//* TITLE Reblog Display Options **//
//* VERSION 2.0.0 **//
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
		},
		"decrease_padding": {
			text: "Decrease left padding so large reblog chains are somewhat readable",
			default: false,
			value: false,
			style: "nested",
		},
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

		if (!XKit.interface.is_tumblr_page()) {
			return;
		}
		if (XKit.page.react) {
			XKit.css_map.getCssMap()
			.then(() => {
				this.reblog_av_wrappers_class = XKit.css_map.keyToCss("avatarWrapper");
				this.reblog_urls_class = XKit.css_map.keyToCss("attributionWithAvatar");
				this.reblog_url_wrappers_class = XKit.css_map.keyToCss("label");
				this.url_links_class = XKit.css_map.keyToCss("blogLink");
				this.reblogs_class = XKit.css_map.keyToCss("reblog");
				this.reblog_headers_class = XKit.css_map.keyToCss("reblogHeader");
				this.ask_blobs_class = XKit.css_map.keyToCss("ask");
				this.row_class = XKit.css_map.keyToCss("row");
				this.rows_class = XKit.css_map.keyToCss("rows");
				this.text_blocks_class = XKit.css_map.keyToCss("textBlock");
				this.img_block_buttons_class = XKit.css_map.keyToCss("imageBlockButton");
				this.video_blocks_class = XKit.css_map.keyToCss("videoBlock");
				this.audio_blocks_class = XKit.css_map.keyToCss("audioBlock");
				if (this.preferences.type.value === "nested") {
					this.run_nested();
				} else {
					this.run_flat();
				}
			});
		}


	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("better_reblogs");
		XKit.tools.remove_css("colorquotes_padding");
		XKit.post_listener.remove("better_reblogs");
		$(".xkit-better-reblogs-old").remove();
		$(".xkit-better-reblogs-title").remove();
		$(".xkit-better-reblogs-done").removeClass("xkit-better-reblogs-done");
		$(".xkit-color-quoted").removeClass("xkit-color-quoted");
		$(".xkit-colorquotes-border-item").css("background", "").css("border-left-color", "");
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

		const reblogTop = XKit.extensions.better_reblogs.reblogs_class;
		const reblogHeader = XKit.extensions.better_reblogs.reblog_headers_class;
		const reblogAvWrap = XKit.extensions.better_reblogs.reblog_av_wrappers_class;
		const reblogUrlWrap = XKit.extensions.better_reblogs.reblog_url_wrappers_class;
		const reblogUrl = XKit.extensions.better_reblogs.reblog_urls_class;
		const rows = XKit.extensions.better_reblogs.rows_class;
		const txtBlk = XKit.extensions.better_reblogs.text_blocks_class;
		var list_sel = reblogTop + ">div:nth-of-type(2)";
		if (this.preferences.remove_last_user.value) {
			XKit.tools.add_css("div[data-is-contributed-content]>" + reblogHeader + " {display: none;}", "better_reblogs");
			list_sel = reblogTop + ":not([data-is-contributed-content])>div:nth-of-type(2)";
		}

		if (this.preferences.margin.value) {
			var margin = "35px";
			if (this.preferences.remove_user_names.value) {
				margin = "52px";
			}
			XKit.tools.add_css(list_sel + " {margin-left: " + margin + "; margin-right: 20.5px;} " +
			list_sel + " " + rows + " " + txtBlk + " {margin-top: unset; margin-left: unset; padding-left: unset;}", "better_reblogs");
		}

		if (this.preferences.remove_icon.value) {
			XKit.tools.add_css(reblogHeader + " :where(" + reblogAvWrap + ") svg {display: none;} ", "better_reblogs");
		}

		if (this.preferences.remove_avatars.value) {
			XKit.tools.add_css(reblogHeader + " " + reblogAvWrap + " {display: none!important;} " +
			reblogHeader + " {padding-left: 5px; margin-bottom: 5px;}", "better_reblogs");
		}

		if (this.preferences.add_border.value) {
			XKit.tools.add_css(list_sel + " {border-left: 4px solid #E7E7E7; padding-left: 10px; margin-left: 15px;} " +
			list_sel + " button>span>figure {padding: 5px 0; padding-right: 10px; width: auto;}" +
			list_sel + " " + rows + " " + txtBlk + " {margin-top: unset; margin-left: unset; padding-left: unset;}", "better_reblogs");

			if (this.preferences.margin.value) {
				var padding = "20.5px";
				if (this.preferences.remove_user_names.value) {
					padding = "17.5px";
				}
				XKit.tools.add_css(list_sel + " {margin-left: 30.5px; padding-left: " + padding + ";} " +
				list_sel + " button>span>figure {padding-right: " + padding + ";} ", "better_reblogs");
			}
		}

		if (this.preferences.remove_user_names.value) {
			XKit.tools.add_css(reblogUrlWrap + " {display: none;} .reblog-list-item .reblog-header {margin-bottom: 0;} " +
			list_sel + ".reblog-content {margin-left: 35px;} .reblog-title {margin-left: 35px; margin-top: -10px;}", "better_reblogs");
		}

		if (this.preferences.alternating_reblogs.value) {
			XKit.tools.add_css(
				list_sel + ":nth-child(odd){background-color: rgb(245,245,245); padding-bottom: 15px;}" +
				list_sel + ":nth-child(even){background-color: rgb(250,250,250);}" +
				list_sel + ":first-child {background-color: #fff !important; padding-bottom: 15px;}" +
				reblogTop + "[data-is-contributed-content] {background-color: #F0F5FA !important;" +
				"padding-bottom:15px !important; border-top: 1px solid #D9E2EA;}",
			"better_reblogs");
		}

		if (this.preferences.slim_new_reblog.value) {
			XKit.tools.add_css(list_sel + " {padding-top: 0; padding-bottom: 0; margin-left: 15.5px; margin-right: 0; min-height: 41px;}" +
				reblogHeader + ", " + list_sel + " " + rows + " " + txtBlk + ", " + list_sel + " button>span>figure {padding-right: 10px !important;}" +
				reblogTop + ", " + reblogHeader + " {padding: 5px; margin: 0;} " + reblogTop + " {padding-right: 0;}",
                	"better_reblogs");

			if (this.preferences.margin.value) {
				XKit.tools.add_css(reblogHeader + ", " + list_sel + " " + rows + " " + txtBlk + ", " + list_sel + " button>span>figure {padding-right: 17.5px !important;}", "better_reblogs");
			}

			if (this.preferences.remove_avatars.value) {
				XKit.tools.add_css(reblogUrl + ", " + list_sel + " {margin-left: 5px;}", "better_reblogs");
			}

			if (!this.preferences.add_border.value) {
				XKit.tools.add_css(reblogTop + ", " + list_sel + " {padding-left: 0; margin-left: 0;}" +
				list_sel + " " + rows + " " + txtBlk + " {margin-top: unset; margin-left: unset; padding-left: 10px;}", "better_reblogs");
			}
		}

		if (this.preferences.reorder_reblog_title.value) {
			XKit.tools.add_css(".reblog-list-item .reblog-title {margin-left:0!important;}",
                "better_reblogs");
		}

		XKit.extensions.better_reblogs.do_flat();
		XKit.post_listener.add("better_reblogs", XKit.extensions.better_reblogs.do_flat);

	},

	run_nested: function() {

			const reblogTop = XKit.extensions.better_reblogs.reblogs_class;
			const reblogHeader = XKit.extensions.better_reblogs.reblog_headers_class;
			const reblogAvWrap = XKit.extensions.better_reblogs.reblog_av_wrappers_class;
			const reblogUrl = XKit.extensions.better_reblogs.reblog_urls_class;
			const reblogUrlWrap = XKit.extensions.better_reblogs.reblog_url_wrappers_class;
			const UrlLink = XKit.extensions.better_reblogs.url_links_class;
			const row = XKit.extensions.better_reblogs.row_class;
			const imgBlkBtn = XKit.extensions.better_reblogs.img_block_buttons_class;
			const list_sel = reblogTop + ":not([data-is-contributed-content])>div:nth-of-type(2)";

			XKit.tools.add_css(`
				${reblogTop} {
					margin-left: 5px;
					margin-top: unset;
					padding-top: unset;
					border-top: unset;
				}
				article > ${reblogTop} {
					padding-top: 10px;
					padding-left: 20px;
					border-top: 1px solid var(--gray-13);
				}
				${reblogTop}[data-is-contributed-content]>div>div>div>p {
					margin-left: -17px;
				}
				${reblogHeader} ${reblogAvWrap}, ${reblogHeader} button, ${reblogTop}[data-is-contributed-content]>${reblogHeader} {
					display: none!important;
				}
				${reblogHeader} {
					padding-left: 0px;
					margin-bottom: 5px;
					display: block;
				}
				${list_sel} {
					border-left: 4px solid #E7E7E7;
					padding-left: 10px;
					margin-left: 0px;
				}
				${list_sel} figure {
					padding: 5px 0;
					padding-right: 10px;
					width: auto;
				}
				${list_sel}>div:not(${reblogTop})>div {
					margin-top: unset;
					margin-left: unset;
					padding-left: unset;
				}
				${reblogHeader} ${reblogUrl}, ${reblogHeader} ${reblogUrlWrap}>div {
					opacity: 0.85;
					text-decoration: underline dotted;
					font-size: 15px;
					font-weight: normal;
					margin-left: unset;
				}
				${reblogHeader} ${reblogUrl}::after {
					content: ':';
				}
				${reblogHeader} ${reblogUrlWrap} {
					display: inline-block;
				}
				${reblogHeader} ${reblogUrlWrap}>div {
					display: unset;
				}
				${reblogHeader} ${UrlLink} {
					color: rgb(68, 68, 68) !important;
				}
				.xtimestamp-reblog {
					margin-left: 10px!important;
					padding-left: 10px!important;
					display: inline-block;
					vertical-align: text-bottom;
				}
				${row} {
					display: flex;
					width: 100%;
				}
				${row}+${row} {
					margin-top: 4px;
				}
				${row}>${imgBlkBtn} {
					margin-top: 0;
				}
				${imgBlkBtn}+${imgBlkBtn} {
					margin-left: 4px;
				}
			`, "better_reblogs");
		XKit.extensions.better_reblogs.do_nested();
		XKit.post_listener.add("better_reblogs", XKit.extensions.better_reblogs.do_nested);
		if (this.preferences.color_quotes.value) {
			this.run_cq();
		}
		if (this.preferences.decrease_padding.value === true) {
			XKit.tools.add_css(".xkit-better-reblogs-old blockquote.reblog-quote { padding-left: 8px; margin-top: 6px; } .xkit-better-reblogs-old p.reblog-user { margin-bottom: 6px; }", 'better_reblogs');
		}
	},

	run_cq: function() {
		XKit.extensions.better_reblogs.do_cq();
		XKit.post_listener.add("better_reblogs", XKit.extensions.better_reblogs.do_cq);
	},

	do_flat: function() {

		var posts = $('[data-id]:not(.xkit-better-reblogs-done)');

		$(posts).each(function() {
			var $this = $(this);
			if ($this.is("[data-js-container-inner]") || $this.hasClass("control-reblog-trail")) {
				return;
			}
			$this.addClass("xkit-better-reblogs-done");

		});
	},

	do_nested: function() {

		var posts = $('[data-id]:not(.xkit-better-reblogs-done)');

		$(posts).each(function() {
			var $this = $(this);
			const reblogTop = XKit.extensions.better_reblogs.reblogs_class;
			const askBlob = XKit.extensions.better_reblogs.ask_blobs_class;
			const row = XKit.extensions.better_reblogs.row_class;
			const txtBlk = XKit.extensions.better_reblogs.text_blocks_class;
			const vidBlk = XKit.extensions.better_reblogs.video_blocks_class;
			const audBlk = XKit.extensions.better_reblogs.audio_blocks_class;

			$this.addClass("xkit-better-reblogs-done");

			var reblog_tree = $this.find(`${reblogTop}`);
			var plop;
			var next;
			$($(reblog_tree)[0]).addClass('xkit-better-reblogs-op');

			for (j = 0; j+1 < $(reblog_tree).get().length; j++) {
				plop = $(reblog_tree)[j];
				next = $(reblog_tree)[j+1];
				next.lastChild.insertBefore(plop, next.lastChild.firstChild);
			}

			plop = $this.find($(askBlob));
			next = $this.find($(`article>${reblogTop}`));

			if ($(plop).get().length >= 1) {
				$(next).before($(plop));
			} else {
				plop = $this.find($('.xkit-better-reblogs-op ' + row.split(', ')[2]));
				plop = $(plop).not(`${txtBlk} ~ ` + row.split(', ')[2]);
				if ($(plop).get().length >= 1) {
					$(next).before($(plop));
				} else {
					plop = $this.find($(`.xkit-better-reblogs-op ${vidBlk}, .xkit-better-reblogs-op ${audBlk}`));
					plop = $(plop).not(`${txtBlk} ~ ${vidBlk}, ${txtBlk} ~ ${audBlk}`);
					if ($(plop).get().length >= 1) {
						$(next).before($(plop));
					}
				}
			}
		});
	},

	do_cq: function() {

		const reblogTop = XKit.extensions.better_reblogs.reblogs_class;
		const list_sel = reblogTop + ":not([data-is-contributed-content])>div:nth-of-type(2)";
		var posts = $('[data-id]:not(.xkit-color-quoted)');

		var colors = XKit.extensions.better_reblogs
			.colors[XKit.extensions.better_reblogs.preferences.cq_theme.value];

		$(posts).each(function() {

			$(this).addClass("xkit-color-quoted");

			var count = 0;

			if (XKit.extensions.better_reblogs.preferences.dont_fade_if_less_than_two.value === true) {
				if ($(this).find($(list_sel)).length === 1) { return; }
			}

			$(this).find($(list_sel)).each(function() {

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

