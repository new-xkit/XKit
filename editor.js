/*

	Extension Editor for XKit 7
	Version 1.2.1

	(c) 2011 - 2014 STUDIOXENIX
	(c) 2015 New XKit Team and Contributors (https://github.com/new-xkit/XKit/contributors)

*/

(function() {
	if (typeof XKit.extensions.xkit_editor !== "undefined") { return; }
	XKit.extensions.xkit_editor = new Object({

		filename: "",
		run: function() {
			XKit.extensions.xkit_editor.filename = "";
			document.title = "XKit Extension Editor";
			extension_editor_run();
		}

	});
}());

var script_editor, icon_editor, css_editor, object_editor;
var json_changed, extension_changed;

function extension_editor_run() {

	var keyText = navigator.platform.match(/Mac/i) ? "Meta" : "Ctrl";

	var m_html =	"<div id=\"xkit-editor-sidebar\">" +
						"<div id=\"xkit-editor-open-file\" class=\"no-file\">No file opened</div>" +
						"<div id=\"xkit-editor-new\" class=\"xkit-button block\">New Extension (" + keyText + " + E)</div>" +
						"<div id=\"xkit-editor-open\" class=\"xkit-button block\">Open Extension (" + keyText + " + O)</div>" +
						"<div id=\"xkit-editor-save\" class=\"xkit-button disabled block\">Save (" + keyText + " + S)</div>" +
						"<div id=\"xkit-editor-delete\" class=\"xkit-button disabled block\">Delete (" + keyText + " + D)</div>" +
						"<div id=\"xkit-editor-update\" class=\"xkit-button disabled block\" style=\"display: none !important;\">Update from XKit Servers</div>" +
					"</div>" +
					"<div id=\"xkit-editor-area\">" +
						"<div id=\"xkit-editor-tabs\">" +
							"<div id=\"xkit-editor-switch-to-script\" class=\"selected\">Script (" + keyText + " + 1)</div>" +
							"<div id=\"xkit-editor-switch-to-css\" class=\"\">Stylesheet (" + keyText + " + 2)</div>" +
							"<div id=\"xkit-editor-switch-to-icon\" class=\"\">Icon (" + keyText + " + 3)</div>" +
							"<div id=\"xkit-editor-switch-to-object\" class=\"\">JSON (" + keyText + " + 4)</div>" +
						"</div>" +
						"<div style=\"margin-top: 40px;\" id=\"xkit-editor-textarea\"></div>" +
						"<div style=\"margin-top: 40px;\" id=\"xkit-editor-textarea-object\"></div>" +
						"<div style=\"margin-top: 40px;\" id=\"xkit-editor-textarea-css\"></div>" +
						"<div style=\"margin-top: 40px;\" id=\"xkit-editor-textarea-icon\"></div>" +
					"</div>";
	$("body").append(m_html);

	var aceScript = document.createElement('script');
	document.body.appendChild(aceScript);
	aceScript.onload = extension_editor_finish_run;
	aceScript.src = "//cdn.jsdelivr.net/ace/1.2.0/noconflict/ace.js";
}

function makeEditorShim(id) {
	var currentNode = document.getElementById(id);
	var newNode = document.createElement('textarea');
	newNode.id = id;
	newNode.autocomplete = "off";
	newNode.autocorrect = "off";
	newNode.autocapitalize = "off";
	newNode.spellcheck = false;
	if (currentNode.hasAttribute('style')) {
		newNode.setAttribute('style', currentNode.getAttribute('style'));
	}
	currentNode.parentNode.replaceChild(newNode, currentNode);
	var elt = $('#' + id);

	return {
		getValue: function() {
			return elt.val();
		},
		setValue: function(text) {
			elt.val(text);
		},
		resize: function() {
		}
	};
}

