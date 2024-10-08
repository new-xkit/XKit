//* TITLE XKit Patches **//
//* VERSION 7.4.20 **//
//* DESCRIPTION Patches framework **//
//* DEVELOPER new-xkit **//

XKit.extensions.xkit_patches = new Object({

	running: false,

	run: function() {
		this.running = true;

		this.run_order.filter(x => {
			return this.run_order.indexOf(x) >= this.run_order.indexOf(XKit.version);
		}).forEach(x => {
			this.patches[x]();
		});

		if (XKit.browser().firefox === true && XKit.storage.get("xkit_patches", "w_edition_warned") !== "true") {
			let version = XKit.tools.parse_version(XKit.version);
			if (version.major === 7 && version.minor >= 8) {
				fetch(browser.extension.getURL("manifest.json")) // eslint-disable-line no-undef
					.then(response => response.json())
					.then(responseData => {
						if (responseData.applications.gecko.id === "@new-xkit-w") {
							XKit.window.show(
								"W Edition warning",
								"XKit Patches has determined that you are using <br><b>New XKit (W Edition)</b>, an unofficial upload of New XKit.<br><br>" +
								'Due to how XKit\'s extension gallery works, this upload violates <a href="https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/AMO/Policy/Reviews#Development_Practices" target="_blank">Mozilla\'s policy on remote code execution</a> ' +
								"for listed add-ons, and is in danger of being banned at any time; potentially deleting your local XKit data.<br><br>" +
								"We recommend installing the official distribution of New XKit from GitHub to avoid this possibility.<br><br>" +
								"Be sure to upload or export your configuration using XCloud before uninstalling W Edition. " +
								"Also, since the two versions conflict, you should uninstall W Edition before re-installing from GitHub.",

								"warning",

								'<a href="https://github.com/new-xkit/XKit/releases/latest" target="_blank" class="xkit-button default">New XKit installation page &rarr;</a>' +
								'<div id="xkit-close-message" class="xkit-button">Close</div>' +
								`<div id="dismiss-warning" class="xkit-button float-right">Don't show this again</div>`
							);

							$("#dismiss-warning").click(() => {
								XKit.window.close();
								XKit.storage.set("xkit_patches", "w_edition_warned", "true");
							});
						} else {
							XKit.storage.set("xkit_patches", "w_edition_warned", "true");
						}
					})
					.catch(console.error);
			} else {
				XKit.storage.set("xkit_patches", "w_edition_warned", "true");
			}
		}

		// Identify retina screen displays. Unused anywhere else
		try {
			XKit.retina = window.devicePixelRatio > 1;
		} catch (e) { }

		if (XKit.frame_mode === true) {
			// from xkit.js
			/* globals xkit_check_storage */
			xkit_check_storage();

			// console.log("XKit Patches determined that it's in frame mode, resizing stuff!");

			$("#iframe_controls,#dashboard_iframe").css("width", "auto");

			var m_url = $("#tumblelog_name").attr('data-tumblelog-name');

			if (m_url === "undefined") { return; }

		}

		// Increasing storage for extensions from 50kb to 150kb.
		if (XKit.storage.unlimited_storage === true) {
			// If we have unlimited storage, make it 10 mb.
			XKit.storage.max_area_size = 10485760;
		} else {
			XKit.storage.max_area_size = 153600;
		}

		window.addEventListener("message", XKit.blog_listener.eventHandler);

		// Scrape Tumblr's data object now that we can run add_function
		const blog_scraper = XKit.page.react ?
			function() {
				/* globals tumblr */
				let blogs = [];
				Promise.race([
					new Promise((resolve) => setTimeout(resolve, 30000)),
					(async () => {
						const {response} = await tumblr.apiFetch("/v2/user/info", {
							queryParams: {'fields[blogs]': 'name'},
						});
						blogs = response.user.blogs.map(blog => blog.name);
					})()
				]).finally(() => {
					window.postMessage({
						xkit_blogs: blogs
					}, window.location.protocol + "//" + window.location.host);
				});
			} :
			function() {
				var blogs = [];
				try {
					var models = Tumblr.dashboardControls.allTumblelogs;
					models.filter(function(model) {
						return model.attributes.hasOwnProperty("is_current");
					}).forEach(function(model) {
						blogs.push(model.attributes.name);
					});
				} catch (e) {} finally {
					window.postMessage({
						xkit_blogs: blogs
					}, window.location.protocol + "//" + window.location.host);
				}
			};
		XKit.tools.add_function(blog_scraper, true);

		XKit.tools.add_function(function fix_autoplaying_yanked_videos() {

			if (!window._ || !window.jQuery) {
				return;
			}

			if (_.get(window, "Tumblr.Prima.CrtPlayer")) {
				window.Tumblr.Prima.CrtPlayer.prototype.onLoadedMetadata =
				_.wrap(window.Tumblr.Prima.CrtPlayer.prototype.onLoadedMetadata,
					function(wrapped, _event) {
						if (!this.$el.is(":visible") || !jQuery.contains(document, this.$el[0])) {
							if (!this.$el.find('video[src^="blob:"]').length) {
								return true;
							}
						}
						return wrapped.call(this, _event);
					});
			}

			// unfortunately we're not fast enought to catch some
			// CRT instances that are currently instantiated, so handle those differently
			jQuery('video').parent().each(function() {
				this.addEventListener('loadedmetadata', function(event) {
					var $target = jQuery(event.target);
					if (!$target.is(":visible") || !jQuery.contains(document, event.target)) {
						event.stopPropagation();
					}
				}, true); // uses .parent() and capturing to preempt tumblr's js
			});
		}, true, {});

		XKit.tools.add_function(function fix_jk_scrolling() {
			if (!window._ || !window.jQuery) {
				return;
			}

			if (_.get(window, "Tumblr.KeyCommands.update_post_positions")) {
				Tumblr.KeyCommands.update_post_positions = _.wrap(Tumblr.KeyCommands.update_post_positions,
					function(wrapped, _event) {
						wrapped.call(this);
						this.post_positions = _.pick(this.post_positions,
							function(scroll_pos, element_id) {
								var element = jQuery("[data-pageable='" + element_id + "']");
								return element.is(":visible") && element.height() > 0;
							});
					});
			}
		}, true, {});

		setTimeout(function() {

			var form_key_to_save = $('meta[name=tumblr-form-key]').attr("content");

			if (typeof form_key_to_save !== "undefined" && form_key_to_save !== "") {
				XKit.storage.set("xkit_patches", "last_stored_form_key", window.btoa(form_key_to_save));
			}

		}, 1000);
	},

	run_order: ["7.9.2"],

	patches: {
		"7.9.2": function() {

			/**
			 * Given a list of different collections in `items`, return all
			 * possible ways to select exactly one element from each collection
			 *
			 * For example, given `[[1, 2], ['a', 'b']]`, return
			 * `[[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]`.
			 *
			 * @param {Array<Array<Object>>} items - a list of collections to combine
			 * @param {Array} current - The current recursive subtree, for tail recursion.
			 * @returns {Array<Array<Object>>} - the list of combinations
			 */
			XKit.tools.cartesian_product = (items, current = []) => {
				if (current.length < items.length) {
					return items[current.length].flatMap(pick =>
						XKit.tools.cartesian_product(items, current.concat(pick))
					);
				} else {
					return [current];
				}
			};

			XKit.post_listener.debounce_timer = null;

			XKit.post_listener.observer = new MutationObserver(mutations => {
				const criteria = XKit.page.react ? "[data-id]" : ".post_container, .post";
				let new_posts = false;
				const observed = mutations.some(({addedNodes, target}) => {
					for (let i = 0; i < addedNodes.length; i++) {
						const $addedNode = $(addedNodes[i]);
						if ($addedNode.is(criteria) || $addedNode.find(criteria).length) {
							new_posts = true;
							return true;
						}
					}

					return $(target).parents(criteria).length !== 0;
				});

				if (observed) {
					const self = XKit.post_listener;
					clearTimeout(self.debounce_timer);
					if (new_posts) {
						self.run_callbacks();
					} else {
						self.debounce_timer = setTimeout(self.run_callbacks, 60);
					}
				}
			});

			XKit.post_listener.run_callbacks = function() {
				Object.values(XKit.post_listener.callbacks).forEach(list => list.forEach(callback => {
					try {
						callback();
					} catch (e) {
						console.error(e);
					}
				}));
			};

			/**
			 * Show an XKit alert window
			 * @param {String} title - Text for alert window's title bar
			 * @param {String} msg - Text for body of window, can be HTML
			 * @param {"error"|"warning"|"question"|"info"} icon - Window's
			 *   icon type, determined by CSS class `icon`.
			 * @param {String} buttons - The HTML to be used in the button area of the window.
			 *                           Usually divs with class "xkit-button".
			 * @param {boolean} wide - Whether the XKit window should be wide.
			 */
			XKit.window.show = function(title, msg, icon = "", buttons = "", wide) {
				const wide_class = wide ? "xkit-wide-window" : "";

				$("#xkit-window").fadeOut('fast', function() {
					$(this).remove();
				});

				let window_html = `
					<div id="xkit-window" class="${icon} ${wide_class}" style="display:none">
						<div class="xkit-window-title">${title}</div>
						<div class="xkit-window-msg">${msg}</div>
						<div class="xkit-window-buttons">${buttons}</div>
					</div>`;

				if ($("#xkit-window-shadow").length === 0) {
					window_html += '<div id="xkit-window-shadow"></div>';
				}

				$("body").prepend(window_html);
				$("#tiptip_holder").css("z-index", "99000000");
				centerIt($("#xkit-window"));

				$("#xkit-window")
					.fadeIn('fast')
					.keydown(event => event.stopPropagation());

				$("#xkit-close-message").click(function() {
					$("#xkit-window-shadow").fadeOut('fast', function() {
						$(this).remove();
					});
					$("#xkit-window").fadeOut('fast', function() {
						$(this).remove();
					});
				});
			};

			/**
			 * Removes the leading whitespace that occurrs on every line of
			 * `string`, and replaces it with the string passed in as `level`.
			 * This is often helpful for making the output of template strings
			 * more readable, by normalizing the additional indentation that
			 * comes with their position in a source file.
			 *
			 * @param {String} level - the amount of indentation to add to
			 *     every line, as a string. May be '' for no indentation.
			 * @param {String} string - the input string to remove and/or add
			 *     indentation from/to.
			 * @returns {String} - the normalized string
			 */
			XKit.tools.normalize_indentation = (level, string) => {
				const lines = string.split("\n");
				const indentation_level = _.minBy(
					lines.map(line => line.match(/^[ \t]+/)),
					i => i ? i[0].length : Infinity
				) || '';

				const leading_indentation = new RegExp(`^${indentation_level}`);
				return lines.map(line => line.replace(leading_indentation, level)).join("\n");
			};

			/**
			 * Gets redpop translation strings for selecting elements via aria labels
			 * @param {String} key - en_US string to translate
			 * @return {Promise} - resolves with the translated key
			 */
			XKit.interface.translate = key => new Promise(resolve => {
				function grabLanguageData() {
					const waitForTumblrObject = setInterval(() => {
						if (window.tumblr) {
							clearInterval(waitForTumblrObject);
							window.postMessage({
								languageData: window.tumblr.languageData
							}, `${location.protocol}//${location.host}`);
						}
					}, 100);
				}

				function receiveLanguageData(e) {
					if (e.origin === `${location.protocol}//${location.host}` && e.data.languageData !== undefined) {
						window.removeEventListener("message", receiveLanguageData);

						if (e.data.languageData.code === "en_US") {
							XKit.interface.translations = null;
							resolve(key);
						} else {
							XKit.interface.translations = e.data.languageData.translations;
							resolve(XKit.interface.translations[key]);
						}
					}
				}

				if (XKit.interface.translations === null) {
					resolve(key);
				} else if (XKit.interface.translations !== undefined) {
					resolve(XKit.interface.translations[key]);
				} else {
					window.addEventListener("message", receiveLanguageData);
					XKit.tools.add_function(grabLanguageData, true);
				}
			});

			/**
			 * Copies a function from the addon context into the page context. This
			 * function will be serialized to a string, and then injected as a script tag
			 * into the page.
			 * @param {Function} func
			 * @param {boolean} exec - Whether to execute the function immediately
			 * @param {Object} addt - The desired contents of the global variable
			 *                        `add_tag`. Only useful if `exec` is true
			 */
			XKit.tools.add_function = function(func, exec, addt) {
				if (!XKit.tools.add_function_nonce) {
					const scripts = document.querySelectorAll('script');
					for (let i = 0; i < scripts.length; i++) {
						var nonce = scripts[i].getAttribute('nonce') || scripts[i].nonce;
						if (nonce) {
							XKit.tools.add_function_nonce = nonce;
							break;
						}
					}
				}

				try {
					var script = document.createElement("script");
					script.textContent = "var add_tag = " + JSON.stringify(addt) + ";\n";
					script.textContent = script.textContent +
						(exec ? "(" : "") +
						XKit.tools.normalize_indentation('', func.toString()) +
						(exec ? ")();" : "");
					if (XKit.tools.add_function_nonce) {
						script.setAttribute('nonce', XKit.tools.add_function_nonce);
					}
					document.body.appendChild(script);
				} catch (e) {
					XKit.window.show("Error",
						"XKit failed to inject a script. Details:" +
						"<p>" + e.message + "</p>",
						"error",
						'<div class="xkit-button default" id="xkit-close-message">OK</div>'
					);
				}
			};

			const async_callbacks = {};
			window.addEventListener('message', event => {
				const target_origin = window.location.protocol + "//" + window.location.host;
				if (event.origin === target_origin && event.data.xkit_callback_nonce) {
					async_callbacks[event.data.xkit_callback_nonce](event.data);
					delete async_callbacks[event.data.xkit_callback_nonce];
				}
			});

			/**
			 * Copies a function from the addon context into the page context
			 * and returns the result of the function as a promise.
			 *
			 * @param {Function} func - This function is rendered to a string
			 *     and then injected into the page.
			 * @param {Object} args - arguments to pass to the function.
			 *     Since the function is rendered to a string before being
			 *     injected, it can't close over any variables, so everything
			 *     used from the calling scope must be passed as an argument
			 *
			 * @return {Promise} - the return value or thrown error from the
			 *     injected function
			 */
			XKit.tools.async_add_function = function(func, args) {
				return new Promise((resolve, reject) => {
					const callback_nonce = Math.random();

					const add_func = `(async ({callback_nonce, args}) => {
						try {
							const return_value = await (${XKit.tools.normalize_indentation("\t".repeat(7), func.toString())})(args);

							window.postMessage({
								xkit_callback_nonce: callback_nonce,
								return_value,
							}, window.location.protocol + "//" + window.location.host);
						} catch (exception) {
							window.postMessage({
								xkit_callback_nonce: callback_nonce,
								exception: JSON.stringify({
									...exception,
									message: exception.message,
									stack: exception.stack,
								}),
							})
						}
					})(add_tag)`;

					async_callbacks[callback_nonce] = (data) => {
						if ('return_value' in data) {
							resolve(data.return_value);
						} else {
							const original_exception = data.exception && JSON.parse(data.exception);
							const error = new Error(`Error in injected function (${original_exception.message})`);
							error.cause = original_exception;
							reject(error);
						}
					};

					XKit.tools.add_function(add_func, false, {callback_nonce, args});
				});
			};

			/**
			 * Edit up to 100 posts at a time via Mass Post Editor
			 *
			 * @param {string[]} post_ids - array of post IDs to edit
			 * @param {object} config - settings object
			 * @param {string} config.mode - "add", "remove", or "delete"
			 * @param {string[]} [config.tags] - array of tags to add or remove
			 * @returns {Promise<object>}
			 */
			XKit.interface.mass_edit = function(post_ids, config) {
			    const path = {
			        "add": "add_tags_to_posts",
			        "remove": "remove_tags_from_posts",
			        "delete": "delete_posts"
			    }[config.mode];

			    let payload = {
			        "post_ids": post_ids.join(","),
			        "form_key": XKit.interface.form_key()
			    };

			    if (config.mode !== "delete") {
			        payload.tags = config.tags.join(",");
			    }

			    return XKit.tools.Nx_XHR({
			        method: "POST",
			        url: `https://www.tumblr.com/${path}`,
			        headers: {
			            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
			        },
			        data: $.param(payload)
			    });
			};

			// Override "Search Page Brick Post Fix" from xkit.css
			XKit.tools.add_css(
				`.post_brick .post_controls .post_controls_inner {
					white-space: nowrap;
				}`,
			"xkit_patches");

			XKit.interface.sidebar = {
				init: function() {
					const html = `<div id="xkit_sidebar"></div>`;
					const priority = [
						$(".small_links"),
						$("#dashboard_controls_open_blog"),
						$(".controls_section.inbox"),
						$(".sidebar_link.explore_link"),
						$(".controls_section.recommended_tumblelogs"),
						$("#tumblr_radar")
					];

					for (let section of priority) {
						if (section.length) {
							section.first().after(html);
							break;
						}
					}
					if (!$("#xkit_sidebar").length) {
						$("#right_column").append(html);
					}

					XKit.tools.add_css(`
						.controls_section.recommended_tumblelogs:not(:first-child) {
							margin-top: 18px !important;
						}`,
					"sidebar_margins_fix");
				},

				/**
				 * Constructs HTML to add to the sidebar.
				 * Primarily used by add, but can be used directly for custom positioning.
				 * @param {Object} section
				 * @param {String} section.id - The element ID for the whole sidebar section
				 * @param {String} [section.title] - Visible header text of the sidebar section
				 * @param {Object[]} [section.items] - Array of objects containing button data
				 * @param {String} section.items[].id - Button element ID
				 * @param {String} section.items[].text - Visible button text
				 * @param {Number/String} [section.items[].count] - Text to be displayed as a counter on the button
				 * @param {Boolean} [section.items[].carrot] - Whether to put a right-facing arrow on the button (shouldn't be combined with count)
				 * @param {Object[]} [section.small] - Array of objects containing small link data (shouldn't contain more than two)
				 * @param {String} section.small[].id - Button element ID
				 * @param {String} section.small[].text - Visible button text
				 * @return {String} Plug-ready sidebar controls section HTML
				 */
				construct: function(section) {
					section.items = section.items || [];
					section.small = section.small || [];

					var html = `<ul id="${section.id}" class="controls_section">`;
					if (section.title) {
						html += `<li class="section_header">${section.title}</li>`;
					}
					for (let item of section.items) {
						html += `
							<li class="controls_section_item">
								<a id="${item.id}" class="control-item control-anchor" style="cursor:pointer">
									<div class="hide_overflow">
										${item.text}
										${(item.carrot ? '<i class="sub_control link_arrow icon_right icon_arrow_carrot_right"></i>' : "")}
									</div>
									<span class="count">${item.count || ""}</span>
								</a>
							</li>`;
					}
					html += "</ul>";

					if (section.small.length !== 0) {
						html += '<div class="small_links">';
						for (let item of section.small) {
							html += `<a id="${item.id}" style="cursor:pointer">${item.text}</a>`;
						}
						html += "</div>";
					}

					return html;
				},

				/**
				 * Shortcut command for constructing and applying controls sections
				 * @param {Object} section - see construct's documentation
				 */
				add: function(section) {
					if (!$("#xkit_sidebar").length) {
						this.init();
					}

					$("#xkit_sidebar").append(this.construct(section));
				},

				remove: id => $(`#${id}, #${id} + .small_links`).remove()
			};

			XKit.svc = {
				blog: {
					followed_by: data => XKit.tools.Nx_XHR({
						method: "GET",
						url: "https://www.tumblr.com/svc/blog/followed_by?" + $.param(data)
					})
				},

				conversations: {
					participant_info: data => XKit.tools.Nx_XHR({
						method: "GET",
						url: "https://www.tumblr.com/svc/conversations/participant_info?" + $.param(data)
					})
				},

				indash_blog: data => XKit.tools.Nx_XHR({
					method: "GET",
					url: "https://www.tumblr.com/svc/indash_blog?" + $.param(data)
				}),

				post: {
					fetch: data => XKit.tools.Nx_XHR({
						method: "GET",
						url: "https://www.tumblr.com/svc/post/fetch?" + $.param(data)
					}),
					update: (data, kitty) => XKit.tools.Nx_XHR({
						method: "POST",
						url: "https://www.tumblr.com/svc/post/update",
						headers: {
							"X-Tumblr-Puppies": kitty
						},
						json: true,
						data: JSON.stringify(data)
					}),
					delete: data => XKit.tools.Nx_XHR({
						method: "POST",
						url: "https://www.tumblr.com/svc/post/delete",
						headers: {
							"Content-Type": "application/x-www-form-urlencoded; charset=UTF-8"
						},
						data: $.param(data)
					})
				}
			};

			/**
			 * Determines whether a user is following the given blog.
			 * The logged-in user must be a member of the given blog to determine this.
			 * @param {String} username
			 * @param {String} blog
			 * @return {Promise<Boolean>}
			 */
			XKit.interface.is_following = function(username, blog) {
				return XKit.svc.blog.followed_by({
					"query": username,
					"tumblelog": blog
				}).then(response => response.json().response.is_friend);
			};

			XKit.blog_listener = {
				callbacks: {},
				done: false,
				add: function(extension, func) {
					if (this.done) {
						func.call(XKit.extensions[extension], XKit.tools.get_blogs());
					} else {
						XKit.blog_listener.callbacks[extension] = func;
					}
				},
				eventHandler: function(e) {
					if (e.origin == window.location.protocol + "//" + window.location.host && e.data.hasOwnProperty("xkit_blogs")) {
						window.removeEventListener("message", XKit.blog_listener.eventHandler);

						if (e.data.xkit_blogs.length) {
							XKit.blogs_from_tumblr = e.data.xkit_blogs.map(XKit.tools.escape_html);
							XKit.tools.set_setting('xkit_cached_blogs', XKit.blogs_from_tumblr.join(';'));
						}

						XKit.blog_listener.done = true;
						var callbacks = XKit.blog_listener.callbacks, blogs = XKit.tools.get_blogs();
						for (var extension in callbacks) {
							callbacks[extension].call(XKit.extensions[extension], blogs);
						}
					}
				}
			};

			XKit.css_map = {
				cssMap: null,

				getCssMap: async function() {
					if (this.cssMap) {
						return this.cssMap;
					}

					this.cssMap = await XKit.tools.async_add_function(async () => {
						if (!window.tumblr) {
							return null;
						}
						const cssMap = await window.tumblr.getCssMap();
						return cssMap;
					});
					return this.cssMap;
				},

				keyToClasses: function(key) {
					if (!this.cssMap || !this.cssMap.hasOwnProperty(key)) {
						return;
					}
					return this.cssMap[key];
				},

				keyToCss: function(key) {
					const classes = this.keyToClasses(key);
					if (!classes) {
						return;
					}
					return classes.map(cls => '.' + cls).join(', ');
				},

				/**
				 * Given any number of keys, turns them into a css selector
				 * where key[0] contains key[1], etc.
				 *
				 * Because CSS commas always take precedence over spaces, and
				 * :is has poor browser support, this requires enumerating all
				 * possible combinations of `key[0] key[1]` and then separating
				 * them with commas.
				 *
				 * @param {...String} keys - the cssMap keys to combine.
				 * @returns {String} - the combined CSS selector.
				 */
				descendantSelector: function(...keys) {
					return XKit.tools.cartesian_product(
						keys.map(key => this.keyToClasses(key).map(cls => `.${cls}`))
					).map(selectors => selectors.join(' ')).join(',');
				},
			};
			_.bindAll(XKit.css_map, ['getCssMap', 'keyToClasses', 'keyToCss', 'descendantSelector']);

			// eslint-disable-next-line no-async-promise-executor
			XKit.tools.Nx_XHR = details => new Promise(async (resolve, reject) => {
				details.timestamp = new Date().getTime() + Math.random();

				const form_key = XKit.interface.form_key() || await XKit.interface.async_form_key();

				const standard_headers = {
					"X-Requested-With": "XMLHttpRequest",
					"X-Tumblr-Form-Key": form_key,
					"X-XKit-Version": XKit.version,
				};

				if (details.headers === undefined) {
					details.headers = standard_headers;
				} else {
					let existing = Object.keys(details.headers).map(x => x.toLowerCase());
					for (let x of Object.keys(standard_headers)) {
						if (!existing.includes(x.toLowerCase())) {
							details.headers[x] = standard_headers[x];
						}
					}
				}

				function send() {
					var request = add_tag;
					var xhr = new XMLHttpRequest();
					xhr.open(request.method, request.url, request.async || true);

					if (request.json === true) {
						xhr.setRequestHeader("Content-type", "application/json");
					}
					for (var header in request.headers) {
						xhr.setRequestHeader(header, request.headers[header]);
					}

					function callback(result) {
						var bare_headers = xhr.getAllResponseHeaders().split("\r\n");
						var cur_headers = {}, splitter;
						for (var x in bare_headers) {
							splitter = bare_headers[x].indexOf(":");
							if (splitter === -1) { continue; }
							cur_headers[bare_headers[x].substring(0, splitter).trim().toLowerCase()] = bare_headers[x].substring(splitter + 1).trim();
						}
						window.postMessage({
							response: {
								status: xhr.status,
								responseText: xhr.response,
								headers: cur_headers
							},
							timestamp: "xkit_" + request.timestamp,
							success: result
						}, window.location.protocol + "//" + window.location.host);
					}

					xhr.onerror = function() { callback(false); };
					xhr.onload = function() { callback(true); };

					if (typeof request.data !== "undefined") {
						xhr.send(request.data);
					} else {
						xhr.send();
					}
				}

				function receive(e) {
					if (e.origin === window.location.protocol + "//" + window.location.host && e.data.timestamp === "xkit_" + details.timestamp) {
						window.removeEventListener("message", receive);
						let {success, response} = JSON.parse(JSON.stringify(e.data));

						if (typeof response.headers["x-tumblr-kittens"] !== "undefined") {
							XKit.interface.kitty.set(response.headers["x-tumblr-kittens"]);
						}

						response.json = () => JSON.parse(response.responseText);

						if (success && response.status >= 200 && response.status < 300) {
							if (details.onload) { response = details.onload(response); }
							resolve(response);
						} else {
							if (details.onerror) { response = details.onerror(response); }
							reject(response);
						}
					}
				}

				window.addEventListener("message", receive);
				XKit.tools.add_function(send, true, details);

			});

			/**
			 * Get the posts on the screen without the given tag
			 * @param {String} without_tag - Class that the posts should not have
			 * @param {Boolean} mine - Whether the posts must be the user's
			 * @param {Boolean} can_edit - Whether the posts must be editable
			 * @return {Array<Object>} The posts
			 */
			XKit.interface.get_posts = function(without_tag, mine, can_edit) {
				var posts = [];

				var selector = ".post";
				var where = XKit.interface.where();

				if (mine && !where.channel && !where.drafts && !where.queue) {
					selector = ".post.is_mine";
				}

				var selection = $(selector);

				var exclusions = [".radar", ".new_post_buttons", ".post_micro"];

				if (typeof without_tag !== "undefined") {
					exclusions.push("." + without_tag);
				}

				for (var i = 0; i < exclusions.length; i++) {
					selection = selection.not(exclusions[i]);
				}

				selection.each(function() {
					// If can_edit is requested and we don't have an edit post control,
					// don't push the post
					if (can_edit && $(this).find(".edit").length === 0) {
						return;
					}
					posts.push($(this));
				});
				return posts;
			};

			XKit.interface.post_window.blog =
				() => $("#channel_id").val() || $(".post-form--header [data-js-tumbleloglabel]").text();

			XKit.interface.post_window.reblogging_from =
				() => $(".post-form--header .reblog_source .reblog_name").text();

			/**
			 * @param {JQuery} obj - Post element
			 * @return {Promise<Object>} Resolves to an interface Post Object or rejects
			 */
			XKit.interface.async_post = function(obj) {
				if ($(obj).attr('data-id') && XKit.page.react) {
					return XKit.interface.react.post(obj);
				} else {
					const post_object = XKit.interface.post(obj);
					if (post_object.error) {
						return Promise.reject(post_object);
					} else {
						return Promise.resolve(post_object);
					}
				}
			};

			XKit.interface.react = {
				post_props: async function(post_id) {
					// eslint-disable-next-line no-shadow
					return XKit.tools.async_add_function(({post_id}) => {
						const keyStartsWith = (obj, prefix) =>
							Object.keys(obj).find(key => key.startsWith(prefix));
						const element = document.querySelector(`[data-id="${post_id}"]`);
						let fiber = element[keyStartsWith(element, '__reactFiber')];

						while (fiber.memoizedProps.timelineObject === undefined) {
							fiber = fiber.return;
						}
						return fiber.memoizedProps.timelineObject;
					}, {post_id});
				},

				post: async function($element) {
					const id = $element.data('id');
					const post = await this.post_props(id);

					return {
						id: id,
						root_id: post.rebloggedRootId || id,
						reblog_key: post.reblogKey,
						owner: post.blogName,
						get tumblelog_key() { throw new Error('not supported'); },
						liked: post.liked,
						permalink: post.postUrl,
						type: 'regular',
						body: $element.find("header + div").html(),
						get animated() { throw new Error('not supported'); },
						is_reblogged: !!post.rebloggedFromUuid,
						is_mine: post.canEdit,
						is_following: post.followed,
						can_edit: post.canEdit,
						source_owner: post.rebloggedRootName,
						reblog_link: post.rebloggedFromUrl,
						reblog_owner: post.rebloggedFromName,
						reblog_original_id: post.rebloggedFromId,
						note_count: post.noteCount,
						avatar: post.blog.avatar[post.blog.avatar.length - 1].url,
						tags: post.tags.join(","),
					};
				},
				/**
				 * Get the posts on the screen without the given tag
				 * @param {String} without_tag - Class that the posts should not have
				 * @param {Boolean} can_edit - Whether the posts must be editable
				 * @return {jQuery} JQuery object containing the posts
				 */
				get_posts: async function(without_tag, can_edit) {
					let selector = "[data-id]";
					if (without_tag !== undefined) {
						selector += `:not(.${without_tag})`;
					}

					if (can_edit) {
						const edit_label = await XKit.interface.translate("Edit");
						return $(selector).filter((index, post) => $(post).find(`[aria-label='${edit_label}']`).length !== 0);
					}

					return $(selector);
				},

				/**
				 * @param {String} post_id
				 * @return {Object} Interface Post Object of post with given id
				 */
				find_post: async function(post_id) {
					// Return a post object based on post ID.
					var post = $(`[data-id='${post_id}']`);

					if (post.length > 0) {
						return await XKit.interface.react.post(post);
					} else {
						var m_error = {};
						m_error.error = true;
						m_error.error_message = "Object not found on page.";
						return m_error;
					}
				},

				control_button_template: null,
				added_func: {},

				get_control_button_template: async function() {
					await XKit.css_map.getCssMap();

					var selector = XKit.css_map.keyToClasses("controlIcon").map(css => `[data-id]:first footer .${css}:first`).join(", ");
					var control = $(selector);

					var get_used_class_from_map = function(key) {
						const keyCss = XKit.css_map.keyToCss(key);
						var element = control.find(keyCss);

						return element.attr("class");
					};

					var controlIconClass = control.attr("class");
					var buttonClass = get_used_class_from_map("button");

					var new_control = `
						<div class="${controlIconClass} {{className}} xkit-interface-control-button" title="{{text}}" {{additional}}>
							<button class="${buttonClass}" aria-label="" tabindex="0">
								<div class="xkit-interface-icon" {{data}}></div>
							</button>
						</div>
					`;

					this.control_button_template = new_control;

					return this.control_button_template;
				},
				/**
				 * Create a specification for a control button that can be added to
				 * future posts using `XKit.interface.add_control_button`.
				 * @param {String} class_name - CSS class of the button to be created
				 * @param {String} icon - URL of the button's icon
				 * @param {String} text - Hover text of the button
				 * @param {EventListener} func - Function called on click of control button
				 * @param {String?} ok_icon - URL of icon displayed when the button is
				 *                            "completed" (e.g. reblog button turning green)
				 */
				create_control_button: async function(class_name, icon, text, func, ok_icon) {
					if (this.control_button_template == null) {
						this.control_button_template = await this.get_control_button_template();
					}

					XKit.interface.added_icon.push(class_name);
					XKit.interface.added_icon_icon.push(icon);
					XKit.interface.added_icon_text.push(text);
					XKit.interface.react.added_func[class_name] = func;

					XKit.tools.add_css(`.${class_name} .xkit-interface-icon {
						background-image: url('${icon}');
						background-size: 100% 100%;
						width: 21px;
						height: 21px;
					}`, `xkit_interface_icon__${class_name}`);

					if (typeof ok_icon !== "undefined") {
						XKit.tools.add_css(`.${class_name} .xkit-interface-completed {
							background-image: url('${ok_icon}');
						}`, `xkit_interface_icon__completed__${class_name}`);
					}
				},
				add_control_button: async function(obj, class_name, additional) {
					if (typeof additional == "undefined") {additional = ""; }

					if (XKit.interface.added_icon.indexOf(class_name) === -1) {
						return;
					}

					var m_text = XKit.interface.added_icon_text[XKit.interface.added_icon.indexOf(class_name)];

					var post_obj = await XKit.interface.react.post(obj);
					var post_id = post_obj.id;
					var post_type = post_obj.type;
					var post_permalink = post_obj.permalink;

					var m_data = `data-post-id = "${post_id}" data-post-type="${post_type}" data-permalink="${post_permalink}"`;

					var template = this.control_button_template;
					var func = XKit.interface.react.added_func[class_name];

					var m_html = template
						.replace(/{{className}}/g, class_name)
						.replace(/{{text}}/g, m_text)
						.replace(/{{additional}}/g, additional)
						.replace(/{{data}}/g, m_data)
					;

					// we know that XKit.css_map.getCssMap() has been called because we have a template from create_control_button
					// so we skip that call with this XKit.css_map.keyToCss() call.
					var controlsSelector = XKit.css_map.keyToCss("controls");
					var controls = $(obj).find(controlsSelector).last();

					if (controls.length > 0) {
						controls.prepend(m_html);

						controls.on('click', '.' + class_name, function(event) {
							if ($(this).hasClass("xkit-interface-working") || $(this).hasClass("xkit-interface-disabled")) { return; }
							if (typeof func === "function") { func.call(this, event); }
						});
					}
				},

				// Each function here requires a Interface Post Object,
				// you can get using interface.post.
				update_view: {
					/**
					 * Set the tags of a post
					 * @param {Object} post_obj - Interface Post Object provided by XKit.interface.post
					 * @param {String} tags - Comma-separated array of tags
					 */
					tags: async function(post_obj, tags) {
						var post_div = $(`[data-id='${post_obj.id}']`);

						var m_inner = "";
						var tags_array = tags.split(",");

						await XKit.css_map.getCssMap();

						var post_tag = XKit.css_map.keyToClasses("tag").join(" ");

						for (var i = 0; i < tags_array.length; i++) {
							const tag = tags_array[i].trim();

							if (tag) {
								m_inner += `<a class="${post_tag}" href="/tagged/${encodeURIComponent(tag)}">#${tag}</a>`;
							}
						}

						var tags_class = XKit.css_map.keyToCss("tags");
						var tags_element = $(post_div).find(tags_class);
						if (tags_element.length > 0) {
							tags_element.find("div:first-child").html(m_inner);

						} else {
							var m_html = `<div class="${XKit.css_map.keyToClasses("tags").join(" ")}"><div>${m_inner}</div></div>`;
							$(post_div).find("footer").before(m_html);

						}
					},
				},

				init_collapsed: function(id) {
					//adjust colors to look good on the sidebar if we're there
					const automatic_color = 'var(--blog-contrasting-title-color, rgba(var(--white-on-dark), 0.65))';
					const automatic_button_color = 'var(--blog-contrasting-title-color, rgb(var(--white-on-dark)))';

					//symmetrically reduce the "top and bottom" margins of a hidden post by this amount
					const shrink_post_amount = '12px';

					XKit.tools.add_css(`
						.xkit--react .${id}-collapsed {
							opacity: 0.75;
							margin-bottom: calc(20px - ${shrink_post_amount});
							transform: translateY(calc(-${shrink_post_amount}/2));
						}
						.xkit--react .${id}-collapsed-note {
							height: 30px;
							color: ${automatic_color};
							padding-left: 15px;
							display: flex;
							align-items: center;
						}
						.xkit--react .${id}-collapsed-button {
							line-height: initial;
							margin: 0;
							position: absolute !important;
							right: 5px;
							display: none !important;
						}
						.xkit--react .${id}-collapsed:hover .${id}-collapsed-button {
							display: inline-block !important;
						}
						.xkit--react .${id}-collapsed-button {
							color: rgba(${automatic_button_color}, 0.8);
							background: rgba(${automatic_button_color}, 0.05);
							border-color: rgba(${automatic_button_color}, 0.3);
						}
						.xkit--react .${id}-collapsed-button:hover {
							color: rgba(${automatic_button_color});
							background: rgba(${automatic_button_color}, 0.1);
							border-color: rgba(${automatic_button_color}, 0.5);
						}
						.xkit--react .${id}-collapsed-note ~ div {
							display: none;
						}
					`, id);
				},

				collapse: function($post, note_text, id) {
					$post.addClass(`${id}-collapsed`);
					const button = `<div class="xkit-button ${id}-collapsed-button">show post</div>`;
					$post.prepend(`<div class="${id}-collapsed-note">${note_text}${button}</div>`);
					$post.on('click', `.${id}-collapsed-button`, (e) => {
						const $clickedbutton = $(e.target);
						const $clickedpost = $clickedbutton.parents(`.${id}-collapsed`);
						const $note = $clickedbutton.parents(`.${id}-collapsed-note`);

						$clickedpost.removeClass(`${id}-collapsed`);
						$note.remove();
					});
				},

				destroy_collapsed: function(id) {
					$(`.${id}-collapsed`).removeClass(`${id}-collapsed`);
					$(`.${id}-collapsed-note`).remove();
				}
			};

			XKit.interface.async_form_key = async function() {
				const request = await fetch('https://www.tumblr.com/developers');
				const meta_tag = (await request.text()).match(
					/tumblr-form-key[^>]*content=("([^"]+)"|'([^']+)')/
				);

				if (meta_tag) {
					const form_key = meta_tag[2] || meta_tag[3];
					XKit.storage.set('xkit_patches', 'last_stored_form_key', window.btoa(form_key));
					return form_key;
				}
			};

			/**
			 * Get the secure_form_key through a request using the current form_key
			 * @param {Function} callback - invoked with `{errors: Boolean, kitten: String}`
			 * @param {Boolean} retry_mode - if true, don't retry on failure
			 */
			XKit.interface.kitty.get = async function(callback, retry_mode = false) {
				if (XKit.interface.kitty.stored !== "") {
					const kitty_diff = (new Date()) - XKit.interface.kitty.store_time;
					if (kitty_diff <= XKit.interface.kitty.expire_time && kitty_diff > 0) {
						callback({errors: false, kitten: XKit.interface.kitty.stored});
						return;
					}
				}

				if (!XKit.interface.form_key()) {
					await XKit.interface.async_form_key();
				}

				XKit.tools.Nx_XHR({
					method: "POST",
					url: "https://www.tumblr.com/svc/secure_form_key",
					onload: function(response) {
						XKit.interface.kitty.store_time = new Date().getTime();
						XKit.interface.kitty.stored = response.headers["x-tumblr-secure-form-key"];

						callback({errors: false, kitten: XKit.interface.kitty.stored, response});
					},
					onerror: function(response) {
						XKit.interface.kitty.stored = "";
						XKit.storage.set("xkit_patches", "last_stored_form_key", "");

						if (!retry_mode) {
							XKit.interface.kitty.get(callback, true);
						} else {
							callback({errors: true, kitten: "", response});
						}
					}
				});
			};

			/**
			 * @return {Object} Information about the browser's current location in Tumblr with keys
			 *	inbox: boolean - Whether viewing inbox
			 *	activity: boolean - Whether viewing activity
			 *	queue: boolean - Whether viewing queue
			 *	channel: boolean - Whether viewing a channel
			 *	search: boolean - Whether viewing a search
			 *	drafts: boolean - Whether viewing drafts
			 *	followers: boolean - Whether viewing followers
			 *	channel: boolean - Whether viewing a channel
			 *	tagged: boolean - Whether viewing tagged posts
			 *	user_url: String - The url of the currently viewed side blog
			 *	endless: boolean - Whether the current view scrolls endlessly
			 *	following: boolean - Whether viewing the following page
			 */
			XKit.interface.where = function() {
				const is_tumblr_page = XKit.interface.is_tumblr_page();
				const is_blog_page = location.pathname.startsWith("/blog");
				const current_blog_page = location.pathname.split("/")[3];

				return {
					dashboard:	is_tumblr_page && location.pathname.startsWith("/dashboard"),
					inbox:		is_tumblr_page && (location.pathname.startsWith("/inbox") || current_blog_page === "messages"),
					likes:		is_tumblr_page && location.pathname.startsWith("/likes"),
					following:	is_tumblr_page && location.pathname.startsWith("/following"),
					channel:	is_tumblr_page && is_blog_page && !current_blog_page,
					followers:	is_tumblr_page && is_blog_page && current_blog_page === "followers",
					activity:	is_tumblr_page && is_blog_page && current_blog_page === "activity",
					drafts:		is_tumblr_page && is_blog_page && current_blog_page === "drafts",
					queue:		is_tumblr_page && is_blog_page && current_blog_page === "queue",
					explore:	is_tumblr_page && location.pathname.startsWith("/explore"),
					search:		is_tumblr_page && location.pathname.startsWith("/search"),
					tagged:		is_tumblr_page && location.pathname.startsWith("/tagged"),

					endless:	is_tumblr_page && $("body").hasClass("without_auto_paginate") === false,
					user_url:	is_tumblr_page && is_blog_page ? location.pathname.split("/")[2] : "",
				};
			};

			XKit.interface.hide = function(selector, extension) {
				XKit.tools.add_css(`${selector} {height: 0; margin: 0; overflow: hidden;}`, extension);
			};
		},
	},

	destroy: function() {
		// console.log = XKit.log_back;
		XKit.tools.remove_css("xkit_patches");
		this.running = false;
	}

});
