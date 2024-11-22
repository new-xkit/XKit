const globby = require('globby');

const files = globby
.sync('{Extensions/dist/*.json,Extensions/dist/page/gallery.json,Extensions/dist/page/list.json,Extensions/dist/page/themes.json}', {
	cwd: '.',
	dot: false,
});

console.log(files);
