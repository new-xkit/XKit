/* eslint-env node */
'use strict';

var connect = require('connect'),
	connectLogger = require('morgan'),
	connectStatic = require('serve-static'),
	del = require('del'),
	fs = require('fs'),
	gulp = require('gulp'),
	gutil = require('gulp-util'),
	https = require('https');

var paths = {
	scripts: {
		dev: ['gulpfile.js', 'dev/**/*.js'],
		core: ['bridge.js', 'editor.js', 'xkit.js'],
		extensions: ['Extensions/**/*.js', '!Extensions/**/*.icon.js']
	},
	css: {
		core: ['xkit.css'],
		extensions: ['Extensions/**/*.css'],
		themes: ['Themes/**/*.css']
	},
	vendor: [
		'vendor/*.js',
	]
};

gulp.task('clean:extensions', function(cb) {
	del(['Extensions/dist/*.json',
	     'Extensions/dist/page/gallery.json',
	     'Extensions/dist/page/list.json'], cb);
});

gulp.task('clean:themes', function(cb) {
	del(['Extensions/dist/page/themes.json'], cb);
});

gulp.task('clean', gulp.series('clean:extensions', 'clean:themes'));

gulp.task('build:extensions', gulp.series('clean:extensions', function() {
	var extensionBuilder = require('./dev/builders/extension');
	return gulp.src(paths.scripts.extensions)
		.pipe(extensionBuilder())
		.pipe(gulp.dest('Extensions/dist'))
		.pipe(extensionBuilder.galleryBuilder('gallery.json'))
		.pipe(gulp.dest('Extensions/dist/page'))
		.pipe(extensionBuilder.listBuilder('list.json'))
		.pipe(gulp.dest('Extensions/dist/page'));
}));

gulp.task('build:themes', gulp.series('clean:themes', function() {
	var themeBuilder = require('./dev/builders/theme');
	return gulp.src(paths.css.themes)
		.pipe(themeBuilder())
		.pipe(themeBuilder.galleryBuilder('themes.json'))
		.pipe(gulp.dest('Extensions/dist/page'));
}));

gulp.task('build', gulp.series('build:extensions', 'build:themes'));

// Server code from http://blog.overzealous.com/post/74121048393/why-you-shouldnt-create-a-gulp-plugin-or-how-to
gulp.task('server', gulp.series('build', function(callback) {
	var log = gutil.log;
	var colors = gutil.colors;

	var devApp = connect();
	devApp.use(connectLogger('dev'));
	devApp.use(function(request, response, next) {
		response.setHeader('Access-Control-Allow-Origin', '*');
		next();
	});
	devApp.use(connectStatic('.'));

	// Automatically rebuild Extensions on script changes
	gulp.watch('Extensions/**/*.js', gulp.series('build:extensions'));
	gulp.watch('Extensions/**/*.css', gulp.series('build:extensions'));

	//Automatically rebuild Themes on change
	gulp.watch('Themes/**/*.css', gulp.series('build:themes'));

	var devServer = https.createServer({
		key: fs.readFileSync('./dev/certs/key.pem'),
		cert: fs.readFileSync('./dev/certs/cert.pem')
	}, devApp)
		.listen(31337);

	devServer.on('error', function(error) {
		log(colors.underline(colors.red('ERROR')) + ' Unable to start server!');
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
}));

gulp.task('default', gulp.series('build'));