/* globals unsafeWindow */
function extension_editor_finish_run() {
	if ((typeof(unsafeWindow) !== 'undefined') && (navigator.userAgent.indexOf('Mobile') === -1)) {
		script_editor = unsafeWindow.ace.edit('xkit-editor-textarea');
		object_editor = unsafeWindow.ace.edit('xkit-editor-textarea-object');
		css_editor = unsafeWindow.ace.edit('xkit-editor-textarea-css');
		icon_editor = unsafeWindow.ace.edit('xkit-editor-textarea-icon');

		var aceTheme = "ace/theme/tomorrow";
		script_editor.setTheme(aceTheme);
		script_editor.getSession().setMode("ace/mode/javascript");
		object_editor.setTheme(aceTheme);
		object_editor.getSession().setMode("ace/mode/json");
		css_editor.setTheme(aceTheme);
		css_editor.getSession().setMode("ace/mode/css");
		icon_editor.setTheme(aceTheme);
		icon_editor.getSession().setMode("ace/mode/javascript");
	} else {
		script_editor = makeEditorShim('xkit-editor-textarea');
		object_editor = makeEditorShim('xkit-editor-textarea-object');
		css_editor = makeEditorShim('xkit-editor-textarea-css');
		icon_editor = makeEditorShim('xkit-editor-textarea-icon');
	}

	extension_editor_update_filename("");
	extension_editor_resize();
	$(window).resize(function() {
		extension_editor_resize();
	});

	$("#xkit-editor-switch-to-script").click(function() {
		$("#xkit-editor-tabs > div").not(this).removeClass("selected");
		$(this).addClass("selected");
		$("#xkit-editor-textarea").css("display", "block");
		$("#xkit-editor-textarea-object").css("display", "none");
		$("#xkit-editor-textarea-css").css("display", "none");
		$("#xkit-editor-textarea-icon").css("display", "none");
	});

	$("#xkit-editor-switch-to-object").click(function() {
		$("#xkit-editor-tabs > div").not(this).removeClass("selected");
		$(this).addClass("selected");
		$("#xkit-editor-textarea").css("display", "none");
		$("#xkit-editor-textarea-object").css("display", "block");
		$("#xkit-editor-textarea-css").css("display", "none");
		$("#xkit-editor-textarea-icon").css("display", "none");
	});

	$("#xkit-editor-switch-to-icon").click(function() {
		$("#xkit-editor-tabs > div").not(this).removeClass("selected");
		$(this).addClass("selected");
		$("#xkit-editor-textarea").css("display", "none");
		$("#xkit-editor-textarea-object").css("display", "none");
		$("#xkit-editor-textarea-css").css("display", "none");
		$("#xkit-editor-textarea-icon").css("display", "block");
	});

	$("#xkit-editor-switch-to-css").click(function() {
		$("#xkit-editor-tabs > div").not(this).removeClass("selected");
		$(this).addClass("selected");
		$("#xkit-editor-textarea").css("display", "none");
		$("#xkit-editor-textarea-object").css("display", "css");
		$("#xkit-editor-textarea-css").css("display", "block");
		$("#xkit-editor-textarea-icon").css("display", "none");
	});

	extension_changed = false;
	json_changed = false;

	$("#xkit-editor-textarea-css, #xkit-editor-textarea-icon, #xkit-editor-textarea").on("change", function(event) {
		if (!extension_changed) { extension_changed = true; }
	});

	$("#xkit-editor-textarea-object").on("change", function(event) {
		if (!json_changed) { json_changed = true; }
	});

	$("#xkit-editor-switch-to-script").trigger('click');

	$("#xkit-editor-new").click(function() {

		XKit.window.show("Create extension", "<input type=\"text\" id=\"xkit-editor-filename\" placeholder=\"Filename (eg: my_extension)\"><br/>No spaces or special characters.", "question", "<div id=\"xkit-editor-create-extension\" class=\"xkit-button default\">OK</div><div id=\"xkit-close-message\" class=\"xkit-button\">Cancel</div>");

		$("#xkit-editor-filename").focus();

		$("#xkit-editor-filename").on('keydown', function(event) {
			if (event.which == 13 || event.keyCode == 13) {
				$("#xkit-editor-create-extension").click();
			}
		});

		$("#xkit-editor-create-extension").click(function() {

			var new_filename = $("#xkit-editor-filename").val();
			if (new_filename === "" || new_filename.indexOf(" ") !== -1) {
				XKit.window.show("Create extension failed", "Invalid or blank filename", "error", "<div id=\"xkit-close-message\" class=\"xkit-button\">OK</div>");
				return;
			}

			if (XKit.installed.check(new_filename) === true) {
				XKit.window.show("Create extension failed", "Filename already exists.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button\">OK</div>");
				return;
			}

			var default_script = "//* TITLE " + new_filename + " **//\n" +
								 "//* VERSION 1.0.0 **//\n" +
								 "//* DESCRIPTION	**//\n" +
								 "//* DEVELOPER New-XKit **//\n" +
								 "//* FRAME false **//\n" +
								 "//* BETA false **//\n" +
								 "\nXKit.extensions." + new_filename + " = new Object({\n" +
								 "\n" +
								 "\trunning: false,\n" +
								 "\n" +
								 "\trun: function() {\n" +
								 "\t\tthis.running = true;\n" +
								 "\t},\n" +
								 "\n" +
								 "\tdestroy: function() {\n" +
								 "\t\tthis.running = false;\n" +
								 "\t}\n" +
								 "\n" +
								 "});";

			var m_object = {};
			m_object.id = new_filename;
			m_object.title = "";
			m_object.css = "";
			m_object.script = default_script;
			m_object.icon = "";
			m_object.description = "";
			m_object.developer = "";
			m_object.version = "";
			m_object.errors = false;
			m_object.beta = false;
			m_object.frame = false;

			var m_result = XKit.tools.set_setting("extension_" + m_object.id, JSON.stringify(m_object));
			if (m_result.errors === false) {
				// Saved data without any errors!
				XKit.installed.add(m_object.id);
				extension_editor_load_extension(m_object.id);
				XKit.window.close();
			} else {
				// Something awful has happened.
				XKit.window.show("Create extension failed", "Unable to store data.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button\">OK</div>");
			}

		});

	});

	$("#xkit-editor-open").click(function() {

		var m_exts_list = "<div class=\"xkit-file-selector\">";

		var extensions = XKit.installed.list();
		for (var i = 0; i < extensions.length; i++) {
			m_exts_list = m_exts_list + "<div class=\"xkit-button block xkit-editor-open-file\" data-filename=\"" + extensions[i] + "\">" + extensions[i] + "</div>";
		}

		m_exts_list = m_exts_list + "</div>";

		XKit.window.show("Open Extension...", m_exts_list, "question", "<div id=\"xkit-close-message\" class=\"xkit-button\">Cancel</div>");

		$(".xkit-editor-open-file").click(function() {
			extension_editor_load_extension($(this).attr('data-filename'));
			XKit.window.close();
		});

	});

	$("#xkit-editor-save").click(function() {
		if ($(this).hasClass("disabled") === true) { return; }
		if (XKit.extensions.xkit_editor.filename === "") { return; }

		var m_object = XKit.installed.get(XKit.extensions.xkit_editor.filename);
		extension_editor_update_object(m_object);

	});

	$("#xkit-editor-delete").click(function() {
		if ($(this).hasClass("disabled") === true) { return; }
		if (XKit.extensions.xkit_editor.filename === "") { return; }

		XKit.window.show("Delete extension?", "Really to delete the extension '" + XKit.extensions.xkit_editor.filename + "'?<br/>You can not undo this action.", "question", "<div id=\"xkit-editor-delete-extension\" class=\"xkit-button default\">Delete</div><div id=\"xkit-close-message\" class=\"xkit-button\">Cancel</div>");

		$("#xkit-editor-delete-extension").click(function() {
			XKit.installed.remove(XKit.extensions.xkit_editor.filename);
			extension_editor_close_file();
			XKit.window.close();
		});

	});

	$(document).on('keydown', function(event) {
		if (event.ctrlKey || event.metaKey) {
			switch (String.fromCharCode(event.which).toLowerCase()) {
			case "s":
				event.preventDefault();
				$("#xkit-editor-save").click();
				break;
			case "o":
				event.preventDefault();
				$("#xkit-editor-open").click();
				break;
			case "e":
				event.preventDefault();
				$("#xkit-editor-new").click();
				break;
			case "d":
				event.preventDefault();
				$("#xkit-editor-delete").click();
				break;
			case "1":
				event.preventDefault();
				$("#xkit-editor-switch-to-script").click();
				break;
			case "2":
				event.preventDefault();
				$("#xkit-editor-switch-to-css").click();
				break;
			case "3":
				event.preventDefault();
				$("#xkit-editor-switch-to-icon").click();
				break;
			case "4":
				event.preventDefault();
				$("#xkit-editor-switch-to-object").click();
				break;
			}
		}
	});
}

