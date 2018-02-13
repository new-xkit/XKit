/* eslint-env node */

/**
 * Paperboy builder module.
 * @module dev/builders/paperboy
 */

'use strict';

var gutil = require('gulp-util'),
	path = require('path'),
	through = require('through2'),
	yaml_fm = require('yaml-front-matter');

var PluginError = gutil.PluginError;

var resourceUtil = require('./resource');

/**
 * Parse and convert extension source code into a distributable object.
 * @see [stream.Transform]{@link https://nodejs.org/docs/v0.12.7/api/stream.html#stream_class_stream_transform_1}
 *
 * @returns {Object<stream.Transform>}
 */
var paperboyBuilder = function() {
	return through.obj(function(file, enc, cb) {
		// Ignore empty files
		if (file.isNull()) {
			cb();
		}

		if (file.isStream()) {
			this.emit('error', new PluginError('resource-builder', 'Streaming not supported'));
			cb();
		}

		/** Each paperboy message has the following fields:
		 * {string}  title       - The title of the message
		 * {string}  message     - The message itself
		 * {string}  author      - An author of the message
		 * {string}  id          - The filename of the message with file extension
		 * {string}  type        - The type of the message (information, extension_updates, weekly_news, developers or important)
		 * {integer} version     - Value of the VERSION field in `script`
		 * {boolean} deleted     - If the message has been removed then this is true
		 * {boolean} firefox     - Does this message specifically talk about New XKit for Firefox
		 * {boolean} chrome      - Does this message specifically talk about New XKit for Google Chrome
		 * {boolean} safari      - Does this message specifically talk about New XKit for Safari
		 */

		var yaml_result = yaml_fm.loadFront(file.contents.toString(), "message");
		var mail = {};
		mail.id = path.basename(file.path);
		if (typeof(yaml_result.message) === "undefined" || typeof(yaml_result.title) === "undefined") {
			this.emit('error', new PluginError('resource-builder', 'Empty message or title in file ' + mail.id));
			cb();
		}

		var allowed_types = [
			"information",
			"extension_updates",
			"weekly_news",
			"developers",
			"important"
		];

		mail.message = yaml_result.message.trim();
		mail.title = yaml_result.title;
		mail.author = yaml_result.author;
		mail.version = yaml_result.version;
		mail.date = yaml_result.date;
		if (typeof(yaml_result.type) === "undefined") { yaml_result.type = "information"; }
		if (allowed_types.indexOf(yaml_result.type.toLowerCase()) === -1) {
			this.emit('error', new PluginError('resource-builder', 'Invalid message type "' + yaml_result.type + '" in file ' + mail.id));
			cb();
		}
		mail.channels = {
			type: yaml_result.type.toLowerCase(),
			browsers: {
				firefox: yaml_result.firefox,
				chrome: yaml_result.chrome,
				safari: yaml_result.safari
			}
		};
		mail.deleted = yaml_result.deleted;

		var attributes = [];

		file = resourceUtil.resourceBuilder(file, mail, 'message', attributes);

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

	var gallery = { server: 'up', news: [] };

	var attributeMapping = {
		id:          'id',
		title:       'title',
		version:     'version',
		message: 	 'message',
		author:      'author',
		deleted:     'deleted',
		channels:    'channels',
		date:		 'date'
	};

	return resourceUtil.galleryBuilder(filename, gallery, attributeMapping, 'news', 'title');
};

paperboyBuilder.galleryBuilder = buildGalleryFile;

module.exports = paperboyBuilder;
