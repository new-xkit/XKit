//* TITLE Super Markdown Editor **//
//* VERSION 1.0 REV A **//
//* DESCRIPTION Add live previews and other functionality to the Markdown post editor **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

// First, we need to access JS libraries loaded on the Tumblr page. In Firefox
// this is easy (just use unsafeWindow), but in Chrome that doesn't work. The
// portable way is to run our own JS using a <script> tag, which is injected
// into the page. However, when you do this, you lose access *back* to the
// original context - these first three functions handle communication between
// the contexts.

// Takes the full dot-path to the name of an XKit method - for example,
// "window.show" - and then any number of arguments, and instructs XKit to call
// that method. This function is available to code running in the unsafe_eval
// context, so that it can still control XKit.
var callXKit = function(cmd, args /* ... */) {
	args = [].slice.apply(arguments);
	window.postMessage({xkit_cmd: {path: args[0], params: args.slice(1)}}, '*');
};

// Listen for requests from the callXKit function - when one arrives, call the
// appropriate XKit method.
window.addEventListener('message', function(event) {
	var msg, path, namespace;
	if (!(msg = event.data.xkit_cmd)) return;

	namespace = XKit;
	path = msg.path.split('.');
	while (path.length > 1) namespace = namespace[path.shift()];
	namespace[path[0]].apply(namespace, msg.params);
});

// Evaluate a function in the page's JavaScript context instead of in the
// extension sandbox. The function is passed through as a string, so it must
// not be a closure - it will however be passed a reference to the callXKit
// function defined above, so it can call back into XKit code.
XKit.tools.unsafe_eval = function(f) {
	if (typeof f !== 'function') throw new Error('Invalid argument to XKit.tools.unsafe_eval(): ' + f);
	var statement = '(' + f.toString() + ')(' + callXKit.toString() + ');';

	// Evaluate the string generated above on the main 'window' by putting a
	// new <script> element in the DOM for it.
	var script = document.createElement('script');
	script.setAttribute("type", "application/javascript");
	script.textContent = statement;
	document.body.appendChild(script);
	document.body.removeChild(script);
};

