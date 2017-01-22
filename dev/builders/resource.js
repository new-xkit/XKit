/* eslint-env node */

/**
 * Resource builder module.
 * @module resource
 * @private
 */

'use strict';

var fs = require('fs'),
	gutil = require('gulp-util'),
	path = require('path'),
	through = require('through2');

var File = gutil.File,
	PluginError = gutil.PluginError;

/** Builds a distributable resource object.
 * @see [vinyl]{@link https://github.com/wearefractal/vinyl}
 *
 * @param {Object<vinyl>} file
 * @param {Object}        resource
 * @param {string}        contentsKey           - The object key from which to get a resource's file contents
 * @param {Object[]}      attributes            - Array of attributes to add to the resource
 * @param {string}        attributes[].name     - The name of the attribute to add
 * @param {string}        attributes[].default  - The default value of the attribute
 * @param {boolean}       attributes[].required - If the attribute is a required field
 *
 * @returns {Object<vinyl>} file
 */
module.exports.resourceBuilder = function(file, resource, contentsKey, attributes) {
	attributes.forEach(function(attribute) {
		var value = module.exports.getAttribute(resource[contentsKey], attribute.name);
		if (value !== null) {
			resource[attribute.name] = value;
		} else {
			if (attribute.required) {
				throw new PluginError('resource-builder',
					'Required attribute ' + attribute.name +
					' not set in ' + path.relative(process.cwd(), file.path)
				);
			}
			if (attribute.default !== null) {
				resource[attribute.name] = attribute.default;
			}
		}
	});

	file.contents = new Buffer(JSON.stringify(resource));
	file.path = gutil.replaceExtension(file.path, '.json');

	return file;
};

/**
 * Generate the resource gallery file by concatenating the contents
 * of streams of files into a gallery object.
 * @see [vinyl]{@link https://github.com/wearefractal/vinyl}
 *
 * @param {string|Object<vinyl>} galleryFileIn             - Name of the file to write
 * @param {Object}               gallery                   - Resource gallery object
 * @param {string}               gallery.server            - Status of the server
 * @param {Object[]}             gallery[resourceArrayKey] - Array of resource objects
 * @param {string}               resourceArrayKey          - Key identifying resource object array, typically the resource type
 * @param {string}               resourceNameKey           - Key on which to compare sort order
 *
 * @returns {Object<stream.Transform>}
 */
// Adapted from https://github.com/wearefractal/gulp-concat
module.exports.galleryBuilder = function(galleryFileIn, gallery, attributeMapping, resourceArrayKey, resourceNameKey) {
	var latestFile;
	var latestMod;

	function bufferContents(file, enc, cb) {
		if (file.isNull()) {
			cb();
			return;
		}

		if (file.isStream()) {
			this.emit('error', new PluginError('resource-builder',  'Streaming not supported'));
			cb();
			return;
		}

		// Set latest file if not already set
		// or if the current file was modified more recently.
		if (!latestMod || file.stat && file.stat.mtime > latestMod) {
		  latestFile = file;
		  latestMod = file.stat && file.stat.mtime;
		}

		var resource = JSON.parse(file.contents.toString());
		var galleryResource = {};
		Object.keys(attributeMapping).forEach(function(key) {
			if (resource.hasOwnProperty(key)) {
				galleryResource[attributeMapping[key]] = resource[key];
			}
		});

		gallery[resourceArrayKey].push(galleryResource);
		cb();
	}

	function endStream(cb) {
		// No files passed in, no file goes out
		if (!latestFile) {
		  cb();
		  return;
		}

		// The gallery should display in sorted order because otherwise
		// it is difficult to find resources.
		gallery[resourceArrayKey] = module.exports.alphaSort(gallery[resourceArrayKey], resourceNameKey);

		var galleryFile;
		if (typeof galleryFileIn === 'string') {
			galleryFile = latestFile.clone({contents: false});
			galleryFile.path = path.join(latestFile.base, galleryFileIn);
		} else {
			galleryFile = new File(galleryFileIn);
		}

		galleryFile.contents = new Buffer(JSON.stringify(gallery));
		this.push(galleryFile);
		cb();
	}

	return through.obj(bufferContents, endStream);
};

/**
 * Synchronously reads the entre contents of a resource file.
 *
 * @param {string} filename
 *
 * @return {string} File contents
 */
module.exports.readResourceSync = function(filename) {
	return fs.readFileSync(
		filename,
		{
			encoding: 'utf8'
		}
	);
};

/**
 * Adds the contents of the dependency file to the resource object.
 * Only adds the contents of dependency files that exist and are readable.
 *
 * @param {Object} resource
 * @param {string} key      - Key on resource to which to add dependency file contents
 * @param {string} filename
 *
 * @return {Object} resource
 */
module.exports.addResourceDependency = function(resource, key, filename) {
	var contents;

	try {
		contents = module.exports.readResourceSync(filename);
	} catch (e) {
		if (e.code === 'ENOENT') {
			contents = '';
		} else {
			throw e;
		}
	}

	if (contents.length > 0) {
		resource[key] = contents;
	}

	return resource;
};

/**
 * Extracts legacy header information from string contents.
 *
 * @param {string} contents
 * @param {string} attribute - Attribute to read from contents
 *
 * @return {string|null} Value of attribute or null if attribute was not found
 */
module.exports.getAttribute = function(contents, attribute) {
	attribute = attribute.toUpperCase();

	// Match the attribute followed by its value wrapped in /* **/
	var regex = new RegExp('/\\*\\s*' + attribute + '\\s*(.+?)\\s*\\*\\*?/');
	var match = contents.match(regex);

	if (!match) {
		return null;
	}
	return match[1];
};

/**
 * Sorts resources in case-insensitive alphabetical order.
 *
 * @param {Object[]} resources
 * @param {string}   key       - Key on which to compare sort order
 *
 * @return {Object[]} resources
 */
module.exports.alphaSort = function(resources, key) {
	return resources.sort(function(rsA, rsB) {
		var aName = rsA[key].toLowerCase();
		var bName = rsB[key].toLowerCase();
		if (aName > bName) {
			return 1;
		}
		if (aName < bName) {
			return -1;
		}
		return 0;
	});
};
