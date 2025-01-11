//* TITLE Old Stats **//
//* VERSION 1.0.0 **//
//* DESCRIPTION Blog stats where they were **//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.old_stats = new Object({

	running: false,
	done: false,
	blogs: {},

	preferences: {
		"iconify": {
			text: "Put the icons back on posts/followers/etc links",
			default: true,
			value: true
		},
		"switcher": {
			text: "Show the blog switcher",
			default: true,
			value: true
		}
	},

	run: function() {
		this.running = true;
		if (this.preferences.iconify.value) {
			XKit.tools.init_css("old_stats");
		}
		if (this.preferences.switcher.value) {
			window.addEventListener("message", this.messageListener);
			XKit.tools.add_css(`
				#old_stats_switcher::before {
					content: "\\EA07";
					font-family: tumblr-icons, Blank;
					color: hsla(0,0%,100%,.6);
					cursor: pointer;
					position: absolute;
					top: calc(50% - 0.5em);
					right: calc(10px + 0.5em);
					transition: transform 0.1s;
				}
				#old_stats_switcher.active::before {
					color: unset;
					transform: rotate(180deg);
				}
				.old_stats_blog { cursor: pointer; }`,
			"old_stats_switcher");
		}
		if ($("#dashboard_controls_open_blog").length) {
			if (this.preferences.switcher.value) {
				this.blogScraper();
			}
		} else if ($(".recommended_tumblelogs").length) {
			this.fetchStats();
		}
	},

	fetchStats: function(blog) {

		var page;

		if (blog) {
			page = "blog/" + blog;
		} else {
			page = "likes";
		}

		GM_xmlhttpRequest({
			method: "GET",
			url: "https://www.tumblr.com/" + page,
			onerror: function(response) {
				console.error("[Old Stats] Couldn't fetch blog info.");
			},
			onload: function(response) {
				$("#dashboard_controls_open_blog, #dashboard_controls_open_blog + .small_links").remove();
				$("#right_column").prepend($(".small_links", response.responseText).css("margin", "0 0 18px")).prepend($("#dashboard_controls_open_blog", response.responseText));
				$("#dashboard_controls_open_blog .selected").removeClass("selected");
				$("#dashboard_controls_open_blog [data-sparkline]").prepend('<canvas id="old_stats_canvas" width="72" height="30" style="display: inline-block; width: 36px; height: 15px; vertical-align: top;">');
				try {
					var sparkline = JSON.parse($("#dashboard_controls_open_blog [data-sparkline]").attr("data-sparkline"));
					var sparkmin = Math.min.apply(Math, sparkline);
					var sparkpx = (Math.max.apply(Math, sparkline) - sparkmin) / 30;
					var canvas = document.getElementById("old_stats_canvas").getContext("2d");
					canvas.strokeStyle = "#FFFFFF";
					canvas.lineWidth = 3.5;
					canvas.moveTo(0, 30 - ((sparkline[0] - sparkmin) / sparkpx));
					for (var i = 1; i < sparkline.length; i++) {
						canvas.lineTo(i * (72 / sparkline.length), 30 - ((sparkline[i] - sparkmin) / sparkpx));
						canvas.stroke();
					}
				} catch (e) {} // No activity, no problem.
				if (XKit.extensions.old_stats.preferences.switcher.value) { XKit.extensions.old_stats.blogScraper(); }
				XKit.extensions.old_stats.done = true;
			}
		});

	},

	blogScraper: function() {
		if (Object.keys(this.blogs).length) { this.initSwitcher(); return; }
		XKit.tools.add_function(function() {
			try {
				var models = Tumblr.dashboardControls.allTumblelogs, blogs = {};
				models.filter(function(model) {
					return model.attributes.hasOwnProperty("is_current");
				}).forEach(function(model) {
					blogs[model.attributes.name] = model.attributes.directory_safe_title;
				});
				window.postMessage({
					xkit_blogs_with_names: blogs
				}, window.location.protocol + "//" + window.location.host);
			} catch (e) { console.error(e.message); }
		}, true);
	},

	messageListener: function(e) {
		if (e.origin == window.location.protocol + "//" + window.location.host && e.data.hasOwnProperty("xkit_blogs_with_names")) {
			window.removeEventListener("message", this.messageListener);
			XKit.extensions.old_stats.blogs = e.data.xkit_blogs_with_names;
			XKit.extensions.old_stats.initSwitcher();
		}
	},

	initSwitcher: function() {
		var blogs = this.blogs;
		if (!Object.keys(blogs).length) { return; }

		$(".no_push.selected_blog").append('<span id="old_stats_switcher"></span>');

		var loading = false;
		$("#old_stats_switcher").click(function() {
			if (document.selection) {
				document.selection.empty();
			} else if (window.getSelection) {
				window.getSelection().removeAllRanges();
			}
			if ($(this).hasClass("active")) {
				$(".old_stats_blog").off("click").remove();
				if (!loading) {
					$("#dashboard_controls_open_blog").children().removeAttr("style");
					$("#dashboard_controls_open_blog + .small_links").removeAttr("style").css("margin", "0 0 18px");
				} else {
					$("#dashboard_controls_open_blog").append(
						'<li class="controls_section_item selected_blog">' +
							'<a class="control-item control-anchor">' +
								'<div class="hide_overflow">Loading...</div>' +
							'</a>' +
						'</li>');
				}
				loading = false;
			} else {
				$("#dashboard_controls_open_blog").children(":not(.selected_blog)").css("display", "none");
				$("#dashboard_controls_open_blog + .small_links").css("display", "none");
				var current_blog = $(".no_push.selected_blog .currently_selected_blog").html(), do_append = false;

				for (var x in blogs) {
					if (x == current_blog) { do_append = true; continue; }
					var blog_html =
						'<li class="no_push old_stats_blog">' +
							'<div class="open_blog with_subtitle">' +
								'<a class="currently_selected_blog hide_overflow blog_title">' + x + '</a>' +
								'<small>' +
									'<div class="hide_overflow">' +
										'<span class="open_blog_link" href="https://' + x + '.tumblr.com/" data-peepr="{&quot;tumblelog&quot;:&quot;' + x + '&quot;}">' + blogs[x] + '</span>' +
									'</div>' +
								'</small>' +
							'</div>' +
						'</li>';
					if (do_append) {
						$(".no_push.selected_blog, .no_push.old_stats_blog").last().after(blog_html);
					} else {
						$(".no_push.selected_blog, .no_push.old_stats_blog").last().before(blog_html);
					}
				}

				$(".no_push.selected_blog, .no_push.old_stats_blog").last().css("margin", "0 0 18px");

				$(".old_stats_blog").click(function() {
					// $(".no_push.selected_blog .open_blog.with_subtitle")[0].outerHTML = this.firstChild.outerHTML.replace("span", "a");
					loading = true;
					$("#old_stats_switcher").click();
					XKit.extensions.old_stats.fetchStats($(this).find(".currently_selected_blog").html());
				});
			}
			$(this).toggleClass("active");
		});
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("old_stats");
		if (this.done) {
			$("#dashboard_controls_open_blog, #dashboard_controls_open_blog + .small_links").remove();
		}
	}
});
