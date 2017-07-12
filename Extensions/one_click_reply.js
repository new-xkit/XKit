//* TITLE One-Click Reply **//
//* VERSION 2.1.1 **//
//* DESCRIPTION Lets you reply to notifications **//
//* DEVELOPER new-xkit **//
//* DETAILS To use this extension, hover over a notification and click on the Reply button. If Multi-Reply is on, hold down the ALT key while clicking on the Reply button to select/deselect posts and reply to all of them at once. **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.one_click_reply = new Object({
	running: false,
	preferences: {
		"sep-1": {
			text: "Features",
			type: "separator"
		},
		"enable_quick_reply": {
			text: "Enable In-Dashboard Reply",
			default: false,
			value: false,
			experimental: true
		},
		"sep0": {
			text: "Reply Options",
			type: "separator"
		},
		"show_avatars": {
			text: "Show avatars on reply posts",
			default: false,
			value: false
		},
		"open_in_new_tab": {
			text: "Open reply windows in a new tab",
			default: false,
			value: false
		},
		"multi_reply": {
			text: "Enable replying to multiple notifications at once (alt+click to select notifications)",
			default: true,
			value: true
		},
		"sep1a": {
			text: "Mentioning Options",
			type: "separator"
		},
		"mention_people": {
			text: "Use the 'mentioning' feature of Tumblr on replies (extremely experimental)",
			default: false,
			value: false,
			experimental: true,
		},
		"sep1": {
			text: "Tagging Options",
			type: "separator"
		},
		"tag_people": {
			text: "Tag people by their usernames on my replies",
			default: true,
			value: true
		},
		"tag_person_replace_hyphens": {
			text: "Replace hyphens in usernames with spaces on tags",
			default: false,
			value: false
		},
		"auto_tag": {
			text: "Auto-tag the post with a custom one",
			default: false,
			value: true
		},
		"auto_tag_text": {
			text:  "Custom tag for reply posts",
			type: "text",
			default: "",
			value: ""
		}
	},

	sentences: {

		"reblog": "<p><a href=\"%l\">%u</a> reblogged your post: <a href=\"%p\">%t</a></p>",
		"reblog_with_comments": "<p><a href=\"%l\">%u</a> reblogged your post <a href=\"%p\">%t</a> and added:</p><blockquote><p>%r</p></blockquote>",
		"like": "<p><a href=\"%l\">%u</a> liked your post: <a href=\"%p\">%t</a></p>",
		"follow": "<p><a href=\"%l\">%u</a> started following %b</p>",
		"reply": "<p><a href=\"%l\">%u</a> replied to your post: <a href=\"%p\">%t</a></p><blockquote><p>%r</p></blockquote>",
		"reply_photo": "<p><a href=\"%l\">%u</a> replied to your post with a photo: <a href=\"%p\">%t</a></p><blockquote><p>%r</p></blockquote>",
		"answer": "<p><a href=\"%l\">%u</a> answered your post: <a href=\"%p\">%t</a></p><blockquote><p>%r</p></blockquote>",

		"nt_reblog": "<p><a href=\"%l\">%u</a> reblogged your <a href=\"%p\">post</a></p>",
		"nt_reblog_with_comments": "<p><a href=\"%l\">%u</a> reblogged your <a href=\"%p\">post</a> and added:</p><blockquote><p>%r</p></blockquote>",
		"nt_like": "<p><a href=\"%l\">%u</a> liked your <a href=\"%p\">post</a></p>",
		"nt_reply": "<p><a href=\"%l\">%u</a> replied to your <a href=\"%p\">post:</a></p><blockquote><p>%r</p></blockquote>",
		"nt_reply_photo": "<p><a href=\"%l\">%u</a> replied to your <a href=\"%p\">post</a> with a photo:</p><blockquote><p>%r</p></blockquote>",
		"nt_answer": "<p><a href=\"%l\">%u</a> answered your <a href=\"%p\">post:</a></p><blockquote><p>%r</p></blockquote>",

	},

	added_css: false,
	added_css_pn: false,
	added_css_pn_new: false,

	run: function() {
		try {
			XKit.tools.init_css("one_click_reply");
			XKit.extensions.one_click_reply.init_mentions();
			XKit.extensions.one_click_reply.init_post_page();
			XKit.extensions.one_click_reply.init_quick_reply();
			$(document).on("mouseleave", ".activity-notification", XKit.extensions.one_click_reply.exit_pn);
			$(document).on("mouseenter", ".activity-notification", XKit.extensions.one_click_reply.enter_pn);
			$(document).on("mouseenter", ".notification", XKit.extensions.one_click_reply.enter);
		} catch (e) {
			alert("Error:\n" + e.message);
		}
	},
	quick_reply_error: function(error_code) {
		XKit.window.show("Unable to create post", "<b>I'm sorry, but I could not create the post.</b><br/>Please try again later.<br/><br/>If the problem continues, check that you are not at your post limit, and send the XKit Blog an ask with the error code \"<b>OCRQR-" + error_code + "</b>\".", "error", "<div class=\"xkit-button default\" id=\"xkit-one-click-reply-error-close\">OK</div>");
		$("#xkit-one-click-reply-error-close").click(function() {
			XKit.window.close();
			XKit.extensions.one_click_reply.quick_reply_close();
		});
	},
	init_post_page: function() {
		if (document.location.href.indexOf("/new/text") !== -1) {
			XKit.interface.post_window_listener.add("one_click_reply_fill_post", XKit.extensions.one_click_reply.fill_post);
		}
	},
	init_mentions: function() {
		if (this.preferences.mention_people.value === true) {
			// This is a terrible way of doing this isn't it?
			for (var obj in this.sentences) {
				this.sentences[obj] = this.sentences[obj].replace("<p><a href=\"%l\">%u</a>", "<p><a class=\"tumblelog\">%u</a>");
			}
		}
	},
	init_quick_reply: function() {
		if (XKit.extensions.one_click_reply.preferences.enable_quick_reply.value === true) {
			var m_html = "<div id=\"xkit-one-click-reply-quick-reply-window-shadow\"></div>" +
					"<div id=\"xkit-one-click-reply-quick-reply-window\">" +
						"<div id=\"xkit-one-click-reply-quick-reply-close\">&nbsp;</div>" +
						"<div id=\"xkit-one-click-reply-quick-reply-title\">" +
							"<img src=\"https://31.media.tumblr.com/avatar_b5acef4abf8c_64.png\" class=\"xkit-qr-avatar\">" +
							"Replying to <span id=\"xkit-one-click-reply-quick-reply-username\">xenix</span>" +
						"</div>" +
						"<textarea id=\"xkit-one-click-reply-quick-reply-text\"></textarea>" +
						"<input type=\"text\" id=\"xkit-one-click-reply-quick-reply-tags\" placeholder=\"additional tags, comma separated\">" +
						"<div id=\"xkit-one-click-reply-quick-reply-ok\" class=\"xkit-button\">Reply</div>" +
						"<div id=\"xkit-one-click-reply-quick-reply-new-tab\" class=\"xkit-button\">Open in New Tab</div>" +
					"</div>";
			$("body").append(m_html);
			$("#xkit-one-click-reply-quick-reply-close, #xkit-one-click-reply-quick-reply-window-shadow").click(function() { if ($(this).hasClass("disabled")) { return; } XKit.extensions.one_click_reply.quick_reply_close(); });

			$("#xkit-one-click-reply-quick-reply-text").bind('keydown', function(event) {
				event.stopPropagation();
				event.stopImmediatePropagation();
			});

			$("#xkit-one-click-reply-quick-reply-text").bind('input propertychange', function(event) {
				if (!this.value.length) {
					$("#xkit-one-click-reply-quick-reply-ok").addClass("disabled");
				} else {
					$("#xkit-one-click-reply-quick-reply-ok").removeClass("disabled");
				}
			});
		}
	},
	/**
	 * Creates blog post
	 * @param {String} sentence - html content
	 * @param {String} tags - comma-separated tags
	 * @param {Object} reply - A "reply" to append to the sentence
	 * @param {String} blog - the id of the blog to post as
	 * @param {Boolean?} retry_mode - If false, allows one retry
	 */
	quick_reply_post: function(sentence, tags, reply, blog, retry_mode) {
		var m_object = {};
		reply = reply.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
		// This is a terrible hack.
		if (XKit.extensions.one_click_reply.preferences.mention_people.value === true) {
			var sentence_obj = $("<div>" + sentence + "</div>");
			$(sentence_obj).find("a").each(function() {
				if (typeof $(this).attr('href') !== "undefined") {
					if ($(this).attr('href').indexOf('/post/') === -1) {
						$(this).removeAttr('href').removeAttr('class').addClass("tumblelog");
					}
				}
			});
			sentence = sentence_obj.html();
		}

		m_object.form_key = XKit.interface.form_key();
		m_object.context_page = "dashboard";
		m_object.editor_type = "rich";

		m_object.channel_id = blog;
		m_object.context_id = blog;

		m_object["is_rich_text[one]"] = "0";
		m_object["is_rich_text[two]"] = "1";
		m_object["is_rich_text[three]"] = "0";

		m_object["post[slug]"] = "";
		m_object["post[draft_status]"] = "";
		m_object["post[source_url]"] = "https://";
		m_object["post[date]"] = "";

		m_object["post[type]"] = "regular";
		m_object["post[state]"] = "0";

		m_object["post[tags]"] = tags;

		reply = XKit.extensions.one_click_reply.JsAutoP(reply);

		m_object["post[one]"] = "";
		m_object["post[two]"] = sentence + "<p>" + reply + "</p>";
		m_object["post[three]"] = "";

		try {

			if (XKit.extensions.tweaks.running === true) {
				if (XKit.extensions.tweaks.preferences.photo_replies.value === true) {
					m_object.allow_photo_replies = "on";
				}
			}

		} catch (e) {

			console.log("OCR = Could not read Tweaks properties");

		}

		XKit.interface.kitty.get(function(kitty_data) {

			if (kitty_data.errors === true) {

				// We fucked up for some reason.
				if (retry_mode !== true) {
					XKit.extensions.one_click_reply.quick_reply_post(sentence, tags, reply, blog, true);
				} else {
					XKit.extensions.one_click_reply.quick_reply_error("101");
				}

				return;

			}

			GM_xmlhttpRequest({
				method: "POST",
				url: "https://www.tumblr.com/svc/post/update",
				data: JSON.stringify(m_object),
				json: true,
				headers: {
					"X-tumblr-puppies": kitty_data.kitten,
					"X-tumblr-form-key": XKit.interface.form_key(),
				},
				onerror: function(response) {
					XKit.interface.kitty.set("");
					if (retry_mode !== true) {
						XKit.extensions.one_click_reply.quick_reply_post(sentence, tags, reply, blog, true);
					} else {
						XKit.extensions.one_click_reply.quick_reply_error("101");
					}
				},
				onload: function(response) {
					// We are done!
					XKit.interface.kitty.set(response.getResponseHeader("X-Tumblr-Kittens"));
					var mdata = null;
					try {
						mdata = jQuery.parseJSON(response.responseText);
					} catch (e) {
						XKit.extensions.one_click_reply.quick_reply_error("106");
					}
					if (mdata.errors === false) {
						XKit.extensions.one_click_reply.quick_reply_close();
					} else {
						XKit.extensions.one_click_reply.quick_reply_error("103");
					}
				}
			});

		});

	},

	/* eslint-disable id-length */
	JsAutoP: function(s) {

		// From: http://ufku.com/personal/autop

		if (!s || s.search(/\n|\r/) == -1) {
			return s;
		}
		var X = function(x, a, b) {return x.replace(new RegExp(a, 'g'), b);};
		var R = function(a, b) {
			s = X(s, a, b);
			return s;
		};
		var blocks = '(table|thead|tfoot|caption|colgroup|tbody|tr|td|th|div|dl|dd|dt|ul|ol|li|pre|select';
		blocks += '|form|blockquote|address|math|style|script|object|input|param|p|h[1-6])';
		s += '\n';
		R('<br />\\s*<br />', '\n\n');
		R('(<' + blocks + '[^>]*>)', '\n$1');
		R('(</' + blocks + '>)', '$1\n\n');
		R('\r\n|\r', '\n'); // cross-platform newlines
		R('\n\n+', '\n\n');// take care of duplicates
		R('\n?((.|\n)+?)\n\\s*\n', '<p>$1</p>\n');// make paragraphs
		R('\n?((.|\n)+?)$', '<p>$1</p>\n');//including one at the end
		R('<p>\\s*?</p>', '');// under certain strange conditions it could create a P of entirely whitespace
		R('<p>(<div[^>]*>\\s*)', '$1<p>');
		R('<p>([^<]+)\\s*?(</(div|address|form)[^>]*>)', '<p>$1</p>$2');
		R('<p>\\s*(</?' + blocks + '[^>]*>)\\s*</p>', '$1');
		R('<p>(<li.+?)</p>', '$1');// problem with nested lists
		R('<p><blockquote([^>]*)>', '<blockquote$1><p>');
		R('</blockquote></p>', '</p></blockquote>');
		R('<p>\\s*(</?' + blocks + '[^>]*>)', '$1');
		R('(</?' + blocks + '[^>]*>)\\s*</p>', '$1');
		R('<(script|style)(.|\n)*?</\\1>', function(m0) {return X(m0, '\n', '<PNL>');});
		R('(<br />)?\\s*\n', '<br />\n');
		R('<PNL>', '\n');
		R('(</?' + blocks + '[^>]*>)\\s*<br />', '$1');
		R('<br />(\\s*</?(p|li|div|dl|dd|dt|th|pre|td|ul|ol)[^>]*>)', '$1');
		if (s.indexOf('<pre') != -1) {
			R('(<pre(.|\n)*?>)((.|\n)*?)</pre>', function(m0, m1, m2, m3) {
				return X(m1, '\\\\([\'\"\\\\])', '$1') + X(X(X(m3, '<p>', '\n'), '</p>|<br />', ''), '\\\\([\'\"\\\\])', '$1') + '</pre>';
			});
		}
		return R('\n</p>$', '</p>');
		/* eslint-disable id-length */
	},

	quick_reply_open: function(sentence, default_tags, avatar, username) {

		$("#xkit-one-click-reply-quick-reply-username").html(username);
		$("#xkit-one-click-reply-quick-reply-title").find(".xkit-qr-avatar").attr('src', avatar);

		$("#xkit-one-click-reply-quick-reply-window-shadow").css("display", "block");
		$("#xkit-one-click-reply-quick-reply-window").fadeIn('fast');

		$("#xkit-one-click-reply-quick-reply-text, #xkit-one-click-reply-quick-reply-tags").val("");
		$("#xkit-one-click-reply-quick-reply-text, #xkit-one-click-reply-quick-reply-tags").prop('disabled', false);
		$("#xkit-one-click-reply-quick-reply-new-tab, #xkit-one-click-reply-quick-reply-close, #xkit-one-click-reply-quick-reply-window-shadow").removeClass("disabled");
		$("#xkit-one-click-reply-quick-reply-ok").addClass("disabled");

		XKit.tools.set_setting("xkit_one_click_reply_data", "{}");

		var m_blog = XKit.tools.get_current_blog();

		var initial_tags = "";
		if (XKit.extensions.one_click_reply.preferences.tag_people.value === true) {
			initial_tags = default_tags;
			if (XKit.extensions.one_click_reply.preferences.auto_tag.value === true && XKit.extensions.one_click_reply.preferences.auto_tag_text.value !== "") {
				initial_tags += "," + XKit.extensions.one_click_reply.preferences.auto_tag_text.value;
			}
		} else {
			if (XKit.extensions.one_click_reply.preferences.auto_tag.value === true && XKit.extensions.one_click_reply.preferences.auto_tag_text.value !== "") {
				initial_tags += "," + XKit.extensions.one_click_reply.preferences.auto_tag_text.value;
			}
		}
		$("#xkit-one-click-reply-quick-reply-tags").val(initial_tags);

		$("#xkit-one-click-reply-quick-reply-ok").unbind("click");
		$("#xkit-one-click-reply-quick-reply-ok").click(function() {

			if ($(this).hasClass("disabled")) { return; }

			$("#xkit-one-click-reply-quick-reply-text, #xkit-one-click-reply-quick-reply-tags").prop('disabled', true);

			$("#xkit-one-click-reply-quick-reply-ok, #xkit-one-click-reply-quick-reply-new-tab, #xkit-one-click-reply-quick-reply-close, #xkit-one-click-reply-quick-reply-window-shadow").addClass("disabled");

			var tags = $("#xkit-one-click-reply-quick-reply-tags").val();
			XKit.extensions.one_click_reply.quick_reply_post(sentence, tags, $("#xkit-one-click-reply-quick-reply-text").val(), m_blog);

		});

		$("#xkit-one-click-reply-quick-reply-new-tab").unbind("click");
		$("#xkit-one-click-reply-quick-reply-new-tab").click(function() {

			if ($(this).hasClass("disabled")) { return; }

			var tags = $("#xkit-one-click-reply-quick-reply-tags").val();

			var data = {
				tags: tags,
				sentence: sentence + "<p></p>"
			};
			XKit.tools.set_setting("xkit_one_click_reply_data", JSON.stringify(data));

			var m_url = "https://www.tumblr.com/new/text";

			if (document.location.href.indexOf("/blog/") !== -1) {
				// Maybe we can make this better?
				if ($("#new_post_label_text").length > 0) {
					m_url = $("#new_post_label_text").attr('href');
				} else {
					m_url = $("body").attr('data-new-root') + "/new/text";
				}
			}

			if (m_url.indexOf('?') !== -1) {
				m_url = m_url.substring(0, m_url.indexOf('?'));
			}


			if (XKit.extensions.one_click_reply.preferences.tag_people.value === true) {
				m_url = m_url + "?tags=" + tags;
				if (XKit.extensions.one_click_reply.preferences.auto_tag.value === true && XKit.extensions.one_click_reply.preferences.auto_tag_text.value !== "") {
					m_url = m_url + "," + XKit.extensions.one_click_reply.preferences.auto_tag_text.value;
				}
			} else {
				if (XKit.extensions.one_click_reply.preferences.auto_tag.value === true && XKit.extensions.one_click_reply.preferences.auto_tag_text.value !== "") {
					m_url = m_url + "?tags=" + XKit.extensions.one_click_reply.preferences.auto_tag_text.value;
				}
			}

			XKit.extensions.one_click_reply.quick_reply_close();
			window.open(m_url);

		});


	},

	quick_reply_close: function() {
		$("#xkit-one-click-reply-quick-reply-window-shadow, #xkit-one-click-reply-quick-reply-window").fadeOut('fast');
	},

	exit_pn: function(event) {
		var target = event.target;
		if (!$(target).hasClass('activity-notification')) {
			target = $(target).closest('.activity-notification');
		}
		$(target).find(".xkit-reply-button-pn").css("display", "none");
	},

	enter_pn: function(event) {
		var target = event.target;
		if (!$(target).hasClass('activity-notification')) {
			target = $(target).closest('.activity-notification');
		}
		if (!$(target).find('.xkit-reply-button-pn').length) {
			var html = '<a class="xkit-reply-button-pn xkit-notes-activity">reply</a>';
			$(target).append(html);
			$(target).find(".xkit-reply-button-pn").click(function(e) {
				e.preventDefault();
				XKit.extensions.one_click_reply.make_post(this, true, e);
			});
		}
		$(target).find(".xkit-reply-button-pn").css("display", "block");
	},

	enter: function(event) {
		var target = event.target;
		if (!$(target).hasClass('notification')) {
			target = $(target).closest('.notification');
		}
		if ($(target).find(".xkit-reply-button").length < 1) {
			var m_html = '<a class="xkit-reply-button">reply</a>';
			if ($(target).find(".block").length > 0) {
				$(target).find(".block").after(m_html);
			} else {
				$(target).find(".notification_sentence").append(m_html);
				$(target).find(".xkit-reply-button").css("top", "16px");
				$(target).find(".xkit-reply-button").css("right", "38px");
			}

			$(target).find(".xkit-reply-button").click(function(e) {
				e.preventDefault();
				XKit.extensions.one_click_reply.make_post(target, false, e);
			});

			var m_right = 45 + $(target).find(".xkit-reply-button").width();
			if (XKit.extensions.one_click_reply.added_css !== true) {
				XKit.tools.add_css(".notification .block, .notification .ignore { right: " + m_right + "px !important; }", "one_click_reply");
				XKit.extensions.one_click_reply.added_css = true;
			}
		}
	},

	fill_post: function() {
		var raw_data = XKit.tools.get_setting("xkit_one_click_reply_data", "{}");

		try {
			var data = JSON.parse(raw_data);

			if (!data || !data.sentence) {
				// Terribly enough, we can't alert an error here because
				// post_window_listener might just not be referring to us
				return;
			}

			var m_sentence = $.trim(data.sentence);
			var tags = data.tags;

			if (XKit.extensions.one_click_reply.preferences.mention_people.value) {
				var sentence_obj = $("<div>" + m_sentence + "</div>");

				$(sentence_obj).find("a").each(function() {
					if (typeof $(this).attr('href') !== "undefined") {
						if ($(this).attr('href').indexOf('/post/') === -1) {
							$(this).removeAttr('href').removeAttr('class').addClass("tumblelog");
						}
					}
				});

				m_sentence = sentence_obj.html();
			}

			if (tags) {
				XKit.interface.post_window.add_tag(tags.split(","));
			}
			XKit.interface.post_window.set_content_html(m_sentence + "<p><br/></p>");
			XKit.interface.post_window_listener.remove("one_click_reply_fill_post");
			XKit.tools.set_setting("xkit_one_click_reply_data", "{}");
		} catch (e) {
			alert("OCR: Error \"" + e.message + "\", data = " + raw_data);
		}
	},

	make_post: function(obj, pn_mode, event, silent_mode) {
		if (!$(obj).hasClass('xkit-reply-button-pn') && pn_mode) {
			return;
		}
		if (XKit.extensions.one_click_reply.preferences.enable_quick_reply.value === true && silent_mode !== true) {
			if (!event.altKey && !pn_mode) {
				// Do not open window if pressing alt key to select items.
				if ($(".xkit-reply-selected").length <= 0 && $(".xkit-reply-selected-pn").length <= 0) {
					// Do not open window if there are selected items.
					var m_return = XKit.extensions.one_click_reply.make_post(obj, false, "", true);
					XKit.extensions.one_click_reply.quick_reply_open(m_return.sentence, m_return.tags, m_return.avatar, m_return.username);
					return;
				}
			}
		}

		if (XKit.extensions.one_click_reply.preferences.multi_reply.value === true && silent_mode !== true) {
			if (event.altKey) {
				var alt_obj = $(obj);
				if (pn_mode === true) {
					alt_obj.toggleClass("xkit-reply-selected-pn");
				} else {
					alt_obj.toggleClass("xkit-reply-selected");
				}
				return;
			} else {
				if ($(".xkit-reply-selected").length > 0 || $(".xkit-reply-selected-pn").length > 0) {
					// There are selected posts!
					if ($(obj).hasClass("xkit-reply-selected") === false && $(obj).hasClass("xkit-reply-selected-pn") === false) {
						// Add this too.
						var m_obj = $(obj);
						if (pn_mode === true) {
							m_obj = $(obj).parent();
							$(m_obj).addClass("xkit-reply-selected-pn");
						} else {
							$(m_obj).addClass("xkit-reply-selected");
						}
					}

					var m_text = "";
					var m_tags = "";

					$(".notification.xkit-reply-selected, .xkit-reply-selected-pn").each(function() {

						// Cycle thru all the posts and gather information.

						if ($(this).hasClass("xkit-reply-selected-pn") === true) {
							var pn_post = XKit.extensions.one_click_reply.make_post_activity(this, true);
							m_tags = m_tags + "," + pn_post.tags;
							m_text = m_text + pn_post.sentence + "<p></p>";
							// m_text = m_text + XKit.extensions.one_click_reply.make_post_activity(this, true);
						} else {
							var standard_post = XKit.extensions.one_click_reply.make_post(this, pn_mode, "", true);
							m_tags = m_tags + "," + standard_post.tags;
							m_text = m_text + standard_post.sentence + "<p></p>";
						}

					});

					var data = {
						sentence: m_text,
						tags: m_tags
					};
					XKit.tools.set_setting("xkit_one_click_reply_data", JSON.stringify(data));

					var m_url = "https://www.tumblr.com/new/text";

					if (document.location.href.indexOf("/blog/") !== -1) {
						// Maybe we can make this better?
						if ($("#new_post_label_text").length > 0) {
							m_url = $("#new_post_label_text").attr('href');
						} else {
							m_url = $("body").attr('data-new-root') + "/new/text";
						}
					}

					if (m_url.indexOf('?') !== -1) {
						m_url = m_url.substring(0, m_url.indexOf('?'));
					}

					if (this.preferences.tag_people.value === true) {
						m_url = m_url + "?tags=" + m_tags;
						if (this.preferences.auto_tag.value === true && this.preferences.auto_tag_text.value !== "") {
							m_url = m_url + "," + this.preferences.auto_tag_text.value;
						}
					} else {
						if (this.preferences.auto_tag.value === true && this.preferences.auto_tag_text.value !== "") {
							m_url = m_url + "?tags=" + this.preferences.auto_tag_text.value;
						}
					}

					$(".xkit-reply-selected").removeClass("xkit-reply-selected");
					$(".xkit-reply-selected-pn").removeClass("xkit-reply-selected-pn");

					if (this.preferences.open_in_new_tab.value === true) {
						window.open(m_url, '_BLANK');
					} else {
						document.location.href = m_url;
					}

					return;
				}

			}
		}

		if (pn_mode === true) {
			XKit.extensions.one_click_reply.make_post_activity(obj);
			return;
		}

		try {

			return XKit.extensions.one_click_reply.make_post_dash(obj, pn_mode, event, silent_mode);

		} catch (e) {
			alert("On 102: " + e.message);
		}
	},

	make_post_dash: function(obj, pn_mode, event, silent_mode) {
		var username = $(obj).find(".username").html();
		var real_username = username;
		if (XKit.extensions.one_click_reply.preferences.tag_person_replace_hyphens.value === true) {
			try {
				username = username.replace(/-/g, ' ');
			} catch (e) {
				console.log("Cant replace hyphens, " + e.message);
			}
		}

		var m_sentence = "";

		if ( $(obj).find(".notification_sentence").find(".hide_overflow") > 0) {
			m_sentence = "<p>" + $(obj).find(".notification_sentence").find(".hide_overflow").html() + "</p>";
			if ($(obj).find(".notification_sentence").attr('data-xkit-text-version-html')) {
				var text_html = $(obj).find(".notification_sentence").attr('data-xkit-text-version-html');
				m_sentence = "<p>" + $(text_html).find(".hide_overflow").html() + "</p>";
			}

		} else {
			var tmp_div = $(obj).find(".notification_sentence");
			$(".xkit-reply-button", tmp_div).remove();
			$(".xkit-notification-notification-block-button", tmp_div).remove();
			var tmp_html = $(tmp_div).html();

			if ($(tmp_div).attr('data-xkit-text-version-html')) {
				tmp_html = $(tmp_div).attr('data-xkit-text-version-html');
				tmp_html = decodeURIComponent(escape(atob(tmp_html)));
			}

			m_sentence = "<p>" + tmp_html + "</p>";
		}

		m_sentence = XKit.extensions.one_click_reply.strip_sentence(m_sentence);

		// Fetch the avatar, slugify it to sentence.
		var m_obj = $(obj);

		console.log(" -- Now: " + $(m_obj).attr('class'));
		var avatar_url = $(m_obj).find(".avatar_frame").find(".avatar").attr('src');
		// This is ugly but it works:
		try {
			var avatar_url_start = avatar_url.indexOf('.media.tumblr.com');
		} catch (e) {
			console.log("Can't fetch avatar.");
		}
		if (avatar_url_start !== -1) {
			avatar_url = "https://31." + avatar_url.substring(avatar_url_start + 1);
		}

		if (XKit.extensions.one_click_reply.preferences.show_avatars.value === true) {
			m_sentence = "<img src=\"" + avatar_url + "\" class=\"image_thumbnail\">" + m_sentence;
		}

		var m_url = "https://www.tumblr.com/new/text";

		if (document.location.href.indexOf("/blog/") !== -1) {
			// Maybe we can make this better?
			m_url = $("#new_post_label_text").attr('href');
		}

		if (m_url.indexOf('?') !== -1) {
			m_url = m_url.substring(0, m_url.indexOf('?'));
		}

		var m_tags_to_return = "";

		if (this.preferences.tag_people.value === true) {
			m_url = m_url + "?tags=" + username;
			m_tags_to_return = username;
			if (this.preferences.auto_tag.value === true && this.preferences.auto_tag_text.value !== "") {
				m_url = m_url + "," + this.preferences.auto_tag_text.value;
				m_tags_to_return = m_tags_to_return + "," + this.preferences.auto_tag_text.value;
			}
		} else {
			if (this.preferences.auto_tag.value === true && this.preferences.auto_tag_text.value !== "") {
				m_url = m_url + "?tags=" + this.preferences.auto_tag_text.value;
				m_tags_to_return = m_tags_to_return + "," + this.preferences.auto_tag_text.value;
			}
		}

		var data = {
			sentence: m_sentence,
			tags: m_tags_to_return
		};

		if (silent_mode === true) {
			data.avatar = avatar_url;
			data.username = real_username;
			return data;
		} else {
			XKit.tools.set_setting("xkit_one_click_reply_data", JSON.stringify(data));

			if (this.preferences.open_in_new_tab.value === true) {
				window.open(m_url, '_BLANK');
			} else {
				document.location.href = m_url;
			}

		}

	},

	make_post_activity: function(obj, silent_mode) {
		if (!$(obj).hasClass('activity-notification')) {
			obj = $(obj).closest('.activity-notification');
		}
		var username = $(obj).attr('data-tumblelog-name');
		var post_url = $(obj).find(".activity-notification__glass").attr('href');

		var m_sentence = "";
		if ( $(obj).find(".activity-notification__activity_main").length > 0) {
			m_sentence = "<p>" + $(obj).find(".activity-notification__activity_main").html() + "</p>";
			if ($(obj).find(".activity-notification__activity_main").attr('data-xkit-text-version-html')) {
				m_sentence = $(obj).find(".activity-notification__activity_main").attr('data-xkit-text-version-html');
				m_sentence = decodeURIComponent(escape(atob(m_sentence)));
			}
		}

		if ($(".summary", m_sentence).length > 0) {
			var m_new = $(m_sentence);
			$(m_new).find(".summary").html($(m_new).find(".summary").html());
			$(m_new).find(".summary").wrap("<a href=\"" + post_url + "\"></a>");
			$(m_new).find(".summary").parent().before(" ");
			m_sentence = $(m_new).html();
		}

		if ($(obj).find(".activity-notification__activity_response").length > 0) {
			m_sentence = m_sentence + $(obj).find(".activity-notification__activity_response").html();
		}

		m_sentence = XKit.extensions.one_click_reply.strip_sentence(m_sentence);

		if (XKit.extensions.one_click_reply.preferences.show_avatars.value === true) {
			// Fetch the avatar, slugify it to sentence.
			var m_obj = $(obj);

			console.log(" -- Now: " + $(m_obj).attr('class'));
			var avatar_url = $(m_obj).find(".ui_avatar_link").attr('data-avatar-url');

			avatar_url = avatar_url.replace("_64.png", "_40.png");
			avatar_url = avatar_url.replace("_64.gif", "_40.gif");
			avatar_url = avatar_url.replace("_64.jpg", "_40.jpg");
			avatar_url = avatar_url.replace("_128.png", "_40.png");
			avatar_url = avatar_url.replace("_128.gif", "_40.gif");
			avatar_url = avatar_url.replace("_128.jpg", "_40.jpg");
			// This is ugly but it works:
			try {
				var avatar_url_start = avatar_url.indexOf('.media.tumblr.com');
			} catch (e) {
				console.log("Can't fetch avatar.");
			}
			if (avatar_url_start !== -1) {
				avatar_url = "https://31." + avatar_url.substring(avatar_url_start + 1);
			}
			m_sentence = "<p><img src=\"" + avatar_url + "\" class=\"image_thumbnail\"></p>" + m_sentence;
		}

		var m_url = "https://www.tumblr.com/new/text";

		if (document.location.href.indexOf("/blog/") !== -1) {
			// Maybe we can make this better?
			m_url = $("body").attr('data-new-root') + "/new/text";
		}

		if (m_url.indexOf('?') !== -1) {
			m_url = m_url.substring(0, m_url.indexOf('?'));
		}

		var m_tags_to_return = "";

		if (this.preferences.tag_people.value === true) {
			m_url = m_url + "?tags=" + username;
			m_tags_to_return = username;
			if (this.preferences.auto_tag.value === true && this.preferences.auto_tag_text.value !== "") {
				m_url = m_url + "," + this.preferences.auto_tag_text.value;
				m_tags_to_return = m_tags_to_return + "," + this.preferences.auto_tag_text.value;
			}
		} else {
			if (this.preferences.auto_tag.value === true && this.preferences.auto_tag_text.value !== "") {
				m_url = m_url + "?tags=" + this.preferences.auto_tag_text.value;
				m_tags_to_return = m_tags_to_return + "," + this.preferences.auto_tag_text.value;
			}
		}

		var data = {
			sentence: m_sentence,
			tags: m_tags_to_return
		};
		if (silent_mode === true) {
			return data;
		} else {
			XKit.tools.set_setting("xkit_one_click_reply_data", JSON.stringify(data));

			if (this.preferences.open_in_new_tab.value === true) {
				window.open(m_url, '_BLANK');
			} else {
				document.location.href = m_url;
			}

		}

	},

	strip_sentence: function(m_sentence) {
		m_sentence = XKit.tools.replace_all(m_sentence, "[[MORE]]", "");
		m_sentence = m_sentence.replace(/[^ -~]/g, function(chr) {
			return "&#" + chr.charCodeAt(0) + ";";
		});
		m_sentence = m_sentence.replace("<p></p>", "");
		return m_sentence;
	},

	destroy: function() {
		XKit.tools.remove_css("one_click_reply");
		XKit.extensions.one_click_reply.added_css = false;
		$(".xkit-reply-button, .xkit-reply-button-pn, #xkit-one-click-reply-quick-reply-window").remove();
		$(document).off("mouseleave", ".post.is_mine .notes_container .note, .ui_notes .ui_note, .ui_notes .activity-notification", XKit.extensions.one_click_reply.exit_pn);
		$(document).off("mouseenter", ".post.is_mine .notes_container .note, .ui_notes .ui_note, .ui_notes .activity-notification", XKit.extensions.one_click_reply.enter_pn);
		$(document).off("mouseenter", ".notification", XKit.extensions.one_click_reply.enter);
	}
});
