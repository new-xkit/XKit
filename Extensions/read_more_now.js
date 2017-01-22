//* TITLE Read More Now **//
//* VERSION 1.4.7 **//
//* DESCRIPTION Read Mores in your dash **//
//* DETAILS This extension allows you to read 'Read More' posts without leaving your dash. Just click on the 'Read More Now!' button on posts and XKit will automatically load and display the post on your dashboard. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.read_more_now = new Object({

	running: false,
	button_caption: "Read More Now!",
	apiKey: XKit.api_key,

	preferences: {
		auto_open: {
			text: "Auto-open all Read More posts (not recommended)",
			default: false,
			value: false
		},
		inline_button: {
			text: "Show a smaller, inline button for Read More Now",
			default: false,
			value: false
		},
		process_keep_reading: {
			text: "Show Read More Now for Keep Reading links",
			default: true,
			value: true
		}
	},

	run: function() {
		this.running = true;

		if (XKit.interface.where().queue === true || XKit.interface.where().drafts === true) {
			return;
		}

		XKit.post_listener.add("read_more_now", XKit.extensions.read_more_now.do);
		XKit.extensions.read_more_now.do();
		$(document).on('click', '.xkit-read-more-now', function() {
			$(this).addClass("disabled");
			$(this).html("Retrieving post...");
			var m_url = $(this).attr('data-post-url');
			var json_page_parts = m_url.replace(/https?:\/\//, "").split("/");
			var blog_name = json_page_parts[0];
			var post_id = json_page_parts[2];
			var m_cont = $(this);

			var api_url = "https://api.tumblr.com/v2/blog/" + blog_name + "/posts" + "?api_key=" + XKit.extensions.read_more_now.apiKey + "&id=" + post_id;

			GM_xmlhttpRequest({
				method: "GET",
				url: api_url,
				json: true,
				onerror: function() {
					$(m_cont).removeClass("disabled");
					$(m_cont).html(XKit.extensions.read_more_now.button_caption);
					XKit.extensions.read_more_now.show_failed();
				},
				onload: function(response) {
					var data = JSON.parse(response.responseText);
					var m_object = data.response;
					try {
						var m_contents = m_object.posts[0].body;

						if (m_object.posts[0].type === "photo") {
							m_contents = m_object.posts[0]["photo-caption"] ||
						             m_object.posts[0].caption;
						}

						if (m_object.posts[0].type === "answer") {
							m_contents = m_object.posts[0].answer;
						}

						if (m_object.posts[0].type === "link") {
							m_contents = m_object.posts[0].description;
						}

						var post_cont = $(m_cont).parent().parent();
						if (post_cont.find(".post_title").length > 0) {
							var post_title = post_cont.find(".post_title")[0].outerHTML;
							post_cont.html(XKit.extensions.read_more_now.strip_scripts(post_title + m_contents));
						} else {
							post_cont.html(XKit.extensions.read_more_now.strip_scripts(m_contents));
						}

						if (XKit.interface.where().search) {
							post_cont.find("img").load(function() {
								XKit.interface.trigger_reflow();
							});
							XKit.interface.trigger_reflow();
						}
					} catch (e) {
						$(m_cont).removeClass("disabled");
						$(m_cont).html(XKit.extensions.read_more_now.button_caption);
						XKit.extensions.read_more_now.show_failed();
					}
				}});
		});
	},

	strip_scripts: function(post_html) {

		/*
			From:
			http://stackoverflow.com/questions/6659351/removing-all-script-tags-from-html-with-js-regular-expression
		*/

		var div = document.createElement('div');
		div.innerHTML = post_html;
		var scripts = div.getElementsByTagName('script');
		var i = scripts.length;
		while (i--) {
			scripts[i].parentNode.removeChild(scripts[i]);
		}
		return div.innerHTML;
	},

	show_failed: function() {

		XKit.window.show("Unable to fetch read more", "Perhaps the user deleted the post?", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");

	},

	do: function() {
		var need_reflow = false;

		$(".posts .post").not(".xread-more-now-done").each(function() {
			var post = $(this);
			if (post.hasClass("xread-more-now-done")) {
				return;
			}
			post.addClass("xread-more-now-done");

			if (post.hasClass("read_more_container")) {
				XKit.extensions.read_more_now.handle_read_more_post(post);
				need_reflow = true;
				return;
			}

			if (XKit.extensions.read_more_now.preferences.process_keep_reading.value) {
				post.find("a").each(function() {
					var link = $(this);
					var link_text = link.text().trim();
					if ((link_text !== "Keep reading")
                                           && (link_text !== "Weiterlesen")        //German
                                           && (link_text !== "Afficher davantage") //French
                                           && (link_text !== "Continua a leggere") //Italian
                                           && (link_text !== "\u3055\u3089\u306B\u8AAD\u3080")         //Japanese
                                           && (link_text !== "Okumaya devam et")   //Turkish
                                           && (link_text !== "Seguir leyendo")     //Spanish
                                           && (link_text !== "\u0427\u0438\u0442\u0430\u0442\u044C \u0434\u0430\u043B\u044C\u0448\u0435")      //Russian
                                           && (link_text !== "Czytaj dalej")       //Polish
                                           && (link_text !== "Continuar a ler")    //Portuguese (Portugal)
                                           && (link_text !== "Continuar lendo")    //Portuguese (Brazil)
                                           && (link_text !== "Lees verder")        //Dutch
                                           && (link_text !== "\uB354 \uBCF4\uAE30")  //Korean
                                           && (link_text !== "\u7EE7\u7EED\u9605\u8BFB") //Simplified Chinese
                                           && (link_text !== "\u7E7C\u7E8C\u95B1\u8B80") /*Traditional Chinese (Hong Kong & Taiwan)*/) {
						return;
					}
					need_reflow = true;

					if (/https?:\/\/[^.]+\.tumblr\.com\/post\/\d+/.test(link.attr("href"))) {
						XKit.extensions.read_more_now.append_button_with_link(link.parent(), link.attr("href"));
					} else {
						// If url is not of the form
						// http://something.tumblr.com/post/numbers/whatever it needs to be
						// determined based on the post's author
						var real_prefix = 'https://' + post.attr('data-tumblelog-name') + '.tumblr.com/';
						var real_link = link.attr('href').replace(/https?:\/\/[^\/]+\//, real_prefix);
						XKit.extensions.read_more_now.append_button_with_link(link.parent(), real_link);
					}
				});
			}
		});
		if (need_reflow) {
			XKit.interface.trigger_reflow();
		}
	},

	handle_read_more_post: function(post) {
		XKit.extensions.read_more_now.append_button_with_link(post, post.find(".read_more").attr("href"));
	},

	append_button_with_link: function(post, url) {
		var div = document.createElement("div");
		div.classList.add("xkit-read-more-now");
		div.classList.add("xkit-button");
		div.dataset.postUrl = url;
		div.innerHTML = XKit.extensions.read_more_now.button_caption;
		if (XKit.extensions.read_more_now.preferences.inline_button.value === true) {
			div.setAttribute("style", "display: inline-block; text-align: center; margin-left: 10px; margin-top: 0; float: right;");
		} else {
			div.setAttribute("style", "display: block; text-align: center; margin-top: 20px;");
		}
		post.append(div);

		if (XKit.extensions.read_more_now.preferences.auto_open.value === true) {
			setTimeout(function() { $(".xkit-read-more-now").trigger("click"); }, 250);
		}
	},

	destroy: function() {
		$(".xkit-read-more-now").remove();
		this.running = false;
	}

});
