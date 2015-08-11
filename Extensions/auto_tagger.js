//* TITLE Auto Tagger **//
//* VERSION 0.6.7 **//
//* DESCRIPTION Tags posts automatically. **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS This extension allows you to automatically add tags to posts based on state (reblogged, original, queued) or post type (audio, video, etc) and keeping original tags while reblogging a post. **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.auto_tagger = new Object({

	running: false,

	preferences: {

		"sep0": {
			text: "Keeping Tags",
			type: "separator",
		},

		"keep_tags": {
			text: "Keep original tags when I'm reblogging a post",
			default: false,
			value: false
		},

		"sep1": {
			text: "Tags by Type",
			type: "separator",
		},

		"tag_for_text": {
			text: "Tags for Text Posts",
			type: "text",
			default: "",
			value: ""
		},

		"tag_for_ask": {
			text: "Tags for reblogged Ask Posts",
			type: "text",
			default: "",
			value: ""
		},

		"tag_for_photo": {
			text: "Tags for Photo/Photoset Posts",
			type: "text",
			default: "",
			value: ""
		},

		"tag_for_quote": {
			text: "Tags for Quote Posts",
			type: "text",
			default: "",
			value: ""
		},

		"tag_for_link": {
			text: "Tags for Link Posts",
			type: "text",
			default: "",
			value: ""
		},

		"tag_for_chat": {
			text: "Tags for Chat Posts",
			type: "text",
			default: "",
			value: ""
		},

		"tag_for_audio": {
			text: "Tags for Audio Posts",
			type: "text",
			default: "",
			value: ""
		},

		"tag_for_video": {
			text: "Tags for Video Posts",
			type: "text",
			default: "",
			value: ""
		},

		"sep2": {
			text: "Tags by State",
			type: "separator",
		},

		"tag_for_original": {
			text: "Tags for posts I create",
			type: "text",
			default: "",
			value: ""
		},

		"tag_for_reblogged": {
			text: "Tags for posts I reblog",
			type: "text",
			default: "",
			value: ""
		},

		"tag_for_queued": {
			text: "Tags for Queued Posts",
			type: "text",
			default: "",
			value: ""
		},

		"sep3": {
			text: "Miscellaneous",
			type: "separator",
		},

		"tag_person": {
			text: "When reblogging, tag with the URL of the person I'm reblogging from",
			default: false,
			value: false
		},

		"tag_person_replace_hyphens": {
			text: "Replace hyphens in usernames with spaces",
			default: false,
			value: false
		},

		"tag_date": {
			text: "Tag with date (ie: <i>#August 21th 2013, #August, #21th, #2013</i>)",
			default: false,
			value: false
		}

	},

	new_post_check_interval: 0,
	run: function() {
		this.running = true;
		new_post_check_interval = setInterval(function() { XKit.extensions.auto_tagger.new_post_check(); }, 1000);
	},

	frame_run: function() {
		if (typeof XKit.page.peepr != "undefined" && XKit.page.peepr) {
			XKit.extensions.auto_tagger.run();
		}
	},

	reblog_do: function() {

		if ($(".post-header").length <= 0) { setTimeout(function() { XKit.extensions.auto_tagger.reblog_do(); }, 100); return; }

		if ($("#post_state").val() === "2") {
			if (XKit.extensions.auto_tagger.preferences.tag_for_queued.value !== "") {
				if (XKit.extensions.auto_tagger.check_if_tag_exists(XKit.extensions.auto_tagger.preferences.tag_for_queued.value) === false) {
					XKit.extensions.auto_tagger.inject_to_window(XKit.extensions.auto_tagger.preferences.tag_for_queued.value);
				}
			}
		} else {
			if (XKit.extensions.auto_tagger.preferences.tag_for_queued.value !== "") {
				if (XKit.extensions.auto_tagger.check_if_tag_exists(XKit.extensions.auto_tagger.preferences.tag_for_queued.value) === true) {
					// Remove tag.
					XKit.extensions.auto_tagger.remove_tag(XKit.extensions.auto_tagger.preferences.tag_for_queued.value);
				}
			}
		}

	},

	check_if_tag_exists: function(tag) {
		return XKit.interface.tag_exists(tag);
	},

	new_post_check: function() {

		var original = true;
		if (document.location.href.indexOf("://www.tumblr.com/reblog/") !== -1) {
			original = false;
		} else if (document.location.href.indexOf("://www.tumblr.com/new/") === -1) {
			// Url is wrong for a new post, neither new nor reblog
			return;
		}

		var post_forms = $(".post-form");

		XKit.console.add("Auto Tagger -> new_post_check -> user in new post page!");

		if(post_forms.length <= 0) {
			XKit.console.add("Auto Tagger -> new_post_check -> delaying, not on page...");
			return;
		}

		var post_form = $(post_forms[0]);

		if (post_form.hasClass("xkit-auto-tagger-done") === true) {
			XKit.console.add("Auto Tagger -> new_post_check -> quitting, already done.");
			return;
		}

		XKit.console.add("Auto Tagger -> new_post_check -> page is shown.");

		post_form.addClass("xkit-auto-tagger-done");

		var post_object = null;
		if (original) {
			// Create fake post object:
			var type = XKit.interface.post_window.type();
			post_object = {type: type, tags: '', owner: ''};
		} else {
			var post_id = document.location.href.match(/tumblr.com\/reblog\/(\d+)\//)[1];
			post_object = XKit.interface.find_post(post_id);
		}

		var m_tags = this.return_tags(post_object, original);

		if (m_tags !== "") {
			this.inject_to_window(m_tags);
		}
	},

	return_date_tag: function() {

		var nowdate = new Date();
		var nowdatem = moment(nowdate);
		var m_date = nowdatem.format("Do[,]MMMM[,]YYYY[,]MMMM Do YYYY");
		return m_date;

	},

	/**
	 * Return tags for the post object returned by XKit.interface.post or
	 * XKit.interface.find_post.
	 * Uses tag_for_reblogged, tag_for_original, tag_based_on_type, keep_tags,
	 * some weird bullshit, tag_person, and tag_date
	 */
	return_tags: function(obj, original) {

		var to_return = "";

		if (typeof XKit.interface === "undefined") { return ""; }

		if (!original) {
			to_return = this.mreturn_add(to_return, XKit.extensions.auto_tagger.preferences.tag_for_reblogged.value);
		}

		if (original) {
			to_return = this.mreturn_add(to_return, XKit.extensions.auto_tagger.preferences.tag_for_original.value);
		}

		to_return = this.mreturn_add(to_return, XKit.extensions.auto_tagger.return_tag_based_on_type(obj));

		if (XKit.extensions.auto_tagger.preferences.keep_tags.value) {
			to_return = this.mreturn_add(to_return, obj.tags);
		}

		if (XKit.extensions.auto_tagger.preferences.keep_tags.value) {

			if ($("body").attr('data-page-root').indexOf('/tagged/') !== -1) {
				var m_search_tag = $("body").attr('data-page-root').substring(8);
				m_search_tag = decodeURIComponent(m_search_tag);
				m_search_tag = XKit.tools.replace_all(m_search_tag, "\\+", " ");
				m_search_tag = XKit.tools.replace_all(m_search_tag, "\\-", " ");
				if (m_search_tag.indexOf("?before=") !== -1) {
					m_search_tag = m_search_tag.substring(0, m_search_tag.indexOf('?before='));
				}

				if (m_search_tag.indexOf('/everything') !== -1) {
					m_search_tag = m_search_tag.substring(0, m_search_tag.indexOf('/everything'));
				}
				to_return = this.mreturn_add(to_return, m_search_tag);
			}

		}

		if (XKit.extensions.auto_tagger.preferences.tag_person.value && obj.owner !== "") {
			if (XKit.extensions.auto_tagger.preferences.tag_person_replace_hyphens.value) {
				if (obj.owner !== undefined) {
					to_return = this.mreturn_add(to_return, obj.owner.replace(/-/g, ' '));
				}
				if (obj.reblog_name !== undefined) {
					to_return = this.mreturn_add(to_return, obj.reblog_name.replace(/-/g, ' '));
				}
			} else {
				to_return = this.mreturn_add(to_return, obj.owner);
			}

		}

		if (XKit.extensions.auto_tagger.preferences.tag_date.value) {
			var m_date = XKit.extensions.auto_tagger.return_date_tag();
			to_return = this.mreturn_add(to_return, m_date);
		}

		if ($.trim(to_return) !== "") {
			return to_return;
		} else {
			return "";
		}

	},

	return_tag_based_on_type: function(obj) {

		if ((obj.type === "regular" || obj.type === "text") && XKit.extensions.auto_tagger.preferences.tag_for_text.value !== "") {
			return XKit.extensions.auto_tagger.preferences.tag_for_text.value;
		}

		if (obj.type === "note" && XKit.extensions.auto_tagger.preferences.tag_for_text.value !== "") {
			return XKit.extensions.auto_tagger.preferences.tag_for_ask.value;
		}

		if (obj.type === "photo" && XKit.extensions.auto_tagger.preferences.tag_for_photo.value !== "") {
			return XKit.extensions.auto_tagger.preferences.tag_for_photo.value;
		}

		if (obj.type === "photoset" && XKit.extensions.auto_tagger.preferences.tag_for_photo.value !== "") {
			return XKit.extensions.auto_tagger.preferences.tag_for_photo.value;
		}

		if (obj.type === "quote" && XKit.extensions.auto_tagger.preferences.tag_for_quote.value !== "") {
			return XKit.extensions.auto_tagger.preferences.tag_for_quote.value;
		}

		if (obj.type === "link" && XKit.extensions.auto_tagger.preferences.tag_for_link.value !== "") {
			return XKit.extensions.auto_tagger.preferences.tag_for_link.value;
		}

		if (obj.type === "conversation" && XKit.extensions.auto_tagger.preferences.tag_for_chat.value !== "") {
			return XKit.extensions.auto_tagger.preferences.tag_for_chat.value;
		}

		if (obj.type === "audio" && XKit.extensions.auto_tagger.preferences.tag_for_audio.value !== "") {
			return XKit.extensions.auto_tagger.preferences.tag_for_audio.value;
		}

		if (obj.type === "video" && XKit.extensions.auto_tagger.preferences.tag_for_video.value !== "") {
			return XKit.extensions.auto_tagger.preferences.tag_for_video.value;
		}

		return "";

	},

	return_tags_for_queue: function() {
		return this.preferences.tag_for_queued.value;
	},

	mreturn_add: function(m_return, tag) {
		if (m_return === "") {
			return tag;
		} else if (tag !== "" && typeof(tag) === 'string') {
			return m_return + "," + tag;
		} else {
			return m_return;
		}
	},

	remove_tag: function(tag) {
		XKit.interface.post_window.remove_tag(tag);
	},

	inject_to_window: function(raw_string) {

		if($(".post-form").length <= 0) {
			setTimeout(function() {
				XKit.extensions.auto_tagger.inject_to_window(raw_string);
			}, 200);
			return;
		}

		var tags = raw_string.split(",");
		XKit.interface.post_window.add_tag(tags);
	},

	destroy: function() {
		this.running = false;
	}

});
