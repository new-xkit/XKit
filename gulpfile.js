/* jshint node: true */
'use strict';

var cache = require('gulp-cached'),
	connect = require('connect'),
	connectLogger = require('morgan'),
	connectStatic = require('serve-static'),
	csslint = require('gulp-csslint'),
	del = require('del'),
	exec = require('child_process').exec,
	fs = require('fs'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	https = require('https'),
	jshint = require('gulp-jshint'),
	jscs = require('gulp-jscs'),
	merge = require('merge-stream'),
	path = require('path'),
	stylish = require('jshint-stylish'),
	zip = require('gulp-zip');

var BUILD_DIR = 'build';
var paths = {
	scripts: {
		dev: ['gulpfile.js'],
		core: ['editor.js', 'xkit.js'],
		extensions: ['Extensions/**/*.js', '!Extensions/**/*.icon.js']
	},
	css: {
		core: ['xkit.css'],
		extensions: ['Extensions/**/*.css'],
		themes: ['Themes/**/*.css']
	},
	vendor: [
		'jquery.js',
		'moment.js',
		'nano.js',
		'tiptip.js'
	]
};

gulp.task('clean', ['clean:build']);

gulp.task('clean:build', function(cb) {
	del([BUILD_DIR], cb);
});

gulp.task('clean:modules', function(cb) {
	del(['node_modules'], cb);
});

gulp.task('clean:chrome', function(cb) {
	del([BUILD_DIR + '/chrome'], cb);
});

gulp.task('clean:firefox', function(cb) {
	del([BUILD_DIR + '/firefox'], cb);
});

gulp.task('clean:safari', function(cb) {
	del([BUILD_DIR + '/safari.safariextension'], cb);
});

gulp.task('clean:extensions', function(cb) {
	del(['Extensions/dist/*.json',
	     'Extensions/dist/page/gallery.json',
	     'Extensions/dist/page/list.json'], cb);
});

gulp.task('clean:themes', function(cb) {
	del(['Extenstions/dist/page/themes.json'], cb);
});

gulp.task('lint:scripts', function() {
	var src = [].concat(
		paths.scripts.dev,
		paths.scripts.core,
		paths.scripts.extensions,
		['Chrome/**/*.js',
		 'Firefox/**/*.js',
		 'Safari/**/*.js']
	);

	return gulp.src(src)
		.pipe(cache('lint:scripts'))
		.pipe(jshint())
		.pipe(jshint.reporter(stylish))
		.pipe(jshint.reporter('fail'))
		.pipe(jscs());
});

gulp.task('lint:css', function() {
	var src = [].concat(
		paths.css.core,
		paths.css.extensions,
		paths.css.themes
	);

	return gulp.src(src)
		.pipe(cache('lint:css'))
		.pipe(csslint())
		.pipe(csslint.reporter());
});

gulp.task('lint', ['lint:scripts']);

gulp.task('copy:chrome', ['clean:chrome', 'lint'], function() {
	var src = [].concat(
		paths.scripts.core,
		paths.css.core,
		paths.vendor,
		['Chrome/**/*']
	);

	return gulp.src(src)
		.pipe(gulp.dest(BUILD_DIR + '/chrome'));
});

gulp.task('compress:chrome', ['copy:chrome'], function() {
	var chromeManifest = JSON.parse(fs.readFileSync('Chrome/manifest.json'));

	return gulp.src(BUILD_DIR + '/chrome/**/*')
		.pipe(zip('new-xkit-' + chromeManifest.version + '.zip'))
		.pipe(gulp.dest(BUILD_DIR + '/chrome'));
});

gulp.task('copy:firefox', ['clean:firefox', 'lint'], function() {
	var src = [].concat(
		paths.scripts.core,
		paths.css.core,
		paths.vendor
	);

	var firefox = ['Firefox/**/*'];

	var extension = gulp.src(firefox)
		.pipe(gulp.dest(BUILD_DIR + '/firefox'));

	var content = gulp.src(src)
		.pipe(gulp.dest(BUILD_DIR + '/firefox/data/xkit'));

	return merge(extension, content);
});

gulp.task('compress:firefox', ['copy:firefox'], function(cb) {
	// `jpm xpi` executable must be expressed relative to `exec({cwd})`
	exec(path.relative('build/firefox', 'node_modules/.bin/jpm xpi'),
		 // `jpm xpi` must be executed from the extension
		 // directory containing a `package.json`.
		 {cwd: 'build/firefox'},
		 function(err, stdout, stderr) {
			if(err) { return cb(err); }
			cb();
		});
});

gulp.task('copy:safari', ['clean:safari', 'lint'], function() {
	var src = [].concat(
		paths.scripts.core,
		paths.css.core,
		paths.vendor,
		['Safari/**/*']
	);

	return gulp.src(src)
		.pipe(gulp.dest(BUILD_DIR + '/safari.safariextension'));

});

gulp.task('build:chrome', ['compress:chrome']);

gulp.task('build:firefox', ['compress:firefox']);

gulp.task('build:safari', ['copy:safari']);

gulp.task('build:extensions', ['lint:scripts', 'clean:extensions'], function() {
	var extensionBuilder = require('./dev/builders/extension');
	return gulp.src(paths.scripts.extensions)
		.pipe(extensionBuilder())
		.pipe(gulp.dest('Extensions/dist'))
		.pipe(extensionBuilder.galleryBuilder('gallery.json'))
		.pipe(gulp.dest('Extensions/dist/page'))
		.pipe(extensionBuilder.listBuilder('list.json'))
		.pipe(gulp.dest('Extensions/dist/page'));
});

gulp.task('build:themes', ['clean:themes'], function(cb) {
	var themeBuilder = require('./dev/builders/theme');
	return gulp.src(paths.css.themes)
		.pipe(themeBuilder())
		.pipe(themeBuilder.galleryBuilder('themes.json'))
		.pipe(gulp.dest('Extensions/dist/page'));
});

gulp.task('build', ['build:chrome', 'build:firefox', 'build:safari']);

gulp.task('watch', function() {
	gulp.watch('**/*.js', ['lint:scripts']);
	gulp.watch('**/*.css', ['lint:css']);
});

// Server code from http://blog.overzealous.com/post/74121048393/why-you-shouldnt-create-a-gulp-plugin-or-how-to
gulp.task('server', ['build:extensions', 'build:themes'], function(callback) {
	var log = gutil.log;
	var colors = gutil.colors;

	var devApp = connect();
	devApp.use(connectLogger('dev'));
	devApp.use(connectStatic('.'));

	// Automatically rebuild Extensions on script changes
	gulp.watch('Extensions/**/*.js', ['build:extensions']);
	gulp.watch('Extensions/**/*.css', ['build:extensions']);

	//Automatically rebuild Themes on change
	gulp.watch('Themes/**/*.css', ['build:themes']);

	var devServer = https.createServer({
				key: fs.readFileSync('./dev/certs/key.pem'),
				cert: fs.readFileSync('./dev/certs/cert.pem')
			}, devApp)
		.listen(31337);

	devServer.on('error', function(error) {
		log(colors.underline(colors.red('ERROR'))+' Unable to start server!');
		callback(error); // we couldn't start the server, so report it and quit gulp
	});

	devServer.on('listening', function() {
		var devAddress = devServer.address();
		var devHost = devAddress.address;
		if (devAddress.address === '0.0.0.0' ||
		    devAddress.address === '::') {
			devHost = 'localhost';
		}
		var url = 'https://' + devHost + ':' + devAddress.port;

		log('Started dev server at ' + colors.magenta(url));
		log(colors.yellow('Remember to add a security exception by visiting ' + colors.magenta(url) + ','));
		log(colors.yellow('otherwise the connection will be blocked by the browser.'));

		callback(); // we're done with this task for now
	});
});

gulp.task('default', ['lint']);
