//* TITLE Servant **//
//* VERSION 0.5.10 **//
//* DESCRIPTION XKit Personal Assistant **//
//* DETAILS Automator for XKit: lets you create little Servants that does tasks for you when the conditions you've set are met. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* SLOW true **//
//* BETA false **//

XKit.extensions.servant = new Object({

	running: false,
	slow: true,

	servants: [],

	preferences: {
		"sep2": {
			text: "My Servants",
			type: "separator"
		}
	},

	causes: {

		sep_1: {

			text: "Posts on Dashboard",
			type: "separator"

		},

		contains: {

			text: "Post Contains",
			type: "text",
			compatibility: "post",
			placeholder: "ie: 'Mitt Romney'",
			returns: "the word found",
			runs_on: "post",
			description: "Runs if a post containing the word you've entered is found, affects that post.",

			run: function(parameter, obj) {

				var m_object = {};

				var m_text = $(obj).find(".post_content").text();

				if ($(obj).find(".post_title").length > 0) {
					m_text = m_text + " " + $(obj).find(".post_title").text();
				}

				m_text = m_text.toLowerCase();
				parameter = parameter.toLowerCase();

				if (m_text.indexOf(parameter) !== -1) {

					m_object.run = true;

				} else {

					m_object.run = false;

				}

				m_object.return = parameter;
				m_object.pass = $(obj);
				return m_object;

			},

		},

		contains_not: {

			text: "Post Doesn't Contain",
			type: "text",
			compatibility: "post",
			placeholder: "ie: 'Mitt Romney'",
			returns: "the word not found",
			runs_on: "post",
			description: "Runs if a post containing the word you've entered is not found, affects that post.",

			run: function(parameter, obj) {

				var m_object = {};

				var m_text = $(obj).find(".post_body").text();

				if ($(obj).find(".post_title").length > 0) {
					m_text = m_text + " " + $(obj).find(".post_title").text();
				}

				m_text = m_text.toLowerCase();
				parameter = parameter.toLowerCase();

				if (m_text.indexOf(parameter) == -1) {

					m_object.run = true;

				} else {

					m_object.run = false;

				}

				m_object.return = parameter;
				m_object.pass = $(obj);
				return m_object;

			},

		},

		made_by: {

			text: "Post is from",
			type: "text",
			compatibility: "post",
			runs_on: "post",
			returns: "the owner's URL",
			placeholder: "ie: 'xkit-extension'",
			description: "Runs if a post is created/reblogged from the URL you've entered is found, affects that post.",

			run: function(parameter, obj) {

				var m_object = {};

				m_object.run = false;

				if ($(obj).attr('data-tumblelog-name') === parameter) {
					m_object.run = true;
				}

				m_object.return = parameter;
				m_object.pass = $(obj);
				return m_object;

			},

		},

		sourced: {

			text: "Post is sourced from",
			type: "text",
			compatibility: "post",
			runs_on: "post",
			returns: "the source URL",
			placeholder: "ie: 'xkit-extension'",
			description: "Runs if a post is sourced to the URL you've entered is found, affects that post.",

			run: function(parameter, obj) {

				var m_object = {};

				m_object.run = false;

				if ($(obj).find(".post_source_link").length > 0) {

					if ($(obj).find(".post_source_link").attr('title') === parameter) {
						m_object.run = true;
					}

				}

				m_object.return = parameter;
				m_object.pass = $(obj);
				return m_object;

			},

		},

		is_original: {

			text: "Post is original",
			type: "",
			compatibility: "post",
			runs_on: "post",
			description: "Runs if the post is original, not reblogged.",

			run: function(parameter, obj) {

				var m_object = {};

				var m_post = XKit.interface.post($(obj));
				m_object.run = false;

				if (typeof m_post === "undefined") {
					m_object.run = false;
				} else {
					if (m_post.is_reblogged === false) {
						m_object.run = true;
					}
				}

				m_object.pass = $(obj);
				return m_object;

			},

		},

		is_reblogged: {

			text: "Post is reblogged",
			type: "",
			compatibility: "post",
			runs_on: "post",
			description: "Runs if the post is not original, but reblogged.",

			run: function(parameter, obj) {

				var m_object = {};

				var m_post = XKit.interface.post($(obj));
				m_object.run = false;

				if (typeof m_post === "undefined") {
					m_object.run = false;
				} else {
					if (m_post.is_reblogged === true) {
						m_object.run = true;
					}
				}

				m_object.pass = $(obj);
				return m_object;

			},

		},

		post_type: {

			text: "Post type is",
			type: "post_type",
			compatibility: "post",
			runs_on: "post",
			returns: "the post type",
			description: "Runs if a post is of the type you've selected",

			run: function(parameter, obj) {

				var m_object = {};

				var search_for = parameter;

				if (search_for === "text") { search_for = "regular"; }
				if (search_for === "chat") { search_for = "conversation"; }

				var m_post = XKit.interface.post($(obj));
				m_object.run = false;

				if (typeof m_post === "undefined") {
					m_object.run = false;
				} else {
					if (search_for === "photo") {
						if (m_post.type === "photo" || m_post.type === "panorama" || m_post.type === "photoset") {
							m_object.run = true;
						}
					}else {
						if (m_post.type === search_for) {
							m_object.run = true;
						}
					}
				}

				m_object.pass = $(obj);
				return m_object;

			},

		},

		post_is_mine: {

			text: "Post is mine",
			type: "",
			compatibility: "post",
			runs_on: "post",
			description: "Runs if you've reblogged/created this post.",

			run: function(parameter, obj) {

				var m_object = {};

				var m_post = XKit.interface.post($(obj));
				m_object.run = false;

				if (typeof m_post === "undefined") {
					m_object.run = false;
				} else {
					if (m_post.is_mine === true) {
						m_object.run = true;
					}
				}

				m_object.pass = $(obj);
				return m_object;

			},

		},

		post_liked: {

			text: "Post is liked by me",
			type: "",
			compatibility: "post",
			runs_on: "post",
			description: "Runs if you've already liked a post.",

			run: function(parameter, obj) {

				var m_object = {};

				var m_post = XKit.interface.post($(obj));
				m_object.run = false;

				if (typeof m_post === "undefined") {
					m_object.run = false;
				} else {
					if (m_post.liked === true) {
						m_object.run = true;
					}
				}

				m_object.pass = $(obj);
				return m_object;

			},

		},

		post_not_done: {

			text: "There is a post (not recommended)",
			type: "",
			compatibility: "post",
			runs_on: "post",
			description: "Runs on all posts. Not recommended.",

			run: function(parameter, obj) {

				var m_object = {};

				if ($(obj).hasClass("with_permalink") && $(obj).hasClass("post_full")) {
					m_object.run = true;
				} else {
					m_object.run = false;
				}

				m_object.pass = $(obj);
				return m_object;

			},

		},

		sep_99a: {

			text: "Content Ratings",
			type: "separator"

		},

		post_adult: {

			text: "The post is made/reblogged by an Adult blog",
			type: "",
			compatibility: "post",
			runs_on: "post",
			description: "Runs on all posts reblogged/posted by a blog with Adult rating.<br/>(ie: a porn blog)",

			run: function(parameter, obj) {

				var m_object = {};

				if ($(obj).attr('data-tumblelog-content-rating') === "adult") {
					m_object.run = true;
				} else {
					m_object.run = false;
				}

				m_object.pass = $(obj);
				return m_object;

			},

		},

		post_nsfw: {

			text: "The post is made/reblogged by a NSFW blog",
			type: "",
			compatibility: "post",
			runs_on: "post",
			description: "Runs on all posts reblogged/posted by a blog with NSFW rating.<br/>(ie: a blog that might post porn/nsfw stuff from time to time)",

			run: function(parameter, obj) {

				var m_object = {};

				if ($(obj).attr('data-tumblelog-content-rating') === "nsfw") {
					m_object.run = true;
				} else {
					m_object.run = false;
				}

				m_object.pass = $(obj);
				return m_object;

			},

		},

		post_nsfw_adult: {

			text: "The post is made/reblogged by a NSFW/adult blog",
			type: "",
			compatibility: "post",
			runs_on: "post",
			description: "Runs on all posts reblogged/posted by a blog with an Adult or NSFW rating.",

			run: function(parameter, obj) {

				var m_object = {};

				if ($(obj).attr('data-tumblelog-content-rating') === "adult" || $(obj).attr('data-tumblelog-content-rating') === "nsfw") {
					m_object.run = true;
				} else {
					m_object.run = false;
				}

				m_object.pass = $(obj);
				return m_object;

			},

		},

		sep_99: {

			text: "Pages",
			type: "separator"

		},

		on_dashboard: {

			text: "I'm on the dashboard",
			type: "page",
			compatibility: "",
			description: "Runs if you are on the dashboard",

			run: function() {

				var m_object = {};

				m_object.run = (XKit.interface.where().dashboard);
				m_object.return = "";

				return m_object;

			},

		},

		on_inbox: {

			text: "I'm on the inbox",
			type: "page",
			compatibility: "",
			description: "Runs if you are on the inbox page",

			run: function() {

				var m_object = {};

				m_object.run = (XKit.interface.where().inbox);
				m_object.return = "";

				return m_object;

			},

		},

		on_channel: {

			text: "I'm on a blog posts page (/blog/[url])",
			type: "page",
			compatibility: "",
			description: "Runs if you are posts page of your blog",

			run: function() {

				var m_object = {};

				m_object.run = (XKit.interface.where().channel && $("body").hasClass("dashboard_index"));
				m_object.return = "";

				return m_object;

			},

		},

		on_likes: {

			text: "I'm on my likes page",
			type: "page",
			compatibility: "",
			description: "Runs if you are on the likes page",

			run: function() {

				var m_object = {};

				m_object.run = (document.location.href.indexOf('www.tumblr.com/likes') !== -1);
				m_object.return = "";

				return m_object;

			},

		},

		on_queue: {

			text: "I'm on the queue page",
			type: "page",
			compatibility: "",
			description: "Runs if you are on the queue page of your blog",

			run: function() {

				var m_object = {};

				m_object.run = (XKit.interface.where().queue);
				m_object.return = "";

				return m_object;

			},

		},

		on_drafts: {

			text: "I'm on the drafts page",
			type: "page",
			compatibility: "",
			description: "Runs if you are on the drafts page of your blog",

			run: function() {

				var m_object = {};

				m_object.run = (XKit.interface.where().drafts);
				m_object.return = "";

				return m_object;

			},

		},

		on_search: {

			text: "I'm on a tracked tag or search",
			type: "page",
			compatibility: "",
			description: "Runs if you are on the a tracked tag page or on search",

			run: function() {

				var m_object = {};

				if (document.location.href.indexOf("www.tumblr.com/tagged/") !== -1 || document.location.href.indexOf("www.tumblr.com/search/") !== -1) {
					m_object.run = true;
				} else {
					m_object.run = false;
				}

				m_object.return = "";

				return m_object;

			},

		},

		sep_50: {

			text: "Date and Time",
			type: "separator"

		},

		time_night: {

			text: "It's night",
			type: "time",
			compatibility: "",
			returns: "the hour, in 24-hour format",
			description: "Runs each time you refresh the page,<br/>if the time is between 6 pm and 6 am",

			run: function() {

				var m_object = {};

				var m_hour = new Date().getHours();

				if (!(m_hour >= 6 && m_hour < 18)) {
					m_object.run = true;
				} else {
					m_object.run = false;
				}

				m_object.return = m_hour;

				return m_object;

			},

		},

		time_weekend: {

			text: "It's weekend",
			type: "time",
			compatibility: "",
			description: "Runs each time you refresh the page,<br/>if the day is saturday or sunday",

			run: function() {

				var m_object = {};

				var m_today = new Date();

				if(m_today.getDay() === 6 || m_today.getDay() === 0) {
					m_object.run = true;
				} else {
					m_object.run = false;
				}

				m_object.return = "";

				return m_object;

			},

		},

		time_weekday: {

			text: "It's weekday",
			type: "time",
			compatibility: "",
			description: "Runs each time you refresh the page,<br/>if the day is not a saturday or a sunday",

			run: function() {

				var m_object = {};

				var m_today = new Date();

				if (m_today.getDay() !== 6 && m_today.getDay() !== 0) {
					m_object.run = true;
				} else {
					m_object.run = false;
				}

				m_object.return = "";

				return m_object;

			},

		},

		time_day: {

			text: "The day is",
			type: "day",
			returns: "the date (0=sunday, 6=saturday)",
			description: "Runs if the day is the thingy you've selected",

			run: function(parameter, obj) {

				var m_object = {};

				var m_today = new Date();

				if (m_today.getDay() == parameter) {
					m_object.run = true;
				} else {
					m_object.run = false;
				}

				m_object.return = "";

				return m_object;

			},

		},

		sep_100: {

			text: "Other",
			type: "separator"

		},

		run_js: {

			text: "Run Javascript Code",
			compatibility: "",
			type: "textarea",
			placeholder: "ie: 'if (mary.has_lamb == true) {\n\treturn true;\n }'",
			description: "Lets you run Javascript Code.<br/>JQuery and XKit API is supported.",

			run: function(parameter, returns) {

				var m_object = {};

				var m_return = false;

				try {
					/* jshint evil: true */
					m_return = eval(parameter + "\n//# sourceURL=xkit/servant/servant"+(new Date()).getTime()+".js");
				} catch(e) {
					m_return = false;
					console.log("Unable to run Servant! ---> " + e.message);
				}

				m_object.run = m_return;
				m_object.return = "";

				return m_object;

			}

		},

		civilization_ends: {

			text: "Civilization comes to an end",
			type: "zombie_cat_attack",
			compatibility: "",
			returns: "the cause (ie: 'zombies')",
			description: "Runs if a society no longer functions, due to reasons<br/> such as a Manbearpig being on the loose",

			run: function() {

				var m_object = {};

				m_object.run = false;
				m_object.return = "zombies";

				return m_object;

			},

		},

	},

	actions: {

		sep_1: {

			text: "Generic",
			type: "separator"

		},

		display_notification: {

			text: "Display notification",
			compatibility: "",
			type: "text",
			placeholder: "ie: 'Wake up!'",
			description: "Displays an XKit notification on the bottom left of the screen.",

			run: function(parameter, returns) {

				var parameter_fixed = parameter;

				for (var i=0;i<=10;i++) {
					parameter_fixed = parameter_fixed.replace("%" + (i + 1), returns[i]);
				}

				XKit.notifications.add(parameter_fixed, "ok", true);

			}

		},


		display_window: {

			text: "Display alert",
			compatibility: "",
			type: "text",
			placeholder: "ie: 'Wake up!'",
			description: "Displays an alert window.",

			run: function(parameter, returns) {

				var parameter_fixed = parameter;

				for (var i=0;i<=10;i++) {
					parameter_fixed = parameter_fixed.replace("%" + (i + 1), returns[i]);
				}

				XKit.window.show("Servant Alert", parameter_fixed, "info", "<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");

			}

		},

		sep_2: {

			text: "Post Related",
			type: "separator"

		},

		block_post: {

			text: "Hide the post",
			compatibility: "post",
			description: "Completely hides the post",

			run: function(parameter, returns, to_pass, compatibility) {

				// Parameter     -> "%1 is happening!"
				// Returns 	 -> the list of %1s and stuff.
				// To_Pass 	 -> passed objects, such as a post
				// Compatibility -> "post", "time", etc.

				for (var i=0;i<to_pass.length;i++) {
					if (compatibility[i] === "post") {
						$(to_pass[i]).remove();
					}
				}

			}

		},

		highlight_post: {

			text: "Highlight the post",
			compatibility: "post",
			description: "Highlight the post with a yellow glowing ring of glow.",

			run: function(parameter, returns, to_pass, compatibility) {

				for (var i=0;i<to_pass.length;i++) {
					if (compatibility[i] === "post") {
						$(to_pass[i]).css("box-shadow","0px 0px 10px 4px yellow");
					}
				}

			}

		},

		dim_post: {

			text: "Dim the post",
			compatibility: "post",
			description: "Dims the posts a lil bit.",

			run: function(parameter, returns, to_pass, compatibility) {

				// Parameter     -> "%1 is happening!"
				// Returns 	 -> the list of %1s and stuff.
				// To_Pass 	 -> passed objects, such as a post
				// Compatibility -> "post", "time", etc.

				var on_click = function() {
					if ($(this).hasClass("active")) {
						$(this).closest(".post.post_full").removeClass("xkit-servant-dimmed-but-active");
						return;
					}
					$(this).closest(".post.post_full").addClass("xkit-servant-dimmed-but-active");
				};

				for (var i=0;i<to_pass.length;i++) {
					if (compatibility[i] === "post") {
						$(to_pass[i]).addClass("xkit-servant-dimmed");
						$(to_pass[i]).find(".post_control_menu.creator").click(on_click);
					}
				}

			}

		},

		like_post: {

			text: "Like the post",
			compatibility: "post",
			description: "Automatically likes the post",

			run: function(parameter, returns, to_pass, compatibility) {

				// Parameter     -> "%1 is happening!"
				// Returns 	 -> the list of %1s and stuff.
				// To_Pass 	 -> passed objects, such as a post
				// Compatibility -> "post", "time", etc.

				for (var i=0;i<to_pass.length;i++) {
					if (compatibility[i] === "post") {
						$(to_pass[i]).find(".post_control.like").not(".liked").trigger('click');
					}
				}

			}

		},

		unlike_post: {

			text: "Unlike the post",
			compatibility: "post",
			description: "Automatically unlikes the post",

			run: function(parameter, returns, to_pass, compatibility) {

				// Parameter     -> "%1 is happening!"
				// Returns 	 -> the list of %1s and stuff.
				// To_Pass 	 -> passed objects, such as a post
				// Compatibility -> "post", "time", etc.

				for (var i=0;i<to_pass.length;i++) {
					if (compatibility[i] === "post") {
						$(to_pass[i]).find(".post_control.like.liked").trigger('click');
					}
				}

			}

		},

		color_post: {

			text: "Colorize the post",
			compatibility: "post",
			description: "Puts a colored band on top the post",
			type: "color",

			run: function(parameter, returns, to_pass, compatibility) {

				// Parameter     -> "%1 is happening!"
				// Returns 	 -> the list of %1s and stuff.
				// To_Pass 	 -> passed objects, such as a post
				// Compatibility -> "post", "time", etc.

				for (var i=0;i<to_pass.length;i++) {
					if (compatibility[i] === "post") {
						$(to_pass[i]).append("<div class=\"xkit-servant-rubber-band\" style=\"background-color: " + parameter + "\">&nbsp;</div>");
					}
				}

			}

		},

		sep_99: {

			text: "Flow",
			type: "separator"

		},

		ask_me: {

			text: "Ask me before continuing",
			compatibility: "",
			type: "text",
			stop: true,
			placeholder: "ie: 'You really wanna run the code?'",
			description: "Shows a confirmation window before moving to the next action, stops if you cancel.",

			run: function(parameter) {

				if (confirm("XKit Servant Message\nPlease confirm the action.\n\n" + parameter)) {
					return true;
				}

				return false;

			}

		},

		delete: {

			text: "Delete this servant",
			compatibility: "",
			type: "flow",
			stop: true,
			description: "Deletes this servant completely.",

			run: function(parameters, returns, to_pass, compatibility, servant_object) {

				XKit.extensions.servant.delete_servant(servant_object.id);

				return false;

			}

		},

		sep_100a: {

			text: "XKit",
			type: "separator"

		},

		enable_extension: {

			text: "Enable Extension",
			compatibility: "",
			type: "extension",
			description: "Enables and runs an extension, if it's disabled",

			run: function(parameter, returns) {

				setTimeout(function() {

				try {

					if (XKit.installed.check(parameter) === true) {
						if (XKit.installed.enabled(parameter) === false) {

							try {
								if (typeof XKit.extensions[parameter].preferences !== "undefined") {
									XKit.extensions.xkit_main.load_extension_preferences(parameter);
								}
								XKit.extensions[parameter].run();
								XKit.installed.enable(parameter);
								XKit.notifications.add("Enabled '" + parameter + "'", "ok");
							} catch(e) {
								XKit.console.add("Can not run " + extension_id + ": " + e.message);
							}

						}

					}

				} catch(e) {

					console.log("Can't disable " + parameter + ", " + e.message);

				}


				}, 1000);

			}

		},

		disable_extension: {

			text: "Disable Extension",
			compatibility: "",
			type: "extension",
			description: "Disables and stop an extension, if it's enabled and running.<br/>Please note that some extensions might need you<br/>to refresh the page to be disabled completely and properly.",

			run: function(parameter, returns) {

				setTimeout(function() {

				try {

					if (XKit.installed.check(parameter) === true) {
						if (XKit.installed.enabled(parameter) === true) {
							XKit.installed.disable(parameter);
							XKit.extensions[parameter].destroy();
							XKit.notifications.add("Disabled '" + parameter + "'", "ok");
						}
					}

				} catch(e) {

					console.log("Can't disable " + parameter + ", " + e.message);

				}


				}, 1000);


			}

		},

		sep_100: {

			text: "Miscellaneous",
			type: "separator"

		},

		run_js: {

			text: "Run Javascript Code",
			compatibility: "",
			type: "textarea",
			placeholder: "ie: 'alert(&quot;%1 happened!&quot;);'",
			description: "Lets you run Javascript Code.<br/>JQuery and XKit API is supported.",

			run: function(parameter, returns, to_pass, compatibility) {

				var parameter_fixed = parameter;

				for (var i=0;i<=10;i++) {
					parameter_fixed = parameter_fixed.replace("%" + (i + 1), returns[i]);
				}

				var m_post = "";

				for (var j=0;j<to_pass.length;j++) {
					if (compatibility[j] === "post") {
						m_post = $(to_pass[j]);
					}
				}

				if (m_post !== "") {

					var to_run = function() {
						post = m_post;
						/* jshint evil: true */
						eval(parameter_fixed + "\n//# sourceURL=xkit/servant/servant"+(new Date()).getTime()+".js");
					};
					to_run();

				} else {

					/* jshint evil: true */
					eval(parameter_fixed + "\n//# sourceURL=xkit/servant/servant"+(new Date()).getTime()+".js");

				}

			}

		},

		refresh: {

			text: "Refresh the page",
			compatibility: "",
			description: "Reloads the page.<br/>Can be useful after disabling/enabling an extension.",

			run: function(parameter, returns) {

				location.reload();

			}

		},

	},

	load_servants: function() {

		var servants_load = XKit.storage.get("servant", "servants", "");

		try {

			XKit.extensions.servant.servants = JSON.parse(servants_load);
			console.log("Servant loaded " + XKit.extensions.servant.servants.length + " servants.");

		} catch(e) {

			XKit.extensions.servant.servants = [];
			XKit.extensions.servant.save_servants();

		}

	},

	save_servants: function() {

		XKit.storage.set("servant", "servants", JSON.stringify(XKit.extensions.servant.servants));

	},

	run: function() {
		this.running = true;

		if ($("body").hasClass("xkit-servant-running")) { console.log("Not going to run Servant again, no I won't."); return; }

		$("body").addClass("xkit-servant-running");

		XKit.tools.init_css("servant");

		this.load_servants();
		this.run_servants();

		$(document).on("click", "#glass_overlay", function() { $(".xkit-servant-dimmed-but-active").removeClass("xkit-servant-dimmed-but-active"); });

	},

	runs_on_posts: [],

	run_servants: function() {

		m_servants = XKit.extensions.servant.servants;

		if (m_servants.length === 0) { return; }

		var runs_on_posts = [];

		for (var i=0;i<m_servants.length;i++) {

			var m_result = XKit.extensions.servant.run_servant(m_servants[i], false);

			if (m_result == "post") {
				// This thing has a runs_on mode, for posts.
				runs_on_posts.push(m_servants[i]);
			}

		}

		console.log("- - --  -- - - - -RUNS ON POSTS - -- - - - - -- - - -");
		console.log(runs_on_posts);

		XKit.extensions.servant.runs_on_posts = [];

		if (runs_on_posts.length > 0) {

			XKit.extensions.servant.runs_on_posts = runs_on_posts;
			XKit.post_listener.add("servant", XKit.extensions.servant.do_posts);
			XKit.extensions.servant.do_posts();

		}

	},

	do_posts: function() {

		var posts = XKit.interface.get_posts("xkit-servants-all-done");

		$(posts).each(function() {

			for (var i=0;i<XKit.extensions.servant.runs_on_posts.length;i++) {
				XKit.extensions.servant.run_servant(XKit.extensions.servant.runs_on_posts[i], true);
			}

			$(this).addClass("xkit-servant-all-done");

		});

	},

	run_servant: function(obj, post_mode) {

		console.log("Running servant with id " + obj.id);
		console.log(obj);

		// to-do: check last run time.

		var causes = obj.causes;
		var actions = obj.actions;

		var returns = [];
		var to_pass = [];
		var compatibility = [];

		var do_run = -1;
		var has_runs_on = false;
		var does_run_on = "";

		for (var i=0;i<causes.length;i++) {

			if (XKit.extensions.servant.causes[causes[i].id].runs_on === "post") {
				has_runs_on = true;
				does_run_on = "post";
			}

		}

		var m_object;

		if (has_runs_on === true && does_run_on === "post") {

			if (!post_mode) {

				// We will go through these later.
				console.log("Skipping because not in post_mode, and has class post mode.");
				return "post";

			} else {

				m_object = $(".posts .post").not(".xkit-servant-" + obj.id).not("#new_post").first();
				if (m_object.length === 0) { return false; }

			}

		}

		causes.forEach(function(cause) {
			var to_run = XKit.extensions.servant.causes[cause.id].run;

			var m_result = false;

			if (XKit.extensions.servant.causes[cause.id].runs_on === "post") {

				m_result = to_run(cause.value, $(m_object));

			} else {

				m_result = to_run(cause.value);

			}

			// Save the "return", ie: %1, %2..
			returns.push(m_result.return);

			// Save the pass, which can be a post object, etc.
			to_pass.push(m_result.pass);

			// We should save this too, so we wouldn't, for example,
			// push a post object to a function that doesn't take post objects.
			compatibility.push(XKit.extensions.servant.causes[cause.id].compatibility);

			// alert("on " + obj.id + ":\n" + "returned " + m_result.run + " on causer " + i + " --- parameter = " + cause.value + "\ntype = " + cause.id);

			if (m_result.run === false || do_run === 0) {
				do_run = 0;
			} else {
				do_run = 1;
			}
		});

		$(m_object).addClass("xkit-servant-" + obj.id);

		if (do_run !== 1) { return; }

		actions.forEach(function(action) {

			var to_run = XKit.extensions.servant.actions[action.id].run;

			var m_result = XKit.extensions.servant.actions[action.id].run(action.value, returns, to_pass, compatibility, obj);

			if (XKit.extensions.servant.actions[action.id].stop === true) {

				// This is a flow thingy, where we must wait for it to return a value
				// so we can go on.

				if (m_result === false) {
					// We should stop.
					return;
				}

			}

		});

		return "";

	},

	add_cause_count: 0,

	show_add: function(m_div) {

		var m_html = "<input type=\"text\" placeholder=\"Servant Title - optional (ie: 'Hide posts containing XKit on tracked pages')\" class=\"xkit-textbox\" id=\"xkit-servant-add-title\">";

		XKit.extensions.servant.add_cause_count = 0;
		XKit.extensions.servant.add_action_count = 0;

		// ---- Causes

		m_html = m_html + "<div class=\"xkit-servant-when xkit-servant-add-division\">" +
					"<div class=\"xkit-servant-division-title\">When</div>" +
						XKit.extensions.servant.add_field_cause();

		m_html = m_html + "<div class=\"xkit-servant-add-more xkit-servant-add-more-causes\">Add another</div>";
		m_html = m_html + "</div>";

		// ---- Actions

		m_html = m_html + "<div class=\"xkit-servant-do xkit-servant-add-division\">" +
					"<div class=\"xkit-servant-division-title\">Do</div>" +
						XKit.extensions.servant.add_field_action();

		m_html = m_html + "<div class=\"xkit-servant-add-more xkit-servant-add-more-actions\">Add another</div>";
		m_html = m_html + "</div>";

		// ---- Additional

		// m_html = m_html + "<div class=\"xkit-servant-silent-division\">&nbsp;</div><div class=\"xkit-checkbox\" style=\"padding-left: 0;\"><b>&nbsp;</b> Run this servant even when only one of the requirements is met. (OR mode)</div>";


		m_html = m_html + "<div class=\"xkit-servant-compatibility-error\"><b>There is an incompatibility here.</b><br/>For example, you can't create a servant with the job \"When the time is 7 PM, block the post\": please check the combination and try again. Click Help on bottom right for more information.</div>";

		m_html = m_html + "<div class=\"xkit-servant-javascript-warning\"><b>Be very careful!</b> The \"Run Javascript Code\" option is for experts. Do not copy/paste and run code from people you don't know and trust, very bad things can happen.</div>";

		XKit.window.show("Add Servant", m_html, "question", "<div class=\"xkit-button default\" id=\"xkit-servant-add\">Add Servant..</div><div id=\"xkit-close-message\" class=\"xkit-button\">Cancel</div><a href=\"http://xkit.info/notes/servant_help.php\" target=\"_BLANK\" class=\"xkit-button float-right\">Help</a>", true);

		XKit.extensions.servant.bind_actions_on_add_window();
		XKit.extensions.servant.react_to_selection_change();

		$(".xkit-servant-add-more-actions").click(function() {

			var m_html = XKit.extensions.servant.add_field_action();
			$(".xkit-servant-do").find(".xkit-servant-add-more").before(m_html);
			centerIt($("#xkit-window"));

			XKit.extensions.servant.readjust_lines($(".xkit-servant-option-action-line-0"));

			XKit.extensions.servant.bind_actions_on_add_window();
			XKit.extensions.servant.react_to_selection_change();

		});

		$(".xkit-servant-add-more-causes").click(function() {

			var m_html = XKit.extensions.servant.add_field_cause();
			$(".xkit-servant-when").find(".xkit-servant-add-more").before(m_html);
			centerIt($("#xkit-window"));

			XKit.extensions.servant.readjust_lines($(".xkit-servant-option-cause-line-0"));

			XKit.extensions.servant.bind_actions_on_add_window();
			XKit.extensions.servant.react_to_selection_change();

		});

		$("#xkit-servant-add").click(function() {

			XKit.extensions.servant.process_add(m_div);

		});

	},

	check_if_empty_value: function() {

		var found = false;

		$(".xkit-servant-option-textbox").each(function() {

			if ($.trim($(this).val()) === "") {
				found = true;
				return false;
			}

		});

		$(".xkit-servant-option-listbox").each(function() {

			if ($.trim($(this).val()) === "") {
				found = true;
				return false;
			}

		});

		return found;

	},

	get_add_value: function(obj) {

		if ($(obj).find(".xkit-servant-option-textbox").length > 0) {

			return $(obj).find(".xkit-servant-option-textbox").val();

		}

		if ($(obj).find(".xkit-servant-option-listbox").length > 0) {

			return $(obj).find(".xkit-servant-option-listbox").val();

		}

		if ($(obj).find(".xkit-servant-option-textareabox").length > 0) {

			return $(obj).find(".xkit-servant-option-textareabox").val();

		}

		return "";

	},

	process_add: function(m_div) {

		// Get the WHENs and DOs.

		if ($("#xkit-servant-add").hasClass("disabled")) {
			return;
		}

		var when = [];
		var action = [];

		if (XKit.extensions.servant.check_if_empty_value() === true) {

			alert("Please fill all the values.");
			return;

		}

		$(".xkit-servant-option-line-cause").each(function() {

			var m_object = {};

			m_object.id = $(this).find(".xkit-servant-add-option").val();
			m_object.value = XKit.extensions.servant.get_add_value($(this));

			when.push(m_object);

		});

		$(".xkit-servant-option-line-action").each(function() {

			var m_object = {};

			m_object.id = $(this).find(".xkit-servant-add-option").val();
			m_object.value = XKit.extensions.servant.get_add_value($(this));

			action.push(m_object);

		});

		var m_servant = {};

		m_servant.id = XKit.tools.random_string() + Math.round(new Date().getTime() / 1000);
		m_servant.causes = when;
		m_servant.actions = action;
		m_servant.create_time = Math.round(new Date().getTime() / 1000);
		m_servant.last_run = -1;

		m_servant.title = $.trim($("#xkit-servant-add-title").val());

		XKit.extensions.servant.load_servants();

		XKit.extensions.servant.servants.push(m_servant);

		XKit.extensions.servant.save_servants();

		XKit.window.close();

		XKit.extensions.xkit_preferences.restart_extension("servant");

		if (typeof m_div !== "undefined") {
			XKit.extensions.servant.cpanel(m_div);
		}

	},

	add_window_option_get_real_value: function(obj) {

		var m_val = $(obj).val();

		var to_return = "";

		$(obj).find("option").each(function() {

			if ($(this).attr('value') === m_val) {

				to_return = $(this);
				return false;

			}

		});

		return to_return;

	},

	settings_box_text: function(obj, parent, real_val) {

		var m_placeholder = "ie: 'xkit'";

		if (typeof $(real_val).attr('data-placeholder') !== "undefined" && $(real_val).attr('data-placeholder') !== "undefined") { m_placeholder = $(real_val).attr('data-placeholder'); }

		m_placeholder = XKit.tools.replace_all(m_placeholder, "\"", "&quot;");

		$(obj).html("<input data-id=\"" + $(parent).parent().attr('data-id') + "\" type=\"text\" placeholder=\"" + m_placeholder + "\" class=\"xkit-textbox xkit-servant-option-textbox\">");

	},

	settings_box_textarea: function(obj, parent, real_val) {

		var m_placeholder = "ie: 'xkit'";

		if (typeof $(real_val).attr('data-placeholder') !== "undefined" && $(real_val).attr('data-placeholder') !== "undefined") { m_placeholder = $(real_val).attr('data-placeholder'); }

		m_placeholder = XKit.tools.replace_all(m_placeholder, "\"", "&quot;");

		$(parent).parent().addClass("servant-contains-textarea");

		$(obj).html("<textarea data-id=\"" + $(parent).parent().attr('data-id') + "\" placeholder=\"" + m_placeholder + "\" class=\"xkit-textbox xkit-servant-option-textareabox\"></textarea>");

		$(".xkit-servant-option-textareabox").bind("keydown", function(event) {

			event.stopPropagation();
			event.stopImmediatePropagation();

		});

	},

	settings_box_extension: function(obj, parent, real_val) {

		var m_array = XKit.installed.list();

		var m_html = "<select class=\"xkit-servant-option-listbox\">";

		for (var i=0;i<m_array.length;i++) {

			var extension_name = XKit.installed.title(m_array[i]);
			var extension_id = m_array[i];

			if (m_array[i].substring(0,5) === "xkit_") { continue; }

			m_html = m_html + "<option value=\"" + extension_id + "\">" + extension_name + "</option>";

		}

		m_html = m_html + "</select>";

		$(obj).html(m_html);

	},

	settings_box_color: function(obj, parent, real_val) {

		var m_array = XKit.installed.list();

		var m_html = "<select class=\"xkit-servant-option-listbox\">";

		m_html = m_html + "<option value=\"#de4c4c\">Red</option>";
		m_html = m_html + "<option value=\"#df982e\">Orange</option>";
		m_html = m_html + "<option value=\"#fde72d\">Yellow</option>";
		m_html = m_html + "<option value=\"#7bcf47\">Green</option>";
		m_html = m_html + "<option value=\"#4cadde\">Blue</option>";
		m_html = m_html + "<option value=\"#b94cde\">Purple</option>";

		m_html = m_html + "<option value=\"#838383\">Light Gray</option>";
		m_html = m_html + "<option value=\"#d6d6d6\">Gray</option>";
		m_html = m_html + "<option value=\"#000\">Black</option>";

		m_html = m_html + "</select>";

		$(obj).html(m_html);

	},

	settings_box_post_type: function(obj, parent, real_val) {

		var m_array = XKit.installed.list();

		var m_html = "<select class=\"xkit-servant-option-listbox\">";

		m_html = m_html + "<option value=\"text\">Text</option>";
		m_html = m_html + "<option value=\"note\">Ask</option>";
		m_html = m_html + "<option value=\"photo\">Photo / Photoset</option>";
		m_html = m_html + "<option value=\"quote\">Quote</option>";
		m_html = m_html + "<option value=\"link\">Link</option>";
		m_html = m_html + "<option value=\"chat\">Chat</option>";
		m_html = m_html + "<option value=\"audio\">Audio</option>";
		m_html = m_html + "<option value=\"video\">Video</option>";

		m_html = m_html + "</select>";

		$(obj).html(m_html);

	},

	settings_box_day: function(obj, parent, real_val) {

		var m_html = "<select class=\"xkit-servant-option-listbox\">";

		m_html = m_html + "<option value=\"1\">Monday</option>";
		m_html = m_html + "<option value=\"2\">Tuesday</option>";
		m_html = m_html + "<option value=\"3\">Wednesday</option>";
		m_html = m_html + "<option value=\"4\">Thursday</option>";
		m_html = m_html + "<option value=\"5\">Friday</option>";
		m_html = m_html + "<option value=\"6\">Saturday</option>";
		m_html = m_html + "<option value=\"0\">Sunday</option>";

		m_html = m_html + "</select>";

		$(obj).html(m_html);

	},

	check_js: function() {

		var to_return = false;

		$(".xkit-servant-cause-selector").each(function() {
			if ($(this).val() === "run_js") {
				to_return = true;
				return false;
			}
		});

		$(".xkit-servant-action-selector").each(function() {
			if ($(this).val() === "run_js") {
				to_return = true;
				return false;
			}
		});

		return to_return;

	},

	check_compatibility: function() {

		// show xkit-servant-compatibility-error?
		var m_compatibility_cause = "";
		var m_compatibility_action = "";

		$(".xkit-servant-cause-selector").each(function() {

			if (typeof XKit.extensions.servant.add_window_option_get_real_value($(this)).attr('data-compatibility') !== "undefined") {

				if (m_compatibility_cause === "") {
					if (typeof XKit.extensions.servant.add_window_option_get_real_value($(this)).attr('data-compatibility') !== "undefined") {
						m_compatibility_cause = XKit.extensions.servant.add_window_option_get_real_value($(this)).attr('data-compatibility');
					}
				}

			}

		});

		$(".xkit-servant-action-selector").each(function() {

			if (typeof XKit.extensions.servant.add_window_option_get_real_value($(this)).attr('data-compatibility') !== "undefined") {

				if (m_compatibility_action === "") {
					if (typeof XKit.extensions.servant.add_window_option_get_real_value($(this)).attr('data-compatibility') !== "undefined") {
						m_compatibility_action = XKit.extensions.servant.add_window_option_get_real_value($(this)).attr('data-compatibility');
					}
				}

			}

		});

		if (m_compatibility_action === "" &&m_compatibility_cause === "") { return false; }
		if (m_compatibility_action !==m_compatibility_cause && m_compatibility_action !== "") { return true; }

		return false;

	},

	react_to_selection_change: function(obj) {

		var selector = ".xkit-servant-add-option";

		if (typeof obj !== "undefined") { selector = obj; }

		$(selector).each(function() {

			var settings_box = $(this).parent().find(".xkit-servant-add-option-settings");
			if ($(settings_box).parent().attr('data-last-id') === $(this).val()) { return; }

			$(settings_box).html("");

			$(this).removeClass("xkit-servant-half-option");
			$(this).removeClass("servant-contains-textarea");

			$(settings_box).removeClass("xkit-servant-options-shown");

			$(settings_box).parent().attr('data-last-id', $(this).val());

			$(settings_box).parent().find(".xkit-servant-help-for-line").attr('title', XKit.extensions.servant.add_window_option_get_real_value($(settings_box).parent().find(".xkit-servant-add-option")).attr('data-description')).tipTip({ delay: 0, defaultPosition: "right", maxWidth: "300px" });

			if (XKit.extensions.servant.add_window_option_get_real_value($(this)).attr('data-type') === "text") {

				$(this).addClass("xkit-servant-half-option");
				$(settings_box).addClass("xkit-servant-options-shown");

				XKit.extensions.servant.settings_box_text(settings_box, this, XKit.extensions.servant.add_window_option_get_real_value($(this)));

			}

			if (XKit.extensions.servant.add_window_option_get_real_value($(this)).attr('data-type') === "textarea") {

				$(this).addClass("xkit-servant-half-option");
				$(settings_box).addClass("xkit-servant-options-shown");

				XKit.extensions.servant.settings_box_textarea(settings_box, this, XKit.extensions.servant.add_window_option_get_real_value($(this)));

			}

			if (XKit.extensions.servant.add_window_option_get_real_value($(this)).attr('data-type') === "color") {

				$(this).addClass("xkit-servant-half-option");
				$(settings_box).addClass("xkit-servant-options-shown");

				XKit.extensions.servant.settings_box_color(settings_box, this, XKit.extensions.servant.add_window_option_get_real_value($(this)));

			}

			if (XKit.extensions.servant.add_window_option_get_real_value($(this)).attr('data-type') === "post_type") {

				$(this).addClass("xkit-servant-half-option");
				$(settings_box).addClass("xkit-servant-options-shown");

				XKit.extensions.servant.settings_box_post_type(settings_box, this, XKit.extensions.servant.add_window_option_get_real_value($(this)));

			}

			if (XKit.extensions.servant.add_window_option_get_real_value($(this)).attr('data-type') === "day") {

				$(this).addClass("xkit-servant-half-option");
				$(settings_box).addClass("xkit-servant-options-shown");

				XKit.extensions.servant.settings_box_day(settings_box, this, XKit.extensions.servant.add_window_option_get_real_value($(this)));

			}

			if (XKit.extensions.servant.add_window_option_get_real_value($(this)).attr('data-type') === "extension") {

				$(this).addClass("xkit-servant-half-option");
				$(settings_box).addClass("xkit-servant-options-shown");

				XKit.extensions.servant.settings_box_extension(settings_box, this, XKit.extensions.servant.add_window_option_get_real_value($(this)));

			}

			if (typeof XKit.extensions.servant.add_window_option_get_real_value($(this)).attr('data-returns') !== "undefined" &&XKit.extensions.servant.add_window_option_get_real_value($(this)).attr('data-returns') !== "undefined") {

				var m_id = $(settings_box).parent().attr('data-id');

				$(settings_box).parent().find(".xkit-servant-add-option-returns").attr('title', "<b>Returns:</b><br/>%" + (parseInt(m_id) + 1) + ": " + XKit.extensions.servant.add_window_option_get_real_value($(this)).attr('data-returns')).tipTip({ delay: 0, defaultPosition: "left" });

				$(settings_box).parent().find(".xkit-servant-help-for-line").attr('title', XKit.extensions.servant.add_window_option_get_real_value($(this)).attr('data-description')).tipTip({ delay: 0, defaultPosition: "right", maxWidth: "300px" });

				$(settings_box).parent().addClass("xkit-servant-return-values-shown");

			} else {

				$(settings_box).parent().removeClass("xkit-servant-return-values-shown");

			}

		});

		if (XKit.extensions.servant.check_js() === true) {
			$(".xkit-servant-javascript-warning").css("display","block");
		} else {
			$(".xkit-servant-javascript-warning").css("display","none");
		}

		if (XKit.extensions.servant.check_compatibility() === true) {
			$(".xkit-servant-compatibility-error").css("display","block");
			$("#xkit-servant-add").addClass("disabled");
		} else {
			$(".xkit-servant-compatibility-error").css("display","none");
			$("#xkit-servant-add").removeClass("disabled");
		}

		centerIt($("#xkit-window"));

	},

	bind_actions_on_add_window: function() {

		$(".xkit-servant-add-delete-line").unbind("click");
		$(".xkit-servant-add-delete-line").bind("click", function() {

			var id = $(this).attr('data-id');

			if (id === "0") { return; }

			$(this).parent().fadeOut('fast', function(){ var m_obj = this; $(this).remove(); XKit.extensions.servant.readjust_lines($(m_obj)); centerIt($("#xkit-window")); XKit.extensions.servant.react_to_selection_change(); });

		});

		$(".xkit-servant-add-option").unbind("change");
		$(".xkit-servant-add-option").bind("change", function() {

			XKit.extensions.servant.react_to_selection_change();

		});

	},

	readjust_lines: function(obj) {

		var line_obj = $(obj);

		var selector = "";

		var is_action = false;

		if ($(line_obj).hasClass("xkit-servant-option-line-cause")) {
			selector = ".xkit-servant-option-line-cause";
		} else{
			selector = ".xkit-servant-option-line-action";
			is_action = true;
		}

		var index = 0;

		$(selector).each(function() {

			$(this).attr('data-id', index);

			for (var i=0;i<10;i++) {
				$(this).removeClass("xkit-servant-option-action-line-" + i);
				$(this).removeClass("xkit-servant-option-cause-line-" + i);
			}

			$(this).find(".xkit-servant-add-delete-line").attr('data-id', index);

			$(this).find(".xkit-servant-help-for-line").attr('data-id', index);

			if (is_action) {
				$(this).addClass("xkit-servant-option-action-line-" + index);
				$(this).find(".xkit-servant-add-option-settings").attr('id', "servant-action-" + index + "-settings");
			} else {
				$(this).addClass("xkit-servant-option-cause-line-" + index);
				$(this).find(".xkit-servant-add-option-settings").attr('id', "servant-cause-" + index + "-settings");
			}

			$(this).find(".xkit-servant-add-option").attr("id", "servant-cause-" + index);

			$(this).find(".xkit-servant-add-option-returns").attr('title', "<b>Returns:</b><br/>%" + (index + 1) + ": " + XKit.extensions.servant.add_window_option_get_real_value($(this).find(".xkit-servant-add-option")).attr('data-returns')).tipTip({ delay: 0, defaultPosition: "left" });

			$(this).find(".xkit-servant-help-for-line").attr('title', XKit.extensions.servant.add_window_option_get_real_value($(this).find(".xkit-servant-add-option")).attr('data-description')).tipTip({ delay: 0, defaultPosition: "right", maxWidth: "300px" });

			index++;

		});

	},

	add_field_cause: function() {

		var m_html = "<div data-id=\"" + XKit.extensions.servant.add_cause_count + "\" class=\"xkit-servant-option-line xkit-servant-option-line-cause xkit-servant-option-cause-line-" + XKit.extensions.servant.add_action_count + "\"><div data-id=\"" + XKit.extensions.servant.add_action_count + "\" class=\"xkit-servant-add-delete-line\">&nbsp;</div>";

		m_html = m_html + "<div data-section=\"cause\" data-id=\"" + XKit.extensions.servant.add_action_count + "\" class=\"xkit-servant-help-for-line\">&nbsp;</div>";

		var causes_html = "";

		if ($(".xkit-servant-option-line-cause").length >= 3) { alert("You can only add up to 3 causes."); return ""; }

		for (var obj in XKit.extensions.servant.causes) {

			var dis_class = "";
			var m_text = XKit.extensions.servant.causes[obj].text;
			if (XKit.extensions.servant.causes[obj].type === "separator") {
				dis_class = "disabled";
				m_text = " --- " + m_text + " --- ";
			}
			causes_html = causes_html + "<option data-description=\"" + XKit.extensions.servant.causes[obj].description + "\" data-returns=\"" + XKit.extensions.servant.causes[obj].returns + "\" data-placeholder=\"" + XKit.extensions.servant.causes[obj].placeholder + "\"  data-compatibility=\"" + XKit.extensions.servant.causes[obj].compatibility + "\" data-additional=\"" + XKit.extensions.servant.causes[obj].additional + "\" data-type=\"" + XKit.extensions.servant.causes[obj].type  + "\" " + dis_class + " value=\"" + obj + "\">" + m_text + "</option>";

		}

		m_html = m_html + "<select class=\"xkit-servant-add-option xkit-servant-cause-selector\" id=\"servant-cause-" + XKit.extensions.servant.add_cause_count + "\">" + causes_html + "</select>";

		m_html = m_html + "<div class=\"xkit-servant-add-option-settings\" id=\"servant-cause-" + XKit.extensions.servant.add_cause_count + "-settings\">&nbsp;</div>";


		m_html = m_html + "<div class=\"xkit-servant-add-option-returns\">&nbsp;</div>";
		m_html = m_html + "</div>";

		XKit.extensions.servant.add_cause_count++;
		return m_html;

	},

	add_field_action: function() {

		var m_html = "<div class=\"xkit-servant-option-line xkit-servant-option-line-action xkit-servant-option-action-line-" + XKit.extensions.servant.add_action_count + "\"><div data-id=\"" + XKit.extensions.servant.add_action_count + "\" class=\"xkit-servant-add-delete-line\">&nbsp;</div>";
		var causes_html = "";

		m_html = m_html + "<div data-section=\"action\" data-id=\"" + XKit.extensions.servant.add_action_count + "\" class=\"xkit-servant-help-for-line\">&nbsp;</div>";

		if ($(".xkit-servant-option-line-action").length >= 5) { alert("You can only add up to 5 actions."); return ""; }

		for (var obj in XKit.extensions.servant.actions) {

			var dis_class = "";
			var m_text = XKit.extensions.servant.actions[obj].text;
			if (XKit.extensions.servant.actions[obj].type === "separator") {
				dis_class = "disabled";
				m_text = " --- " + m_text + " --- ";
			}
			causes_html = causes_html + "<option data-description=\"" + XKit.extensions.servant.actions[obj].description + "\" data-placeholder=\"" + XKit.extensions.servant.actions[obj].placeholder + "\" data-compatibility=\"" + XKit.extensions.servant.actions[obj].compatibility + "\" data-additional=\"" + XKit.extensions.servant.actions[obj].additional + "\" data-type=\"" + XKit.extensions.servant.actions[obj].type  + "\" " + dis_class + " value=\"" + obj + "\">" + m_text + "</option>";

		}

		m_html = m_html + "<select class=\"xkit-servant-add-option xkit-servant-action-selector\" id=\"servant-action-" + XKit.extensions.servant.add_action_count + "\">" + causes_html + "</select>";

		m_html = m_html + "<div class=\"xkit-servant-add-option-settings\" id=\"servant-action-" + XKit.extensions.servant.add_action_count + "-settings\">&nbsp;</div>";

		m_html = m_html + "</div>";


		XKit.extensions.servant.add_action_count++;
		return m_html;

	},

	control_panel_div: "",
	servant_count_for_list: 1,

	create_cpanel_div: function(obj) {

		var m_title = obj.title;

		if (!obj.title) {
			m_title = "Servant #" + XKit.extensions.servant.servant_count_for_list;
		}

		var m_description = "When ";

		var m_action = "";
		if (obj.actions.length > 1) {
			for (var i=0;i<obj.actions.length;i++) {
				m_val = "";
				m_action = m_action + XKit.extensions.servant.actions[obj.actions[i].id].text.toLowerCase();
				if (i < obj.actions.length - 1) {
					m_action = m_action + " and ";
				}
			}
		} else {
			m_action = XKit.extensions.servant.actions[obj.actions[0].id].text.toLowerCase();
		}

		if (obj.causes.length > 1) {
			for (var cause_i = 0; cause_i < obj.causes.length; cause_i++) {
				var cause = obj.causes[cause_i];
				m_val = "";
				if (typeof cause.value !== "undefined" &&cause.value !== "") {
					m_val = " " + cause.value;
				}
				m_description = m_description + XKit.extensions.servant.causes[cause.id].text + m_val;
				if (cause_i < obj.causes.length - 1) {
					m_description = m_description + " and ";
				}
			}
			m_description = m_description + ", " + m_action;
		} else {
			m_val = "";
			if (typeof obj.causes[0].value !== "undefined" &&obj.causes[0].value !== "") {
				m_val = " " + obj.causes[0].value;
			}
			m_description = m_description + XKit.extensions.servant.causes[obj.causes[0].id].text + m_val + ", " + m_action;
		}

		m_description = m_description + ". ";

		return	"<div class=\"xkit-servant-list-item\" data-servant-id=\"" + obj.id + "\">" +
				"<div class=\"m-title\">" + m_title + "</div>" +
				"<div class=\"m-description\">" + m_description + "</div>" +
				"<div data-servant-id=\"" + obj.id + "\" class=\"xkit-servant-item-delete\">&nbsp;</div>" +
			"</div>";
	},

	cpanel: function(m_div) {

		XKit.extensions.servant.control_panel_div = m_div;

		$("#xkit-servant-cp").remove();

		XKit.extensions.servant.load_servants();

		var servant_html = "";

		if (XKit.extensions.servant.servants.length === 0) {

			servant_html = "<div id=\"servant-list-no-servants\">You have no servants.<br/>You can add one by clicking the button above.</div>";

		} else {

			XKit.extensions.servant.servant_count_for_list = 1;

			for (var i=0;i<XKit.extensions.servant.servants.length;i++) {

				servant_html = servant_html + XKit.extensions.servant.create_cpanel_div(XKit.extensions.servant.servants[i]);
				XKit.extensions.servant.servant_count_for_list++;

			}

		}

		var m_html = "<div id=\"xkit-servant-cp\">" +
					"<div id=\"servant-toolbar\">" +
						"<div id=\"servant-add-button\" class=\"xkit-button\">Add new servant..</div>" +
						"<div id=\"servant-refresh-warning\">You need to refresh the page for changes to take affect</div>" +
					"</div>" +
					"<div id=\"servant-list\">" +
						servant_html +
					"</div>" +
				"</div>";


		$(m_div).append(m_html);

		$("#servant-add-button").click(function() {

			XKit.extensions.servant.show_add(m_div);

		});

		$(".xkit-servant-item-delete").click(function() {

			var m_id = $(this).attr('data-servant-id');
			XKit.extensions.servant.delete_servant(m_id);
			$(this).parent().slideUp('fast', function() {

				$(this).remove();

				$("#xkit-extensions-panel-right").nanoScroller();

				if (XKit.extensions.servant.servants.length === 0) {
					XKit.extensions.servant.cpanel(XKit.extensions.servant.control_panel_div);
				}

				XKit.extensions.xkit_preferences.restart_extension("servant");

			});

		});

		$("#xkit-extensions-panel-right").nanoScroller();
		$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });

	},

	delete_servant: function(id) {

		XKit.extensions.servant.load_servants();

		for (var i=0;i<XKit.extensions.servant.servants.length;i++) {

			if (XKit.extensions.servant.servants[i].id === id) {

				XKit.extensions.servant.servants.splice(i,1);

			}

		}

		XKit.extensions.servant.save_servants();

	},

	destroy: function() {
		this.running = false;
	}

});
