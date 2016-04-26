//* TITLE Editable Reblogs **//
//* VERSION 3.0.7 **//
//* DESCRIPTION Restores ability to edit previous reblogs of a post **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.editable_reblogs = new Object({

	running: false,
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

		XKit.interface.post_window_listener.add("editable_reblogs", XKit.extensions.editable_reblogs.post_window);
		XKit.tools.add_css(".control-reblog-tree {display: none; } .post-form--header .reblog-title {margin: 10px; color: #444} "
			+ ".xkit-editable-reblogs-button { float: right; margin-left: 20px; }"
			+ ".control.right.xkit-editable-reblogs-control { display: block; width: 210px; text-align: right }", "editable_reblogs_remove_content_tree");

		var pat_ver = XKit.tools.parse_version(XKit.installed.get("xkit_patches").version);
		if (pat_ver.major <=5 && pat_ver.minor <= 3 && pat_ver.patch <= 0){
			XKit.extensions.xkit_updates.update('xkit_patches', function(result){
				if(result.errors){
					XKit.window.show('Updating error', 'ERROR: Editable Reblogs does not support your version of XKit Patches, '+
					'and cannot automatically update it.<br><br>'+
					"Try force updating all extensions from the gallery, and if that fails, try uninstalling and reinstalling XKit.",
					'error', "<div id=\"xkit-close-message\" class=\"xkit-button\">OK</div>");
				} else {
					window.location = window.location;
				}
			});
		}
		$("body").on("click", ".create_post_button", XKit.extensions.editable_reblogs.make_post);
		// DOM nodes containing options disappear before a handler can be run
		$("body").on("click", XKit.extensions.editable_reblogs.record_post_settings);
		$('body').on("keyup", '#customUrl_input', function() {
			XKit.extensions.editable_reblogs.post_slug_metadata = $(this).val();
		});
		$('body').on("keyup", '#postDate_input', function() {
			XKit.extensions.editable_reblogs.post_date_metadata = $(this).val();
		});
	},
	post_window: function() {
		var self = XKit.extensions.editable_reblogs;
		if (!self.reblog_tree_exists()) {
			return;
		}
		//also just let chat, link, and quote posts do what they do
		var post_type = XKit.interface.post_window.post_type();
		if (post_type.chat || post_type.quote) {
			return;
		}
		//disable on pages that don't include reblog_key and post_id in the URL
		//for now until we've refactored more effectively
		var location_path = window.location.pathname;
		var location_items = location_path.split("/");
		location_items.shift();
		if (location_items[0] != "reblog" && location_items[0] != "edit") {
			return;
		}
		var xkit_button = $('.post-form--save-button');
		// Prevent Tumblr's event handler from acting on the save button
		xkit_button.find("[data-js-clickablesave]").removeAttr("data-js-clickablesave");
		self.initialize_selected_post_type();
		self.scheduled_date = "Next Tuesday, 10am";
		self.load_initial_metadata();
		self.process_existing_content();
	},
	load_initial_metadata: function() {
		//if this is an edit, we need to load the custom date and slug metadata if there is any
		//so we can maintain it if they don't change anything
		var self = XKit.extensions.editable_reblogs;
		self.post_date_metadata = "";
		self.post_slug_metadata = "";
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
			self.post_date_metadata = response.data.post.date;
			self.post_slug_metadata = response.data.post.slug;
			if (response.data.post.is_private === 1) {
				self.selected_post_type = "PRIVATE";
			}
		});
	},
	process_existing_content: function() {
		var reblog_tree = $(".post-form .reblog-list");

		var all_quotes = [];
		var old_content = '';
		var all_quotes_text = '';
		// Guard against double evaluation by marking the tree as processed
		var processed_class = 'xkit-editable-reblogs-done';
		if (reblog_tree.length > 0) {
			if (reblog_tree.hasClass(processed_class)) {
				return;
			}
			reblog_tree.addClass(processed_class);

			var title = reblog_tree.find('.reblog-title');
			$('.post-form--header').append(title);
			reblog_tree.find(".reblog-list-item").each(function(index) {
				var reblog_data = {
					reblog_content: $(this).find('.reblog-content').html() ? $(this).find('.reblog-content').html() : '',
					reblog_author: $(this).find('.reblog-tumblelog-name').text() ? $(this).find('.reblog-tumblelog-name').text().trim() : '',
					reblog_url: $(this).find('.reblog-tumblelog-name').attr('href').trim()
						? $(this).find('.reblog-tumblelog-name').attr('href').trim()
						: 'http://' + $(this).find('.reblog-tumblelog-name').text().trim() + '.tumblr.com'
				};
				all_quotes.push(reblog_data);
			});
			all_quotes.forEach(function(data, index, all) {
				var reblog_content = data.reblog_content.replace("tmblr-truncated read_more_container", "");
				all_quotes_text = "<p><a class='tumblr_blog' href='" + data.reblog_url + "'>" + data.reblog_author + "</a>:</p><blockquote>" + all_quotes_text + reblog_content + "</blockquote>";
			});
		}
		try {
			old_content = XKit.interface.post_window.get_content_html();
		} catch (e) {
			XKit.tools.add_function(function() {
				Tumblr.Events.trigger("postForms:saved");
			}, true, "");
			XKit.window.show('Invalid editor type', 'ERROR: Editable Reblogs cannot currently get content from your default editor type. '+
				'To continue using editable reblogs, click <a target="_blank" href="https://www.tumblr.com/settings/dashboard">here</a> '+
				'to edit your dashboard settings to use the rich text editor or HTML editor',
				'error', "<div id=\"xkit-close-message\" class=\"xkit-button\">OK</div>");
			return;
		}
		// add 'tumblr_blog' class to all tumblr.com links,
		// assuming that they're part of a reblog-structure that's not being parsed properly
		var nodes = $(all_quotes_text + old_content);
		nodes.find('a[href*="tumblr.com"]').addClass('tumblr_blog');
		var nodes_text = $('<div>').append($(nodes).clone()).html();
		XKit.interface.post_window.set_content_html(nodes_text);
		//run submission cleanup before post is submitted
		$('.controls-container').on('click', '.create_post_button', XKit.extensions.editable_reblogs.process_submit);

		$(".btn-remove-trail .icon").click();
		$(".control-reblog-trail").hide();
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
			XKit.extensions.editable_reblogs.selected_post_type = "PUBLISH";
		} else if (where.drafts) {
			XKit.extensions.editable_reblogs.selected_post_type = "DRAFT";
		} else if (where.queue) {
			XKit.extensions.editable_reblogs.selected_post_type = "QUEUE";
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
					XKit.extensions.editable_reblogs.selected_post_type = type;

					if (type === "SCHEDULE") {
						$("[data-js-scheduletext]").off("blur");
						$("[data-js-scheduletext]").on("blur", XKit.extensions.editable_reblogs.update_scheduled_date);
					}
					return;
				}
			}
		}
	},
	update_scheduled_date: function(e) {
		XKit.extensions.editable_reblogs.scheduled_date = e.target.value;
	},
	make_post: function(e) {
		if (!XKit.extensions.editable_reblogs.reblog_tree_exists()) {
			return;
		}
		var post_types = XKit.extensions.editable_reblogs.post_types;
		switch (post_types[XKit.extensions.editable_reblogs.selected_post_type]) {
			case post_types.PUBLISH:
				XKit.extensions.editable_reblogs.send_post_request(e);
				break;
			case post_types.QUEUE:
				XKit.extensions.editable_reblogs.send_queue_request(e);
				break;
			case post_types.DRAFT:
				XKit.extensions.editable_reblogs.send_draft_request(e);
				break;
			case post_types.PRIVATE:
				XKit.extensions.editable_reblogs.send_private_request(e);
				break;
			case post_types.SCHEDULE:
				XKit.extensions.editable_reblogs.send_schedule_request(e);
				break;
		}
	},
	send_post_request: function(e) {
		e.preventDefault();
		var request = XKit.extensions.editable_reblogs.build_svc_request();
		request["post[state]"] = "0";
		XKit.extensions.editable_reblogs.send_request(request);
	},
	send_queue_request: function(e) {
		e.preventDefault();
		var request = XKit.extensions.editable_reblogs.build_svc_request();
		request["post[state]"] = "2";
		XKit.extensions.editable_reblogs.send_request(request);
	},
	send_draft_request: function(e) {
		e.preventDefault();
		var request = XKit.extensions.editable_reblogs.build_svc_request();
		request["post[state]"] = "1";
		XKit.extensions.editable_reblogs.send_request(request);
	},
	send_private_request: function(e) {
		e.preventDefault();
		var request = XKit.extensions.editable_reblogs.build_svc_request();
		request["post[state]"] = "private";
		XKit.extensions.editable_reblogs.send_request(request);
	},
	send_schedule_request: function(e) {
		e.preventDefault();
		var request = XKit.extensions.editable_reblogs.build_svc_request();
		request["post[state]"] = "on.2";
		request["post[publish_on]"] = XKit.extensions.editable_reblogs.scheduled_date;
		XKit.extensions.editable_reblogs.send_request(request);
	},
	build_svc_request: function() {
		var post_type = XKit.interface.post_window.post_type();
		var request = XKit.extensions.editable_reblogs.build_common_svc_request();
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
		request["post[slug]"] = XKit.extensions.editable_reblogs.post_slug_metadata;
		request["post[draft_status]"] = "";
		request["post[date]"] = XKit.extensions.editable_reblogs.post_date_metadata;
		request["post[tags]"] = $.map($('.post-form--footer .tag-label'), function(element, index) {
			return $(element).text();
		}).join(",");
		request["post[two]"] = XKit.extensions.editable_reblogs.parse_html(XKit.interface.post_window.get_content_html());
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
		// tumblr_blog must be wrapped in single quotes, not double, or the dash will nom the shit out of your post
		var text = XKit.interface.post_window.get_content_html();
		//********* DO ANY DOM MANIPULATION FIRST *************
		//******if done later it will undo the single quote fix*********
		var nodes = $('<div>').append($(text));
		nodes.find('.tmblr-truncated').replaceWith('[[MORE]]');
		text = nodes.html();
		//********ALL DOM MANIPULATION ABOVE THIS LINE*********
		text = text.replace(/"tumblr_blog"/g, "'tumblr_blog'");
		// also remove empty HTML if the user hasn't added anything
		if (text.indexOf("<p><br></p>", text.length - 11) !== -1) {
			text = text.substring(0, text.length - 11);
		}
		return text;
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
					XKit.window.show("Error",
						"Error: XER-SR.<br /><br />There was an error reblogging your post. Please try again shortly. If you continue to receive this, please contact XKit staff.",
						"error",
						"<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div><a href=\"http://new-xkit-extension.tumblr.com/\" class=\"xkit-button\">Visit the New XKit Blog</a>");
					console.log("editable_reblogs.send_request:\n", response);
				},
				onload: function(response) {
					// We are done!
					XKit.interface.kitty.set(response.getResponseHeader("X-tumblr-kittens"));
					var redirect_url = XKit.tools.getParameterByName("redirect_to");
					XKit.tools.add_function(function() {
						Tumblr.Events.trigger("postForms:saved");
						var redirect_url = add_tag;
						if (redirect_url !== "") {
							setTimeout(function(){
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
		$("body").off("click", ".create_post_button", XKit.extensions.editable_reblogs.send_post_request);
		$("body").off("click", XKit.extensions.editable_reblogs.record_post_settings);
		XKit.interface.post_window_listener.remove("editable_reblogs");
	}
});
