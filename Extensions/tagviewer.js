//* TITLE TagViewer **//
//* VERSION 0.5.0 **//
//* DESCRIPTION View post tags easily **//
//* DEVELOPER new-xkit **//
//* DETAILS This extension allows you to see what tags people added to a post while they reblogged it. It also provides access to the post, and to Tumblr search pages to find similar posts.<br><br>Based on the work of <a href='http://inklesspen.tumblr.com'>inklesspen</a> **//
//* FRAME false **//
//* BETA false **//
//* SLOW false **//

XKit.extensions.tagviewer = new Object({

	running: false,
	slow: false,

	button_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAAXNSR0IArs4c6QAAAvBJREFUOBGlVM9L2mEYf96vaVQeWgrTOpUSaxs6yNrBdhiCRJcNL7vIQogxSErZP1CwwW5pmCNvHnbrsEOwg+07iIUjQSg3XIfGiCiTzdpaRvPXPs8XHVKzFXvh8XmfX5/3877P81WEw+ErJycnz4UQViKSIPWrCOO9Vqt9OjY2lqsPNNqLmZmZeQQfNUpgPw77pFar746Pj2fOy+MYM7pVTfKoVKrbKB6siSRJdxBbq1Qq1wqFwtu5uTlDNbehklAsOAr1sVwu38NWhtz3+XyJycnJd2DmgH1h0NNvNgE2WgBMQJTl9Xq/XQb0NOAsmP4E0mwV79KgIhAIrILVAIAG+Zr1QKf3oVBIh7d8A78V+X9tFDMscSESmlmfty5yfQaMMwgaAgIh3XmAHPsXqMRDy/SRa+Xr/C+oMjI8XzxnPG9ms/nz8PBwqqmpaQCHMONdCI/SPA5ehf6z+PBisSijzsKkWlpa+hVAzkgkEjeNRmMcTm06nT7e2toSBwcHzQaDgSwWy6+enp4SimJIfQj9o4YaDAYf47lesA0SFgWQmcGOAWR3cXHRBlt0dXVRR0cH7e3tUSaToba2torL5Sq3t7d/R24/QL9gQh5g/xL5Kuhpv98/pYJhhiHH4/Hs0tKSrbu7m1AoNBqNAtbX10d2u512dnbE8vKyhEM0Op3O63Q6JfiC9WDAIQHHh2QyeYxk29DQENlsNsJVKRqNEmI8TjQ6OkpgRisrK/w05Ha7y3q9XkQiEZHP5xVmDMaLx0a0trbeUKwL/uzv70s4THg8nkN8DNP1ZczwOhxr6+vrKlmWBbpMDoeD8J60ublJJpOJuDGxWIy2t7dpZGSEent7axj8f/kMt5iqOWpNccLxOpvNioWFBcXX2dmpNIUbwoJ55bdVrl4tLkMfQ9wAfFX1kVLMBpjaoeRSqaTe2NgQqVSKcrmcws5qtRI3i9+zuo6geT5d8KVqzjMaoFchKUgBcmZh3g7h/Ap5AlGfAYDjN8f2ldpe2/sVAAAAAElFTkSuQmCC",

	preferences: {
		"notice": {
			text: "Notice",
			type: "separator"
		}
	},

	cpanel: function(obj) {
		if (typeof XKit.extensions.retags == "undefined") {
			$(obj).append("<div id=\"tagviewer-cpanel-notice\">Hi! This extension has no options, but you may be looking for <a id=\"install-retags-shortcut\">Retags</a>.</div>");
			$("#install-retags-shortcut").click(function() {
				function search_for_retags(mutations, observer) {
					mutations.forEach(function(mutation) {
						if ($(mutation.addedNodes).find("#xkit-gallery-search").length) {
							$("#xkit-gallery-search").val("Retags").keyup();
							observer.disconnect();
							return false;
						}
					});
				}
				var gallery_observer = new MutationObserver(search_for_retags);
				$("#xkit-cp-tab-get-extensions").click();
				gallery_observer.observe($("#xkit-control-panel")[0], {
					childList: true,
					subtree: true
				});
			});
		}
	},

	run: function() {

		this.running = true;

		XKit.tools.init_css("tagviewer");
		XKit.interface.create_control_button("xkit-tagviewer", this.button_icon, "TagViewer", "");
		XKit.extensions.tagviewer.init();
		XKit.post_listener.add("tagviewer", XKit.extensions.tagviewer.do);
		if ($(".posts .post").length > 0) {
			XKit.extensions.tagviewer.do();
		}
	},

	init: function() {

		$(document).on("click", ".xkit-tagviewer", function(event) {
			var post_id = $(this).attr('data-post-id');
			var tumblelog_key = $(this).attr('data-xkit-tagviewer-tumblelog-key');
			var tumblelog_name = $(this).attr('data-xkit-tagviewer-tumblelog-name');
			XKit.extensions.tagviewer.view_tags(post_id, tumblelog_key, tumblelog_name);
		});

	},

	notes_url: "",
	found_count: 0,
	last_page: false,
	loading_more: false,
	post_id: "",
	init_id: "",

	view_tags: function(post_id, tumblelog_key, tumblelog_name) {

		// Set tag viewer up and show our window.

		XKit.extensions.tagviewer.init_id = XKit.tools.random_string();
		XKit.extensions.tagviewer.found_count = 0;
		XKit.extensions.tagviewer.post_id = post_id;
		XKit.extensions.tagviewer.last_page = false;
		XKit.extensions.tagviewer.loading_more = false;
		XKit.extensions.tagviewer.notes_url = `https://www.tumblr.com/svc/tumblelog/${tumblelog_name}/${post_id}/notes?mode=reblogs_with_tags`;

		console.log("tagviewer -> init_id is " + XKit.extensions.tagviewer.init_id);

		// Create our window.
		var m_html = "<div class=\"nano\" id=\"tagviewer-window-outer\">" +
				"<div class=\"content\" id=\"tagviewer-window\">" +
					"<div id=\"tagviewer-loading\">Loading, please wait...</div>" +
					"</div></div><div id=\"tagviewer-loader-icon\">&nbsp;</div>";

		$("#tagviewer-window").unbind('scroll');
		XKit.window.show("", m_html, "", "<div id=\"xkit-close-message\" class=\"xkit-button\">Close</div>");
		XKit.extensions.tagviewer.load_tags();

	},

	load_tags: function() {

		let init_id = this.init_id;
		let post_id = this.post_id;

		fetch(this.notes_url)
			.then(response => {
				if (post_id !== this.post_id || init_id !== this.init_id) {
					console.log("[TagViewer] Quitting, wrong post ID or init ID");
					return;
				}

				if (!response.ok) {
					throw response.status;
				}

				response.json().then(responseData => {
					let reblogs = responseData.response.notes.filter(note => note.tags && note.tags.length !== 0);
					for (let reblog of reblogs) {
						this.add_tags(reblog.blog_name, reblog.tags, `${reblog.blog_url}post/${reblog.post_id}`, reblog.avatar_url["64"]);
						this.found_count++;
					}

					if (responseData.response._links) {
						this.notes_url = "https://www.tumblr.com" + responseData.response._links.next.href;
						if (this.found_count <= 7) {
							// Not enough posts with tags loaded to fill the window
							this.show_loader();
							this.load_tags();
						} else {
							// Window filled, wait for user to scroll down
							this.hide_loader();
							this.loading_more = false;
							this.activate_endless_scroll();
						}
					} else {
						this.last_page = true;
						this.hide_loader();
						if (this.found_count === 0) {
							$("#tagviewer-loading").html("No posts with tags found.");
						}
					}
				})
				.catch(console.error);
			})
			.catch(() => XKit.window.show(
				"Unable to fetch required data",
				"TagViewer could not get the required data from the Tumblr servers.<br><br>" +
				"Please try again later or file a bug at the New XKit blog.",

				"error",

				'<div id="xkit-close-message" class="xkit-button default">OK</div>' +
				'<a href="https://new-xkit-extension.tumblr.com" target="_blank" class="xkit-button">New XKit blog</a>'
			));

	},

	activate_endless_scroll: function() {

		$("#tagviewer-window").unbind('scroll');
		$("#tagviewer-window").bind('scroll', function() {

			var c_height = 0;
			$("#tagviewer-window").children().each(function() {
				c_height = c_height + $(this).outerHeight(true);
			});

			if ($("#tagviewer-window").scrollTop() >= c_height - 400) {

				if (XKit.extensions.tagviewer.loading_more) {return; }

				XKit.extensions.tagviewer.loading_more = true;
				XKit.extensions.tagviewer.found_count = 0;

				XKit.extensions.tagviewer.show_loader();

				$("#tagviewer-window-outer").nanoScroller();
				setTimeout(function() { XKit.extensions.tagviewer.load_tags();	}, 2000);

			}

		});

	},

	show_loader: function() {

		$("#tagviewer-loader-icon").css("display", "block");

	},

	hide_loader: function() {

		$("#tagviewer-loader-icon").css("display", "none");

	},

	add_tags: function(by, tags, link, avi) {

		$("#tagviewer-loading").slideUp('slow', function() { $(this).remove(); });

		var m_html = '<div class="tagviewer-tag">' +
						'<div class="tagviewer-by">' +
							`<a target="_blank" href="${link}" class="tagviewer-by-link">${by}</a>` +
							`<img class="tagviewer-by-avatar" src="${avi}">` +
						'</div>' +
						'<div class="tagviewer-tag-tags">';

		for (let tag of tags) {
			m_html += `<a target="_blank" href="https://www.tumblr.com/tagged/${tag.replace(/ /g, "-")}" class="tagviewer-tag-tag">#${tag}</a>`;
		}

		m_html += '</div></div>';

		if ($("#tagviever-mini-loader").length > 0) {
			$("#tagviewer-window").before(m_html);
		} else {
			$("#tagviewer-window").append(m_html);
		}

		$("#tagviewer-window-outer").nanoScroller();

	},

	do: function() {

		// get posts:
		var posts = XKit.interface.get_posts("xkit-tagviewer-done");

		$(posts).each(function() {

			$(this).addClass("xkit-tagviewer-done");

			var m_post = XKit.interface.post($(this));

			// Post has no notes, skip.
			if (m_post.note_count === 0) { return; }

			// Don't add button if we are in inbox.
			if ($(this).hasClass("is_note") && XKit.interface.where().inbox === true) { return; }

			XKit.interface.add_control_button(this, "xkit-tagviewer", "data-xkit-tagviewer-tumblelog-key=\"" + m_post.tumblelog_key + "\" data-xkit-tagviewer-tumblelog-name=\"" + m_post.owner + "\"");

		});
	},

	destroy: function() {
		$(".xtagviewer_post_icon").remove();
		XKit.tools.remove_css("tagviewer");
		XKit.post_listener.remove("tagviewer");
		this.running = false;
	}
});
