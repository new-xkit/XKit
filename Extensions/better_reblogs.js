//* TITLE Reblog Display Options **//
//* VERSION 1.3.2 **//
//* DESCRIPTION Adds different styles to the new reblog layout, including the "classic" nested look. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.better_reblogs = new Object({

	running: false,

	preferences: {
		'sep0': {
			text: 'Reblog Style',
			type: 'separator'
		},
		"type": {
			text: "Which reblog style to use?",
			type: "combo",
			values: ["flat", "flat",
				"nested", "nested"],
			value: "flat",
			default: "flat",
		},
		'sep1': {
			text: 'Style Options',
			type: 'separator'
		},
		"remove_icon": {
			text: 'Remove the green "reblogged" icon from avatars',
			default: true,
			value: true,
			style: "flat"
		},
		"margin": {
			text: "Move reblog content to the right (under the username, not avatar)",
			default: true,
			value: true,
			style: "flat",
		},
		"add_border": {
			text: "Add border to the left",
			default: false,
			value: false,
			style: "flat",
		},
		"remove_last_user": {
			text: "Remove the username/avatar from the last post if its new (not reblogged)",
			default: false,
			value: false,
			style: "flat"
		},
		"reorder_reblog_title": {
			text: "Put post titles above posts",
			default: false,
			value: false,
			style: "flat",
		},
		"remove_user_names": {
			text: "Hide usernames and put posts next to avatars. (mouse over avatars for blog info)",
			default: false,
			value: false,
			style: "flat",
		},
		"slim_new_reblog": {
			text: "Slim the new reblog spacing",
			default: false,
			value: false,
			style: "flat",
		},
		"remove_avatars": {
			text: "Remove avatars",
			default: false,
			value: false,
			style: "flat",
		},
		"alternating_reblogs": {
			text: "Lightly highlight reblogs in alternating gray and new comments in blue",
			default: false,
			value: false,
			style: "flat"
		},
		"color_quotes": {
			text: "Enable Color Quotes",
			default: false,
			value: false,
			style: "nested",
		},
		"dont_fade_if_less_than_two": {
			text: "Don't color the block quotes if there is only one",
			default: true,
			value: true,
			style: "nested",
		},
		"cq_theme": {
			text: "Color Theme",
			default: "rainbow",
			value: "rainbow",
			type: "combo",
			values: [
				"Default Rainbow", "rainbow",
				"Reverse Rainbow", "revrainbow",
				"Pastel Rainbow", "pastel",
				"Tumblr Blue", "blue",
				"Grayscale", "grayscale",
				"Pink and Red", "pink",
				"Red and Gray", "rag",
			],
			style: "nested",
		},
		"do_backgrounds": {
			text: "Use a faded color on block quote backgrounds too",
			default: false,
			value: false,
			style: "nested",
		},
		"increase_padding": {
			text: "Increase padding for easier reading",
			default: false,
			value: false,
			style: "nested",
		}
	},

	colors: {
		rainbow: ["ff1900", "ff9000", "ffd000", "6adc13", "00cd8b", "00a5e7", "001999", "cc00b9", "ff78e1"],
		revrainbow: ["ff78e1", "cc00b9", "001999", "00a5e7", "00cd8b", "6adc13", "ffd000", "ff9000", "ff1900"],
		pastel: ["e45c5c", "ffcc66", "d7e972", "76e2c2", "5dc6cd", "be7ce4", "e45c5c", "ffcc66", "d7e972"],
		blue: ["36536e", "536c83", "6a8094", "798c9f", "36536e", "536c83", "6a8094", "798c9f", "36536e"],
		grayscale: ["b2b2b2", "969696", "6b6b6b", "3d3d3d", "d3d0d0", "b2b2b2", "969696", "6b6b6b", "3d3d3d"],
		pink: ["c53b3c", "f09dd8", "c53b3c", "f09dd8", "c53b3c", "f09dd8", "c53b3c", "f09dd8"],
		rag: ["e24545", "acacac", "e24545", "acacac", "e24545", "acacac", "e24545", "acacac"]
	},

	run: function() {
		this.running = true;

		if (this.preferences.type.value === "nested") {
			this.run_nested();
		} else {
			this.run_flat();
		}

	},

	frame_run: function() {
		if (XKit.page.peepr) {
			XKit.extensions.better_reblogs.run();
		}
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("better_reblogs");
		XKit.post_listener.remove("better_reblogs");
		$(".xkit-better-reblogs-old").remove();
		$(".xkit-better-reblogs-title").remove();
		$(".xkit-better-reblogs-done").removeClass("xkit-better-reblogs-done");
		this.destroy_cq();
	},

	cpanel: function(cp) {
		var update = function(type) {
			for (var i in XKit.extensions.better_reblogs.preferences) {
				var j = XKit.extensions.better_reblogs.preferences[i];
				if (j.style) {
					if (j.style === type) {
						cp.find('[data-setting-id="' + i + '"]').show();
					} else {
						cp.find('[data-setting-id="' + i + '"]').hide();
					}
				}
			}
		};
		var old_val;
		cp.find("select[data-setting-id=type]").focus(function() {
			old_val = $(this).val();
		}).change(function() {
			var $el = $(this);
			$el.blur();
			XKit.window.show("Warning", "Changing the reblog style requires refreshing the page. " +
                "<br>Are you sure you wish to continue?",
                "warning",
                '<div id="xkit-confirm-refresh" class="xkit-button default">Refresh</div>' +
                '<div id="xkit-close-message" class="xkit-button">Cancel</div>');
			$("#xkit-confirm-refresh").click(function() {
				window.location = window.location;
			});
			$("#xkit-close-message").click(function() {
				$el.val(old_val);
			});
		});
		update(cp.find("select[data-setting-id=type]").val());
	},

	run_flat: function() {

		var list_sel = "";
		if (this.preferences.remove_last_user.value) {
			XKit.tools.add_css(".reblog-list-item.contributed-content .reblog-header {display: none;}", "better_reblogs");
			list_sel = ".reblog-list ";
		}

		if (this.preferences.margin.value) {
			XKit.tools.add_css(list_sel + ".reblog-list-item .reblog-content {margin-left:35px;} " +
                list_sel + ".reblog-list-item .reblog-title {margin-left:35px;}", "better_reblogs");
		}

		if (this.preferences.remove_icon.value) {
			XKit.tools.add_css(".reblog-header .sub-icon-reblog:before {display: none!important;} " +
                ".reblog-header .sub-icon-reblog:after {display:none!important;}", "better_reblogs");

		}

		if (this.preferences.add_border.value) {
			XKit.tools.add_css(list_sel + ".reblog-list-item .reblog-content {border-left: 2px solid #E7E7E7; padding-left: 10px;} " +
                ".post.post_full " + list_sel + ".reblog-list-item .tmblr-full > img {padding: 0 20px}", "better_reblogs");

			if (!(this.preferences.margin.value || this.preferences.remove_user_names.value)) {
				XKit.tools.add_css(".reblog-list-item .reblog-content {margin-left: 3px;}", "better_reblogs");
			}

			if (this.preferences.remove_last_user.value) {
				XKit.tools.add_css(list_sel + ".contributed-content .reblog-content {border-left: unset !important; padding-left: unset !important;}", "better_reblogs");

				if (!(this.preferences.margin.value || this.preferences.remove_user_names.value)) {
					XKit.tools.add_css(list_sel + ".contributed-content .reblog-content {margin-left: -10px;}", "better_reblogs");
				}

			}

		}

		if (this.preferences.remove_user_names.value) {
			XKit.tools.add_css(".reblog-tumblelog-name {display:none;} .reblog-list-item .reblog-header {margin-bottom: 0;} " +
                list_sel + ".reblog-content {margin-left:35px;} .reblog-title {margin-left:35px; margin-top:-10px;}", "better_reblogs");
		}

		if (this.preferences.remove_avatars.value) {
			XKit.tools.add_css(".reblog-avatar {display:none !important;} .reblog-header {padding-left: 0px !important;}",
                "better_reblogs");
		}

		if (this.preferences.alternating_reblogs.value) {
			XKit.tools.add_css(
                ".reblog-list-item:nth-child(odd){background-color: rgb(245,245,245); padding-bottom: 15px;}" +
                ".reblog-list-item:nth-child(even){background-color: rgb(250,250,250);}" +
                ".original-reblog-content {background-color: #fff !important; padding-bottom: 15px;}" +
                ".contributed-content {background-color: #F0F5FA !important;" +
                    "padding-bottom:15px !important; border-top: 1px solid #D9E2EA;}",
                "better_reblogs");
		}

		if (this.preferences.slim_new_reblog.value) {
			XKit.tools.add_css(".reblog-list-item {padding: 10px 20px 5px !important; min-height: 41px;}",
                "better_reblogs");
		}

		if (this.preferences.reorder_reblog_title.value) {
			XKit.tools.add_css(".reblog-list-item .reblog-title {margin-left:0!important;}",
                "better_reblogs");
		}

		XKit.extensions.better_reblogs.do_flat();
		XKit.post_listener.add("better_reblogs", XKit.extensions.better_reblogs.do_flat);

	},

	run_nested: function() {
		XKit.tools.add_css('.posts .reblog-list {display: none!important} ' +
                '.posts .reblog-title {display: none!important} ' +
                '.posts .reblog-list-item.contributed-content ' +
                    '{display: none!important;} ' +
                '.posts .post_full.post .post_content_inner .post_media ' +
                '~ .xkit-better-reblogs-old {margin-top: 13px;} ' +
                '.xkit-better-reblogs-old p.reblog-user {margin-bottom: 10px} ' +
                '.xkit-better-reblogs-old blockquote.reblog-quote {margin-top: 10px}',
            'better_reblogs');
		XKit.extensions.better_reblogs.do_nested();
		XKit.post_listener.add("better_reblogs", XKit.extensions.better_reblogs.do_nested);
		if (this.preferences.color_quotes.value) {
			this.run_cq();
		}
	},

	run_cq: function() {
		if (this.preferences.increase_padding.value === true) {
			XKit.tools.add_css("#posts .post_content blockquote " +
                "{ padding-top: 8px; padding-bottom: 8px; }", "colorquotes_padding");
		}

		if ($("#posts").length > 0) {
			XKit.post_listener.add("br-colorquotes", this.do_cq);
			this.do_cq();
		}
	},

	do_flat: function() {
		var posts = XKit.interface.get_posts("xkit-better-reblogs-done");

		$(posts).each(function() {
			var $this = $(this);
			if ($this.is("[data-js-container-inner]") || $this.hasClass("control-reblog-trail")) {
				return;
			}
			$this.addClass("xkit-better-reblogs-done");

            // trick tumblr into displaying the little blog info popovers for the reblog avatars
			$this.find(".reblog-avatar").addClass("post_sub_avatar");

			if (XKit.extensions.better_reblogs.preferences.reorder_reblog_title.value) {
				var title = $this.find(".reblog-title");
				if (!title.length) {
					return;
				}
				var parent = title.parent();
				if (!parent.find(".reblog-content").length) {
					return;
				}
				title.remove();
				parent.prepend(title);
			}
		});
	},

	do_nested: function() {
		var posts = XKit.interface.get_posts("xkit-better-reblogs-done");

		$(posts).each(function() {
			var $this = $(this);
			if ($this.is("[data-js-container-inner]") || $this.hasClass("control-reblog-trail")) {
				return;
			}
			$this.addClass("xkit-better-reblogs-done");

			var reblog_tree = $this.find(".reblog-list");
			var title = reblog_tree.find('.reblog-title').clone();

			if (!reblog_tree.length) {
				var content = $this.find(".reblog-list-item.contributed-content .reblog-content").clone();
				title = $this.find(".reblog-list-item.contributed-content .reblog-title").clone();
				if (content.length) {
					content.addClass("post_body");
					$this.find(".reblog-list-item.contributed-content").before(title);
					title.removeClass("reblog-title");
					title.addClass("post_title xkit-better-reblogs-title");
					$this.find(".reblog-list-item.contributed-content").before(content);
				}
				return;
			}

			reblog_tree.after('<div class="xkit-better-reblogs-old post_body"></div>');
			reblog_tree.after(title);
			title.removeClass("reblog-title");
			title.addClass("post_title xkit-better-reblogs-title");

			var all_quotes = [];
			reblog_tree.find(".reblog-list-item:not(.contributed-content)").each(function() {
				var $item = $(this);
				var reblog_content = $item.find('.reblog-content');
				var author = $item.find('.reblog-tumblelog-name');
				var reblog_data = {
					reblog_content: reblog_content.html() || '',
					reblog_author: author.contents()[0].data || '',
					reblog_url: author.attr('href') || ''
				};
				all_quotes.push(reblog_data);
			});

			var all_quotes_text = "";
			all_quotes.forEach(function(data, index, all) {
				var reblog_content = data.reblog_content;
				all_quotes_text =
                    '<p class="reblog-user">' + "<a class='tumblr_blog' href='" + data.reblog_url + "'>" +
                        data.reblog_author + "</a>:</p>" +
                    '<blockquote class="reblog-quote">' + all_quotes_text + reblog_content + "</blockquote>";
			});

			$this.find(".xkit-better-reblogs-old").append(all_quotes_text);
			var post_c = $this.find(".reblog-list-item.contributed-content .reblog-content").clone();
			$this.find(".xkit-better-reblogs-old").append(post_c);
		});
	},

	do_cq: function() {

		var posts = XKit.interface.get_posts("xkit-color-quoted");

		var colors = XKit.extensions.better_reblogs
            .colors[XKit.extensions.better_reblogs.preferences.cq_theme.value];

		$(posts).each(function() {

			$(this).addClass("xkit-color-quoted");

			var count = 0;

			if (XKit.extensions.better_reblogs.preferences.dont_fade_if_less_than_two.value === true) {
				if ($(this).find("blockquote").length === 1) { return; }
			}

			$(this).find("blockquote").each(function() {

				if (count >= colors.length) { count = 0; }

				var m_color = XKit.extensions.better_reblogs.hex_to_rgb(colors[count]);

				$(this).css("border-left-color", "#" + colors[count]);
				$(this).attr('xkit-border-color', JSON.stringify(m_color));
				$(this).addClass("xkit-colorquotes-border-item");

				if (XKit.extensions.better_reblogs.preferences.do_backgrounds.value === true) {
					$(this).css("background", "rgba(" + m_color.r + "," + m_color.g + "," + m_color.b + ",0.1)");
				}

				count++;

			});


		});

	},

	destroy_cq: function() {
		XKit.post_listener.remove("br-colorquotes");
		$(".xkit-color-quoted").removeClass("xkit-color-quoted");
		XKit.tools.remove_css("colorquotes_padding");
		$(".xkit-colorquotes-border-item").css("background", "").css("border-left-color", "");
	},

	hex_to_rgb: function(hex) {
        // From: http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
        /* eslint-disable id-length */

		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
		return result ? {
			r: parseInt(result[1], 16),
			g: parseInt(result[2], 16),
			b: parseInt(result[3], 16)
		} : null;

		/* eslint-enable id-length */
	},

});
