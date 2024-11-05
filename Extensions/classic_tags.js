//* TITLE Tag Tracking+ **//
//* VERSION 1.6.12 **//
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
		"alphabetical_tags": {
			text: "Sort tags alphabetically",
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
	typeahead_dropdown: null,
	tag_text: null,
	tags: [],
	placeholder: null,
	search_input: null,

	observer: new MutationObserver(function(mutations) {
		const {classic_tags} = XKit.extensions;
		const new_tab = classic_tags.preferences.open_in_new_tab.value;

		mutations.forEach(({addedNodes})=> {
			if (!addedNodes) {
				return;
			}

			addedNodes.forEach(addedNode => {
				const container = $(addedNode).filter(classic_tags.typeahead_dropdown);

				if (container.length === 0) {
					return;
				}

				const $tags = container.find("a");

				$tags.each(function() {
					const $tag = $(this);

					$tag.attr("target", new_tab ? "_blank" : "");

					const $name = $tag.find(classic_tags.tag_text);
					const count = classic_tags.tagcounts[$name.text()];
					if (count) {
						$name.text(`${$name.text()} (${count})`);
					}
				});
			});
		});
	}),

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

	update_tag_timestamp: async function() {
		try {
			const current_tag = decodeURIComponent(location.pathname.split('/')[2].replace(/\+/g, ' '));
			const newest_post = $("[data-id]").first();

			if (newest_post != null) {
				const post = await XKit.interface.react.post(newest_post);

				return this.get_post_timestamp(post.owner, post.id).then(function(timestamp) {
					XKit.storage.set("classic_tags", "lastseen#" + current_tag, timestamp);
				});
			}
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
						anchor.find(".result_title").after(`<span class="count">${count}</span>`);
					}
				});
			});
		} else {
			self.tags.tags.forEach(tag => {
				var count = self.tagcounts[tag.name];

				if (!count || parseInt(count, 10) < self.max_posts_per_tag) {
					fetch_count(tag.name);
				}
			});
		}

		if (self.preferences.show_new_notification.value) {
			$.when.apply($, new_post_count_promises).then(function() {
				var any_new_posts = Array.prototype.some.call(arguments, function(count) { return !!count; });
				self.search_input.attr("placeholder", `${self.placeholder}${(any_new_posts ? " [New]" : "")}`);
			});
		}

		self.count_update_handle = setTimeout(self.update_tag_counts.bind(self, next_update * 1.5), next_update);
	},

	run: function() {
		XKit.tools.init_css("classic_tags");

		var where = XKit.interface.where();

		if (!where.dashboard && !where.tagged) {
			return;
		}

		XKit.css_map.getCssMap().then(() => {
			this.typeahead_dropdown = XKit.css_map.keyToCss("typeaheadDropdown");
			this.tag_text = XKit.css_map.keyToCss("tagText");

			if (where.tagged) {
				this.update_tag_timestamp().then(() => this.show());
			} else {
				this.show();
			}
		}).catch(e => console.error("Can't run Classic Tags:" + e.message));
	},

	show: async function() {
		const where = XKit.interface.where();
		if (!where.dashboard && !where.tagged) {
			return;
		}

		const $container = $(XKit.css_map.descendantSelector("formContainer", "targetWrapper"));
		const $sidebar = $(XKit.css_map.keyToCss("sidebar")).find("aside");

		this.search_input = $container.find("input[name='q']");
		this.placeholder = this.search_input.attr("placeholder");

		this.tags = await XKit.tools.async_add_function(async () => {
			const result = await window.tumblr.apiFetch("/v2/user/followed_tags", { method: "GET", queryParams: { limit: 20 } });
			const tag_expression = new RegExp(/^#?(.+)/);

			return {
				tags: result.response.timeline.elements.map(tag => {
					const match = tag.tagName.match(tag_expression);
					const tag_name = match != null ? match[1] : tag.tagName;

					return ({
						name: tag_name,
						link: tag.links.tap.href
					});
				}),
				more: result.response.timeline.links.next != null
			};
		});

		var extra_classes = "";
		var m_html = "";

		if (this.preferences.alphabetical_tags.value) {
			this.tags.tags.sort((tagA, tagB) => (tagA.name > tagB.name) ? 1 : -1);
		}

		this.tags.tags.forEach(tag => {

			if (location.href === tag.link) {
				extra_classes = "selected";
			} else {
				extra_classes = "";
			}

			if (this.preferences.only_new_tags.value) {
				extra_classes += " hidden";
			}

			const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 18 18' width='18' height='18' fill='rgba(var(--white-on-dark), 0.65)'><path d='M 0 0 L 0 8 L 11 18 L 18 10 L 8 0 L 0 0 z M 3.5 2 A 1.5 1.5 0 0 1 5 3.5 A 1.5 1.5 0 0 1 3.5 5 A 1.5 1.5 0 0 1 2 3.5 A 1.5 1.5 0 0 1 3.5 2 z '></path></svg>`;

			m_html += `
				<div class="xtag ${extra_classes}">
					<a class="result_link" href="${tag.link}" data-tag-result="${tag.name}" ${(this.preferences.open_in_new_tab.value ? "target='_blank'" : "")}>
						<div class="hide_overflow">
							<span class="result_icon">${svg}</span>
							<span class="result_title">${tag.name}</span>
						</div>
					</a>
				</div>
			`;

		});

		if (m_html !== "" && this.preferences.show_tags_on_sidebar.value) {
			if (this.tags.more === true && this.preferences.turn_off_warning.value !== true) {
				m_html += "<div class=\"classic-tags-too-much-tags-error\"><b>Too Many Tracked Tags:</b><br> Only 20 tracked tags will be listed here.</div>";
			}

			const extra_class = this.preferences.only_new_tags.value ? "hidden" : "";
			m_html = `
				<div class="${XKit.css_map.keyToClasses("sidebarItem").join(" ")} ${extra_class}" id="xtags">
					<div class="${XKit.css_map.keyToClasses("sidebarTitle").join(" ")}">Tracked Tags</div>
					${m_html}
				</div>
			`;

			if (this.preferences.prepend_sidebar.value === true) {
				$sidebar.prepend(m_html);
			} else {
				$sidebar.append(m_html);
			}
		}

		var target = $container[0];
		this.observer.observe(target, {
			subtree: true,
			childList: true
		});

		this.update_tag_counts(2 * 60 * 1000); //start at 2 minutes
	},

	destroy: function() {
		XKit.tools.remove_css("classic_tags");
		$("#xtags").remove();
		XKit.extensions.classic_tags.search_input.attr("placeholder", XKit.extensions.classic_tags.placeholder);
		XKit.extensions.classic_tags.observer.disconnect();
		clearTimeout(XKit.extensions.classic_tags.count_update_handle);
	}

});
