//* TITLE Outbox **//
//* VERSION 0.11.0 **//
//* DESCRIPTION Saves your sent replies and asks. **//
//* DETAILS This extension stores and lets you view the last 50 asks you've answered privately. Please keep in mind that this is a highly experimental extension, so if you hit a bug, please send the XKit blog an ask with the problem you've found. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.outbox = new Object({

	running: false,

	preferences: {
		"sep0": {
			text: "User interface options",
			type: "separator"
		},
		"show_checkbox": {
			text: "Show 'Save to Outbox' checkbox in Inbox",
			default: true,
			value: true
		},
		"sep1": {
			text: "Storage options",
			type: "separator"
		},
		"use_shared": {
			text: "Use Shared Storage (turn on if outbox messages are disappearing)",
			default: true,
			value: true
		},
	},

	frame_run: function() {

		XKit.console.add("Outbox working on Frame mode...");
		if (document.location.href.indexOf('/ask_form') !== -1) {
			this.run_ask_frame();
		}

	},

	run_ask_frame: function() {

		var form_key = $("#form_key").val();
		if (typeof form_key === "undefined") { return; }

		$(document).on("click", "#ask_button", function() {

			var m_messages = XKit.storage.get("outbox", "messages_" + form_key, "");
			if (XKit.extensions.outbox.preferences.use_shared.value) {
				m_messages = XKit.storage.get("outbox", "messages", "");
			}

			var m_messages_array = "";

			try {
				m_messages_array = JSON.parse(m_messages);
				if (m_messages_array.length >= 50) {
					// remove the last element.
					m_messages_array.pop();
				}
			} catch (e) {
				m_messages_array = [];
			}

			var m_username = document.location.href.substring(document.location.href.indexOf('/ask_form') + 10);
			m_username = m_username.substring(0, m_username.indexOf("."));

			var m_obj = {};
			m_obj.avatar = "ask";
			m_obj.username = $("#tumblelog_name").find(".name").html();
			m_obj.message = $("#question").val();
			m_obj.answer = "";
			m_obj.to = m_username;
			m_obj.time = new Date().getTime();

			m_messages_array.unshift(m_obj);
			//XKit.storage.set("outbox", "messages_" + form_key, JSON.stringify(m_messages_array));
			if (XKit.extensions.outbox.preferences.use_shared.value) {
				XKit.storage.set("outbox", "messages", JSON.stringify(m_messages_array));
			} else {
				XKit.storage.set("outbox", "messages_" + form_key, JSON.stringify(m_messages_array));
			}


		});

	},

	check_indash_asks: function() {

		var form_key = XKit.interface.form_key();

		$(document).on("click", ".post-form--asks .ask-button", function() {

			var $form = $(this).closest('.post-form--asks');

			var m_messages = XKit.storage.get("outbox", "messages_" + form_key, "");
			if (XKit.extensions.outbox.preferences.use_shared.value) {
				m_messages = XKit.storage.get("outbox", "messages", "");
			}

			var m_messages_array = "";

			try {
				m_messages_array = JSON.parse(m_messages);
				if (m_messages_array.length >= 50) {
					// remove the last element.
					m_messages_array.pop();
				}
			} catch (e) {
				m_messages_array = [];
			}

			var m_obj = {};
			m_obj.avatar = "ask";
			m_obj.username = $form.find('.ask-from .tumblelog_name').text();
			m_obj.message = $form.find('textarea[name=question]').val();
			m_obj.answer = "";
			m_obj.to = $form.find(".ask-recipient-label").text();
			m_obj.time = new Date().getTime();

			m_messages_array.unshift(m_obj);
			if (XKit.extensions.outbox.preferences.use_shared.value) {
				XKit.storage.set("outbox", "messages", JSON.stringify(m_messages_array));
			} else {
				XKit.storage.set("outbox", "messages_" + form_key, JSON.stringify(m_messages_array));
			}


		});

	},

	run: function() {
		this.running = true;

		XKit.extensions.outbox.check_indash_asks();

		if (XKit.interface.where().inbox !== true) {
			XKit.console.add("Outbox -> Quitting, not in inbox");
			return;
		}

		XKit.tools.init_css("outbox");

		var xf_html = '<ul class="controls_section" id="xkit_outbox_ul"><li class="section_header selected">OUTGOING</li>' +
			'<li class="" style="height: 36px;"><a href="#" id="xkit-outbox-button">' +
				'<div class="hide_overflow" style="color: rgba(255, 255, 255, 0.5) !important; font-weight: bold; padding-left: 10px; padding-top: 8px;">My Outbox</div>' +
			'</a></li></ul>';
		$("ul.controls_section:last").before(xf_html);

		$(".controls_section.inbox").prepend("<li class=\"section_header selected\">INCOMING</li>");

		$("#xkit-outbox-button").click(function() {

			if (!$(this).parent().hasClass("xkit-selected")) {

				$(this).parent().addClass("xkit-selected");
				$(this).parent().addClass("selected");
				XKit.extensions.outbox.start();

			} else {

				$(this).parent().removeClass("xkit-selected");
				$(this).parent().removeClass("selected");
				XKit.extensions.outbox.end();

			}

			return false;
		});

		var form_key = $('meta[name=tumblr-form-key]').attr("content");
		if (form_key === "" || typeof form_key === "undefined") {
			XKit.notifications.add("Can't load Outbox, data-form-key not defined.", "error");
			return;
		}

		XKit.post_listener.add("outbox_init", XKit.extensions.outbox.init_outbox_buttons);
		XKit.extensions.outbox.init_outbox_buttons();

		$(document).on('click', '.xkit-outbox-save-checkbox', function() {
			$(this).toggleClass("selected");
		});

	},

	init_outbox_buttons: function() {

		$("[id^='ask_answer_link_']").unbind("click", XKit.extensions.outbox.save_activate);
		$("[id^='ask_answer_link_']").bind("click", XKit.extensions.outbox.save_activate);

	},

	save_activate: function(e) {

		var obj = e.target || e.srcElement;
		var m_parent = $(obj).parentsUntil(".post").parent();
		var private_button = $(m_parent).find('[id^="private_answer_button_"]');

		if ($(m_parent).hasClass("xkit-outbox-activated") === true) {
			return;
		}

		if (XKit.extensions.outbox.preferences.show_checkbox.value) {
			$(m_parent).find(".chrome.ask_cancel_button").before("<div style=\"padding-top: 5px; margin-bottom: 10px;\"><div class=\"xkit-checkbox xkit-outbox-save-checkbox selected\"><b>&nbsp</b>Save to outbox if answered privately</div></div>");
		}

		$(m_parent).addClass("xkit-outbox-activated");
		$(private_button).bind("click", XKit.extensions.outbox.save);

	},

	save: function(e) {

		var obj = e.target || e.srcElement;

		var m_parent = $(obj).parentsUntil(".post").parent();

		if ($(m_parent).find(".xkit-outbox-save-checkbox").length > 0) {

			if (!$(m_parent).find(".xkit-outbox-save-checkbox").hasClass("selected")) {
				return;
			}

		}

		var m_avatar = $(m_parent).find(".post_avatar_image").attr('src');
		var m_username = $(m_parent).find(".post_info").find("a").html();
		var m_message = $(m_parent).find(".post_body").html();
		var m_to = $(m_parent).attr('data-tumblelog-name');

		var post_id = $(m_parent).attr('data-post-id');
		XKit.extensions.outbox.poke_tinymce(post_id);

		if (m_message.indexOf("<div id=\"ask_answer_") !== -1) {

			m_message = m_message.substring(0, m_message.indexOf("<div"));

		}

		var m_answer = $('#ask_answer_field_' + post_id).val();

		setTimeout(function() {

			m_answer = $('#ask_answer_field_' + post_id).val();

			var form_key = $('meta[name=tumblr-form-key]').attr("content");
			var m_messages = XKit.storage.get("outbox", "messages_" + form_key, "");
			if (XKit.extensions.outbox.preferences.use_shared.value) {
				m_messages = XKit.storage.get("outbox", "messages", "");
			}

			var m_messages_array = "";

			try {
				m_messages_array = JSON.parse(m_messages);
				if (m_messages_array.length >= 50) {
					// remove the last element.
					m_messages_array.pop();
				}
			} catch (err) {
				m_messages_array = [];
			}

			var m_obj = {};
			m_obj.avatar = m_avatar;
			m_obj.username = m_username;
			m_obj.message = m_message;
			m_obj.answer = m_answer;
			m_obj.to = m_to;
			m_obj.time = new Date().getTime();

			m_messages_array.unshift(m_obj);

			if (XKit.extensions.outbox.preferences.use_shared.value) {
				XKit.storage.set("outbox", "messages", JSON.stringify(m_messages_array));
			} else {
				XKit.storage.set("outbox", "messages_" + form_key, JSON.stringify(m_messages_array));
			}
			XKit.notifications.add("Saved to outbox.", "ok");

		}, 1);

	},

	poke_tinymce: function(post_id) {
		var source = " if (tinyMCE && tinyMCE.get('ask_answer_field_" + post_id + "')) {  " +
						" document.getElementById('ask_answer_field_" + post_id + "').value = (tinyMCE.get('ask_answer_field_" + post_id + "').getContent()); " +
				 " } ";

		if ('function' == typeof source) {
			source = '(' + source + ')();';
		}

		var script = document.createElement('script');
		script.setAttribute("type", "application/javascript");
		script.textContent = source;
		document.body.appendChild(script);
	},

	start: function() {

		XKit.tools.add_css(" .post { display: none; } .post.by-xkit-outbox { display: block !important; } #auto_pagination_loader, #next_page_link { display: none !important; } ", "outbox_additional");

		var form_key = $('meta[name=tumblr-form-key]').attr("content");
		if (form_key === "" || typeof form_key === "undefined") {
			XKit.extensions.outbox.show_empty("Can't load messages,<br/>data-form-key not found.");
			return;
		}

		var m_messages = XKit.storage.get("outbox", "messages_" + form_key, "");
		if (XKit.extensions.outbox.preferences.use_shared.value) {
			m_messages = XKit.storage.get("outbox", "messages", "");
		}

		if (m_messages === "") {
			XKit.extensions.outbox.show_empty();
			return;
		}

		var messages_array;
		try {
			messages_array = JSON.parse(m_messages);
			XKit.extensions.outbox.show(messages_array);
			$(document).on('click', '.xkit-outbox-delete', XKit.extensions.outbox.delete);
		} catch (e) {
			XKit.extensions.outbox.show_empty("Can't load messages,<br/>" + e.message);
		}

	},

	delete: function(e) {

		var obj = e.target;

		var form_key = $('meta[name=tumblr-form-key]').attr("content");
		var m_messages = XKit.storage.get("outbox", "messages_" + form_key, "");
		if (XKit.extensions.outbox.preferences.use_shared.value) {
			m_messages = XKit.storage.get("outbox", "messages", "");
		}

		var m_messages_array = [];

		try {
			m_messages_array = JSON.parse(m_messages);
		} catch (err) {
		}

		m_messages_array.splice(parseInt($(obj).attr('data-outbox-id')), 1);

		if (XKit.extensions.outbox.preferences.use_shared.value) {
			XKit.storage.set("outbox", "messages", JSON.stringify(m_messages_array));
		} else {
			XKit.storage.set("outbox", "messages_" + form_key, JSON.stringify(m_messages_array));
		}
		// XKit.storage.set("outbox", "messages_" + form_key, JSON.stringify(m_messages_array));

		var parent = $(obj).parentsUntil('#posts');
		$(parent).fadeOut('slow', function() {
			$(parent).remove();
		});



	},

	show: function(m_array) {

		var m_html = "";
		for (var m_message in m_array) {

			var m_obj = m_array[m_message];

			m_html = m_html + XKit.extensions.outbox.render(m_obj, m_message);

		}
		if ($('.no_posts_found').length > 0) {
			$('.no_posts_found').after("<ol id='posts' class='posts post-avatar--static'></ol>");
			$('.no_posts_found').hide();
		}
		$("#posts").prepend(m_html);

	},

	render_ask: function(obj, m_id) {

		var to_return = "<li class=\"post_container\"><div class=\"post is_note note is_mine post_full by-xkit-outbox is_mine is_original is_private_answer no_source\">";

		var m_link = "<a class=\"xkit-outbox-link\" href=\"http://" + obj.to + ".tumblr.com/\">" + obj.to + "</a>";

		var m_day = "";
		var m_date = "";

		if (obj.time !== "" && typeof obj.time !== "undefined") {
			// defined in moment.js
			/* globals moment */
			var moment_val = moment(obj.time);
			m_day = moment_val.format('ddd');
			m_date = moment_val.format('MM/DD/YY hh:mm a');
		} else {
			m_day = "?";
			m_date = "Unknown";
		}

		obj.message = $("<div>" + obj.message + "</div>").text();

		to_return = to_return + "<div class=\"post_avatar\"><div class=\"queue\">" +
				"<div class=\"publish_info day publish_on_day\">" + m_day + "</div>" +
				"<div class=\"publish_info time publish_on_time\">" + m_date + "</div>" +
			"</div></div>";

		to_return = to_return + "<div class=\"post-wrapper\">" +
				"<span class=\"xkit-outbox-fanmail-indicator\">sent ask</span>" +
				"<div class=\"post_header\"><div class=\"post_info\">You've sent to " + m_link + "</div></div>" +
				"<div class=\"post_content clearfix\"><div class=\"post_content_inner clearfix\">" +
					"<div class=\"post_body\">" +
						"<div class=\"clear\">&nbsp;</div>" +
						"<div class=\"post_question_fan_mail\">" + obj.message + "</div>" +
					"</div>" +
				"</div></div>" +
				"<div class=\"post_footer clearfix\">" +
					"<div class=\"post_notes\"><div class=\"post_notes_inner\"></div></div>" +
					"<div class=\"post_controls\" role=\"toolbar\"><div class=\"post_controls_inner\">" +
						"<div class=\"post_control deny-xoutbox xkit-outbox-delete\" data-outbox-id=\"" + m_id + "\" title=\"Delete\"></div>" +
					"</div></div>" +
				"</div>" +
			"</div>";

		to_return = to_return + "</div></li>";

		return to_return;

	},

	render_fan_mail: function(obj, m_id) {

		var to_return = "<li class=\"post_container\"><div class=\"post is_note note is_mine post_full by-xkit-outbox is_mine is_original is_private_answer no_source\">";

		var m_link = "<a class=\"xkit-outbox-link\" href=\"http://" + obj.to + ".tumblr.com/\">" + obj.to + "</a>";

		var m_day = "";
		var m_date = "";

		if (obj.time !== "" && typeof obj.time !== "undefined") {
			var moment_val = moment(obj.time);
			m_day = moment_val.format('ddd');
			m_date = moment_val.format('MM/DD/YY hh:mm a');
		} else {
			m_day = "?";
			m_date = "Unknown";
		}

		obj.message = $("<div>" + obj.message + "</div>").text();

		to_return = to_return + "<div class=\"post_avatar\"><div class=\"queue\">" +
				"<div class=\"publish_info day publish_on_day\">" + m_day + "</div>" +
				"<div class=\"publish_info time publish_on_time\">" + m_date + "</div>" +
			"</div></div>";

		to_return = to_return + "<div class=\"post-wrapper\">" +
				"<span class=\"xkit-outbox-fanmail-indicator\">fan mail</span>" +
				"<div class=\"post_header\"><div class=\"post_info\">You've sent to " + m_link + "</div></div>" +
				"<div class=\"post_content clearfix\"><div class=\"post_content_inner clearfix\">" +
					"<div class=\"post_body\">" +
						"<div class=\"clear\">&nbsp;</div>" +
						"<div class=\"post_question_fan_mail\">" + obj.message + "</div>" +
					"</div>" +
				"</div></div>" +
				"<div class=\"post_footer clearfix\">" +
					"<div class=\"post_notes\"><div class=\"post_notes_inner\"></div></div>" +
					"<div class=\"post_controls\" role=\"toolbar\"><div class=\"post_controls_inner\">" +
						"<div class=\"post_control deny-xoutbox xkit-outbox-delete\" data-outbox-id=\"" + m_id + "\" title=\"Delete\"></div>" +
					"</div></div>" +
				"</div>" +
			"</div>";

		to_return = to_return + "</div></li>";

		return to_return;

	},

	render: function(obj, m_id) {

		if (obj.avatar === "fan_mail") {
			return XKit.extensions.outbox.render_fan_mail(obj, m_id);
		}

		if (obj.avatar === "ask") {
			return XKit.extensions.outbox.render_ask(obj, m_id);
		}

		var to_return = "<li class=\"post_container\"><div class=\"post is_note note is_mine post_full by-xkit-outbox is_mine is_original is_private_answer no_source\">";

		var m_link = "<a class=\"xkit-outbox-link\" href=\"http://" + obj.username + ".tumblr.com/\">" + obj.username + "</a>";

		var av_link = "<a href=\"http://" + obj.username + ".tumblr.com/\"><img width=\"24\" height=\"24\" src=\"" + obj.avatar + "\"></a>";
		var av_text = "<a href=\"http://" + obj.username + ".tumblr.com/\" class=\"post_question_asker\">" + obj.username + "</a>";

		var m_day = "";
		var m_date = "";

		if (obj.time !== "" && typeof obj.time !== "undefined") {
			var moment_val = moment(obj.time);
			m_day = moment_val.format('ddd');
			m_date = moment_val.format('MM/DD/YY hh:mm a');
		} else {
			m_day = "?";
			m_date = "Unknown";
		}

		to_return = to_return + "<div class=\"post_avatar\"><div class=\"queue\">" +
				"<div class=\"publish_info day publish_on_day\">" + m_day + "</div>" +
				"<div class=\"publish_info time publish_on_time\">" + m_date + "</div>" +
			"</div></div>";

		if (obj.message.indexOf("<div") !== -1) {
			obj.message = obj.message.substring(0, obj.message.indexOf("<div"));
		}

		to_return = to_return + "<div class=\"post-wrapper\">" +
				"<div class=\"post_header\"><div class=\"post_info\">You've sent to " + m_link + "</div></div>" +
				"<div class=\"post_content clearfix\"><div class=\"post_content_inner clearfix\">" +
					"<div class=\"post_body\">" +
						"<div class=\"clear\">&nbsp;</div>" +
						"<div class=\"post_question\">" + obj.message + "</div>" +
						"<div class=\"asking_avatar\">" +
							av_link +
							av_text +
						"</div>" +
						"<div class=\"post_answer_bar\" style=\"margin-top: 15px; padding-top: 15px; border-top: 1px solid #e7eaec\">" + obj.answer + "</div>" +
					"</div>" +
				"</div></div>" +
				"<div class=\"post_footer clearfix\">" +
					"<div class=\"post_notes\"><div class=\"post_notes_inner\"></div></div>" +
					"<div class=\"post_controls\" role=\"toolbar\"><div class=\"post_controls_inner\">" +
						"<div class=\"post_control deny-xoutbox xkit-outbox-delete\" data-outbox-id=\"" + m_id + "\" title=\"Delete\"></div>" +
					"</div></div>" +
				"</div>" +
			"</div>";

		to_return = to_return + "</div></li>";

		return to_return;

	},

	show_empty: function(m_message) {

		var m_error = "No messages on outbox yet.";
		if (typeof m_message !== "undefined" && m_message !== "") {
			m_error = m_message;
		}

		$(".no_posts_found").remove();
		$("#posts").before(
			"<div id=\"xkit-outbox-no-posts\" class=\"no_posts_found\" style=\"padding-top: 234px; padding-bottom: 234px;\">" +
				"<i class=\"icon_mail\"></i>" +
				m_error  +
			"</div>"
		);

	},

	end: function() {

		$(".by-xkit-outbox").parent().remove();
		$("#xkit-outbox-no-posts").remove();
		if ($('.no_posts_found').length > 0) {
			$('.no_posts_found').show();
			$('#posts').remove();
		}
		XKit.tools.remove_css("outbox_additional");
		$(document).off('click', '.xkit-outbox-delete', XKit.extensions.outbox.delete);

	},

	destroy: function() {
		this.running = false;
		XKit.extensions.outbox.end();
		$("[id^='ask_answer_link_']").off("click", XKit.extensions.outbox.save_activate);
		XKit.post_listener.remove("outbox_init");
	}

});
