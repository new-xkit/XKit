//* TITLE Highlighter **//
//* VERSION 0.1.4 **//
//* DESCRIPTION Don't miss things **//
//* DETAILS The cousin of Blacklister, this extension highlights posts depending on the words you decide. When a word you add is found on a post, the post will get a yellow-ish background. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.highlighter = new Object({

	running: false,
	slow: true,

	preferences: {
		"sep1": {
			text: "Under the Hood options",
			type: "separator"
		},
		"use_improved": {
			text: "Use improved checking",
			slow: true,
			default: true,
			value: true
		},
		"dont_highlight_me": {
			text: "Don't highlight my posts",
			default: true,
			value: true
		},
		"check_for_blocking": {
			text: "Don't highlight posts hidden by Blacklist",
			default: true,
			value: true
		},
		"sep2": {
			text: "Highlighted Words",
			type: "separator"
		}
	},

	highlightered: [],

	run: function() {
		this.running = true;
		XKit.tools.init_css("highlighter");

		var m_highlighter = XKit.storage.get("highlighter", "words", "").split(",");
		if (m_highlighter !== "") {
			this.highlightered = m_highlighter;
		}

		if ($(".posts .post").length > 0) {
			XKit.post_listener.add("highlighter", XKit.extensions.highlighter.check);
			XKit.extensions.highlighter.check();
		}

	},

	check: function() {

		$(".posts .post").not(".mine").not(".xhighlighter-done").each(function() {

			// Check if it's something we should not touch.
			if ($(this).attr('id') === "new_post") { return; }
			if ($(this).css("display") === "none") { return; }

			// Add class to not do this twice.
			$(this).addClass("xhighlighter-done");

			// if has no text content, no need to do this.
			if ($(this).find(".post_content").length <= 0) { return; }

			// Collect the tags
			var m_tags = "";
			if ($(this).find(".tag").length > 0) {
				$(this).find(".tag").each(function() {
					m_tags = m_tags + " " + $(this).html().replace("#", "");
				});
			} else {
				if ($(this).find(".post_tag").length > 0) {
					$(this).find(".post_tag").each(function() {
						m_tags = m_tags + " " + $(this).html().replace("#", "");
					});
				}
			}

			// Collect the title contents too.
			var m_title = "";
			if ($(this).find(".post_title").length > 0) {
				m_title = $(this).find(".post_title").html();
			}

			// Collect the content.
			var m_content = "";

			if ($(this).find(".post_text_wrapper").length > 0) {
				m_content = $(this).find(".post_text_wrapper").html();
			}

			if ($(this).find(".post_body").length > 0) {
				m_content = $(this).find(".post_body").html();
			}

			if ($(this).find(".caption").length > 0) {
				m_content = $(this).find(".caption").html();
			}

			m_content = m_content + " " + m_title + " " + m_tags;
			m_content = XKit.tools.replace_all(m_content, "&nbsp;", " ");
			m_content = m_content.toLowerCase();

			// Strip HTML tags.
			m_content = m_content.replace(/<(?:.|\n)*?>/gm, '');

			var m_result = XKit.extensions.highlighter.do_post(m_content);
			if (m_result !== "") {
				XKit.extensions.highlighter.highlight_post($(this), m_result);
			}


		});

		$(".xhighlighter_open_post").unbind("click");
		$(".xhighlighter_open_post").bind("click", function() {

			var m_div = $("#" + $(this).attr('data-post-id'));
			$(m_div).removeClass("xhighlighter_highlightered_post");
			$(m_div).find(".post_info").css("display", "block");
			$(m_div).find(".post_controls").css("display", "block");
			$(m_div).find(".post_footer_links").css('display', 'block');
			$(m_div).find(".post_tags").css('display', 'block');
			$(m_div).find(".post_footer").css('display', 'table');

			$(m_div).find(".full_answer_container_wrapper").css("display", "block");

			$(m_div).find(".xhighlighter_excuse").remove();
			$(m_div).find(".post_content").html($(m_div).find(".xhighlighter_old_content").html());

		});

		XKit.tools.add_function(function() {
			/*Tumblr.Events.on("DOMEventor:flatscroll", function(n) {
				console.log(JSON.stringify(n));
				//n.documentHeight = 0;
				// if ((n.documentHeight - n.windowScrollY) < n.windowHeight * 3) {
				console.log(" -- 1] " + (n.documentHeight - n.windowScrollY));
				console.log(" -- 2] " + n.windowHeight * 3 + " <-- must be smaller than this");
			});*/
			Tumblr.Events.trigger("DOMEventor:updateRect");
		}, true, "");

	},

	highlight_post: function(obj, word) {

		if (XKit.extensions.highlighter.preferences.dont_highlight_me.value === true) {
			if ($(obj).hasClass("is_mine") === true) {
				return;
			}
		}

		if (XKit.extensions.highlighter.preferences.check_for_blocking.value === true) {
			if ($(obj).hasClass("xblacklist_hidden_post") === true || $(obj).hasClass("xblacklist_blacklisted_post")) {
				return;
			}
		}

		$(obj).append("<div class=\"xhighlighter-reason\">" + word + "</div>");
		$(obj).addClass("xhighlighter_highlightered_post");

	},

	do_post: function(post_content) {

		if ($.trim(post_content) === "") { return ""; }
		post_content = post_content.replace(/\n/g, ' ');
		var p_words = post_content.split(" ");

		for (var i = 0; i < XKit.extensions.highlighter.highlightered.length; i++) {

			var m_word = XKit.extensions.highlighter.highlightered[i].toLowerCase();
			if ($.trim(m_word) === "") { continue; }

			var m_word_wildcard = false;

			if (m_word.substring(m_word.length - 1) === "*") {
				// This word is wildcarded!
				m_word_wildcard = true;
				m_word = m_word.substring(0, m_word.length - 1);
			}

			if (m_word.indexOf(" ") !== -1) {
				m_word_wildcard = true;
			}

			if (m_word_wildcard === false) {

				// Well this one is easy:

				// First lets strip the dots or commas.

				if (p_words.indexOf(m_word) !== -1) {
					// We've found the word!
					return m_word;
				} else {
					if (XKit.extensions.highlighter.preferences.use_improved.value === true) {
						// This will use some CPU...
						if (post_content.indexOf(m_word) !== -1) {
							for (var j = 0; j < p_words.length; j++) {
								if (p_words[j].indexOf(m_word) !== -1) {
									var mp_word = p_words[j].replace(/\./g, '');
									mp_word = mp_word.replace(/\,/g, '');
									mp_word = mp_word.replace(/\u2026/g, '');
									if (m_word === mp_word) {
										return m_word;
									}
								}
							}
						}
					}
				}

			} else {

				// Ugh. Wildcarded. This will
				// require some processing power.
				// To save CPU time, let's run it in the
				// post_content first, continue only if
				// we can find it there.
				if (post_content.indexOf(m_word) !== -1) {

					// Ugh. Even worse, we've found it,
					// now we need to get into a loop.
					for (var p_i = 0; p_i < p_words.length; p_i++) {

						if (p_words[p_i] === "") { continue; }
						if (p_words[p_i].indexOf(m_word) !== -1) {
							return m_word;
						}

						if (p_i < p_words.length) {
							var tmp_word = p_words[p_i] + " " + p_words[p_i + 1];

							// This is a dirty fix but it should work for now.
							if (p_words[p_i + 2] !== "" || typeof p_words[p_i + 2] !== "undefined") {
								tmp_word = tmp_word + " " + p_words[p_i + 2];
							}
							if (p_words[p_i + 3] !== "" || typeof p_words[p_i + 3] !== "undefined") {
								tmp_word = tmp_word + " " + p_words[p_i + 3];
							}
							if (p_words[p_i + 4] !== "" || typeof p_words[p_i + 4] !== "undefined") {
								tmp_word = tmp_word + " " + p_words[p_i + 4];
							}

							if (tmp_word.indexOf(m_word) !== -1) {
								return m_word;
							}
						}

					}

				}
			}

		}

		// Found nothing.
		return "";


	},

	destroy: function() {
		this.running = false;
		$(".xhighlighter-done").each(function() {
			$(this).removeClass("xhighlighter_highlightered_post");
		});
		$(".xhighlighter-reason").remove();
		$(".xhighlighter-done").removeClass("xhighlighter-done");
		$(".xhighlighter_highlightered_post").removeClass("xhighlighter_highlightered_post");
		XKit.tools.remove_css("highlighter");
	},

	create_highlighter_div: function(word) {

		var m_html = "<div class=\"xkit-highlightered-word\">" + word + "<div data-word=\"" + word + "\" class=\"xkit-highlightered-word-delete\">&#10006;</div></div>";
		return m_html;

	},

	check_if_exists: function(word) {

		if (XKit.extensions.highlighter.highlightered.indexOf(word) !== -1) {
			return true;
		} else {
			return false;
		}

	},

	save_highlighter: function() {

		XKit.storage.set("highlighter", "words", this.highlightered.join(","));

	},

	cpanel: function(m_div) {

		if ($("#xkit-highlighter-custom-panel").length > 0) {
			// Panel already exists, probably in refresh mode.
			// Remove it first.
			$("#xkit-highlighter-custom-panel").remove();
		}

		var m_html = "<div id=\"xkit-highlighter-custom-panel\"><div id=\"highlighter-toolbar\"><div id=\"highlighter-add-button\" class=\"xkit-button\">Add a new word..</div><div id=\"highlighter-tips\" class=\"xkit-button\">Tips on Highlighting</div><div id=\"highlighter-delete-all\" class=\"xkit-button\">Delete All</div></div><div id=\"highlighter-words\">";
		if (XKit.extensions.highlighter.highlightered.length <= 1) {
			m_html = m_html + "<div id=\"xkit-highlighter-none\"><b>You have no highlighted words.</b><br/>Click on the button above to add new words to your Highlighter.</div>";
		} else {
			for (var i = 0; i < XKit.extensions.highlighter.highlightered.length; i++) {
				if (XKit.extensions.highlighter.highlightered[i] !== "") {
					m_html = m_html + XKit.extensions.highlighter.create_highlighter_div(XKit.extensions.highlighter.highlightered[i]);
				}
			}
		}

		m_html = m_html + "</div></div>";
		$(m_div).append(m_html);

		$(".xkit-highlightered-word-delete").unbind("click");
		$(".xkit-highlightered-word-delete").click(function() {

			var m_index = XKit.extensions.highlighter.highlightered.indexOf($(this).attr('data-word'));
			if (m_index === -1) { return; }

			XKit.extensions.highlighter.highlightered.splice(m_index, 1);
			XKit.extensions.highlighter.save_highlighter();
			XKit.extensions.highlighter.cpanel(m_div);
			XKit.extensions.xkit_preferences.restart_extension("highlighter");

		});

		$("#highlighter-tips").click(function() {

			XKit.window.show("A few tips on highlighting", "<ul class=\"xkit-highlighter-add-margins-to-ul\">" +
				"<li>You can add \"*\" at the end of a word to wildcard it.</li>" +
				"<li>Wildcarded words match words that begin with it: for example, \"cat*\" will find \"category\", \"capital\" etc.</li>" +
				"<li>If you add something that contains 2 or more words, it will be wildcarded automatically</li>" +
				"<li>Adding too much words, especially wildcard ones, will slow your computer down dramatically.</li>" +
				"</ul>", "info", "<div class=\"xkit-button\" id=\"xkit-close-message\">OK</div>");

		});

		$("#highlighter-delete-all").click(function() {

			XKit.window.show("Delete list", "Delete all your highlightered words?", "question", "<div class=\"xkit-button default\" id=\"xkit-highlighter-delete-all-continue\">Yes, delete my list.</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

			$("#xkit-highlighter-delete-all-continue").click(function() {

				var m_array = [];

				XKit.extensions.highlighter.highlightered = m_array;
				XKit.extensions.highlighter.save_highlighter();
				XKit.window.close();
				XKit.extensions.highlighter.cpanel(m_div);
				XKit.extensions.xkit_preferences.restart_extension("highlighter");

			});

		});

		$("#highlighter-add-button").click(function() {

			XKit.window.show("Add word to highlighter", "<b>Enter the word you want to add.</b><br/>Your words can not contain commas or backslashes.<input type=\"text\" maxlength=\"50\" placeholder=\"Enter a word here.\" class=\"xkit-textbox\" id=\"xkit-highlighter-word\"><br/>Before adding a word, please check \"Tips on Highlighting\" section.", "question", "<div class=\"xkit-button default\" id=\"xkit-highlighter-add-word\">Add word</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

			$("#xkit-highlighter-add-word").click(function() {

				var m_to_add = $("#xkit-highlighter-word").val();

				if (m_to_add === "" || $.trim(m_to_add) === "") {
					XKit.window.close();
					return;
				}

				if (m_to_add.indexOf(",") !== -1) {
					alert("The word(s) you enter can not have commas in it.");
					return;
				}

				if (m_to_add.indexOf("\\") !== -1) {
					alert("The word(s) you enter can not have backslashes in it.");
					return;
				}

				if (m_to_add.length <= 1) {
					alert("Words must be at least two characters.");
					return;
				}

				if (m_to_add.substring(0, 1) === "#") {
					alert("Please do not add hashtags to words.");
					return;
				}

				if (XKit.extensions.highlighter.check_if_exists(m_to_add) === true) {
					alert("This word is already in the highlight list.");
					return;
				}

				XKit.extensions.highlighter.highlightered.push(m_to_add);
				XKit.extensions.highlighter.save_highlighter();
				XKit.window.close();
				XKit.extensions.highlighter.cpanel(m_div);
				XKit.extensions.xkit_preferences.restart_extension("highlighter");

			});

		});

		$("#xkit-extensions-panel-right").nanoScroller();
		$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });

	}

});
