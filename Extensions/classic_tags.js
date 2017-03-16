//* TITLE Tag Tracking+ **//
//* VERSION 1.6.4 **//
//* DESCRIPTION Shows your tracked tags on your sidebar **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.classic_tags = new Object({

	running: false,
	slow: true,
	apiKey: XKit.api_key,
	max_posts_per_tag: 10,
	tagcounts: {},
	count_update_handle: null,

	preferences: {
		"sep-1": {
			text: "Tag Search",
			type: "separator"
		},
		"show_new_notification": {
			text: "Show a [new] indicator in the tag search bar",
			default: true,
			value: true
		},
		"redirect_to_tagged": {
			text: "Redirect the followed tags to /tagged/ instead of /search/",
			default: true,
			value: true
		},
		"sep-2": {
			text: "Tags in Sidebar",
			type: "separator"
		},
		"show_tags_on_sidebar": {
			text: "Show Tags on sidebar",
			default: true,
			value: true
		},
		"only_new_tags": {
			text: "Only show tags with new posts",
			default: false,
			value: false
		},
		"prepend_sidebar": {
		    text: "Put tags at top of sidebar",
		    default: false,
		    value: false
		},
		"sep-3": {
			text: "Settings",
			type: "separator"
		},
		"open_in_new_tab": {
			text: "Open the tag results in a new window",
			default: false,
			value: false
		},
		"turn_off_warning": {
			text: "Turn off 'Too Many Tracked Tags' warning",
			default: false,
			value: false
		}
	},

	observer: new MutationObserver(function(mutations) {
		$("#popover_search .result_link").each(function() {
			var link = $(this);
			if (XKit.extensions.classic_tags.preferences.open_in_new_tab.value) {
				link.attr("target", "_BLANK");
			} else {
				link.attr("target", "");
			}

			if (XKit.extensions.classic_tags.preferences.redirect_to_tagged.value) {
				XKit.extensions.classic_tags.redirect_to_tagged.call(this);
			}

			var tag_name = link.attr("data-tag-result");
			var count = XKit.extensions.classic_tags.tagcounts[tag_name];
			if (count) {
				var title = link.find(".result_title");
				title.text(title.text() + " (" + count + ")");
			}
		});
	}),

	redirect_to_tagged: function() {
		// Extract tag from the data-tag-result attribute. May break if
		// Tumblr removes this. Will not break if tumblr changes the
		// link format.
		var tag = $(this).attr("data-tag-result");

		// Construct a URL for the tag, replacing all spaces with "-"
		var newHref = "/tagged/" + tag.replace(/ /g, "-");
		$(this).attr("href", newHref);
	},

	get_post_timestamp: function(blog_name, post_id) {
		var self = this;
		var api_url = "https://api.tumblr.com/v2/blog/" + blog_name + "/posts" + "?api_key=" + self.apiKey + "&id=" + post_id;
		var promise = $.Deferred();

		function fail() {
			console.log("XKit TagTracker+ Error: Unable to fetch post timestamp for " + post_id);
			promise.reject();
		}

		try {
			GM_xmlhttpRequest({
				method: "GET",
				url: api_url,
				onerror: fail,
				onload: function(response) {
					try {
						var data = JSON.parse(response.responseText);
						var post = data.response.posts[0];
						promise.resolve(post.timestamp);
					} catch (e) {
						fail();
					}
				}
			});
		} catch (e) {
			fail();
		}

		return promise;
	},

	get_unread_post_count_for_tag: function(tag_name) {
		var self = this;
		var api_url = "https://api.tumblr.com/v2/tagged?limit=" + self.max_posts_per_tag + "&tag=" + tag_name + "&api_key=" + self.apiKey;
		var promise = $.Deferred();

		function fail() {
			console.log("XKit TagTracker+ Error: Unable to fetch unread tag counts for " + tag_name);
			promise.reject();
		}

		try {
			GM_xmlhttpRequest({
				method: "GET",
				url: api_url,
				onerror: fail,
				onload: function(response) {
					try {
						var data = JSON.parse(response.responseText);
						var newest_post_seen = XKit.storage.get("classic_tags", "lastseen#" + tag_name);
						if (!newest_post_seen) {
							promise.resolve(data.response.length);
							return;
						}

						var newer_posts_count = data.response.map(function(post) {
							return post.timestamp;
						}).filter(function(timestamp) {
							return timestamp > newest_post_seen;
						}).length;

						promise.resolve(newer_posts_count);
					} catch (e) {
						fail();
					}
				}
			});
		} catch (e) {
			fail();
		}

		return promise.then(function(count) {
			if (count === self.max_posts_per_tag) { count += "+"; }
			self.tagcounts[tag_name] = count;
			return count;
		});
	},

	update_tag_timestamp: function() {
		try {
			var current_tag = $(".tag_controls .tag").text().trim();
			var newest_post = $(".posts .post[data-id]").first();
			var post_id = newest_post.attr("data-id");
			var post_data = newest_post.attr("data-json");
			var blog_url = JSON.parse(post_data)["tumblelog-data"].uuid;
			return XKit.extensions.classic_tags.get_post_timestamp(blog_url, post_id).then(function(timestamp) {
				XKit.storage.set("classic_tags", "lastseen#" + current_tag, timestamp);
			});
		} catch (e) {
			console.log("XKit TagTracker+ Error: Couldn't find newest post timestamp on /tagged");
			return $.Deferred().resolve();
		}
	},

	update_tag_counts: function(next_update) {
		var self = this;
		var new_post_count_promises = [];

		function fetch_count(tag_name) {
			var promise = self.get_unread_post_count_for_tag(tag_name);
			new_post_count_promises.push(promise);
			return promise;
		}

		if (self.preferences.show_tags_on_sidebar.value) {
			var list = $("#xtags");
			var list_hidden = list.hasClass("hidden");
			$(".xtag").each(function() {
				var li = $(this);
				var anchor = li.find(".result_link");
				var tag_name = anchor.attr("data-tag-result");
				if (parseInt(self.tagcounts[tag_name], 10) === self.max_posts_per_tag) {
					return true;
				}

				fetch_count(tag_name).then(function(count) {
					if (!count) { return; }
					if (list_hidden) {
						list.removeClass("hidden");
						list_hidden = false;
					}

					li.removeClass("hidden");
					var existing_count = anchor.find(".count");
					if (existing_count.length) {
						existing_count.text(count);
					} else {
						anchor.find(".result_title").removeClass("no_count").after("<span class='count'>" + count + "</span>");
					}
				});
			});
		} else {
			$("#popover_search .result_link").each(function() {
				var link = $(this);
				var tag_name = link.attr("data-tag-result");
				var count = self.tagcounts[tag_name];
				if (!count || parseInt(count, 10) < self.max_posts_per_tag) {
					fetch_count(tag_name);
				}
			});
		}

		var search = $("#search_query");
		var new_label = "Search [new]";
		if (self.preferences.show_new_notification.value && search.attr("placeholder") !== new_label) {
			$.when.apply($, new_post_count_promises).then(function() {
				var any_new_posts = Array.prototype.some.call(arguments, function(count) { return !!count; });
				if (any_new_posts) {
					search.attr("placeholder", new_label);
				}
			});
		}

		self.count_update_handle = setTimeout(self.update_tag_counts.bind(self, next_update * 1.5), next_update);
	},

	run: function() {

		try {

			XKit.tools.init_css("classic_tags");
			if ($("#dashboard_index").length === 0) {
				if (document.location.href.indexOf('/tagged') === -1) {
					return;
				}
			}

			if (XKit.interface.where().tagged && !location.href.match(/before=[0-9]+/i)) {
				XKit.extensions.classic_tags.update_tag_timestamp().then(function() {
					XKit.extensions.classic_tags.show();
				});
			} else {
				XKit.extensions.classic_tags.show();
			}

		} catch (e) {

			console.error("Can't run Classic Tags:" + e.message);

		}
	},

	show: function() {
		if ($(".tracked_tags").length === 0) {
			return;
		}

		if ($("#dashboard_index").length === 0) {
			if (document.location.href.indexOf('/tagged') === -1) {
				return;
			}
		}

		var extra_classes = "";
		var m_html = "";
		var total_tag_count = $(".tracked_tag").length;

		if (XKit.extensions.classic_tags.preferences.show_tags_on_sidebar.value) {
			if (total_tag_count >= 21 && XKit.extensions.classic_tags.preferences.turn_off_warning.value !== true) {

				m_html = "<div class=\"classic-tags-too-much-tags-error\"><b>Too Many Tracked Tags:</b><br> After around 20 tags, Tumblr stops updating the status of all your tracked tags until you untrack some. Please track less than 20 tags for this extension to work.</div>";
				m_html = '<ul class="controls_section" id="xtags"><li class=\"section_header selected\">TRACKED TAGS</li>' + m_html + '</ul>';

				if (document.location.href.indexOf('/tagged/') !== -1) {

					$("#right_column").append(m_html);

				} else {

					if (XKit.extensions.classic_tags.preferences.prepend_sidebar.value === true) {
						$("#right_column").prepend(m_html);
					} else if ($("ul.controls_section:eq(1)").length > 0) {
						if ($("#xim_small_links").length > 0) {
							$("#xim_small_links").after(m_html);
						} else {
							$("ul.controls_section:eq(1)").after(m_html);
						}
					} else {
						//$("#right_column").append(m_html);
						$(".controls_section_radar").before(m_html);
					}
				}

				return;

			}
		}

		$(".tracked_tag").each(function() {
			var result = $(this).find(".result_link");
			var href = result.attr('href');

			if ($("body").attr('data-page-root') === href) {
				extra_classes = "selected";
			} else {
				extra_classes = "";
			}

			if (XKit.extensions.classic_tags.preferences.only_new_tags.value) {
				extra_classes += " hidden";
			}

			var m_title = $(this);
			var result_title = $(m_title).find(".result_title");
			result_title.html(result_title.html().replace("#", ""));

			m_html = m_html + '<li class="xtag ' + extra_classes + '"><div class="hide_overflow">' + $(m_title).html() + '</div></li>';
		});

		if (m_html !== "" && XKit.extensions.classic_tags.preferences.show_tags_on_sidebar.value) {
			var extra_class = XKit.extensions.classic_tags.preferences.only_new_tags.value ? "hidden" : "";
			m_html = '<ul class="controls_section ' + extra_class + '" id="xtags"><li class=\"section_header selected\">TRACKED TAGS</li>' + m_html + '</ul>';

			if (document.location.href.indexOf('/tagged/') !== -1) {
				$("#right_column").children(".tag_controls").after(m_html);
			} else if (XKit.extensions.classic_tags.preferences.prepend_sidebar.value === true) {
			    $("#right_column").prepend(m_html);
			} else if ($("#xim_small_links").length > 0) {
				$("#xim_small_links").after(m_html);
			} else {
				$("#right_column").prepend(m_html);
			}
		}

		var target = document.querySelector('#popover_search');
		XKit.extensions.classic_tags.observer.observe(target, {
			attributes: true
		});
		if (XKit.extensions.classic_tags.preferences.open_in_new_tab.value) {
			$(".result_link").each(function() { $(this).attr("target", "_BLANK"); });
		} else {
			$(".result_link").each(function() { $(this).attr("target", ""); });
		}
		if (XKit.extensions.classic_tags.preferences.redirect_to_tagged.value) {
			$(".result_link").each(XKit.extensions.classic_tags.redirect_to_tagged);
		}

		XKit.extensions.classic_tags.update_tag_counts(2 * 60 * 1000); //start at 2 minutes
	},

	destroy: function() {
		XKit.tools.remove_css("classic_tags");
		$("#xtags").remove();
		$("#search_query").attr("placeholder", "Search Tumblr");
		XKit.extensions.classic_tags.observer.disconnect();
		clearTimeout(XKit.extensions.classic_tags.count_update_handle);
	}

});
