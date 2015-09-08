//* TITLE Super Markdown Editor **//
//* VERSION 1.0 REV A **//
//* DESCRIPTION Add live previews and other functionality to the Markdown post editor **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

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
	var pending = $.Deferred().promise();
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
		headers: {'x-tumblr-form-key': XKit.interface.form_key()},
		processData: false,
		contentType: false
	});
};

var ACE_SELECTOR = '.html-field .ace_editor';
var aceInsert = function(str) {
	XKit.tools.unsafe_eval(function() {
		var editor = window.ace.edit(document.querySelector(this.ace));
		editor.insert(this.str);
		editor.focus();
	}, {ace: ACE_SELECTOR, str: str});
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
				aceInsert('![](' + url + ')');
			}, function(err) {
				XKit.window.show('Sorry!',
					'Uploading the image <pre>' + escapeHtml(file.name) + '</pre> failed. Please try again.',
					'error', '<div id="xkit-close-message" class="xkit-button default">Okay</div>'
				);
			});
		});
	},

	'inline-embed': function(videoButton) {
		$('#super-markdown-embed-code').on('input', embed.process).on('blur', embed.hide);
		videoButton.click(embed.show);
	},

	gif: function(gifButton) {
		// The GIF thing is hard to reimplement and not very useful so
		// let's just skip it.
		gifButton.css({display: 'none'});
	},

	hr: function(hrButton) {
		hrButton.click(function() {
			aceInsert('\n\n----\n\n');
		});
	},
	'read-more': function(readMoreButton) {
		readMoreButton.click(function() {
			aceInsert('\n\n<!-- more -->\n\n');
		});
	}
};

var setupButtons = function() {
	var buttons = $('.editor-wrapper .inline-controls').clone();

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

	$('.html-field .tabs').append(buttons.parent('.editor-slot'));

	buttons.find('.control').each(function(i, e) {
		var $e = $(e);
		handleButton[$e.data('control-name')]($e);
	});
};

var setupPreview = function() {
	// Move the preview above the Markdown entry field.
	$('.view.preview-view').insertBefore('.html-mode');
	// When the user edits the markdown source, update the live preview.
	XKit.tools.unsafe_eval(function(xkit) {
		var editor = window.ace.edit(document.querySelector(this.ace));
		var update = function() {
			xkit('extensions.super_markdown_editor.update_preview', editor.getValue());
		};
		if (editor.getValue()) update();
		editor.on('change', update);
	}, {ace: ACE_SELECTOR});
};

var ajax = {
	preview: last(function(content) {
		return postFormData('/svc/filter_html_for_dash_preview', {
			html: content,
			markdown: 1
		});
	}),
	embed: (function() {
		var embeds = {};
		return function(code) {
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
	})()
};
ajax.newestEmbed = last(ajax.embed);

var embed = {
	show: function() {
		$('#super-markdown-controls .control').slideUp(function() {
			$('#super-markdown-embed-code').slideDown().focus();
		});
	},
	hide: function() {
		var $field = $('#super-markdown-embed-code');
		$field.addClass('editor-placeholder').text('');
		$field.slideUp(function() {
			$('#super-markdown-controls .control').slideDown();
		});
	},
	process: function() {
		var $field = $('#super-markdown-embed-code');
		if (!$field.text()) {
			$field.addClass('editor-placeholder');
			return;
		}
		$field.removeClass('editor-placeholder');
		ajax.newestEmbed($field.text()).then(function(res) {
			if (!res.service) return;
			var $figure = $('<figure>').attr({
				class: 'tmblr-embed tmblr-full xkit-json-embed',
				'data-provider': res.service,
				'data-orig-width': res.width_orig, 'data-orig-height': res.height_orig,
				'data-url': res.url
			}).html(res.embed_code);
			var html = $figure.wrap('<div>').parent().html();
			aceInsert(html);
		});
	}
};


XKit.extensions.super_markdown_editor = {
	running: false,
	run: function() {
		this.running = true;
		XKit.tools.init_css("super_markdown_editor");
		XKit.interface.post_window_listener.add("super_markdown_editor", XKit.extensions.super_markdown_editor.post_window);
	},
	post_window: function() {
		setupButtons();
		setupPreview();
	},
	update_preview: function(src) {
		var $src = $('<div>').html(src);
		var embeds = $src.find('figure.tmblr-embed');
		ajax.preview(src).then(function(res) {
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
				return ajax.embed(embeds[i].getAttribute('data-url')).then(function(res) {
					$e.html(res.embed_code);
				});
			}).get();
			$.when.apply($, loadedEmbeds).then(function() {
				$('.view.preview-view').css({display: 'block'});
				$('.html-preview').html(newPreview.html());
			});
		});
	},
	destroy: function() {
		this.running = false;
		$('#super-markdown-controls').parent().remove();
		XKit.tools.remove_css("super_markdown_editor");
		XKit.interface.post_window_listener.remove("super_markdown_editor");
	}
};
