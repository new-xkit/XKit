/* eslint-env node */

/**
 * Extension builder module.
 * @module dev/builders/extension
 */

'use strict';

var gutil = require('gulp-util'),
	path = require('path'),
	through = require('through2');

var File = gutil.File,
	PluginError = gutil.PluginError;

var resourceUtil = require('./resource');

/**
 * Parse and convert extension source code into a distributable object.
 * @see [stream.Transform]{@link https://nodejs.org/docs/v0.12.7/api/stream.html#stream_class_stream_transform_1}
 *
 * @returns {Object<stream.Transform>}
 */
var extensionBuilder = function() {
	return through.obj(function(file, enc, cb) {
		// Ignore empty files
		if (file.isNull()) {
			cb();
		}

		if (file.isStream()) {
			this.emit('error', new PluginError('resource-builder', 'Streaming not supported'));
			cb();
		}

		/** Each extension has the following fields:
		 * {string}  script      - Contents of the extension file
		 * {string}  id          - File name without extension
		 * {string}  icon        - Contents of the `id`.icon.js file
		 * {string}  css         - Contents of the `id`.css file
		 * {string}  title       - Value of the TITLE field in `script`
		 * {string}  version     - Value of the VERSION field in `script`
		 * {string}  description - Value of the DESCRIPTION field in `script`
		 * {string}  details     - Value of the DETAILS field in `script`
		 * {string}  developer   - Value of the DEVELOPER field in `script`
		 * {boolean} frame       - Value of the FRAME field in `script`
		 * {boolean} [beta]      - Value of the optional BETA field in `script`
		 * {boolean} [slow]      - Value of the optional SLOW field in `script`
		 */
		var extension = {};
		extension.id = path.basename(file.path, '.js');
		extension.script = file.contents.toString();
		extension.file = 'found';
		extension.server = 'up';
		extension.errors = false;

		// The path to file without the file extension.
		// Like path.basename() except it preserves path.dirname().
		var filePathBasename = path.join(path.dirname(file.path), extension.id);

		extension = resourceUtil.addResourceDependency(extension, 'icon', filePathBasename + '.icon.js');
		extension = resourceUtil.addResourceDependency(extension, 'css', filePathBasename + '.css');

		var attributes = [
			{
				name: 'title',
				default: null,
				required: true
			},
			{
				name: 'description',
				default: null,
				required: true
			},
			{
				name: 'developer',
				default: null,
				required: true
			},
			{
				name: 'version',
				default: null,
				required: true
			},
			{
				name: 'details',
				default: null,
				required: false
			},
			{
				name: 'frame',
				default: 'false',
				required: false
			},
			{
				name: 'beta',
				default: 'false',
				required: false
			},
			{
				name: 'slow',
				default: 'false',
				required: false
			}
		];

		file = resourceUtil.resourceBuilder(file, extension, 'script', attributes);
		this.push(file);
		cb();
	});
};

/**
 * Generate the extensions gallery file by concatenating the contents
 * of streams of files into a gallery object.
 * @see [vinyl]{@link https://github.com/wearefractal/vinyl}
 * @see [stream.Transform]{@link https://nodejs.org/docs/v0.12.7/api/stream.html#stream_class_stream_transform_1}
 *
 * @param {string|Object<vinyl>} filename - Name of the file to write
 *
 * @returns {Object<stream.Transform>}
 */
var buildGalleryFile = function(filename) {
	if (!filename) {
		throw new PluginError('resource-builder', 'Missing file option for galleryBuilder');
	}

	var gallery = { server: 'up', extensions: [] };

	var attributeMapping = {
		id:          'name',
		title:       'title',
		version:     'version',
		description: 'description',
		icon:        'icon',
		details:     'details'
	};

	return resourceUtil.galleryBuilder(filename, gallery, attributeMapping, 'extensions', 'title');
};

/**
 * Generate the extensions list file from an existing stream of
 * gallery object data.
 * @see [stream.Transform]{@link https://nodejs.org/docs/v0.12.7/api/stream.html#stream_class_stream_transform_1}
 *
 * @param {string} filename - Name of the file to write
 *
 * @returns {Object<stream.Transform>}
 */
var buildListFile = function(filename) {
	return through.obj(function(file, enc, cb) {
		var list = { server: 'up', extensions: [] };

		var extensions = JSON.parse(file.contents).extensions;
		extensions.forEach(function(extension) {
			list.extensions.push({
				name: extension.name,
				version: extension.version
			});
		});

		// The list should display in sorted order
		list.extensions = resourceUtil.alphaSort(list.extensions, 'name');

		var listFile;
		if (typeof filename === 'string') {
			listFile = file.clone({contents: false});
			listFile.path = path.join(file.base, filename);
		} else {
			listFile = new File(filename);
		}

		listFile.contents = new Buffer(JSON.stringify(list));
		this.push(listFile);
		cb();
	});
};

extensionBuilder.galleryBuilder = buildGalleryFile;
extensionBuilder.listBuilder = buildListFile;

module.exports = extensionBuilder;