// The majority of the work done by the extension is inside this function,
// which will be evaluated in page context using unsafe_eval().
var superMarkdownEditor = function(xkitApi) {
	"use strict";
	var $ = jQuery;

	// A couple of utilities first. This is just standard HTML entity escaping.
	var escapeHtml = function(s) {
		var tagsToReplace = {
			'&': '&amp;',
			'<': '&lt;',
			'>': '&gt;'
		};
		return s.replace(/[&<>]/g, function(tag) {
			return tagsToReplace[tag] || tag;
		});
	};

	// https://github.com/domenic/last tweaked slightly so that it works with
	// jQuery's broken promises (we don't want to paste an entire full-size
	// promise library into one of these scripts).
	var last = (function() {
		// 'pending' is a promise that never resolves - it's returned from
		// then() below to make other promises also never resolve.
		var pending = jQuery.Deferred().promise();
		return function(operation) {
			var latestPromise = null;
			return function() {
				var promiseForResult = operation.apply(this, arguments);
				latestPromise = promiseForResult;

				return promiseForResult.then(
					function(value) {
						if (latestPromise === promiseForResult) {
							return value;
						} else {
							return pending;
						}
					}, function(reason) {
						if (latestPromise === promiseForResult) {
							throw reason;
						} else {
							return pending;
						}
					}
				);
			};
		};
	})();

	// Most of the AJAX calls we use take multipart form data as their content,
	// so this helper makes it a little more convenient to send that sort of
	// thing up.
	var postFormData = function(url, data) {
		var formData = new FormData(), k;
		for (k in data) if (data.hasOwnProperty(k)) {
			formData.append(k, data[k]);
		}
		return $.ajax({
			url: url,
			type: 'POST',
			data: formData,
			headers: {'x-tumblr-form-key': $('meta[name=tumblr-form-key]').attr('content')},
			processData: false,
			contentType: false
		});
	};

	// Fetch the active Ace editor instance! This is the main reason we run in
	// page context - you can't get the Ace instance from the extension
	// sandbox.
	var ace = function() {
		return window.ace.edit($('.html-field .ace_editor')[0]);
	};

	// Bindings for processing each of the insert-thingy buttons defined here.
	var handleButton = {
		'inline-image': function(imgButton) {
			imgButton.change(function() {
				var file;
				if (!(file = imgButton.find('input[type=file]')[0].files[0])) return;
				imgButton.find('input[type=file]').val(null);

				postFormData('/svc/post/upload_text_image', {
					image: file
				}).then(function(res) {
					var url = res.response[0].url;
					var editor = ace();
					editor.insert('![](' + url + ')');
					editor.focus();
				}, function(err) {
					xkitApi(
						'window.show', 'Sorry!',
						'Uploading the image <pre>' + escapeHtml(file.name) + '</pre> failed. Please try again.',
						'error', '<div id="xkit-close-message" class="xkit-button default">Okay</div>'
					);
				});
			});
		},

		'inline-embed': function(videoButton) {
			videoButton.click(function() {
				showEmbedCodeField();
			});
		},

		gif: function(gifButton) {
			// The GIF thing is hard to reimplement and not very useful so
			// let's just skip it.
			gifButton.css({display: 'none'});
		},

		hr: function(hrButton) {
			hrButton.click(function() {
				var editor = ace();
				editor.insert('\n\n----\n\n');
				editor.focus();
			});
		},
		'read-more': function(readMoreButton) {
			readMoreButton.click(function() {
				var editor = ace();
				editor.insert('\n\n<!-- more -->\n\n');
				editor.focus();
			});
		}
	};

	var format = function(buttons) {
		buttons.attr({style: '', id: 'super-markdown-controls'});
		buttons.wrap('<div class="editor-slot"></div>');
		buttons.find('.opener').remove();
		buttons.find('.tray').removeClass('velocity-animating').attr('style', '');
		$('<div>').attr({
			contenteditable: true,
			'data-placeholder': 'Paste a URL or embed code',
			id: 'super-markdown-embed-code',
			class: 'editor-placeholder'
		}).appendTo(buttons.find('.tray'));
	};

	var place = function(buttons) {
		$('.html-field .tabs').append(buttons.parent('.editor-slot'));
	};

	var buttons = $('.editor-wrapper .inline-controls').clone();
	format(buttons);
	place(buttons);
	buttons.find('.control').each(function(i, e) {
		var $e = $(e);
		handleButton[$e.data('control-name')]($e);
	});

	var preview = last(function(content) {
		return postFormData('/svc/filter_html_for_dash_preview', {
			html: content,
			markdown: 1
		});
	});

	// Move the preview above the Markdown entry field.
	$('.view.preview-view').insertBefore('.html-mode');

	// Reload the contents of the preview every time the user changes their
	// Markdown source.
	var updatePreview = function() {
		var src = ace().getValue();
		var $src = $('<div>').html(src);
		var embeds = $src.find('figure.tmblr-embed');
		preview(src).then(function(res) {
			var newPreview = $('<div>').html(res);

			// All of the below code is needed because Tumblr's representation
			// of embedded videos is as a <figure>. Most places that show posts
			// will populate that <figure> automatically with appropriate embed
			// code, but we don't get that luxury. Instead, we just find all the embed
			// <figure>s and insert the appropriate code ourselves.
			var loadedEmbeds = newPreview.find('figure.tmblr-embed').map(function(i, e) {
				var $e = $(e);
				// Take away the grey <iframe> box Tumblr added.
				$e.next().remove();
				return getEmbed(embeds[i].getAttribute('data-url')).then(function(res) {
					$e.html(res.embed_code);
				});
			}).get();
			$.when.apply($, loadedEmbeds).then(function() {
				$('.view.preview-view').css({display: 'block'});
				$('.html-preview').html(newPreview.html());
			});
		});
	};
	if (ace().getValue()) updatePreview();
	ace().on('change', updatePreview);

	var showEmbedCodeField = function() {
		buttons.find('.control').slideUp(function() {
			$('#super-markdown-embed-code').slideDown().focus();
		});
	};
	var hideEmbedCodeField = function() {
		var $field = $('#super-markdown-embed-code');
		$field.addClass('editor-placeholder').text('');
		$field.slideUp(function() {
			buttons.find('.control').slideDown();
		});
	};

	var embeds = {};
	var getEmbed = function(code) {
		if (!embeds[code]) embeds[code] = $.ajax({
			url: '/svc/post/get_video_data',
			type: 'POST',
			headers: {'x-tumblr-form-key': $('meta[name=tumblr-form-key]').attr('content')},
			data: JSON.stringify({
				embed_url: code,
				embed_width: $('.post-container').width()
			})
		});
		return embeds[code];
	};
	var getNewestEmbed = last(getEmbed);

	$('#super-markdown-embed-code').on('input', function() {
		var $field = $(this);
		if (!$field.text()) {
			$field.addClass('editor-placeholder');
			return;
		}

		$field.removeClass('editor-placeholder');
		getNewestEmbed($field.text()).then(function(res) {
			if (!res.service) return;
			var editor = ace();
			var $figure = $('<figure>').attr({
				class: 'tmblr-embed tmblr-full xkit-json-embed',
				'data-provider': res.service,
				'data-orig-width': res.width_orig, 'data-orig-height': res.height_orig,
				'data-url': res.url
			}).html(res.embed_code);
			var html = $figure.wrap('<div>').parent().html();
			editor.insert(html);
			editor.focus();
		});
	}).on('blur', hideEmbedCodeField);
};

XKit.extensions.super_markdown_editor = {
	running: false,
	run: function() {
		this.running = true;
		XKit.tools.init_css("super_markdown_editor");
		XKit.interface.post_window_listener.add("super_markdown_editor", XKit.extensions.super_markdown_editor.post_window);
	},
	post_window: function() {
		XKit.tools.unsafe_eval(superMarkdownEditor);
	},
	destroy: function() {
		this.running = false;
		$('#super-markdown-controls').parent().remove();
		XKit.tools.remove_css("super_markdown_editor");
		XKit.interface.post_window_listener.remove("super_markdown_editor");
	}
};
