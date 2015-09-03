/* jshint node:true */
'use strict';

var fs = require('fs'),
	glob = require('glob'),
	path = require('path');

var resourceBuilder = require('./resources');

/**
 * Build the themes in `themePath`, writing the distribution json file
 * into `distributionPath`.
 * @param {String} themePath
 * @param {String} distributionPath
 * @exported
 */
function build(themePath, distributionPath) {
	themeBuilder
		.create(themePath, distributionPath)
		.processThemes();
}
exports.build = build;

/**
 * @constructor
 * @param {String} themePath Path from which to read theme files
 * @param {String} distributionPath Path in which to write theme file
 */
var themeBuilder = Object.create(resourceBuilder);
themeBuilder.create = function(resourcePath, distributionPath) {
	return resourceBuilder.create.call(this, resourcePath, distributionPath);
};

/**
 * Process all themes found in `themePath`
 */
themeBuilder.processThemes = function() {
	var themeFiles = glob.sync(
		'**/*.css',
		{
			cwd: this.resourcePath,
			nodir: true
		}
	);
	var themes = [];

	themeFiles.forEach(function(themePath) {
		themes.push(this.processTheme(themePath));
	}.bind(this));

	this.writeThemesFile(themes);
};

/**
 * Process a single theme
 * @param {String} themePath Path to the theme relative to resourcePath
 */
themeBuilder.processTheme = function(themePath) {
	// Each theme has the following fields:
	// {String} file Contents of the css file
	// {String} name Value of the NAME field in `file`
	// {String} version Value of the VERSION field in `file`
	// {String} description Value of the DESCRIPTION field in `file`
	// {String} developer Value of the DEVELOPER field in `file`
	var theme = {};
	theme.file = path.basename(themePath);
	theme.contents = this.readResourceFile(themePath);

	var attributes = ['name', 'version', 'description', 'developer'];
	attributes.forEach(function(attribute) {
		var value = this.getAttribute(theme.contents, attribute);
		if (value !== null) {
			theme[attribute] = value;
		}
	}.bind(this));

	return theme;
};

/**
 * Generate and write the themes.json file
 * @param {Array<Object>} themes - Themes to include
 */
themeBuilder.writeThemesFile = function(themes) {
	var themeFile = {
		server: 'up',
		themes: themes
	};

	// The themes should display in sorted order.
	themeFile.themes = this.alphaSort(themeFile.themes, 'name');

	this.writePageFile('themes.json', JSON.stringify(themeFile));
};