function extension_editor_load_extension(extension_id) {

	var m_extension = XKit.installed.get(extension_id);
	extension_editor_update_filename(extension_id);
	script_editor.setValue(m_extension.script);
	icon_editor.setValue(m_extension.icon);
	css_editor.setValue(m_extension.css);
	object_editor.setValue(JSON.stringify(m_extension));

	function clear_selection(editor) {
		if (editor.getSession) {
			editor.getSession().getSelection().clearSelection();
		}
	}

	clear_selection(script_editor);
	clear_selection(icon_editor);
	clear_selection(css_editor);
	clear_selection(object_editor);

	$("#xkit-editor-switch-to-script").trigger('click');

}

function extension_editor_update_object(m_object) {
	var is_json_tab = $("#xkit-editor-switch-to-object").hasClass("selected");

	if (is_json_tab && extension_changed) {
		if (!confirm("You are currently on the JSON tab but you modified either Script, Stylesheet or Icon. Saving now would override these changes.\n\nDo you want to save regardless?")) {
			return;
		}
	} else if (!is_json_tab && json_changed) {
		if (!confirm("You have modified the JSON object but you are not in the JSON editor. Saving now would override these changes.\n\nDo you want to save regardless?")) {
			return;
		}
	} else if (extension_changed && json_changed) {
		if (!confirm("You have modified the JSON object and the Script, Stylesheet or Icon. Saving now would override some of these changes.\n\nDo you want to save regardless?")) {
			return;
		}
	}
	// Check for title, description, developer, version etc. data
	// here and update the object if neccessary.
	if (is_json_tab) {
		m_object.script = JSON.parse(object_editor.getValue()).script;
	} else {
		m_object.script = script_editor.getValue();
	}

	var version = extension_editor_legacy_get_attribute(m_object.script, "version");
	if (version === "") {
		XKit.window.show("Can't save file", "Required VERSION attribute not found.<br/>Consult XKit Developer Documentation.", "error", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
		return;
	} else {
		m_object.version = version;
	}

	m_object.title = extension_editor_legacy_get_attribute(m_object.script, "title");
	m_object.description = extension_editor_legacy_get_attribute(m_object.script, "description");
	m_object.developer = extension_editor_legacy_get_attribute(m_object.script, "developer");
	if (extension_editor_legacy_get_attribute(m_object.script, "frame").toLowerCase() === "true") {
		m_object.frame = true;
	} else {
		m_object.frame = false;
	}
	if (extension_editor_legacy_get_attribute(m_object.script, "beta").toLowerCase() === "true") {
		m_object.beta = true;
	} else {
		m_object.beta = false;
	}
	m_object.details = extension_editor_legacy_get_attribute(m_object.script, "details");

	if (is_json_tab) {
		m_object.icon = JSON.parse(object_editor.getValue()).icon;
		m_object.css = JSON.parse(object_editor.getValue()).css;
	} else {
		m_object.icon = icon_editor.getValue();
		m_object.css = css_editor.getValue();
	}

	m_object.errors = false;

	// Update this area too.
	if (is_json_tab) {
		script_editor.setValue(JSON.parse(object_editor.getValue()).script);
		icon_editor.setValue(JSON.parse(object_editor.getValue()).icon);
		css_editor.setValue(JSON.parse(object_editor.getValue()).css);
	} else {
		object_editor.setValue(JSON.stringify(m_object));
	}

	XKit.installed.update(XKit.extensions.xkit_editor.filename, m_object);
	XKit.notifications.add("Extension " + XKit.extensions.xkit_editor.filename + " saved successfully.");

	json_changed = false;
	extension_changed = false;

}

function extension_editor_legacy_get_attribute(text, info_needed) {

	try {

		var tempdata = text;
		info_needed = info_needed.toUpperCase();
		var inf_string = "/* " + info_needed + " ";
		if (typeof tempdata === "undefined") {
			return "";
		}
		var str_start = tempdata.indexOf(inf_string);
		if (str_start === -1) { return ""; }
		var str_end = tempdata.indexOf("**/", str_start);
		if (str_end === -1) { return ""; }
		return tempdata.substring(str_start + (inf_string.length), str_end - 1);

	} catch (e) {

		return "";

	}

}

function extension_editor_update_filename(filename) {

	XKit.extensions.xkit_editor.filename = filename;

	if (filename !== "") {
		document.title = filename + " - XKit Extension Editor";
		$("#xkit-editor-open-file").html(filename);
		$("#xkit-editor-open-file").removeClass("no-file");
		$("#xkit-editor-attributes").removeClass("disabled");
		$("#xkit-editor-save").removeClass("disabled");
		$("#xkit-editor-delete").removeClass("disabled");
		$("#xkit-editor-update").removeClass("disabled");
	} else {
		document.title = "XKit Extension Editor";
		$("#xkit-editor-open-file").html("No file opened");
		$("#xkit-editor-open-file").addClass("no-file");
		$("#xkit-editor-attributes").addClass("disabled");
		$("#xkit-editor-save").addClass("disabled");
		$("#xkit-editor-delete").addClass("disabled");
		$("#xkit-editor-update").addClass("disabled");
	}

}

function extension_editor_close_file() {

	extension_editor_update_filename("");
	script_editor.setValue("");
	icon_editor.setValue("");
	css_editor.setValue("");
	object_editor.setValue("");
	$("#xkit-editor-switch-to-script").trigger('click');

}

function extension_editor_resize() {

	var new_width = $(window).width() - 200;
	$("#xkit-editor-area").css("width", new_width + "px");
	$("#xkit-editor-textarea").css("width", new_width + "px");
	$("#xkit-editor-textarea-icon").css("width", new_width + "px");
	$("#xkit-editor-textarea-object").css("width", new_width + "px");
	$("#xkit-editor-textarea-css").css("width", new_width + "px");

	var new_height = $(window).height() - 40;
	$("#xkit-editor-area").css("height", new_height + "px");
	$("#xkit-editor-textarea").css("height", new_height + "px");
	$("#xkit-editor-textarea-icon").css("height", new_height + "px");
	$("#xkit-editor-textarea-object").css("height", new_height + "px");
	$("#xkit-editor-textarea-css").css("height", new_height + "px");

	script_editor.resize();
	icon_editor.resize();
	css_editor.resize();
	object_editor.resize();
}
