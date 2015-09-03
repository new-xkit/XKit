/* jshint node:true */

var fs = require('fs'),
	path = require('path');

var resourceBuilder = {
	/**
	 * @constructor
	 * @param {String} resourcePath Path from which to read resource files
	 * @param {String} distributionPath Path in which to write distribution files
	 */
	create: function(resourcePath, distributionPath) {
		this.resourcePath = resourcePath;
		this.distributionPath = distributionPath;
		return this;
	},

	/**
	 * Read a file in the resources directory
	 * @param {String} path Relative path of file in directory
	 * @return {String} File contents
	 */
	readResourceFile: function(relPath) {
		return fs.readFileSync(
			path.join(this.resourcePath, relPath),
			{ encoding: 'utf8' }
		);
	},

	/**
	 * Write a file to the distribution directory
	 * @param {String} relPath Relative path of file in directory
	 * @param {String} contents File contents
	 */
	writeDistributionFile: function(relPath, contents) {
		fs.writeFileSync(
			path.join(this.distributionPath, relPath),
			contents
		);
	},

	/**
	 * Write a file in the page directory, a child of the distribution directory
	 * @param {String} relPath Relative path of file in directory
	 * @param {String} contents File contents
	 */
	writePageFile: function(relPath, contents) {
		this.writeDistributionFile(path.join('page', relPath), contents);
	},

	/**
	 * @param {String} relPath Relative path of file in directory
	 * @return {Boolean} Whether the resource file exists
	 */
	existsResourceFile: function(relPath) {
		return fs.existsSync(path.join(this.resourcePath,  relPath));
	},

	/**
	 * @param {String} contents Contents of resource file
	 * @param {String} attribute Attribute to read from contents
	 * @return {String?} Value of attribute or NULL if attribute was not found
	 */
	getAttribute: function(contents, attribute) {
		attribute = attribute.toUpperCase();
		// Match the attribute followed by its value wrapped in /* **/
		var regex = new RegExp('/\\*\\s*' + attribute + '\\s*(.+?)\\s*\\*\\*?/');
		var match = contents.match(regex);
		if(!match) {
			return null;
		}
		return match[1];
	},
	/**
	 * @param {Array} resources Resources to sort
	 * @param {String} key Key on which to compare sort order
	 * @return {Array} Resources sorted in case-insentitive alpha order
	 */
	alphaSort: function(resources, key) {
		var sorted = resources;
		sorted.sort(function(rsA, rsB) {
			var aName = rsA[key].toLowerCase();
			var bName = rsB[key].toLowerCase();
			if(aName > bName) {
				return 1;
			}
			if(aName < bName) {
				return -1;
			}
			return 0;
		});
		return sorted;
	}
};

module.exports = resourceBuilder;
