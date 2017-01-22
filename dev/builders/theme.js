/* eslint-env node */

/**
 * Themes builder module.
 * @module dev/builders/theme
 */

'use strict';

var gutil = require('gulp-util'),
	path = require('path'),
	through = require('through2');

var PluginError = gutil.PluginError;

var resourceUtil = require('./resource');

/**
 * Parse and convert theme source code into a distributable object.
 * @see [stream.Transform]{@link https://nodejs.org/docs/v0.12.7/api/stream.html#stream_class_stream_transform_1}
 *
 * @returns {Object<stream.Transform>}
 */
var themeBuilder = function() {
	return through.obj(function(file, enc, cb) {
		// Ignore empty files
		if (file.isNull()) {
			cb();
		}

		if (file.isStream()) {
			this.emit('error', new PluginError('resource-builder', 'Streaming not supported'));
			cb();
		}

		/** Each theme has the following fields:
		* {string} file        - Contents of the theme file
		* {string} name        - Value of the NAME field in `file`
		* {string} version     - Value of the VERSION field in `file`
		* {string} description - Value of the DESCRIPTION field in `file`
		* {string} developer   - Value of the DEVELOPER field in `file`
		*/
		var theme = {};
		theme.file = path.basename(file.path);
		theme.contents = file.contents.toString();

		var attributes = [
			{
				name: 'name',
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
			}
		];

		file = resourceUtil.resourceBuilder(file, theme, 'contents', attributes);
		this.push(file);
		cb();
	});
};

/**
 * Generate the themes gallery file by concatenating the contents
 * of streams of files into a gallery object.
 * @see [vinyl]{@link https://github.com/wearefractal/vinyl}
 *
 * @param {string|Object<vinyl>} filename - Name of the file to write
 * @return {Object<stream.Transform>}
 */
var buildGalleryFile = function(filename) {
	if (!filename) {
		throw new PluginError('resource-builder', 'Missing file option for galleryBuilder');
	}

	var gallery = { server: 'up', themes: [] };

	var attributeMapping = {
		file:        'file',
		name:        'name',
		version:     'version',
		description: 'description',
		developer:   'developer',
		contents:    'contents'
	};

	return resourceUtil.galleryBuilder(filename, gallery, attributeMapping, 'themes', 'name');
};

themeBuilder.galleryBuilder = buildGalleryFile;

module.exports = themeBuilder;
