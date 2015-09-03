/* jshint node:true */
'use strict';

var fs = require('fs'),
	glob = require('glob'),
	path = require('path');

var resourceBuilder = require('./resources');

/**
 * Build the extensions in `extensionPath`, writing the distribution
 * json files into `distributionPath`.
 * @param {String} extensionPath
 * @param {String} distributionPath
 * @exported
 */
function build(extensionPath, distributionPath) {
	extensionBuilder
		.create(extensionPath, distributionPath)
		.processExtensions();
}
exports.build = build;

/**
 * @constructor
 * @param {String} resourcePath Path from which to read extension files
 * @param {String} distributionPath Path in which to write extension file
 */
var extensionBuilder = Object.create(resourceBuilder);
extensionBuilder.create = function(resourcePath, distributionPath) {
	return resourceBuilder.create.call(this, resourcePath, distributionPath);
};

/**
 * Process all extensions found in `resourcePath`
 */
extensionBuilder.processExtensions = function() {
	var extensionFiles = glob.sync(
		'*.js',
		{
			cwd: this.resourcePath,
			nodir: true,
			ignore: '*.icon.js'
		}
	);
	var extensions = [];

	extensionFiles.forEach(function(extensionPath) {
		extensions.push(this.processExtension(extensionPath));
	}.bind(this));

	this.writeGalleryFile(extensions);
	this.writeListFile(extensions);
};

/**
 * Process a single extension
 * @param {String} extensionPath Path to the extension relative to resourcePath
 */
extensionBuilder.processExtension = function(extensionPath) {
	// Each extension has the following fields:
	// {String} script Contents of the js file
	// {String} id File name without .js
	// {String} icon Contents of the `id`.icon.js file
	// {String} css Contents of the `id`.css file
	// {String} title Value of the TITLE field in `script`
	// {String} version Value of the VERSION field in `script`
	// {String} description Value of the DESCRIPTION field in `script`
	// {String} details Value of the DETAILS field in `script`
	// {String} developer Value of the DEVELOPER field in `script`
	// {Boolean} frame Value of the FRAME field in `script`
	// {Boolean} beta Value of the optional BETA field in `script`
	// {Boolean} slow Value of the optional SLOW field in `script`
	var extension = {};
	extension.id = path.basename(extensionPath, '.js');
	extension.script = this.readResourceFile(extensionPath);

	if(this.existsResourceFile(extension.id + '.icon.js')) {
		extension.icon = this.readResourceFile(extension.id + '.icon.js');
	}
	if(this.existsResourceFile(extension.id + '.css')) {
		extension.css = this.readResourceFile(extension.id + '.css');
	}

	var attributes = ['title', 'description', 'developer', 'version',
					  'frame', 'beta', 'slow', 'details'];
	attributes.forEach(function(attribute) {
		var value = this.getAttribute(extension.script, attribute);
		if(value !== null) {
			extension[attribute] = value;
		}
	}.bind(this));

	extension.file = 'found';
	extension.server = 'up';
	extension.errors = false;

	['frame', 'beta', 'slow'].forEach(function(falseDefault) {
		if(!extension.hasOwnProperty(falseDefault)) {
			extension[falseDefault] = 'false';
		}
	});

	this.writeDistributionFile(extension.id + '.json', JSON.stringify(extension));

	return extension;
};

/**
 * Generate and write the gallery.json file
 * @param {Array<Object>} extensions Extensions to include in the gallery
 */
extensionBuilder.writeGalleryFile = function(extensions) {
	var gallery = {server: 'up', extensions: []};
	extensions.forEach(function(extension) {
		var galleryExtension = {
			name: extension.id,
			title: extension.title,
			version: extension.version,
			description: extension.description
		};
		if(extension.icon) {
			galleryExtension.icon = extension.icon;
		}
		gallery.extensions.push(galleryExtension);
	});

	// The gallery should display in sorted order because otherwise it
	// is difficult to find extensions.
	gallery.extensions = this.alphaSort(gallery.extensions, 'title');

	this.writePageFile('gallery.json', JSON.stringify(gallery));
};

/**
 * Generate and write the list.json file
 * @param {Array<Object>} extensions Extensions to include in the list
 */
extensionBuilder.writeListFile = function(extensions) {
	var list = {server: 'up', extensions: []};
	extensions.forEach(function(extension) {
		list.extensions.push({
			name: extension.id,
			version: extension.version
		});
	});
	this.writePageFile('list.json', JSON.stringify(list));
};
