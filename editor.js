/*

	Extension Editor for XKit 7
	Version 1.2.1

	(c) 2011 - 2014 STUDIOXENIX
	(c) 2015 - 2018 the New XKit Team and Contributors (https://github.com/new-xkit/XKit/contributors)

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

function extension_editor_run() {

	var keyText = navigator.platform.match(/Mac/i) ? "Cmd" : "Ctrl";

	var m_html =	"<div id=\"xkit-editor-sidebar\">" +
						"<div id=\"xkit-editor-open-file\" class=\"no-file\">No file opened</div>" +
						"<div id=\"xkit-editor-new\" class=\"xkit-button disabled block\">New Extension (" + keyText + " + E)</div>" +
						"<div id=\"xkit-editor-open\" class=\"xkit-button block\">Open Extension (" + keyText + " + O)</div>" +
						"<div id=\"xkit-editor-save\" class=\"xkit-button disabled block\">Save (" + keyText + " + S)</div>" +
						"<div id=\"xkit-editor-delete\" class=\"xkit-button disabled block\">Delete (" + keyText + " + D)</div>" +
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

	extension_editor_finish_run();
}

function makeEditorShim(id) {
	var currentNode = document.getElementById(id);
	var newNode = document.createElement('textarea');
	newNode.id = id;
	newNode.readOnly = true;
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

	$(document).on('keydown', function(event) {
		if (event.ctrlKey || event.metaKey) {
			switch (String.fromCharCode(event.which).toLowerCase()) {
				case "o":
					event.preventDefault();
					$("#xkit-editor-open").click();
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
	} else {
		document.title = "XKit Extension Editor";
		$("#xkit-editor-open-file").html("No file opened");
		$("#xkit-editor-open-file").addClass("no-file");
		$("#xkit-editor-attributes").addClass("disabled");
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
