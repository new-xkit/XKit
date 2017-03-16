//* TITLE Tag Replacer **//
//* VERSION 0.4.6 **//
//* DESCRIPTION Replace old tags! **//
//* DETAILS Allows you to bulk replace tags of posts. Go to your Posts page on your dashboard and click on the button on the sidebar and enter the tag you want replaced, and the new tag, and Tag Replacer will take care of the rest. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.tag_replacer = new Object({

	running: false,
	apiKey: XKit.api_key,

	run: function() {

		this.running = true;

		if (!XKit.interface.where().channel) {
			return;
		}
		if (typeof XKit.interface.where().user_url === "undefined" || XKit.interface.where().user_url === "") {return; }

		XKit.tools.init_css("tag_replacer");

		if ($("#tag_replacer.ul").length === 0) {
			var xf_html = '<ul class="controls_section" id="tag_replacer_ul">' +
				'<li class="section_header selected">Tag Replacer</li>' +
				'<li class="no_push" style="height: 36px;"><a data-url="' + XKit.interface.where().user_url + '" href="#" id="tag_replacer_button">' +
				'<div class="hide_overflow" style="color: rgba(255, 255, 255, 0.5) !important; font-weight: bold; padding-left: 10px; padding-top: 8px;">Replace a tag<span class="sub_control link_arrow icon_right icon_arrow_carrot_right"></span></div>' +
				'</a></li></ul>';
			$("ul.controls_section:first").before(xf_html);
		}

		$("#tag_replacer_button").click(function() {
			var m_url = $(".open_blog_link").attr('href').replace(/https?:\/\//gi, "");
			if (m_url.substring(m_url.length - 1) === "/") { m_url = m_url.substring(0, m_url.length - 1); }
			XKit.extensions.tag_replacer.show(m_url);

			return false;
		});

	},

	show: function(url) {

		XKit.window.show("Tag Replacer", "<b>Replace this tag:</b><input type=\"text\" maxlength=\"150\" placeholder=\"Enter a tag (example: 'I like pandas')\" class=\"xkit-textbox\" id=\"xkit-tag-replacer-replace\"><div class=\"xkit-checkbox\" id=\"xkit-tag-replacer-case-sensitive\"><b>&nbsp;</b>Case Sensitive Mode</div><div class=\"xkit-tag-replacer-separator\">&nbsp;</div><b>With this tag:</b> (leave blank to delete the tag)<input type=\"text\" maxlength=\"150\" placeholder=\"Enter a tag (example: 'I still like pandas')\" class=\"xkit-textbox\" id=\"xkit-tag-replacer-with\"><div class=\"xkit-checkbox\" id=\"xkit-tag-replacer-append\"><b>&nbsp;</b>Don't replace the tag but append the tag above</div><div class=\"xkit-tag-replacer-separator\">&nbsp;</div><small>You can replace only one tag at a time.<br/>Due to technical reasons, you can't edit tags containing dashes.</small>", "question", "<div class=\"xkit-button default\" id=\"xkit-tag-replacer-ok\">Go!</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

		$("#xkit-tag-replacer-case-sensitive").click(function() { $(this).toggleClass("selected"); });
		$("#xkit-tag-replacer-append").click(function() { $(this).toggleClass("selected"); });

		$("#xkit-tag-replacer-ok").click(function() {

			var t_replace = "";

			if (XKit.extensions.tag_replacer.case_sensitive) {
				t_replace = $.trim($("#xkit-tag-replacer-replace").val());
			} else {
				t_replace = $.trim($("#xkit-tag-replacer-replace").val().toLowerCase());
			}

			var t_with = $.trim($("#xkit-tag-replacer-with").val());

			if (t_replace === "" && t_with === "") { XKit.window.close(); }

			if (t_replace.indexOf(",") !== -1) {
				alert("Tag to search for can not contain commas.");
				return;
			}

			if (t_replace === "") {
				alert("Enter the tag you want replaced.");
				return;
			}

			if (t_with === "" && $("#xkit-tag-replacer-append").hasClass("selected")) {
				alert("Enter the tag you want to append.");
				return;
			}

			XKit.extensions.tag_replacer.start(url, encodeURIComponent(t_replace), t_with, $("#xkit-tag-replacer-append").hasClass("selected"));

		});

	},

	page: 0,
	url: "",
	t_replace: "",
	t_with: "",
	p_array: [],
	p_array_index: 0,
	append_mode: false,
	case_sensitive: false,
	success_count: 0,
	fail_count: 0,

	start: function(url, t_replace, t_with, append_mode) {

		console.log("replace " + t_replace + " with " + t_with + " on " + url);

		XKit.extensions.tag_replacer.page = 0;
		XKit.extensions.tag_replacer.url = url;
		XKit.extensions.tag_replacer.t_replace = t_replace;
		XKit.extensions.tag_replacer.t_with = t_with;
		XKit.extensions.tag_replacer.p_array = [];
		XKit.extensions.tag_replacer.p_array_index = 0;
		XKit.extensions.tag_replacer.success_count = 0;
		XKit.extensions.tag_replacer.fail_count = 0;
		XKit.extensions.tag_replacer.append_mode = append_mode;
		XKit.extensions.tag_replacer.case_sensitive = $("#xkit-tag-replacer-case-sensitive").hasClass("selected");

		XKit.extensions.tag_replacer.next();

		XKit.window.show("Working...", "Tag Replacer is trying to find posts with the tag you've entered, please wait. This might take a while.<div id=\"xkit-tag-replacer-progress\">Initializing...</div>", "info");

	},

	show_error: function(message) {

		XKit.window.show("Tag Replacer encountered an error", message, "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");

	},

	start_replacing: function() {

		if (XKit.extensions.tag_replacer.p_array.length === 0) {

			XKit.window.show("Nothing for me to do.", "Tag Replacer could not find any posts containing the tag you were searching for.", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
			return;

		}

		XKit.window.show("Working...", "Tag Replacer is replacing tags." + XKit.progress.add("tag-replacer-pb") +  "<div id=\"xkit-tag-replacer-progress\">This might take a long, long, long time.</div>", "info");
		XKit.extensions.tag_replacer.replace_next();

	},

	replace_next: function() {

		var m_post = XKit.extensions.tag_replacer.p_array[XKit.extensions.tag_replacer.p_array_index];

		var m_post_obj = {};

		m_post_obj.id = m_post;
		m_post_obj.owner = XKit.interface.where().user_url;

		if (XKit.extensions.tag_replacer.p_array_index >= XKit.extensions.tag_replacer.p_array.length) {
			if (XKit.extensions.tag_replacer.success_count === 0) {
				XKit.window.show("Thank you, come again!", "Tag Replacer could not find any posts with the tag you've specified. Make sure you turn off Case Sensitive mode if you can't find the posts.", "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
			} else {
				XKit.window.show("Thank you, come again!", "Tag Replacer replaced tags of " + XKit.extensions.tag_replacer.success_count + " posts. (Failed: " + XKit.extensions.tag_replacer.fail_count + " posts)", "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
			}
			return;
		}

		console.log("Fetching post with ID " + m_post);

		XKit.interface.fetch(m_post_obj, function(data) {

			console.log(data);

			if (data.error === true) {
				XKit.extensions.tag_replacer.show_error("<b>Unable to fetch post object.</b><br/>Please try again later.<br/><br/>Error Code: TGR-935");
				return;
			}

			var m_tags = data.data.post.tags.split(",");
			if (!XKit.extensions.tag_replacer.case_sensitive) {
				m_tags = m_tags.map(function(tag) {
					return tag.toLowerCase();
				});
			}

			var found_tag = false;

			if (XKit.extensions.tag_replacer.append_mode === false) {

				for (var i = 0; i < m_tags.length; i++) {
					if (encodeURIComponent(m_tags[i]) === XKit.extensions.tag_replacer.t_replace) {
						found_tag = true;
						m_tags[i] = XKit.extensions.tag_replacer.t_with;
						break;
					}
				}

			} else {

				found_tag = true;
				console.log("append mode, appending " + XKit.extensions.tag_replacer.t_with);
				m_tags.push(XKit.extensions.tag_replacer.t_with);

			}

			if (found_tag === false) {
				var perc = Math.round((XKit.extensions.tag_replacer.p_array_index * 100) / XKit.extensions.tag_replacer.p_array.length);
				XKit.progress.value("tag-replacer-pb", perc);
				XKit.extensions.tag_replacer.p_array_index++;
				setTimeout(function() { XKit.extensions.tag_replacer.replace_next(); }, 500);
				return;
			}

			XKit.extensions.tag_replacer.success_count++;

			var tags_to_post = m_tags.join(",");

			var m_post_object = XKit.interface.edit_post_object(data.data, { tags: tags_to_post });

			XKit.interface.edit(m_post_object, function(edit_data) {

				var progress_perc = Math.round((XKit.extensions.tag_replacer.p_array_index * 100) / XKit.extensions.tag_replacer.p_array.length);
				XKit.progress.value("tag-replacer-pb", progress_perc);

				if (edit_data.error === false && edit_data.data.errors === false) {

					console.log("Post " + m_post + " updated successfully.");

					XKit.extensions.tag_replacer.p_array_index++;
					setTimeout(function() { XKit.extensions.tag_replacer.replace_next(); }, 1000);

				} else {

					XKit.extensions.tag_replacer.fail_count++;

					XKit.extensions.tag_replacer.p_array_index++;
					setTimeout(function() { XKit.extensions.tag_replacer.replace_next(); }, 2000);

				}

			});

		});

	},

	next: function(retry_mode) {

		var api_url = "https://api.tumblr.com/v2/blog/" +  XKit.extensions.tag_replacer.url + "/posts" + "?api_key=" + XKit.extensions.tag_replacer.apiKey + "&tag=" + XKit.extensions.tag_replacer.t_replace + "&limit=50" + "&offset=" + XKit.extensions.tag_replacer.page * 50;

		GM_xmlhttpRequest({
			method: "GET",
			url: api_url,
			json: true,
			onerror: function(response) {
				if (response.status === 404) {
					XKit.window.show("Nothing for me to do.", "Tag Replacer could not find any posts containing the tag you were searching for.", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
				} else {
					XKit.extensions.tag_replacer.show_error("<b>Unable to get the blog information.</b><br/>Please try again later.<br/><br/>Error Code: TGR-230");
				}
				return;
			},
			onload: function(response) {
				try {

					var data = JSON.parse(response.responseText);
					var posts = data.response.posts;

					if (posts.length === 0) {
						XKit.extensions.tag_replacer.start_replacing();
						return;
					}

					for (var i = 0; i < posts.length; i++) {
						XKit.extensions.tag_replacer.p_array.push(posts[i].id);
					}

					$("#xkit-tag-replacer-progress").html("Loaded " + XKit.extensions.tag_replacer.p_array.length + " tagged posts..");

					XKit.extensions.tag_replacer.page++;
					setTimeout(function() { XKit.extensions.tag_replacer.next(); }, 1500);

				} catch (e) {
					// Could this be a custom URL and Tumblr's stupidity on stripping the JSON part of the URL requested?
					XKit.extensions.tag_replacer.show_error("<b>Unable to read JSON received from API calls.</b><br/>Please try again later.<br/><br/>Error Code: TGR-235");
					return;
				}

			}
		});

	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("tag_replacer");
		$("#tag_replacer_ul").remove();
	}

});
