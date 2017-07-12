//* TITLE Editable Reblogs **//
//* VERSION 3.3.8 **//
//* DESCRIPTION Restores ability to edit previous reblogs of a post **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.editable_reblogs = new Object({

	running: false,
	state: undefined,
	post_types: {
		PUBLISH: 0,
		QUEUE: 1,
		DRAFT: 2,
		PRIVATE: 3,
		SCHEDULE: 4
	},

	selected_post_type: "PUBLISH",
	scheduled_date: "Next Tuesday, 10am",
	post_date_metadata: null,
	post_slug_metadata: null,

	run: function() {
		this.running = true;

		XKit.interface.post_window_listener.add("editable_reblogs", this.post_window.bind(this));
		XKit.tools.init_css("editable_reblogs");
		this.create_post_button_click_handler = this.make_post.bind(this);

		// DOM nodes containing options disappear before a handler can be run
		var record_post_settings_handler = this.record_post_settings.bind(this);
		$("body").on("click", record_post_settings_handler);

		var post_setting_keyup_handlers = {};
		$.each({"#customUrl_input": "post_slug_metadata", "#postDate_input": "post_date_metadata"},
			function(selector, property) {
				post_setting_keyup_handlers[selector] = function() {
					XKit.extensions.editable_reblogs[property] = $(this).val();
				};

				$('body').on("keyup", selector, post_setting_keyup_handlers[selector]);
			}
		);

		this.teardown_event_handlers = function() {
			$("body").off("click", ".create_post_button", this.create_post_button_click_handler);
			$("body").off("click", record_post_settings_handler);
			$.each(post_setting_keyup_handlers, function(selector, handler) {
				$('body').off("keyup", selector, handler);
			});
		};
	},

	post_window: function() {
		this.state = "initial";
		$("body").off("click", ".create_post_button", this.create_post_button_click_handler);

		if (!this.reblog_tree_exists()) {
			XKit.interface.post_window.set_content_html(this.wrap_html_links(XKit.interface.post_window.get_content_html()));
			return;
		}

		//also just let chat, link, and quote posts do what they do
		var post_type = XKit.interface.post_window.post_type();
		if (post_type.chat || post_type.quote) {
			return;
		}
		var has_displayed_ER_warning = XKit.storage.get('editable_reblogs', 'has_displayed_ER_warning', '');
		if (!has_displayed_ER_warning) {
			XKit.window.show('Editable Reblogs Warning',
				"WARNING: Editable Reblogs no longer preserves Tumblr's reblog " +
				"structure due to changes on Tumblr's side. Any posts reblogged " +
				"with Editable Reblogs will display the entire reblog tree as a " +
				"single blockquoted post.<br><br>" +
				"The XKit team deeply apologizes for any inconvenience this causes, " +
				"and we're working to restore the original functionality, " +
				"but Tumblr's updates are in this case beyond our control.<br><br>" +
				"As always, this extension can be disabled at any time from the XKit preferences panel.",
				'error', '<div id="xkit-close-message" class="xkit-button xkit-er-ack-blockquotes">OK</div>');
			$(".xkit-er-ack-blockquotes").click(function() {
				XKit.storage.set('editable_reblogs', 'has_displayed_ER_warning', 'true');
			});
		}
		//disable on pages that don't include reblog_key and post_id in the URL
		//for now until we've refactored more effectively
		var location_path = window.location.pathname;
		var location_items = location_path.split("/");
		location_items.shift();
		if (location_items[0] != "reblog" && location_items[0] != "edit") {
			return;
		}

		this.initialize_selected_post_type();
		this.scheduled_date = "Next Tuesday, 10am";
		this.load_initial_metadata();
		var element = this.add_edit_button();
		$(element).one('click', function() {
			this.edit_the_reblogs();
			$(element).addClass('disabled');
		}.bind(this));
	},

	add_edit_button: function() {
		var post_margin = $(".post-form .post-margin");
		post_margin.append(
			'<div class="xkit-er-edit-button icon_edit_pencil"></div>'
		);

		if (!XKit.storage.get('editable_reblogs', 'has_dismissed_button_callout', '')) {
			post_margin.append(
				'<div class="xkit-er-callout--container">' +
				  '<div class="xkit-er-callout--header">Editable Reblogs</div>' +
				  '<div class="xkit-er-callout--body">click this button to trim or edit this post</div>' +
				'</div>'
			);

			$('.xkit-er-callout--container').delay(800).slideDown(800);
			$('.post-form .editor').one('keyup', function() {
				$('.xkit-er-callout--container').delay(2000).slideUp(800);
			});

			$(".xkit-er-edit-button").click(function() {
				XKit.storage.set('editable_reblogs', 'has_dismissed_button_callout', 'true');
				$('.xkit-er-callout--container').slideUp(800);
			});
			$('.xkit-er-callout--container').click(function() {
				XKit.storage.set('editable_reblogs', 'has_dismissed_button_callout', 'true');
				$('.xkit-er-callout--container').slideUp(800);
			});
		}

		return $('.xkit-er-edit-button')[0];
	},

	edit_the_reblogs: function() {
		try {
			var save_button = $('.post-form--save-button [data-js-clickablesave]');
			// Prevent Tumblr's event handler from acting on the save button
			save_button.removeAttr("data-js-clickablesave");
			$("body").on("click", ".create_post_button", this.create_post_button_click_handler);
			this.process_reblog_content();
			this.state = "success";
		} catch (e) {
			console.error(e);

			this.get_post_save_button().attr("data-js-clickablesave", "");

			if (!e.hide_popup) {
				var github_url = XKit.tools.github_issue("Editable Reblogs " + this.state + " error",
					{ state: this.state, "ER Version": XKit.installed.get("editable_reblogs").version },
				e);

				XKit.window.show('Editable Reblogs Error', 'ERROR: Editable Reblogs failed to proccess some part of your post safely. ' +
					'Therefore, it has been disabled to prevent unintentional side-effects that could potentially corrupt the post. ' +
					(!e.hide_url ? '<br><br><a target="_blank" href="' + github_url + '">You can report this issue on Github by clicking here</a>' : ''),
					'error', '<div id="xkit-close-message" class="xkit-button">OK</div>');
			}
		}
	},

	load_initial_metadata: function() {
		//if this is an edit, we need to load the custom date and slug metadata if there is any
		//so we can maintain it if they don't change anything
		this.state = "metadata";
		this.post_date_metadata = "";
		this.post_slug_metadata = "";
		var location_path = window.location.pathname;
		var location_items = location_path.split("/");
		location_items.shift();
		if (location_items[0] != "edit") {
			return;
		}

		var post_fetch_request = {
			id: parseInt(location_items[1]),
			form_key: XKit.interface.form_key(),
			post_type: false
		};

		XKit.interface.fetch(post_fetch_request, function(response) {
			this.post_date_metadata = response.data.post.date;
			this.post_slug_metadata = response.data.post.slug;
			if (response.data.post.is_private === 1) {
				this.selected_post_type = "PRIVATE";
			}
		}.bind(this));
	},

	get_post_save_button: function() {
		return $('.post-form--save-button button');
	},

	wrap_html_links: function(html_text) {
		var nodes = $(html_text);
		nodes.find('a').wrap('<span></span>');
		var nodes_text = $('<div>').append($(nodes).clone()).html();
		return nodes_text;
	},

	process_reblog_content: function() {
		var reblog_tree = $(".post-form .reblog-list");

		var all_quotes = [];
		var old_content = '';
		var all_quotes_text = '';

		this.state = "processing reblog content";
		// Guard against double evaluation by marking the tree as processed
		var processed_class = 'xkit-editable-reblogs-done';
		if (reblog_tree.length > 0) {
			this.state = "tree processing";

			if (reblog_tree.hasClass(processed_class)) {
				return;
			}
			reblog_tree.addClass(processed_class);

			this.state = "processing reblog items";

			reblog_tree.find(".reblog-list-item").each(function(index) {
				var reblog_data = {
					reblog_content: $(this).find('.reblog-content').html() ? $(this).find('.reblog-content').html() : '',
					reblog_author: $(this).find('.reblog-tumblelog-name').text() ? $(this).find('.reblog-tumblelog-name').text().trim() : '',
					reblog_url: $(this).find('.reblog-tumblelog-name').attr('href')
						? $(this).find('.reblog-tumblelog-name').attr('href').trim()
						: 'http://' + $(this).find('.reblog-tumblelog-name').text().trim() + '.tumblr.com/post/1/undefined'
				};

				all_quotes.push(reblog_data);
			});

			all_quotes.forEach(function(data, index, all) {
				var reblog_content = data.reblog_content.replace("tmblr-truncated read_more_container", "");

				if (!all_quotes_text && this.is_blockquote_reblog(data.reblog_content)) {
					all_quotes_text = reblog_content;
				} else {
					all_quotes_text = "<p><a href='" + data.reblog_url + "'>" + data.reblog_author + "</a>:</p>" +
					"<blockquote>" + all_quotes_text + reblog_content + "</blockquote>";
				}
			}.bind(this));
		}

		try {
			old_content = XKit.interface.post_window.get_content_html();
		} catch (e) {
			XKit.window.show('Invalid editor type', 'ERROR: Editable Reblogs cannot currently get content from your default editor type. ' +
				'To continue using editable reblogs, click <a target="_blank" href="https://www.tumblr.com/settings/dashboard">here</a> ' +
				'to edit your dashboard settings to use the rich text editor or HTML editor',
				'error', "<div id=\"xkit-close-message\" class=\"xkit-button\">OK</div>");
			var error = new Error("Editor Type");
			error.hide_popup = true;
			throw error;
		}

		this.state = "post processing";
		// add 'tumblr_blog' class to all tumblr.com links,
		// assuming that they're part of a reblog-structure that's not being parsed properly
		var nodes = $(all_quotes_text + old_content);
		// nodes.find('a[href*="tumblr.com"]').addClass('tumblr_blog');
		var nodes_text = $('<div>').append($(nodes).clone()).html();

		// var undefined_urls = nodes_text.match(new RegExp("<a .*post/1/undefined", "g")) || [];
		// if (undefined_urls.length > 1) {
		// 	var error = new Error("Too many bad urls");
		// 	error.hide_url = true;
		// 	throw error;
		// }

		this.state = "mutation";

		var title = reblog_tree.find('.reblog-title');
		$('.post-form--header').append(title);
		XKit.interface.post_window.set_content_html(nodes_text);

		$(".btn-remove-trail .icon").click();
		$(".control-reblog-trail").hide();
	},

	is_blockquote_reblog: function(text) {
		var elements = $(text);

		elements = elements.filter(function(index, node) {
			if (!node.innerHTML || node.innerHTML == "<br>") {
				return false;
			}
			return true;
		});

		if (elements.length != 2) {
			return false;
		}

		var url = elements[0];
		var is_url = url.tagName == "P" &&
					 url.childNodes[0].tagName == "A" &&
					 url.childNodes[0].href.match("/post/");

		var blockquote = elements[1];
		var is_blockquote = blockquote.tagName == "BLOCKQUOTE";

		return is_url && is_blockquote;
	},

	reblog_tree_exists: function() {
		//if we don't have a reblog tree to edit, gtfo
		//this also applies to new posts
		//which saves us from worrying about things like photo replies
		return $(".post-form .reblog-list").length !== 0;
	},

	initialize_selected_post_type: function() {
		var where = XKit.interface.where();
		if (where.dashboard) {
			this.selected_post_type = "PUBLISH";
		} else if (where.drafts) {
			this.selected_post_type = "DRAFT";
		} else if (where.queue) {
			this.selected_post_type = "QUEUE";
		}
	},

	record_post_settings: function(e) {
		var post_dropdown_exists = $(e.target).parents(".popover--save-post-dropdown").length > 0;
		if (post_dropdown_exists) {
			var clicked_li = e.target.tagName !== "LI" ? e.target.parentNode : e.target;
			for (var i = 0; i < clicked_li.attributes.length; i++) {
				// looking for attribute like "data-js-publish" and "data-js-draft"
				var attribute = clicked_li.attributes[i].name;
				if (attribute.startsWith("data-js-") && !attribute.endsWith("preview")) {
					var type = attribute.substring(8).toUpperCase();
					this.selected_post_type = type;

					if (type === "SCHEDULE") {
						$("[data-js-scheduletext]").off("blur");
						$("[data-js-scheduletext]").on("blur", this.update_scheduled_date.bind(this));
					}
					return;
				}
			}
		}
	},

	update_scheduled_date: function(e) {
		this.scheduled_date = e.target.value;
	},

	make_post: function(event) {
		if (!this.reblog_tree_exists() || this.state != "success") {
			XKit.interface.post_window.set_content_html(this.wrap_html_links(XKit.interface.post_window.get_content_html()));
			this.get_post_save_button().attr("data-js-clickablesave", '');
			this.get_post_save_button().click();
			return;
		}

		try {
			var post_types = this.post_types;
			switch (post_types[this.selected_post_type]) {
			case post_types.PUBLISH:
				this.send_post_request(event);
				break;
			case post_types.QUEUE:
				this.send_queue_request(event);
				break;
			case post_types.DRAFT:
				this.send_draft_request(event);
				break;
			case post_types.PRIVATE:
				this.send_private_request(event);
				break;
			case post_types.SCHEDULE:
				this.send_schedule_request(event);
				break;
			}

			this.state = "finished";
		} catch (e) {
			console.error(e);

			var github_url = XKit.tools.github_issue("Editable Reblogs post error",
				{ state: this.state, "ER Version": XKit.installed.get("editable_reblogs").version },
			e);

			XKit.window.show('Editable Reblogs Error',
				"ERROR: Editable Reblogs failed to process some part of your post, and it wasn't posted. " +
				"Try removing images or media and trying again." +
				(!e.hide_url ? '<br><br><a target="_blank" href="' + github_url + '">You can report this issue on Github by clicking here</a>' : ''),
				'error', '<div id="xkit-close-message" class="xkit-button">OK</div>');
		}
	},

	send_post_request: function(e) {
		e.preventDefault();
		var request = this.build_svc_request();
		request["post[state]"] = "0";
		this.send_request(request);
	},

	send_queue_request: function(e) {
		e.preventDefault();
		var request = this.build_svc_request();
		request["post[state]"] = "2";
		this.send_request(request);
	},

	send_draft_request: function(e) {
		e.preventDefault();
		var request = this.build_svc_request();
		request["post[state]"] = "1";
		this.send_request(request);
	},

	send_private_request: function(e) {
		e.preventDefault();
		var request = this.build_svc_request();
		request["post[state]"] = "private";
		this.send_request(request);
	},

	send_schedule_request: function(e) {
		e.preventDefault();
		var request = this.build_svc_request();
		request["post[state]"] = "on.2";
		request["post[publish_on]"] = this.scheduled_date;
		this.send_request(request);
	},

	build_svc_request: function() {
		var post_type = XKit.interface.post_window.post_type();
		var request = this.build_common_svc_request();
		if (post_type.text) {
			request["post[type]"] = "regular";
			//@TODO make title editable
			request["post[one]"] = $('.post-form--header .reblog-title').text();
		}
		if (post_type.photo) {
			request["post[type]"] = "photo";
		}
		if (post_type.video) {
			request["post[type]"] = "video";
		}
		if (post_type.note) {
			request["post[type]"] = "note";
			request["post[three]"] = request["post[two]"];
			request["post[two]"] = "";
		}
		if (post_type.audio) {
			request["post[type]"] = "audio";
		}
		if (post_type.link) {
			request["post[type]"] = "link";
			request["post[three]"] = request["post[two]"];
			request["post[two]"] = "";
		}
		return request;
	},

	build_common_svc_request: function() {
		var request = {};
		var location_path = window.location.pathname;
		var location_items = location_path.split("/");
		location_items.shift();

		request.form_key = XKit.interface.form_key();
		request.channel_id = $('.post-form--header .tumblelog-select .caption').text();
		request.detached = true; //?
		request.reblog = location_items[0] === "reblog";

		if (location_items[0] === "reblog") {
			request.reblog_id = parseInt(location_items[1]);
		}
		if (location_items[0] === "edit") {
			request.post_id = parseInt(location_items[1]);
		}

		request.reblog_key = location_items[2];
		request.errors = false;
		request.silent = false;
		request.context_id = "";
		if (location_items[0] === "reblog") {
			request.reblog_post_id = location_items[1];
		}
		if (location_items[0] === "edit") {
			request.edit_post_id = location_items[1];
		}

		request.remove_reblog_tree = true;
		request["is_rich_text[one]"] = "0";
		request["is_rich_text[two]"] = "1";
		request["is_rich_text[three]"] = "0";
		request["post[slug]"] = this.post_slug_metadata;
		request["post[draft_status]"] = "";
		request["post[date]"] = this.post_date_metadata;

		request["post[tags]"] = $.map($('.post-form--footer .tag-label'), function(element, index) {
			return $(element).text();
		}).join(",");

		var html_data = this.parse_html(XKit.interface.post_window.get_content_html());
		request["post[two]"] = this.wrap_html_links(html_data);

		if ($('.post-forms--social-buttons .social-button.twitter').hasClass('checked')) {
			request.send_to_twitter = "on";
		}
		if ($('.post-forms--social-buttons .social-button.facebook').hasClass('checked')) {
			request.send_to_fbog = "on";
		}
		//@TODO maybe we can do this in the future
		request.custom_tweet = false;

		return request;
	},

	parse_html: function(data) {

		var text = XKit.interface.post_window.get_content_html();

		var nodes = $('<div>').append($(text));
		nodes.find('.tmblr-truncated').replaceWith('[[MORE]]');
		XKit.extensions.editable_reblogs.format_video_media(nodes);

		// tumblr_blog must be wrapped in single quotes,
		// not double, or the dash will nom the shit out of your post
		//********ALL DOM MANIPULATION ABOVE THIS LINE*********
		text = nodes.html();
		// text = text.replace(/['"]tumblr_blog['"]/g, "tumblr_blog tumblr_blog");

		// also remove empty HTML if the user hasn't added anything
		if (text.indexOf("<p><br></p>", text.length - 11) !== -1) {
			text = text.substring(0, text.length - 11);
		}
		return text;
	},

	format_video_media: function(nodes) {
		// parse items embedded in the current post
		var embeds = nodes.find('.media-holder');
		$.each(embeds, function(index, value) {
			var element = $(value);
			element.find('.media-killer').remove();
			element.find('.media-mover').remove();
			element.find('.thumbnail-preview').remove();
			var figure = element.find('figure');
			if (!figure.find('iframe').length) {
				return;
			}

			figure.removeClass('tmblr-embed-placeholder')
					.removeClass('embed-thumbnail-preview')
					.addClass('tmblr-embed')
					.removeAttr('data-embed-code')
					.unwrap();
		});
		// parse items embedded in earlier reblogs
		var figures = nodes.find('figure.tmblr-embed');
		$.each(figures, function(index, value) {
			var figure = $(value);
			var iframe = figure.find('iframe');
			if (!iframe.length) {
				return;
			}

			if (!iframe.is('[data-src]')) {
				var src = iframe.attr('src');
				iframe.attr('data-src', src);
			}
			if (!figure.is('[data-orig-height]')) {
				var height = iframe.attr('height');
				figure.attr('data-orig-height', height);
			}
			if (!figure.is('[data-orig-width]')) {
				var width = iframe.attr('width');
				figure.attr('data-orig-width', width);
			}
			if (!figure.is('[data-url]')) {
				var tumblrSource = iframe.attr('data-src');
				var embedId = iframe.attr('id');
				var segments = tumblrSource.split('/');
				var url = segments[6].replace('#' + embedId, '');
				figure.attr('data-url', url);
			}
			if (!figure.is('[data-provider]')) {
				//it doesn't seem to matter what this value is as long as it exists
				figure.attr('data-provider', 'youtube');
			}
		});
	},

	send_request: function(request) {
		XKit.interface.kitty.get(function(kitty_data) {

			GM_xmlhttpRequest({
				method: "POST",
				url: "http://www.tumblr.com/svc/post/update",
				data: JSON.stringify(request),
				json: true,
				headers: {
					"X-tumblr-puppies": kitty_data.kitten,
					"X-tumblr-form-key": XKit.interface.form_key(),
				},

				onerror: function(response) {
					XKit.interface.kitty.set("");

					var github_url = XKit.tools.github_issue("Editable Reblogs posting error",
						{ "ER Version": XKit.installed.get("editable_reblogs").version,
						 user: request.channel_id, body: request["post[two]"]}, {stack: response});

					XKit.window.show("Error",
						"Error: XER-SR.<br><br>There was an error reblogging your post. Please try again shortly. " +
						'<br><br>' +
						'<a target="_blank" href="' + github_url + '">You can report this issue on Github by clicking here</a>',
						"error",
						'<div class="xkit-button default" id="xkit-close-message">OK</div>');

					console.error("editable_reblogs.send_request:\n", response);
				},

				onload: function(response) {
					// We are done!
					XKit.interface.kitty.set(response.getResponseHeader("X-Tumblr-Kittens"));
					var redirect_url = XKit.tools.getParameterByName("redirect_to");
					XKit.tools.add_function(function() {
						Tumblr.Events.trigger("postForms:saved");
						var redirect_url = add_tag; // eslint-disable-line no-shadow
						if (redirect_url !== "") {
							setTimeout(function() {
								window.location.replace(redirect_url);
							}, 500);
						}
					}, true, redirect_url);
				}
			});

		});
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("editable_reblogs_remove_content_tree");
		this.teardown_event_handlers();
		XKit.interface.post_window_listener.remove("editable_reblogs");
	}
});
