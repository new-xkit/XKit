//* TITLE Blacklist **//
//* VERSION 3.1.9 **//
//* DESCRIPTION Clean your dash **//
//* DETAILS This extension allows you to block posts based on the words you specify. If a post has the text you've written in the post itself or it's tags, it will be replaced by a warning, or won't be shown on your dashboard, depending on your settings. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

jQuery.fn.selectText = function() {
	var doc = document;
	var element = this[0];
	var range, selection;

	if (doc.body.createTextRange) {
		range = document.body.createTextRange();
		range.moveToElementText(element);
		range.select();
	} else if (window.getSelection) {
		selection = window.getSelection();
		range = document.createRange();
		range.selectNodeContents(element);
		selection.removeAllRanges();
		selection.addRange(range);
	}
};

XKit.extensions.blacklist = new Object({

	running: false,
	slow: true,

	control_panel_div: "",

	preferences: {
		"sep0": {
			text: "User interface options",
			type: "separator"
		},
		"shortcut": {
			text: "Enable alt + B shortcut for adding new words",
			default: true,
			value: true
		},
		"right_click": {
			text: "Enable alt + click on highlighted text to add words",
			experimental: true,
			default: false,
			value: false
		},
		"show_type": {
			text: "Show type of post when it's blocked",
			default: true,
			value: true
		},
		"mini_block": {
			text: "Enable mini-UI for blocked posts",
			default: false,
			value: false
		},
		"sep1": {
			text: "Blacklisting options",
			type: "separator"
		},
		"dont_display": {
			text: "Don't display blocked posts at all (not recommended)",
			default: false,
			value: false
		},
		"check_authors": {
			text: "Check author blog titles and usernames for blacklisted words",
			default: true,
			value: true
		},
		"dont_block_me": {
			text: "Don't block my own posts",
			default: true,
			value: true
		},
		"dont_on_inbox": {
			text: "Don't run Blacklist on my Inbox",
			default: false,
			value: false
		},
		"dont_block_liked": {
			text: "Don't block posts I've liked or replied to",
			default: false,
			value: false
		},
		"dont_show_cause": {
			text: "Don't show why the post was blocked",
			default: false,
			value: false
		},
		"use_improved": {
			text: "Use improved checking",
			slow: true,
			default: true,
			value: true
		},
		"sep2": {
			text: "Appearance options",
			type: "separator"
		},
		"show_tags": {
			text: "Show tags on blocked posts (does not work with Mini-UI mode)",
			default: false,
			value: false
		},
		"sep3": {
			text: "Blacklisted Words",
			type: "separator"
		}
	},

	blacklisted: [],
	whitelisted: [],

	edit_label: "",

	run: async function() {
		this.running = true;

		if (!XKit.interface.is_tumblr_page()) {
			return;
		}

		await XKit.css_map.getCssMap();
		if (XKit.page.react) {
			this.edit_label = await XKit.interface.translate("Edit");
		}

		if ($("body").hasClass("dashboard_messages_inbox") === true || $("body").hasClass("dashboard_messages_submissions") === true) {
			if (this.preferences.dont_on_inbox.value) {
				return;
			}
		}

		XKit.tools.init_css("blacklist");
		XKit.interface.hide(".xblacklist_hidden_post", "blacklist");

		var m_blacklist = XKit.storage.get("blacklist", "words", "").split(",");
		var m_whitelist = XKit.storage.get("blacklist", "words_whitelisted", "").split(",");

		if (m_blacklist !== "") {
			this.blacklisted = m_blacklist;
		}

		if (m_blacklist !== "") {
			this.whitelisted = m_whitelist;
		}

		if (this.preferences.shortcut.value === true) {

			$(document).on('keydown', XKit.extensions.blacklist.key_down);

		}

		const postSel = XKit.css_map.keyToCss('listTimelineObject') || '.post';
		const postContentClasses = XKit.css_map.keyToClasses('post') || ['.post_content'];
		const blacklistedPostContentSel = postContentClasses.map(cls => `.xblacklist_blacklisted_post ${cls}`).join(', ');

		if (this.preferences.mini_block.value === true) {

			const mini_ui = `
				.xblacklist_blacklisted_post {
					opacity: 1 !important;
					padding: 0 !important;
					border: 1px dashed rgba(var(--white-on-dark, 255,255,255), 0.4) !important;
					background: transparent !important;
				}
				.xblacklist_blacklisted_post .post_avatar,
				.xblacklist_blacklisted_post .post_permalink {
					display: none !important;
				}
				.xblacklist_excuse_container {
					background: transparent !important;
				}
				.xblacklist_blacklisted_post .xblacklist_excuse {
					height: 40px !important;
					line-height: 40px !important;
					color: rgba(var(--white-on-dark, 255,255,255), 0.4);
					padding: 0;
					margin: 0;
					padding-left: 15px;
				}
				${blacklistedPostContentSel} {
					background: transparent;
				}
				.xblacklist_blacklisted_post .xblacklist_open_post,
				.xblacklist_blacklisted_post .post_tags {
					display: none;
				}
				.xblacklist_blacklisted_post:hover .xblacklist_open_post {
					display: inline-block;
					height: unset;
					line-height: initial;
					top: 50% !important;
					transform: translateY(-50%);
					margin: 0;
				}
				.xkit--react .xblacklist_open_post {
					color: rgba(var(--white-on-dark), 0.8);
					background: rgba(var(--white-on-dark), 0.05);
					border-color: rgba(var(--white-on-dark), 0.3);
				}
				.xkit--react .xblacklist_open_post:hover {
					color: rgb(var(--white-on-dark));
					background: rgba(var(--white-on-dark), 0.1);
					border-color: rgba(var(--white-on-dark), 0.5);
				}
			`;

			XKit.tools.add_css(mini_ui, "blacklist");

		}

		if (XKit.page.react || $(postSel).length > 0) {
			XKit.post_listener.add("blacklist", XKit.extensions.blacklist.check);
			XKit.extensions.blacklist.check();

			if (XKit.extensions.blacklist.preferences.right_click.value === true) {
				$(document).on('mouseup', XKit.extensions.blacklist.get_selection);
			}

		}

	},

	key_down: function(e) {
		if (e.altKey === true) {
			if (e.which === 66) {
				var m_div = "";
				if ($("#xkit-control-panel").length > 0) {
					// Control panel is open.
					if (XKit.extensions.blacklist.control_panel_div !== "") {
						m_div = XKit.extensions.blacklist.control_panel_div;
					}
				}
				XKit.extensions.blacklist.show_add("", m_div, true);
			}
		}

	},

	get_selection: function(e) {

		if ( e.altKey !== true ) { return; }

		var text = "";

		try {

			if (top.getSelection) {
				text = top.getSelection().toString();
			} else if (document.selection && document.selection.type != "Control") {
				text = document.selection.createRange().text;
			}

		} catch (err) {
			// console.log("ho");
		}

		if (text === "" || typeof text === "undefined") {
			return;
		}

		text = $.trim(text);

		XKit.extensions.blacklist.show_add(text, "");

	},

	export: function() {

		var m_data = {};

		m_data.creator = "XKIT";
		m_data.version = "1.0";
		m_data.blacklist = XKit.extensions.blacklist.blacklisted;
		m_data.whitelist = XKit.extensions.blacklist.whitelisted;

		var m_html = "<div id=\"xkit-blacklist-share-code\" class=\"nano\">" +
					"<div class=\"content\">" +
						"<div id=\"xkit-blacklist-share-code-inner\">" +
							JSON.stringify(m_data) +
						"</div>" +
					"</div>" +
				"</div>";

		XKit.window.show("Export Blacklist", "Blacklist Contents in JSON:" + m_html, "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");

		$("#xkit-blacklist-share-code").nanoScroller();
		$("#xkit-blacklist-share-code").nanoScroller({ scroll: 'top' });

		$("#xkit-blacklist-share-code").click(function() { $(this).selectText();});

	},

	import: function(m_div) {

		XKit.window.show("Import", "<b>You can import settings from Tumblr Savior/XKit.</b><br/>Go to your Tumblr Savior's Save/Load panel and paste the text below to import your blacklisted/whitelisted words.<input type=\"text\" placeholder=\"Paste preferences text here.\" class=\"xkit-textbox\" id=\"xkit-blacklist-import-words\">", "question", "<div class=\"xkit-button default\" id=\"xkit-blacklist-add-words\">Import!</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

		$("#xkit-blacklist-replace-on-import").click(function() {
			$(this).toggleClass("selected");
		});

		$("#xkit-blacklist-add-words").click(function() {

			var $m_to_add = $("#xkit-blacklist-import-words");
			var m_to_add = $m_to_add.val();

			if (m_to_add === "" || $.trim(m_to_add) === "") {
				$m_to_add
					.css("border-color", "red")
					.attr("placeholder", "You forgot to paste anything.")
					.val("")
					.click(function() {
						$m_to_add
							.removeAttr("style")
							.attr("placeholder", "Paste preferences text here.")
							.off("click");
					});
				return;
			}

			var m_obj = null;
			try {

				m_obj = JSON.parse(m_to_add);

			} catch (e) {
				XKit.window.show("Invalid or corrupt data.",
					"The JSON you inputted could not be read.<br>" +
					"Be sure you are copy/pasting the right file in its entirety.<br><br>" +
					"<b>Error details:</b> <p> " + e.message + "</p>",
					"error",
					'<div class="xkit-button default" id="xkit-close-message">OK</div>'
				);
				return;
			}

			var to_check_blacklist = "listBlack";
			var to_check_whitelist = "listWhite";

			if (m_obj.creator === "XKIT") {

				to_check_blacklist = "blacklist";
				to_check_whitelist = "whitelist";

			}

			var blacklist_count = 0;
			if (typeof m_obj[to_check_blacklist] === "object") {
				for (var i = 0; i < m_obj[to_check_blacklist].length; i++) {
					var m_word = m_obj[to_check_blacklist][i];
					m_word = $.trim(m_word);
					if (m_word === "") { continue; }
					if (m_word.indexOf(",") !== -1) {
						m_word = XKit.tools.replace_all(m_word, ",", "");
					}
					if (m_word.indexOf("\\") !== -1) {
						m_word = XKit.tools.replace_all(m_word, "\\\\", "");
					}
					if (m_word.length <= 3) {
						m_word = m_word + "*";
					}
					if (XKit.extensions.blacklist.check_if_exists(m_word) !== true) {
						XKit.extensions.blacklist.blacklisted.push(m_word);
						blacklist_count++;
					}
				}
			}

			var whitelist_count = 0;
			if (typeof m_obj[to_check_whitelist] === "object") {
				m_obj[to_check_whitelist].forEach(function(word) {
					word = $.trim(word);
					if (word === "") { return; }
					if (word.indexOf(",") !== -1) {
						word = XKit.tools.replace_all(word, ",", "");
					}
					if (word.indexOf("\\") !== -1) {
						word = XKit.tools.replace_all(word, "\\\\", "");
					}
					if (word.length <= 3) {
						word = word + "*";
					}
					if (XKit.extensions.blacklist.check_if_exists(word) !== true) {
						XKit.extensions.blacklist.whitelisted.push(word);
						whitelist_count++;
					}
				});
			}

			if (blacklist_count > 0 || whitelist_count > 0) {

				if (m_obj.creator === "XKIT") {

					XKit.window.show("Results",	"<b>Imported from XKit Blacklist.</b><br/>" +
									"Added <b>" + blacklist_count + "</b> new words to the blacklist.<br/>" +
									"Added <b>" + whitelist_count + "</b> new words to the whitelist.<br/><br/>Words that already exist in your list are not added. Your settings are not carried from Tumblr Savior, so you might want to check the settings to configure Blacklist to your liking.", "info", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");


				} else {

					XKit.window.show("Results",	"<b>Imported from version " +  m_obj.version + " of Tumblr Savior.</b><br/>" +
									"Added <b>" + blacklist_count + "</b> new words to the blacklist.<br/>" +
									"Added <b>" + whitelist_count + "</b> new words to the whitelist.<br/><br/>Words that already exist in your list are not added. Your settings are not carried from Tumblr Savior, so you might want to check the settings to configure Blacklist to your liking.", "info", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");

				}

				XKit.extensions.blacklist.save_blacklist();

			} else {

				XKit.window.show("Results", "<b>No words were imported.</b><br/>It might be possible that all the words in your import were already in your blacklist.", "info", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");

			}

			XKit.extensions.blacklist.cpanel(m_div);
			XKit.extensions.xkit_preferences.restart_extension("blacklist");

			/*if (typeof m_text === "undefined" || m_text === "") {
				XKit.extensions.blacklist.cpanel(m_div);
			} else {
				XKit.notifications.add("Added to blacklist.","ok");
			}
			XKit.extensions.xkit_preferences.restart_extension("blacklist");
			*/

		});

	},

	show_add: function(m_text, m_div, from_shortcut) {

		XKit.window.show("Add word to blacklist/whitelist", "<b>Enter the word you want to add.</b><br/>Your words can not contain commas or backslashes.<input type=\"text\" maxlength=\"50\" placeholder=\"Enter a word here.\" class=\"xkit-textbox\" id=\"xkit-blacklist-word\"><div class=\"xkit-checkbox\" id=\"xkit-blacklist-add-to-whitelist\"><b>&nbsp;</b>Add to whitelist</div><br/>Before adding a word, please check \"Tips\" section.", "question", "<div class=\"xkit-button default\" id=\"xkit-blacklist-add-word\">Add word</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

		if (typeof m_text !== "undefined" && m_text !== "") {
			$("#xkit-blacklist-word").val(m_text);
		}

		$("#xkit-blacklist-add-to-whitelist").click(function() {
			$(this).toggleClass("selected");
		});

		$("#xkit-blacklist-add-word").click(function() {

			var $m_to_add = $("#xkit-blacklist-word");
			var m_to_add = $m_to_add.val().replace(/\u200B/g, '');
			function complain(problem) {
				$m_to_add
					.css("border-color", "red")
					.attr("placeholder", problem)
					.val("")
					.click(function() {
						$m_to_add
							.removeAttr("style")
							.attr("placeholder", "Enter a word here.")
							.off("click");
					});
			}

			if (m_to_add === "" || $.trim(m_to_add) === "") {
				complain("Not even XKit can save you from ALL posts.");
				return;
			}

			if (m_to_add.indexOf(",") !== -1) {
				complain("The word you enter cannot have commas in it.");
				return;
			}

			if (m_to_add.indexOf("\\") !== -1) {
				complain("The word you enter cannot have backslashes in it.");
				return;
			}

			if (m_to_add.length <= 1) {
				complain("Words must be at least two characters.");
				return;
			}

			if (XKit.extensions.blacklist.check_if_exists(m_to_add) === true) {
				complain(m_to_add + " is already in the blacklist.");
				return;
			}

			if (!$("#xkit-blacklist-add-to-whitelist").hasClass("selected")) {

				XKit.extensions.blacklist.blacklisted.push(m_to_add);
				XKit.extensions.blacklist.save_blacklist();

			} else {

				XKit.extensions.blacklist.whitelisted.push(m_to_add);
				XKit.extensions.blacklist.save_blacklist();

			}

			if ((typeof m_text === "undefined" || m_text === "") && from_shortcut !== true) {
				XKit.extensions.blacklist.cpanel(m_div);
			} else {
				if (!$("#xkit-blacklist-add-to-whitelist").hasClass("selected")) {
					XKit.notifications.add("Added to blacklist.", "ok");
				} else {
					XKit.notifications.add("Added to whitelist.", "ok");
				}
			}

			XKit.extensions.xkit_preferences.restart_extension("blacklist");
			XKit.window.close();

		});

	},

	check: function() {

		var height_changed = false;

		if (XKit.extensions.blacklist.running !== true) {return; }

		// Refuse to process anything within the new post form
		$('.post-form .post').not('.xblacklist-done').each(function() {
			$(this).addClass('xblacklist-done');
			return;
		});

		const postSel = XKit.css_map.keyToCss('listTimelineObject') || '.post';
		$(postSel).not(".xblacklist-done").each(function() {

			try {

				// Check if it's something we should not touch.
				if ($(this).attr('id') === "new_post") { return; }
				//if ($(this).css("display") === "none") { return; }

				// $(this).css("background","green");

				// if has no text content, no need to do this.
				// if ($(this).find(".post_content").length <= 0 && $(this).find(".post_body").length <=0 &&) { $(this).css("background","blue"); return; }

				// Add class to not do this twice.
				$(this).addClass("xblacklist-done");

				if (XKit.extensions.blacklist.preferences.dont_block_me.value && $(this).find(`[aria-label='${XKit.extensions.blacklist.edit_label}']`).length) {
					return;
				}

				// Collect the tags
				var tag_array = [];
				const tagSel = XKit.css_map.keyToCss('tag') || '.post_tag';
				if ($(this).find(tagSel).length > 0) {
					$(this).find(tagSel).each(function() {
						tag_array.push($(this).text().trim().replace("#", "").toLowerCase());
					});
				}

				// Collect the title contents too.
				var m_title = "";
				if ($(this).find(".post_title, .reblog-title").length > 0) {
					m_title = $(this).find(".post_title, .reblog-title").html();
				}

				// Collect the author info, if the option is toggled.
				var m_author = "";
				if (XKit.extensions.blacklist.preferences.check_authors.value) {
					try {
						const postInfoSel = XKit.css_map.keyToCss('blogLink') ||
							'.post_info_link, .reblog-tumblelog-name';
						var post_info_links = $(this).find(postInfoSel).map(function() {
							return $(this).text();
						});

						// Join the text of the post info links with spaces
						m_author += post_info_links.get().join(" ");

						const contentSourceSel = XKit.css_map.keyToCss('contentSource') || '.reblog_source';
						if ($(this).find(contentSourceSel).length > 0) {
							m_author = m_author + " " + $(this).find(contentSourceSel).find("a").html();
						}

						if ($(this).find(".post_source_link").length > 0) {
							m_author = m_author + " " + $(this).find(".post_source_link").html();
						}
					} catch (e) {
						console.log(" !! can't get author !!");
					}
				}

				// Collect the content.
				var m_content = "";

				// Old methods of finding content
				if ($(this).find('.post_text_wrapper').length > 0) {
					m_content = $(this).find('.post_text_wrapper').html();
				}

				if ($(this).find(".post_body").length > 0) {
					m_content = $(this).find(".post_body").html();
				}

				// Link buttons (link post's content) live inside a .post_media
				// which can coexist with a .post_body.
				if ($(this).find(".post_media").length > 0) {
					m_content += " " + $(this).find(".post_media").html();
				}

				if ($(this).find(".caption").length > 0) {
					m_content = $(this).find(".caption").html();
				}

				if ($(this).find(".reblog-content").length > 0) {
					m_content = $(this).find(".reblog-content").map(function() {
						return $(this).html();
					}).get().join(" ");
				}

				// New method for finding content on react. "link" finds the content of link posts
				const contentSel = XKit.css_map.keyToCss('textBlock') + "," + XKit.css_map.keyToCss('link');
				var content = $(this).find(contentSel);
				if (content.length) {
					m_content += content.map(function() {
						return $(this).html();
					}).get().join(" ");
				}

				m_content = m_content + " " + m_title;

				if (XKit.extensions.blacklist.preferences.check_authors.value) {
					m_content = m_content + " " + m_author;
				}

				m_content = XKit.tools.replace_all(m_content, "&nbsp;", " ");
				m_content = m_content.toLowerCase();

				// Preserve href links.
				m_content = m_content.replace(/<a\s+(?:[^>]*?\s+)?href="([^"]*)".*?>/gm, ' $1 ');
				// Strip HTML tags.
				m_content = m_content.replace(/<(?:.|\n)*?>/gm, ' ');

				//console.log('all the content is', m_content);

				var m_result = XKit.extensions.blacklist.do_post($(this), m_content, tag_array);
				if (m_result !== "") {
					height_changed = true;
					//$(this).css("background","red");
					XKit.extensions.blacklist.hide_post($(this), m_result);
				} else {
					//$(this).css("background","green");
				}

			} catch (e) {

				console.error("Blacklist can't parse post: " + e.message);
				// $(this).css("background","red");

			}

		});

		if (height_changed) {
			setTimeout(function() {

				XKit.tools.add_function(function() {
					try {
						if (typeof Tumblr === "undefined") {
							setTimeout(function() {

								try {
									Tumblr.Events.trigger("DOMEventor:updateRect");
								} catch (e) {
								// console.log("!!! XKit blacklist ---> " + e.message);
								}

							}, 1000);
						} else {
							Tumblr.Events.trigger("DOMEventor:updateRect");
						}
					} catch (e) {
					// console.log("!!! XKit blacklist ---> " + e.message);
					}
				}, true, "");

			}, 300);
		}
	},

	hide_post: function($post, word) {
		const {
			dont_block_me,
			dont_block_liked,
			dont_display,
			show_type,
			dont_show_cause,
			mini_block,
			show_tags
		} = this.preferences;

		if (dont_block_me.value && $post.hasClass('is_mine')) {
			return;
		}

		if (dont_block_liked.value && $post.find('.post_control.like.liked').length !== 0) {
			return;
		}

		if (dont_display.value) {
			$post.addClass('xblacklist_hidden_post');
			return;
		}

		const cause = dont_show_cause.value ?
			''
			: `Blocked because it contains the word &quot;<b>${word}</b>&quot;`;

		const post_type_div = show_type.value ?
			`<div class="xkit-blacklist-post-type ${$post.attr('data-type')}">&nbsp;</div>`
			: '';

		const excuse = `
			<div class="xblacklist_excuse_container">
				<div class="xblacklist_excuse">
					${cause}
					${post_type_div}
					<div class="xkit-button xblacklist_open_post">
						Show it anyway
					</div>
				</div>
			</div>
		`;

		$post.addClass('xblacklist_blacklisted_post');

		if (!mini_block.value) {
			$post.find('header, .post_header').first().after(excuse);
		} else {
			$post.prepend(excuse);
		}

		$post.on('click', '.xblacklist_open_post', this.unhide_post);

		if (!mini_block.value) {
			$post.addClass('xblacklist_blacklisted_post_full_ui');

			if (show_tags.value) {
				const tagsSel = XKit.css_map.keyToCss('tags') || '.post_tags';
				const excuseTags = $post.find(tagsSel).clone().addClass('post_tags');
				$post.find('.xblacklist_excuse_container').append(excuseTags);
			}
		}

		if ($post.hasClass("xkit-shorten-posts-shortened")) {
			$post.find('.xkit-shorten-posts-embiggen').hide();
			$post.attr('data-xkit-blacklist-old-height', $post.css("height"));
			$post.css('height', 'auto');
		}
	},

	unhide_post: function(e) {
		const $button = $(e.target);
		const $post = $button.parents('.xblacklist_blacklisted_post');
		const $excuse = $button.parents('.xblacklist_excuse_container');

		if ($post.hasClass('xkit-shorten-posts-shortened')) {
			$post.find('.xkit-shorten-posts-embiggen').show();
			$post.css('height', $post.attr('data-xkit-blacklist-old-height'));
		}

		$post.removeClass('xblacklist_blacklisted_post');
		$excuse.remove();
	},

	do_post: function(obj, post_content, tags) {

		// if ($.trim(post_content) === "") { return ""; }
		post_content = post_content.replace(/\n/g, ' ').replace(/\u200B/g, '');
		var p_words = post_content.split(" ");

		var new_array = [];

		for (var i = 0; i < p_words.length; i++) {

			if ($.trim(p_words[i]) !== "") {
				new_array.push(p_words[i].toLowerCase());
			}

		}

		/*var new_tags = [];

		for (var i=0;i<tags.length;i++) {

			if ($.trim(tags[i]) !== "") {
				new_tags.push(tags[i].toLowerCase());
			}

		}*/

		//// console.log(tags);

		// $(obj).css("background","blue"); return;

		if (XKit.extensions.blacklist.check_for_whitelist(new_array, post_content, tags) !== "") {
			// $(obj).css("background","cyan");
			// // console.log("Skipping because of " + XKit.extensions.blacklist.check_for_whitelist(new_array, post_content, tags));
			return "";
		}

		// Return our findings.
		// $(obj).find(".post_info").html("tags: " + tags);

		return XKit.extensions.blacklist.check_for_blacklist(new_array, post_content, tags);


	},

	check_contents: function(to_use, p_words, post_content, tags) {

		for (var i = 0; i < to_use.length; i++) {

			var m_word = to_use[i].toLowerCase();
			if ($.trim(m_word) === "") { continue; }

			// console.log("blacklist -> current word is \"" + m_word + "\"");

			var m_word_wildcard = false;

			if (m_word.substring(m_word.length - 1) === "*") {
				// This word is wildcarded!
				m_word_wildcard = true;
				m_word = m_word.substring(0, m_word.length - 1);
			}

			if (m_word.indexOf(" ") !== -1) {
				m_word_wildcard = true;
			}

			var m_p_words = [];
			var tag_search_mode = false;

			if (m_word.substring(0, 1) === "#") {
				// console.log("blacklist -> checking tags only...");
				if (tags.length === 0) { continue; }
				m_word = m_word.substring(1);
				tag_search_mode = true;
				m_p_words = tags;
			} else {
				// console.log("blacklist -> checking tags + content...");
				m_p_words = p_words;
				m_p_words = m_p_words.concat(tags);
				// console.log(m_p_words);
			}

			var m_post_content = post_content;

			if (tag_search_mode) {
				m_post_content = tags.join(" ");
			} else {
				m_post_content = m_post_content + tags.join(" ");
			}

			if (m_word_wildcard === false) {

				// Well this one is easy:

				// First lets strip the dots or commas.

				if (m_p_words.indexOf(m_word) !== -1) {
					// We've found the word!
					if (tag_search_mode) {
						return "#" + m_word;
					} else {
						return m_word;
					}
				} else {
					if (XKit.extensions.blacklist.preferences.use_improved.value === true) {
						// This will use some CPU...
						if (m_post_content.indexOf(m_word) !== -1) {
							// // console.log('%c  found on m_post_content.', 'background: #a5edae; color: black');
							for (var j = 0; j < m_p_words.length; j++) {
								if (m_p_words[j].indexOf(m_word) !== -1) {
									var mp_word = m_p_words[j].replace(/\./g, '');
									mp_word = mp_word.replace(/,/g, '');
									mp_word = mp_word.replace(/\u2026/g, '');
									mp_word = mp_word.replace(/[.,-/#!$%^&*;:{}=\-_`~()@]/g, "").replace(/\s{2,}/g, " ");
									//// console.log('%c  mp_word = ' + mp_word, 'background: #a5edae; color: black');
									if (m_word === mp_word) {
										if (tag_search_mode) {
											return "#" + m_word;
										} else {
											return m_word;
										}
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
				if (m_post_content.indexOf(m_word) !== -1) {

					// Ugh. Even worse, we've found it,
					// now we need to get into a loop.
					for (var m_i = 0; m_i < m_p_words.length; m_i++) {

						if (m_p_words[m_i] === "") { continue; }
						if (m_p_words[m_i].indexOf(m_word) !== -1) {
							if (tag_search_mode) {
								return "#" + m_word;
							} else {
								return m_word;
							}
						}

						if (m_i < m_p_words.length) {
							var tmp_word = m_p_words[m_i] + " " + m_p_words[m_i + 1];

							// This is a dirty fix but it should work for now.
							if (m_p_words[m_i + 2] !== "" || typeof m_p_words[m_i + 2] !== "undefined") {
								tmp_word = tmp_word + " " + m_p_words[m_i + 2];
							}
							if (m_p_words[m_i + 3] !== "" || typeof m_p_words[m_i + 3] !== "undefined") {
								tmp_word = tmp_word + " " + m_p_words[m_i + 3];
							}
							if (m_p_words[m_i + 4] !== "" || typeof m_p_words[m_i + 4] !== "undefined") {
								tmp_word = tmp_word + " " + m_p_words[m_i + 4];
							}
							if (m_p_words[m_i + 5] !== "" || typeof m_p_words[m_i + 5] !== "undefined") {
								tmp_word = tmp_word + " " + m_p_words[m_i + 5];
							}
							if (m_p_words[m_i + 6] !== "" || typeof m_p_words[m_i + 6] !== "undefined") {
								tmp_word = tmp_word + " " + m_p_words[m_i + 6];
							}

							const unsanitized = tmp_word;

							tmp_word = tmp_word.replace(/,/g, '').replace(/\u2026/g, '');
							tmp_word = tmp_word.replace(/[.,-/#!$%^&*;:{}=\-_`~()]/g, "").replace(/\s{2,}/g, " ");

							// // console.log("--------- " + tmp_word);

							if (tmp_word.includes(m_word) || unsanitized.includes(m_word)) {
								if (tag_search_mode) {
									return "#" + m_word;
								} else {
									return m_word;
								}
							}
						}

					}

				}
			}

		}

		return "";

	},

	check_for_whitelist: function(p_words, post_content, tags) {

		return XKit.extensions.blacklist.check_contents(XKit.extensions.blacklist.whitelisted, p_words, post_content, tags);

	},

	check_for_blacklist: function(p_words, post_content, tags) {

		return XKit.extensions.blacklist.check_contents(XKit.extensions.blacklist.blacklisted, p_words, post_content, tags);

	},

	destroy: function() {
		this.running = false;
		clearTimeout(XKit.extensions.blacklist.check_interval);
		XKit.post_listener.remove("blacklist");
		setTimeout(function() {
			$(".xblacklist-done").each(function() {
				$(this).removeClass("xblacklist_blacklisted_post");
				$(this).find(".xblacklist_excuse_container").remove();
				const postContentSel = XKit.css_map.keyToCss('post') || '.post_content';
				$(this).find(postContentSel).html($(this).find(".xblacklist_old_content").html());
				$(this).find(".xkit-shorten-posts-embiggen").css("display", "block");
				XKit.extensions.blacklist.unhide_post($(this));
			});
			$(".xblacklist-done").removeClass("xblacklist-done");
			$(".xblacklist_hidden_post").removeClass("xblacklist_hidden_post");
			$(".xblacklist_blacklisted_post").removeClass("xblacklist_blacklisted_post");
		}, 500);
		XKit.tools.remove_css("blacklist");
	},

	create_blacklist_div: function(word, on_whitelist) {

		var m_classes = "xkit-blacklisted-word";
		if (on_whitelist === true) {
			m_classes = m_classes + " xkit-whitelisted-word";
		}

		var m_html = "<div class=\"" + m_classes + "\">" + word + "<div data-word=\"" + word + "\" class=\"xkit-blacklisted-word-delete\">&#10006;</div></div>";
		return m_html;

	},

	check_if_exists: function(word) {

		if (XKit.extensions.blacklist.blacklisted.indexOf(word) !== -1 || XKit.extensions.blacklist.whitelisted.indexOf(word) !== -1) {
			return true;
		} else {
			return false;
		}

	},

	save_blacklist: function() {

		XKit.storage.set("blacklist", "words", this.blacklisted.join(","));
		XKit.storage.set("blacklist", "words_whitelisted", this.whitelisted.join(","));

	},

	cpanel: function(m_div) {

		XKit.extensions.blacklist.control_panel_div = m_div;

		if ($("#xkit-blacklist-custom-panel").length > 0) {
			// Panel already exists, probably in refresh mode.
			// Remove it first.
			$("#xkit-blacklist-custom-panel").remove();
		}

		var m_html = "<div id=\"xkit-blacklist-custom-panel\"><div id=\"blacklist-toolbar\"><div id=\"blacklist-add-button\" class=\"xkit-button\">Add new</div><div id=\"blacklist-populate-common\" class=\"xkit-button\">Auto-Populate</div><div id=\"blacklist-tips\" class=\"xkit-button\">Tips</div><div id=\"blacklist-import\" class=\"xkit-button\">Import</div><div id=\"blacklist-export\" class=\"xkit-button\">Export</div><div id=\"blacklist-delete-all\" class=\"xkit-button\">Delete All</div></div>";

		m_html = m_html + "<div id=\"blacklist-word-container\"><div id=\"blacklist-words\"><div class=\"blacklist-words-title\">Blacklisted Words</div>";
		if (XKit.extensions.blacklist.blacklisted.length <= 1) {
			m_html = m_html + "<div class=\"xkit-blacklist-none\"><b>You have no blacklisted words.</b></div>";
		} else {
			for (var i = 0; i < XKit.extensions.blacklist.blacklisted.length; i++) {
				if (XKit.extensions.blacklist.blacklisted[i] !== "") {
					m_html = m_html + XKit.extensions.blacklist.create_blacklist_div(XKit.extensions.blacklist.blacklisted[i]);
				}
			}
		}


		m_html = m_html + "</div><div id=\"whitelist-words\"><div class=\"blacklist-words-title\">Whitelisted Words</div>";

		if (XKit.extensions.blacklist.whitelisted.length <= 1) {
			m_html = m_html + "<div class=\"xkit-blacklist-none\"><b>You have no whitelisted words.</b></div>";
		} else {
			for (var j = 0; j < XKit.extensions.blacklist.whitelisted.length; j++) {
				if (XKit.extensions.blacklist.whitelisted[j] !== "") {
					m_html = m_html + XKit.extensions.blacklist.create_blacklist_div(XKit.extensions.blacklist.whitelisted[j], true);
				}
			}
		}

		m_html = m_html + "</div><div class=\"xkit-blacklist-clear\">&nbsp;</div></div>";

		$(m_div).append(m_html);

		$(".xkit-blacklisted-word-delete").unbind("click");
		$(".xkit-blacklisted-word-delete").click(function() {

			if ($(this).parent().hasClass("xkit-whitelisted-word")) {

				var m_index = XKit.extensions.blacklist.whitelisted.indexOf($(this).attr('data-word'));
				if (m_index === -1) { return; }

				XKit.extensions.blacklist.whitelisted.splice(m_index, 1);
				XKit.extensions.blacklist.save_blacklist();
				XKit.extensions.xkit_preferences.restart_extension("blacklist");

				var m_box = $(this).parent();
				$(this).parent().slideUp('slow', function() {
					$(m_box).remove();
				});

			} else {

				var word_index = XKit.extensions.blacklist.blacklisted.indexOf($(this).attr('data-word'));
				if (word_index === -1) { return; }

				XKit.extensions.blacklist.blacklisted.splice(word_index, 1);
				XKit.extensions.blacklist.save_blacklist();
				XKit.extensions.xkit_preferences.restart_extension("blacklist");

				var parent_box = $(this).parent();
				$(this).parent().slideUp('slow', function() {
					$(parent_box).remove();
				});

			}

		});

		$("#blacklist-tips").click(function() {

			XKit.window.show("A few tips on blacklisting", "<ul class=\"xkit-blacklist-add-margins-to-ul\">" +
				"<li>You can add \"*\" at the end of a word to wildcard it.</li>" +
				"<li>Wildcarded words match words that begin with it: for example, \"cat*\" will find \"category\", \"capital\" etc.</li>" +
				"<li>If you add something that contains 2 or more words, it will be wildcarded automatically</li>" +
				"<li>Adding too much words, especially wildcard ones, will slow your computer down dramatically.</li>" +
				"</ul>", "info", "<div class=\"xkit-button\" id=\"xkit-close-message\">OK</div>");

		});

		$("#blacklist-delete-all").click(function() {

			XKit.window.show("Delete list", "Delete all your blacklisted words?", "question", "<div class=\"xkit-button default\" id=\"xkit-blacklist-delete-all-continue\">Yes, delete my list.</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

			$("#xkit-blacklist-delete-all-continue").click(function() {

				var m_array = [];

				XKit.extensions.blacklist.blacklisted = m_array;
				XKit.extensions.blacklist.whitelisted = m_array;
				XKit.extensions.blacklist.save_blacklist();
				XKit.window.close();
				XKit.extensions.blacklist.cpanel(m_div);
				XKit.extensions.xkit_preferences.restart_extension("blacklist");

			});

		});

		$("#blacklist-populate-common").click(function() {

			XKit.window.show("Populate list", "<b>This will <i>delete</i> your existing list and replace it with some of the most common blocked words.</b><br/><br/>Note that this list might be incomplete, so please check it twice and add the ones you feel missing before using it.", "question", "<div class=\"xkit-button default\" id=\"xkit-blacklist-populate-continue\">Yes, populate my list.</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

			$("#xkit-blacklist-populate-continue").click(function() {

				var m_array = ["tw:*", "nsfw", "trigger*", "porn*", "naked", "cut*", "rape", "sex*", "blood*", "gore*", "nude*", "ass*", "horny*", "xxx", "adult", "amateur", "tit*", "fuck*", "boob*", "cock", "cunt", "pussy*", "anal*", "hardcore"];

				XKit.extensions.blacklist.blacklisted = m_array;
				XKit.extensions.blacklist.save_blacklist();
				XKit.window.close();
				XKit.extensions.blacklist.cpanel(m_div);
				XKit.extensions.xkit_preferences.restart_extension("blacklist");

			});

		});

		$("#blacklist-add-button").click(function() {

			XKit.extensions.blacklist.show_add("", m_div);

		});

		$("#blacklist-import").click(function() {

			XKit.extensions.blacklist.import(m_div);

		});

		$("#blacklist-export").click(function() {

			XKit.extensions.blacklist.export();

		});

		$("#xkit-extensions-panel-right").nanoScroller();
		$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });

	}

});
