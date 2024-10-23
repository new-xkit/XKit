//* TITLE XKit Patches **//
//* VERSION 7.4.23 **//
//* DESCRIPTION Patches framework **//
//* DEVELOPER new-xkit **//

XKit.extensions.xkit_patches = new Object({

	running: false,

	run: function() {
		this.running = true;

		if (this.run_order.includes(XKit.version)) {
			this.run_order.filter(x => {
				return this.run_order.indexOf(x) >= this.run_order.indexOf(XKit.version);
			}).forEach(x => {
				this.patches[x] && this.patches[x]();
			});
		}

		if (XKit.browser().firefox === true && XKit.storage.get("xkit_patches", "w_edition_warned") !== "true") {
			let version = XKit.tools.parse_version(XKit.version);
			if (version.major === 7 && version.minor >= 8) {
				fetch(browser.runtime.getURL("manifest.json")) // eslint-disable-line no-undef
					.then(response => response.json())
					.then(responseData => {
						if (responseData.applications && responseData.applications.gecko.id === "@new-xkit-w" ||
							responseData.browser_specific_settings && responseData.browser_specific_settings.gecko.id === "@new-xkit-w") {
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

	run_order: ["7.8.1", "7.8.2", "7.9.0", "7.9.1", "7.9.2"],

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

		"7.9.1": function() {},

		"7.9.0": function() {},

		"7.8.2": function() {
			XKit.api_key = "kZSI0VnPBJom8cpIeTFw4huEh9gGbq4KfWKY7z5QECutAAki6D";

			XKit.tools.init_css("xkit_patches");

			/**
			 * Get the user's currently selected blog.
			 * @return {String} blog id, e.g. new-xkit-extension.
			 */
			XKit.tools.get_current_blog = function() {
				var avatar = $("#post_controls_avatar");
				if (avatar.length > 0) {
					var image = avatar.find(".post_avatar_image");
					if (image.length > 0) {
						return image.attr("alt");
					}
				}
				console.log('XKit.tools.get_current_blog: Warning, fell back to main blog');
				return XKit.tools.get_blogs()[0];
			};

			/**
			 * Parse an XKit extension version string of form X.Y.Z or X.Y REV Z
			 * @param {String} versionString
			 * @return {Object} version descriptor with keys major, minor, and patch
			 */
			XKit.tools.parse_version = function(versionString) {
				if (typeof(versionString) === "undefined" || versionString === "") {
					return {major: 0, minor: 0, patch: 0};
				}
				var version = {};
				var versionSplit = versionString.split(".");
				if (versionSplit.length < 3) {
					var revisionString = versionSplit[1].toLowerCase().split("rev");
					version.major = parseInt(versionSplit[0]);
					version.minor = parseInt(revisionString[0].trim());
					if (typeof(revisionString[1]) === "undefined") {
						version.patch = 0;
					} else {
						// No need for toLowerCase here since we already do that when we split versionSplit above
						version.patch = revisionString[1].trim().charCodeAt(0) - "a".charCodeAt(0);
					}
				} else {
					version.major = parseInt(versionSplit[0]);
					version.minor = parseInt(versionSplit[1]);
					version.patch = parseInt(versionSplit[2]);
				}
				return version;
			};

			/**
			 * @return {Array<String>} user's blogs' IDs
			 */
			XKit.tools.get_blogs = function() {
				var m_blogs = [];

				// Approach 1: Scrape the tumblelog models for ones we control
				// code is above

				if (XKit.blogs_from_tumblr) {
					m_blogs = XKit.blogs_from_tumblr;
					XKit.tools.set_setting('xkit_cached_blogs', m_blogs.join(';'));
					return m_blogs;
				}

				// Approach 2: Scrape from the dynamically-created popover element.

				var blog_menu_items = $("[data-js-channel-list] .popover_menu_item_blog");
				if (blog_menu_items.length) {

					blog_menu_items.each(function() {
						var blog_url = this.id.split("--")[1];
						if (blog_url) {
							m_blogs.push(blog_url);
						}
					});

					if (m_blogs.length) {
						XKit.tools.set_setting('xkit_cached_blogs', m_blogs.join(';'));
						return m_blogs;
					}
				}

				// Approach 3: Use the last good cached data that we saved in settings
				m_blogs = XKit.tools.get_setting("xkit_cached_blogs", "");
				if (m_blogs !== "") {
					return m_blogs.split(";");
				}
			};

			XKit.tools.make_file = function(filename, data, options) {
				try {

					if (!Array.isArray(data)) {
						data = [data];
					}

					var blob = new Blob(data, options || { type: "text/plain" });
					var fakelink = document.createElement("a");
					var url = window.URL.createObjectURL(blob);

					fakelink.style.display = "none";
					fakelink.href = url;
					fakelink.download = filename || true;

					document.body.appendChild(fakelink);
					fakelink.click();
					window.URL.revokeObjectURL(url);
					return true;

				} catch (e) {
					console.error(e.message);
					return false;
				}
			};

			/**
			 * Creates a link to a github issue with error text and template
			 * @param {String} title - the title of the github issue--should be unique and useful
			 * @param {Object?} data - Key-value pairs to list at the top of the issue.
			 * @param {Error?} error - An exception to serialize, if availible
			 * @return {String} The url to link the user to
			 */
			XKit.tools.github_issue = function(title, data, error) {

				if (!data) {
					data = {};
				}

				data['User Agent'] = window.navigator.userAgent;
				data['XKit Version'] = XKit.version;
				data['Patches Version'] = XKit.installed.get("xkit_patches").version;
				data['Extensions'] = XKit.installed.list().join(", ");
				data['URL'] = window.location.toString();

				var body = "\xA0\n*Please describe what actions we can take to reproduce the bug you found, " +
				  "including any links or screenshots that might help us figure out what's going on.*\n\n\n" +
			   "-----------\n\n";

				if (error) {
					body += "```\n" +
					error.stack +
					"\n```\n\n";
				}

				body += "System Data | \xA0 \n";
				body += "----------- | -----------\n";
				$.each(data, function(key, value) {
					body += key + " | " + value + "\n";
				});

				return "https://github.com/new-xkit/XKit/issues/new?" + $.param({body: body, title: title});
			};


			/**
			 * Quick-and-dirty function debouncing.
			 * Debounced functions will only occur 'delay' milliseconds after their last call.
			 * Multiple calls before the function is executed resets the timer.
			 * @param {Function} func - Function to wrap. Will be executed with
										the *last* passed 'this' values and arguments
			 * @param {Number} wait - Milliseconds to pass to setTimeout. Delay that occurs after the last function call
			 * @return {Function} The wrapped, debounced function.
			 */
			XKit.tools.debounce = function(func, wait) {
				var timeout_id;
				return function() {
					var last_context = this;
					var last_args = arguments;

					var exec = function() {
						timeout_id = null;
						func.apply(last_context, last_args);
					};
					clearTimeout(timeout_id);
					timeout_id = setTimeout(exec, wait);
				};
			};

			/**
			 * Cached nonce for use in script injection to overcome CSP
			 */
			XKit.tools.add_function_nonce = "";

			/**
			 * @return {Object} The elements of XKit's storage as a map from setting key to
			 *                  setting value
			 */
			XKit.tools.dump_config = function() {
				if (XKit.browser().safari) {
					var obj = XBridge.storage_area;
					for (var x in obj) {
						obj[x] = XBridge.storage.read(x);
					}
					return obj;
				} else {
					// from WebExtension/bridge.js
					/* globals xkit_storage */
					return xkit_storage;
				}
			};

			/**
			 * @param {String} text - the text to be escaped
			 * @return {String} Will return the passed text, with all potentially
			 *                  dangerous-for-HTML characters escaped
			 *
			 * see also https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet#XSS_Prevention_Rules
			 * for the source of the list of escaping rules in this function.
			 *
			 * Under no circumstances should the output of this function be injected into
			 * an unquoted element attribute, as there are many ways to escape from an
			 * unquoted attribute that aren't covered here. Don't use unquoted attributes
			 */
			XKit.tools.escape_html = function(text) {
				return String(text)
			.replace(/&/g, "&amp;")
			.replace(/</g, "&lt;")
			.replace(/>/g, "&gt;")
			.replace(/"/g, "&quot;")
			.replace(/'/g, "&#039;")
			.replace(/\//g, "&#x2F;");
			};

			/**
			 * @param {String} name - Name of URL parameter to retrieve
			 * @return {String} Value of parameter or ""
			 */
			XKit.tools.getParameterByName = function(name) {
				// http://stackoverflow.com/a/901144/2073440
				name = encodeURIComponent(name);
				var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
					results = regex.exec(location.search);
				if (results === null) {
					return "";
				} else {
					var parameter = results[1];
					return decodeURIComponent(parameter.replace(/\+/g, " "));
				}
			};

			/**
			 * @return {Object} An overview of the browser's information:
			 *	name: "Google Chrome" | "Mozilla Firefox" | "Apple Safari" - The browser's human-readable name
			 *	spoofed: boolean - Whether XKit suspects the user of spoofing an IE user agent.
			 *	chrome: boolean - Whether the browser is Chrome
			 *	firefox: boolean - Whether the browser is Firefox
			 *	safari: boolean - Whether the browser is Safari
			 *	opera: boolean - Whether the browser is Opera (Always false as implemented currently)
			 *	version: number - The numerical representation of the browser's version or 0 if unknown
			 *	mobile: boolean - Whether Tumblr is serving the mobile version of the site
			 */
			XKit.browser = function() {

				var to_return = {};

				to_return.name = "UNKNOWN";
				to_return.spoofed = false;
				to_return.chrome = false;
				to_return.firefox = false;
				to_return.safari = false;
				to_return.opera = false;
				to_return.version = 0;
				to_return.mobile = false;

				// First, let's check if it's chrome.
				if (window.chrome) {
					to_return.chrome = true;
				} else {
					// it can still be chrome?
					var is_chrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
					to_return.chrome = is_chrome;
				}

				function get_ua_version(user_agent) {
					var index = navigator.userAgent.toLowerCase().indexOf(user_agent);
					var real_version = parseFloat(navigator.userAgent.toLowerCase().substring(index + (user_agent.length)));
					return real_version;
				}

				if (to_return.chrome === true) {
					// Get version.
					to_return.name = "Google Chrome";
					to_return.version = get_ua_version("chrome/");
				}

				// Then, let's check if it's firefox.
				if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
					to_return.name = "Mozilla Firefox";
					to_return.firefox = true;
					to_return.version = get_ua_version("firefox/");
				}

				// Blahblah Safari blah.
				if (/Safari/.test(navigator.userAgent) && /Apple Computer/.test(navigator.vendor)) {
					to_return.name = "Apple Safari";
					to_return.safari = true;
					to_return.firefox = false;
					to_return.version = get_ua_version("safari/");
				}

				to_return.ug = navigator.userAgent.toLowerCase();

				// Check if there is spoofing!
				// A lot of people now switch to IE.
				if (navigator.userAgent.indexOf('MSIE') > -1) {
					to_return.spoofed = true;
				}

				// Check if you're viewing the mobile version
				if ($('.is_mobile').length > 0) {
					to_return.mobile = true;
				}

				return to_return;

			};

			XKit.iframe = {

				/**
				 * @return {String} Id of blog which the iframe refers to (usually
				 *                  the blog in which the iframe is embedded)
				 */
				get_tumblelog: function() {
					var new_channel_id = document.location.href.match(/[&?]tumblelogName=([\w-]+)/);
					var archive_channel_id = document.location.href.match(/[&?]name=([\w-]+)/);
					var old_channel_id = $("#tumblelog_name").attr('data-tumblelog-name');
					return (new_channel_id && new_channel_id[1]) || (archive_channel_id && archive_channel_id[1]) || old_channel_id;
				},

				/**
				 * @return {String} Post to which this iframe refers
				 */
				single_post_id: function() {
					var all_post_ids = document.location.href.match(/[&?](singlePostId|pid|postId)=(\d+)/);
					return all_post_ids[2];
				},

				/**
				 * @return {String} Form key of the iframe (the data to use in a
				 *                  reblog or other API request)
				 */
				form_key: function() {
					var new_form_key = $("meta[name=tumblr-form-key]").attr("content");
					var old_form_key = $(".btn.reblog").attr('data-form-key');
					return new_form_key || old_form_key;
				},

				/**
				 * Hide the text of a button in the iframe.
				 * @param {JQuery} button
				 */
				hide_button: function(button) {
					button.addClass("no_label");
					button.addClass("no-text").contents()
						.filter(function() {
							return this.nodeType === 3;
						}).wrap('<span class="hidden">');

					button.children(".button-label").hide();
				},

				/**
				 * @param  {String} name: the css class name of the button
				 * @return {JQuery} the element for that css class name
				 */
				tx_button_selector: function(name) {
					return $(`.tx-button.${name}-button, .tx-icon-button.${name}-button`);
				},

				/**
				 * @return {JQuery} The follow button in the iframe
				 */
				follow_button: function() {
					return this.tx_button_selector("follow");
				},

				/**
				 * @return {JQuery} The unfollow button in the iframe
				 */
				unfollow_button: function() {
					return this.tx_button_selector("unfollow");
				},

				/**
				 * @return {JQuery} The delete button in the iframe
				 */
				delete_button: function() {
					return this.tx_button_selector("delete");
				},

				/**
				 * @return {JQuery} The reblog button in the iframe
				 */
				reblog_button: function() {
					return this.tx_button_selector("reblog");
				},

				/**
				 * @return {JQuery} The dashboard button in the iframe
				 */
				dashboard_button: function() {
					return this.tx_button_selector("dashboard");
				},

				/**
				 * Uses tumblr's built-in RPC functionality to resize the in-blog iframe.
				 * The iframe will be resized to the maximum of the current body size or
				 * the iframe-controls-container size.
				 *
				 * This is the same postMessage call that happens when you click on the
				 * profile menu, without the body classes arguments. (Tumblr also allows
				 * for the code to set classes on the iframe element and the body of the page)
				 */
				size_frame_to_fit: function() {
					var button_container = $(".iframe-controls-container")[0] || {};

					var width = Math.max(
						button_container.scrollWidth || -Infinity,
						document.body.scrollWidth);

					var height = Math.max(
						button_container.scrollHeight || -Infinity,
						document.body.scrollHeight);

					var payload = {
						method: "tumblr-unified-controls:IframeControls:size",
						args: [{
							width: width,
							height: height
						}]
					};

					window.top.postMessage(JSON.stringify(payload), "*");
				}
			};

			/**
			 * Close the current XKit alert window. Counterpart to `XKit.window.show`
			 */
			XKit.window.close = function() {

				$("#xkit-window-shadow").fadeOut('fast');
				$("#xkit-window-old").fadeOut('fast');
				$("#tiptip_holder").css("z-index", "99999");
				$("#xkit-window").fadeOut('fast', function() {
					$(this).remove();
					$("#xkit-window-shadow").remove();
					$("#xkit-window-old").remove();
				});

			};

			XKit.interface = new Object({

				revision: 2,

				added_icon: [],
				added_icon_icon: [],
				added_icon_text: [],

				post_window_listener_id: [],
				post_window_listener_func: [],
				post_window_listener_running: false,
				post_window_listener_window_id: 0,

				/**
				 * Interface for tracking the secure_form_key used in Tumblr API
				 * requests.
				 */
				kitty: {

					stored: "",
					store_time: 0,
					expire_time: 600000,

					/**
					 * @param {String} kitty - The new secure_form_key value.
					 */
					set: function(kitty) {

						if (typeof kitty === "undefined") { kitty = ""; }
						//// console.log("XKitty: Setting kitty to \"" + kitty + "\"");
						XKit.interface.kitty.stored = kitty;

					},
				},

				post_window: {

					added_icon: [],
					added_icon_icon: [],
					added_icon_text: [],

					/**
					 * Create a specification for a control button that can be added to
					 * future posts using `XKit.post_window.add_control_button`.
					 * @param {String} class_name - CSS class of the button to be created
					 * @param {String} icon - URL of the button's icon
					 * @param {String} text - Hover text of the button
					 * @param {EventListener} func - Function called on click of control button
					 */
					create_control_button: function(class_name, icon, text, func) {

						XKit.interface.post_window.added_icon.push(class_name);
						XKit.interface.post_window.added_icon_icon.push(icon);
						XKit.interface.post_window.added_icon_text.push(text);

						XKit.tools.add_css("." + class_name + " {" +
								" background-image: url('" + icon + "') !important;" +
								" background-size: auto auto !important;" +
								"}", "xkit_interface_post_window_icon___" + class_name);

						$(document).on('click', '.' + class_name, function() {
							if ($(this).hasClass("xkit-interface-working") || $(this).hasClass("xkit-interface-disabled")) { return; }
							if (typeof func === "function") { func.call(this, event); }
						});

					},

					/**
					 * Instantiate and add a previously "created" button to the
					 * current post window.
					 * @param {String} class_name - CSS class of the button to be added
					 * @param {String?} additional - String inserted into the button's div tag
					 */
					add_control_button: function(class_name, additional) {

						if (typeof additional == "undefined") {additional = ""; }

						if (XKit.interface.post_window.added_icon.indexOf(class_name) === -1) {
							// console.log("Interface -> Can't add icon, button not created, use create_control_button.");
							return;
						}

						var m_text = XKit.interface.post_window.added_icon_text[XKit.interface.post_window.added_icon.indexOf(class_name)];
						var m_html = "<div title=\"" + m_text + "\" class=\"xkit-interface-control-button " + class_name + "\" " + additional + "></div>";

						// Add to area above controls
						var control_area = $(".post-form--controls");
						if (control_area.length > 0) {
							var xkit_area = control_area.find("#xkit-interface-buttons");
							if (xkit_area.length > 0) {
								xkit_area.prepend(m_html);
							} else {
								control_area.prepend("<div id=\"xkit-interface-buttons\">" + m_html + "</div>");
							}
						}
					},

					/**
					 * @return {String} HTML content of the current post window
					 */
					get_content_html: function() {
						if ($(".html-field").css("display") === "none") {
							//rich text editor
							var content_editor = $('.post-form--form').find('.editor.editor-richtext');
							if (content_editor.length === 0) {
								console.error('ERROR: unable to get content html');
								return '';
							}
							return content_editor.html();
						} else if ($('.chat-field').length > 0 && $('.chat-field').css("display") !== "none") {
							//chat post editor
							return $('editor-plaintext').html();
						} else {
							var html_or_markdown = $(".tab-label[data-js-srclabel]").text();
							if (html_or_markdown === 'HTML') {
								var text = $('.ace_editor .ace_text-layer').text();
								// replace nonebreaking spaces with normal ones
								text = text.replace(/\xa0/g, ' ');
								return text;
							}
							throw "Invalid editor type.";
						}
					},

					/**
					 * Sets the content of the post window.
					 * @param {String} new_content
					 */
					set_content_html: function(new_content) {
						if ($(".html-field").css("display") === "none") {
							var content_editor = $('.post-form--form').find('.editor.editor-richtext');
							if (content_editor.length === 0) {
								console.error('unable to set content html');
								return;
							}
							content_editor.focus();
							content_editor.html(new_content);
							content_editor.addClass("editor-richtext-has-text");
							content_editor.blur();
							return;
						}

						var html_or_markdown = $(".tab-label[data-js-srclabel]").text();
						XKit.tools.add_function(function() {
							/* globals require */
							/* eslint-disable no-shadow */
							var new_content = add_tag[0];
							var html_or_markdown = add_tag[1];
							/* eslint-enable no-shadow */
							var editor_div = document.getElementsByClassName("ace_editor");
							if (html_or_markdown === "Markdown") {
								new_content = require('to-markdown').toMarkdown(new_content);
							}
							if (editor_div.length === 1) {
								var editor = window.ace.edit(editor_div[0]);
								editor.setValue(new_content);
								setTimeout(function() {
									jQuery(".ace_marker-layer").empty();
								}, 500);
							}
						}, true, [new_content, html_or_markdown]);
					},

					/**
					 * Adds tags to the post window.
					 * @param {String|Array<String>} tag_or_tags
					 */
					add_tag: function(tag_or_tags) {
						var tag_editor = $(".post-form--tag-editor").find(".editor-plaintext");
						function add_single_tag(tag) {
							tag_editor.focus();
							tag_editor.text(tag);
							tag_editor.addClass("editor-plaintext-has-text");
							tag_editor.blur();
						}
						if (typeof tag_or_tags !== "string") {
							tag_or_tags.forEach(function(tag) {
								add_single_tag(tag.trim());
							});
						} else {
							add_single_tag(tag_or_tags);
						}
					},

					/**
					 * @param {String} tag
					 * @return {boolean} Whether the tag exists in the current post window's tag input
					 */
					tag_exists: function(tag) {

						var found = false;
						tag = tag.toLowerCase();

						$(".post-form--tag-editor").find(".tag-label").each(function() {
							var this_tag = $(this).text();
							this_tag = this_tag.toLowerCase();
							if (this_tag.substring(0) === "\"") {
								this_tag = this_tag.substring(1, this_tag.length - 1);
							}
							if (this_tag === tag) {
								found = true;
							}
						});

						return found;

					},

					/**
					 * Remove all tags from the current post window
					 */
					remove_all_tags: function() {
						$(".post-form--tag-editor").find(".tag-label").click();
					},

					/**
					 * Remove a specific tag from the current post window
					 * @param {String} tag
					 */
					remove_tag: function(tag) {

						tag = tag.toLowerCase();


						$(".post-form--tag-editor").find(".tag-label").each(function() {

							var this_tag = $(this).text();
							this_tag = this_tag.toLowerCase();
							if (this_tag.substring(0) === "\"") {
								this_tag = this_tag.substring(1, this_tag.length - 1);
							}
							if (this_tag === tag) {
								$(this).click();
							}

						});
					},

					/**
					 * @return {Object} State of the post, with keys
					 *	publish: boolean - Whether the post will be published (default new post)
					 *	draft: boolean - Whether the post will be drafted
					 *	queue: boolean - Whether the post will be queued
					 *	private: boolean - Whether the post will be "published privately"
					 */
					state: function() {

						var to_return = {};

						to_return.publish = $("#post_state").val() == "0";
						to_return.draft = $("#post_state").val() == "1";
						to_return.queue = $("#post_state").val() == "2";
						to_return.private = $("#post_state").val() == "private";

						return to_return;

					},

					/**
					 * @return {Object} Description of post type, see keys in function source
					 */
					post_type: function() {
						var post_form = $(".post-form");
						return {
							text: post_form.hasClass("post-form--text"),
							photo: post_form.hasClass("post-form--photo"),
							video: post_form.hasClass("post-form--video"),
							chat: post_form.hasClass("post-form--chat"),
							note: post_form.hasClass("post-form--note"),		// Tumblr calls published answers notes
							quote: post_form.hasClass("post-form--quote"),
							audio: post_form.hasClass("post-form--audio"),
							link: post_form.hasClass("post-form--link")
						};
					},

					/**
					 * @return {String} Blog making the post
					 */
					blog: function() {

						return $("#channel_id").val();

					},

					/**
					 * @param {String} url - URL of blog to which to switch the post window
					 * @return {boolean} Whether the switch succeeded
					 */
					switch_blog: function(url) {

						$("#tumblelog_choices").find(".option").each(function() {

							if ($(this).attr('data-option-value') === url) {
								$(this).trigger('click');
								return true;
							}

						});

						return false;

					},

					/**
					 * @return {boolean} Whether the post window is currently open
					 */
					open: function() {

						return XKit.interface.post_window_listener_window_id !== 0;

					},

					/**
					 * @return {String} Type of post, see also XKit.interface.post_window.post_type
					 */
					type: function() {
						var types = ['text', 'photo', 'quote', 'link', 'chat', 'audio', 'video'];
						var form = $('.post-form');
						for (var i = 0; i < types.length; i++) {
							var type = types[i];
							if (form.hasClass('post-form--' + type)) {
								return type;
							}
						}
						// Default to text
						return 'text';
					},

					/**
					 * @return {Object} Description of originality of post with boolean
					 *                  keys is_reblog and is_original for the two cases.
					 */
					origin: function() {

						var to_return = {};

						to_return.is_reblog = $(".post-form--header").find(".reblog_source").length > 0;
						to_return.is_original = $(".post-form--header").find(".reblog_source").length <= 0;

						return to_return;

					}

				},

				post_window_listener: {

					/**
					 * Begin running the post_window_listener
					 */
					run: function() {

						if (XKit.interface.post_window_listener_running) { return; }

						XKit.interface.post_window_listener_running = true;
						XKit.interface.post_window_listener.set_listen();

					},

					/**
					 * Schedule the execution of XKit.interface.post_window_listener
					 */
					set_listen: function() {

						setTimeout(function() { XKit.interface.post_window_listener.do(); }, 800);

					},

					/**
					 * Perform the logic of the post_window_listener, running all
					 * registered post_window_listener callbacks if there is a
					 * newly opened post window. Otherwise schedules itself to run
					 * later using set_listen.
					 */
					do: function() {

						if (!XKit.interface.post_window_listener_running) {
							XKit.interface.post_window_listener_window_id = 0;
							XKit.interface.post_window_listener.set_listen();
							return;
						}

						var post_content = $(".post-form");
						var ask_form = $(".post_ask_answer_form");

						if (post_content.length <= 0 || ask_form.length > 0 || post_content.css('display') === 'none') {
							// No post window yet. Do nothing.
							XKit.interface.post_window_listener_window_id = 0;
							XKit.interface.post_window_listener.set_listen();
							return;
						}

						if (XKit.interface.post_window_listener_window_id !== 0) {
							// Already ran the functions here?
							XKit.interface.post_window_listener.set_listen();
							return;
						} else {
							XKit.interface.post_window_listener_window_id = XKit.tools.random_string();
						}

						if (XKit.interface.post_window_listener_id.length === 0) {
							// We got not functions to run.
							XKit.interface.post_window_listener.set_listen();
							return;
						}

						// console.log("interface -> Post Window found, running attached functions. [" + XKit.interface.post_window_listener_window_id + "]");

						for (var i = 0; i < XKit.interface.post_window_listener_id.length; i++) {

							if (typeof XKit.interface.post_window_listener_func[i] === "function") {

								try {
									XKit.interface.post_window_listener_func[i].call();
								} catch (e) {
									// console.log("interface -> post_window_listener -> can't run \"" + XKit.interface.post_window_listener_id[i] + "\": " + e.message);
								}
							}

						}

						XKit.interface.post_window_listener.set_listen();


					},

					/**
					 * Call func whenever a new create post window appears
					 * @param {String} id - globally unique identifier of function for removal
					 * @param {Function} func - function to call
					 */
					add: function(id, func) {
						// Call a function when the manual reblog window appears.
						XKit.interface.post_window_listener_id.push(id);
						XKit.interface.post_window_listener_func.push(func);
						XKit.interface.post_window_listener.run();

						if (XKit.interface.post_window.open()) {
							// This is one of the many reasons why nearly every extension uses
							// fully qualified names
							func.call();
						}
					},

					/**
					 * @param {String} id - ID of function to remove as provided in
					 *                      XKit.interface.post_window_listener.add
					 */
					remove: function(id) {

						var m_id = XKit.interface.post_window_listener_id.indexOf(id);

						if (m_id === -1) { return; }

						XKit.interface.post_window_listener_id.splice(m_id, 1);
						XKit.interface.post_window_listener_func.splice(m_id, 1);


					}


				},

				update_view: {

					// Each function here requires a Interface Post Object,
					// you can get using interface.post.

					/**
					 * Set the tags of a post
					 * @param {Object} post_obj - Interface Post Object provided by XKit.interface.post
					 * @param {String} tags - Comma-separated array of tags
					 */
					tags: function(post_obj, tags) {

						var post_div = $("#post_" + post_obj.id);

						var m_inner = "";
						var tags_array = tags.split(",");
						var added_tag_count = 0;

						for (var i = 0; i < tags_array.length; i++) {

							var formatted = encodeURIComponent(tags_array[i]);

							if (tags_array[i] === "" || tags_array[i] === " ") { continue; }

							if (tags_array[i].substring(0, 1) === " ") {
								tags_array[i] = tags_array[i].substring(1);
							}

							m_inner = m_inner + "<a class=\"post_tag\" href=\"/tagged/" + formatted + "\">#" + tags_array[i] + "</a>";
							added_tag_count++;

						}

						if (added_tag_count > 0) {
							$(post_div).removeClass("no_body");
						} else {
							$(post_div).addClass("no_body");
						}

						if ($(post_div).find(".post_tags").length > 0) {

							$(post_div).find(".post_tags").find("div:first-child").html(m_inner);

						} else {

							var m_html = "<div class=\"source-clear\"></div><div class=\"post_tags fadeable fadeable-source\"><div class=\"post_tags_inner\">" +
										m_inner +
									"</div>";
							$(post_div).find(".post_footer").before(m_html);

						}

					}

				},

				/**
				 * Override parameters of a post object
				 * @param {Object} tumblr_object
				 * @param {Object} settings - Object with keys `tags` and/or `caption` which
				 *                            will override tumblr_object's corresponding keys.
				 * @return {Object} Updated tumblr_object (same as the param) or an
				 *                  error object with keys `error` and `message`
				 */
				edit_post_object: function(tumblr_object, settings) {

					// Used to modify a Tumblr Post Object.
					// NEVER edit it yourself, it might change in the
					// future rendering your code useless. Use this.

					// Takes the Tumblr Object (get it using Fetch below, don't modify)
					// and a settings object. The settings object can have the following:

					/*
						[ settings] - object
							|
							|--- tags
							|--- caption
					*/

					if (typeof tumblr_object.post === "undefined") {
						// Jump one object in.
						tumblr_object = {};
						tumblr_object.error = true;
						tumblr_object.message = "Wrong/corrupt tumblr object, post object not found.";
						// console.log(tumblr_object.message);
						return tumblr_object;
					}

					if (typeof settings.tags !== "undefined") {

						tumblr_object.post.tags = settings.tags;

					}

					if (typeof settings.caption !== "undefined") {

						if (tumblr_object.post.type === "link") {
							tumblr_object.post.three = settings.caption;
						} else {
							tumblr_object.post.two = settings.caption;
						}

					}

					return tumblr_object;

				},

				/**
				 * Edit a post
				 * @param {Object} tumblr_object - Tumblr information corresponding to post
				 * @param {Function} func - Callback upon edit completion or error. If error,
				 *                          argument has keys error:true and message:String. Otherwise
				 *                          it contains JSON data of Tumblr's response to the edit.
				 * @param {boolean?} retry_mode - True if this function has failed and is
				 *                                attempting to retry the edit
				 */
				edit: function(tumblr_object, func, retry_mode) {

					// Used to edit a post.
					// Takes a Tumblr Post Object (get it using Fetch.)

					var m_object = {};

					m_object.form_key = XKit.interface.form_key();
					m_object.channel_id = tumblr_object.post_tumblelog.name_or_id;
					m_object.context_id = tumblr_object.post_tumblelog.name_or_id;
					m_object.post_id = tumblr_object.post.id;

					m_object.edit = true;
					m_object.safe_edit = true; // whatever the fuck this is.
					m_object.errors = false;
					m_object.message = "Post edited on " + m_object.channel_id;
					m_object.silent = true;
					m_object.post_context_page = "dashboard";
					m_object.editor_type = "rich";

					// m_object.post = {};

					/*

						{
							"form_key": "----", --OK
							"channel_id": "xenix", -- OK
							"post_id": "58790345774", -- OK
							"edit": true, -- OK
							"safe_edit": true, -- OK
							"errors": false, -- OK
							"created_post": true, -- OK
							"context_page": "dashboard", -- OK
							"post_context_page": "dashboard", --- OK
							"message": "Post edited on xenix", --- OK
							"silent": true, --- OK
							"context_id": "xenix", --- OK
							"editor_type": "rich", --- OK
							"is_rich_text[one]": "0",
							"is_rich_text[two]": "1",
							"is_rich_text[three]": "0",
							"post[slug]": "", --- OK
							"post[date]": "Aug 20th, 2013 5:44pm",
							"MAX_FILE_SIZE": "10485760",
							"post[type]": "photo",	--- OK
							"post[two]": "", --- OK
							"post[tags]": "omg,hahah", --- OK
							"post[state]": "0", --- OK
							"post[photoset_layout]": "1",
							"post[photoset_order]": "o1",
							"images[o1]": ""
						}

					*/

					m_object.post = tumblr_object.post;

					m_object['post[type]'] = tumblr_object.post.type;

					if (typeof tumblr_object.post.one !== "undefined") {
						m_object['post[one]'] = tumblr_object.post.one;
					}

					m_object['post[two]'] = tumblr_object.post.two;

					if (tumblr_object.post.type !== "photo" && tumblr_object.post.type !== "photoset") {
						if (typeof tumblr_object.post.three !== "undefined") {
							m_object['post[three]'] = tumblr_object.post.three;
						}
					}

					var m_tags = tumblr_object.post.tags;
					if (typeof m_tags === "undefined" || m_tags === "null") { m_tags = ""; }

					m_object['post[tags]'] = m_tags;
					m_object['post[slug]'] = tumblr_object.post.slug;

					if (tumblr_object.post.type === "photo" || tumblr_object.post.type === "photoset") {

						// This is retarded but it's whatever.

						m_object['post[photoset_layout]'] = "\"" + tumblr_object.post.photoset_layout + "\"";

						var m_photos = "";
						for (var photo in tumblr_object.post.photos) {
							if (m_photos === "") {
								m_photos = tumblr_object.post.photos[photo].id;
							} else {
								m_photos = m_photos + "," + tumblr_object.post.photos[photo].id;
							}
							m_object['images[' + tumblr_object.post.photos[photo].id + ']'] = "";
						}

						m_object['post[photoset_order]'] = m_photos;


					}

					var m_state = tumblr_object.post.state;
					if (isNaN(tumblr_object.post.state) === false) {
						m_state = tumblr_object.post.state.toString();
					}
					m_object['post[state]'] = m_state;

					// Not sure about this part:
					m_object["is_rich_text[one]"] = "0";
					m_object["is_rich_text[two]"] = "1";
					m_object["is_rich_text[three]"] = "0";

					m_object.created_post = tumblr_object.created_post;
					m_object.context_page = tumblr_object.post_context_page;
					m_object.post_context_page = tumblr_object.post_context_page;
					m_object.silent = false;
					m_object.errors = false;

					m_object.edit = true;

					var to_return = {};

					to_return.error = false;
					to_return.error_message = "";
					to_return.status = 200;
					to_return.data = "";

					XKit.interface.kitty.get(function(kitty_data) {

						if (kitty_data.errors === true) {

							// We fucked up. Let's try again.
							if (retry_mode === false) {
								XKit.interface.edit(tumblr_object, func, true);
							} else {
								to_return.error = true;
								to_return.status = kitty_data.response.status;

								if (kitty_data.response.status === 401) {
									to_return.message = "Permission Denied";
								} else {
									if (kitty_data.response.status === 404) {
										to_return.message = "Post Not Found";
									} else {
										to_return.message = "Unknown";
									}
								}

								func(to_return);

							}

							return;

						}

						GM_xmlhttpRequest({
							method: "POST",
							url: "http://www.tumblr.com/svc/post/update",
							data: JSON.stringify(m_object),
							json: true,
							headers: {
								"X-tumblr-puppies": kitty_data.kitten,
								"X-tumblr-form-key": XKit.interface.form_key(),
							},
							onerror: function(response) {

								XKit.interface.kitty.set(response.getResponseHeader(""));
								to_return.error = true;
								to_return.status = response.status;

								if (response.status === 401) {
									to_return.message = "Permission Denied";
								} else {
									if (response.status === 404) {
										to_return.message = "Post Not Found";
									} else {
										to_return.message = "Unknown";
									}
								}

								func(to_return);

							},
							onload: function(response) {

								XKit.interface.kitty.set(response.getResponseHeader("X-Tumblr-Kittens"));

								try {
									to_return.data = JSON.parse(response.responseText);
									func(to_return);
								} catch (e) {
									to_return.error = true;
									to_return.error_message = "Error parsing JSON";
									func(to_return);
								}

							}
						});

					});

				},

				/**
				 * @param {Object} post_object - Interface Post Object provided by XKit.interface.post
				 * @param {Function} func - Called on error or on completion with an object describing
				 *                          the results of the fetch. The object has key error: true
				 *                          if there is an error.
				 * @param {boolean} reblog_mode - Whether the post is a reblog
				 */
				fetch: function(post_object, func, reblog_mode) {

					// Fetches internal Tumblr object for a post, then calls callback (func)
					// You need to feed this an Interface Post Object.

					var m_object = {};

					m_object.form_key = XKit.interface.form_key();

					if (reblog_mode === true) {
						m_object.post_type = false; // Not sure why.
						m_object.reblog_key = post_object.reblog_key;
						m_object.reblog_id = post_object.id;
						m_object.channel_id = post_object.owner;
					} else {
						m_object.post_type = false; // Not sure why.
						m_object.post_id = post_object.id;
						m_object.channel_id = post_object.owner;
					}

					var to_return = {};

					to_return.error = false;
					to_return.error_message = "";
					to_return.status = 200;
					to_return.data = "";

					GM_xmlhttpRequest({
						method: "POST",
						url: "http://www.tumblr.com/svc/post/fetch",
						data: JSON.stringify(m_object),
						json: true,
						onerror: function(response) {

							to_return.error = true;
							to_return.status = response.status;

							if (response.status === 401) {
								to_return.message = "Permission Denied";
							} else {
								if (response.status === 404) {
									to_return.message = "Post Not Found";
								} else {
									to_return.message = "Unknown";
								}
							}

							func(to_return);

						},
						onload: function(response) {

							try {
								to_return.data = JSON.parse(response.responseText);
								func(to_return);
							} catch (e) {
								to_return.error = true;
								to_return.error_message = e.message;
								func(to_return);
							}

						}
					});

				},

				/**
				 * Adds or removes the "working" animation from the control button.
				 * @param {JQuery} obj
				 * @param {boolean} working - Whether the button should be "working"
				 */
				switch_control_button: function(obj, working) {


					if (working) {
						$(obj).addClass("xkit-interface-working");
					} else {
						$(obj).removeClass("xkit-interface-working");
					}


				},

				/**
				 * Adds or removes the "disabled" animation from the control button.
				 * @param {JQuery} obj
				 * @param {boolean} disabled - Whether the button should be "disabled"
				 */
				disable_control_button: function(obj, disabled) {


					if (disabled) {
						$(obj).addClass("xkit-interface-disabled");
					} else {
						$(obj).removeClass("xkit-interface-disabled");
					}


				},

				/**
				 * Adds or removes the "green/completed" animation from the control button.
				 * @param {JQuery} obj
				 * @param {boolean} completed - Whether the button should be "green/completed"
				 */
				completed_control_button: function(obj, completed) {


					if (completed) {
						$(obj).addClass("xkit-interface-completed");
					} else {
						$(obj).removeClass("xkit-interface-completed");
					}


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
				create_control_button: function(class_name, icon, text, func, ok_icon) {

					XKit.interface.added_icon.push(class_name);
					XKit.interface.added_icon_icon.push(icon);
					XKit.interface.added_icon_text.push(text);

					XKit.tools.add_css("." + class_name + ":after {" +
							" background-image: url('" + icon + "') !important;" +
							" background-size: auto auto !important;" +
							" margin-top: -7px !important; " +
							"}", "xkit_interface_icon___" + class_name);

					if (typeof ok_icon !== "undefined") {
						XKit.tools.add_css("." + class_name + ".xkit-interface-completed:after {" +
							" background-image: url('" + ok_icon + "') !important;" +
							" background-size: auto auto !important;" +
							" opacity: 1 !important; " +
							"}", "xkit_interface_icon___completed___" + class_name);
					}

					$(document).on('click', '.' + class_name, function() {
						if ($(this).hasClass("xkit-interface-working") || $(this).hasClass("xkit-interface-disabled")) { return; }
						if (typeof func === "function") { func.call(this, event); }
					});

				},

				/**
				 * Instantiate and add a previously "created" button to the
				 * specified post.
				 * @param {Object} obj - Interface Post Object
				 * @param {String} class_name - CSS class of the button to be added
				 * @param {String?} additional - String inserted into the button's div tag
				 */
				add_control_button: function(obj, class_name, additional) {

					if (typeof additional == "undefined") {additional = ""; }

					if (XKit.interface.added_icon.indexOf(class_name) === -1) {
						// console.log("Interface -> Can't add icon, button not created, use create_control_button.");
						return;
					}

					var m_text = XKit.interface.added_icon_text[XKit.interface.added_icon.indexOf(class_name)];

					var post_obj = XKit.interface.post(obj);
					var post_id = post_obj.id;
					var post_type = post_obj.type;
					var post_permalink = post_obj.permalink;

					var m_data = "data-post-id = \"" + post_id + "\" data-post-type=\"" + post_type + "\" data-permalink=\"" + post_permalink + "\"";

					var m_html = "<div " + m_data + " title=\"" + m_text + "\" class=\"xkit-interface-control-button post_control post_control_icon " + class_name + "\" " + additional + "></div>";

					if ($(obj).find(".post_controls_inner").length > 0) {
						$(obj).find(".post_controls_inner").prepend(m_html);
					} else if (XKit.browser().mobile) {
						$(obj).find(".mh_post_foot_control.show_notes").after(m_html);
					} else {
						$(obj).find(".post_controls").prepend(m_html);
					}

					if (XKit.interface.where().search) {
						XKit.interface.trigger_reflow();
					}
				},

				/**
				 * @param {String} post_id
				 * @return {Object} Interface Post Object of post with given id
				 */
				find_post: function(post_id) {

					// Return a post object based on post ID.

					if ($("body").find("#post_" + post_id).length > 0) {
						return XKit.interface.post($("#post_" + post_id));
					} else if ($(".mh_post").length > 0) {
						return XKit.interface.post($(".mh_post"));
					} else {
						var m_error = {};
						m_error.error = true;
						m_error.error_message = "Object not found on page.";
						return m_error;
					}

				},

				/**
				 * @param {JQuery} obj - Post element
				 * @return {Object} Interface Post Object or {error: true}
				 */
				post: function(obj) {

					var m_return = {};

					if (typeof $(obj).attr('data-post-id') == "undefined" && $(".mh_post_head_link").length === 0) {
						// Something is wrong.
						m_return.error = true;

						return;

					} else if ($(".mh_post_head_link").length > 0) {

						m_return.error = false;

						m_return.id = $(obj).find(".mh_post_head_link").attr('href').split('/')[4];

						m_return.permalink = $(obj).find(".mh_post_head_link").attr('href');

						if ($(obj).hasClass("post_type_regular")) {
							m_return.type = 'regular';
						} else if ($(obj).hasClass("post_type_audio")) {
							m_return.type = 'audio';
						} else if ($(obj).hasClass("post_type_quote")) {
							m_return.type = 'quote';
						} else if ($(obj).hasClass("post_type_photo")) {
							m_return.type = 'photo';
						} else if ($(obj).hasClass("post_type_photoset")) {
							m_return.type = 'photoset';
						} else if ($(obj).hasClass("post_type_video")) {
							m_return.type = 'video';
						} else if ($(obj).hasClass("post_type_panorama")) {
							m_return.type = 'panorama';
						}

						return m_return;
					}

					m_return.error = false;

					m_return.id = $(obj).attr('data-post-id');
					m_return.root_id = $(obj).attr('data-root_id');
					m_return.reblog_key = $(obj).attr('data-reblog-key');
					m_return.owner = $(obj).attr('data-tumblelog-name');
					m_return.tumblelog_key = $(obj).attr('data-tumblelog-key');

					m_return.liked = $(obj).find(".post_control.like").hasClass("liked");
					m_return.permalink = $(obj).find(".post_permalink").attr('href');

					m_return.type = $(obj).attr('data-type');

					if ($(obj).find(".post_content_inner").length > 0) {
						m_return.body = $(obj).find(".post_content_inner").html();
					} else {
						if ($(obj).find(".post_body").length > 0) {
							m_return.body = $(obj).find(".post_body").html();
						} else {
							m_return.body = "";
						}
					}

					m_return.animated = $(obj).hasClass("is_animated");
					m_return.is_reblogged = $(obj).hasClass("is_reblog") || $(obj).find(".reblog_info").length > 0;
					m_return.is_mine = $(obj).hasClass("is_mine");
					m_return.is_following = ($(obj).attr('data-following-tumblelog') === true);
					m_return.can_edit = $(obj).find(".post_control.edit").length > 0;


					if (m_return.is_reblogged && $(obj).attr('data-json')) {
						try {
							var json = $(obj).attr('data-json');
							var parsedJson = JSON.parse(json);
							m_return.source_owner = parsedJson['tumblelog-root-data'].name;
						} catch (e) {
							console.log('Error retrieving data-json attribute of post');
						}
					} else if ($(obj).hasClass("has_source")) {
						// Different pages (such as the sidebar) don't always have data-json defined,
						// so fall back to checking for source elements
						try {
							var sourceJson = $(obj).find('.post-source-link').attr('data-peepr');
							var parsedSourceJson = JSON.parse(sourceJson);
							m_return.source_owner = parsedSourceJson.tumblelog;
						} catch (e) {
							console.log('Error retrieving data-peepr attribute of post-source-link');
						}
					} else if ($(obj).find(".reblog_info").length > 0) {
						// If there is no source link but there is a reblog link, then
						// the reblog source is the source
						try {
							var reblogJson = $(obj).find(".reblog_info").attr('data-peepr');
							var parsedReblogJson = JSON.parse(reblogJson);
							m_return.source_owner = parsedReblogJson.tumblelog;
						} catch (e) {
							console.log('Error retrieving data-peepr attribute of reblog_info');
						}
					} else {
						// If there is no reblog or source link, consider the
						// post owner to be the original source
						m_return.source_owner = m_return.owner;
					}

					if (m_return.is_reblogged) {

						try {

							m_return.reblog_link = $(obj).find(".reblog_source").find("a").first().attr('href');
							m_return.reblog_owner = $(obj).find(".reblog_source").find("a").first().text();
							m_return.reblog_original_id = m_return.reblog_link.split('/')[4];

						} catch (e) {


						}

					}

					var n_count = 0;

					if ($(obj).find(".note_link_current").length > 0) {
						if ($(obj).find(".note_link_current").html() === "") {
							n_count = 0;
						} else {
							n_count = $(obj).find(".note_link_current").html().replace(/\D/g, '');
						}
					}

					m_return.note_count = n_count;

					m_return.avatar = $(obj).find(".post_avatar_image").attr('src');

					m_return.tags = "";
					if ($(obj).find(".post_tags").length > 0) {
						var to_return = "";
						$(obj).find(".post_tags").find(".post_tag").each(function() {
							if ($(this).hasClass("post_ask_me_link") === true) { return; }
							var m_tag = $(this).text();
							if (m_tag[0] === "#") {
								m_tag = m_tag.substring(1);
							}
							if (to_return === "") {
								to_return = m_tag;
							} else {
								to_return = to_return + "," + m_tag;
							}
						});
						m_return.tags = to_return;
					}

					return m_return;

				},

				/**
				 * @return {String} The current Tumblr form_key used for authentication
				 */
				form_key: function() {

					var to_return = $('meta[name=tumblr-form-key]').attr("content");

					if (typeof to_return === "undefined" || to_return === "") {
						// console.log(" --- XKit Interface: Form Key could not be fetched, using stored one.");
						to_return = window.atob(XKit.storage.get("xkit_patches", "last_stored_form_key", ""));
					} else {
						// console.log(" --- XKit Interface: Got form key, storing that one.");
						XKit.storage.set("xkit_patches", "last_stored_form_key", window.btoa(to_return));
					}
					return to_return;

				},

				/**
				 * @return {String} The concatentation of two form keys. Unused and likely a typo.
				 */
				check_key: function() {

					return $("body").attr('data-form-key') + $("body").attr('data-form-key');

				},

				/**
				 * @return {Object} Various information about the current user with keys
				 *	posts: number - Number of posts
				 *	followers: number - Number of followers
				 *	drafts: number - Number of drafts
				 *	processing: number - Number of posts "processing" (may be defunct)
				 *	queue: number - Number of posts in queue
				 *	activity: String - Activity data as a stringified array
				 *	name: String - username
				 *  title: String - blog title
				 */
				user: function() {

					var m_return = {};

					// Init variables
					m_return.posts = 0;
					m_return.followers = 0;
					m_return.drafts = 0;
					m_return.processing = 0;
					m_return.queue = 0;
					m_return.activity = '[0,0,0,0,0,0,0,0,0,0,0,0]';

					// Needs to be in a variable, otherwise account button can't be clicked. (Weird as fuck)
					var m_account = $("#account_button");

					m_account.click(); // Because tab must be open to steal data from it

					if ($(".blog-list-item").find(".blog-list-item-info").find(".blog-list-item-info-name").length > 0) {
						m_return.name = $(".blog-list-item").find(".blog-list-item-info").find(".blog-list-item-info-name").html().replace(",", "");
					} else {
						m_return.name = 'ERROR';
					}

					if ($(".blog-list-item").find(".blog-list-item-info").find(".blog-list-item-info-title").length > 0) {
						m_return.title = $(".blog-list-item").find(".blog-list-item-info").find(".blog-list-item-info-title").html().replace(",", "");
					} else {
						m_return.title = 'ERROR';
					}


					if ($(".blog-sub-nav-details").find(".blog-sub-nav-item").length > 0) {
						$(".blog-sub-nav-details").children(".blog-sub-nav-item").each(function(index, obj) {
							if ($(this).find(".blog-sub-nav-item-label").html() === 'Posts') {
								m_return.posts = parseInt($(this).find(".blog-sub-nav-item-data").html().replace(",", ""));
							}
							if ($(this).find(".blog-sub-nav-item-label").html() === 'Followers') {
								m_return.followers = parseInt($(this).find(".blog-sub-nav-item-data").html().replace(",", ""));
							}
							if ($(this).find(".blog-sub-nav-item-label").html() === 'Activity') {
								// Hax. Won't properly retrieve $(this).find(".blog-sub-nav-item-data.sparkline") for some reason.
								m_return.activity = $(this).find(".blog-sub-nav-item-link").html().slice(113).slice(0, -8);
							}
							if ($(this).find(".blog-sub-nav-item-label").html() === 'Drafts') {
								m_return.drafts = parseInt($(this).find(".blog-sub-nav-item-data").html().replace(",", ""));
							}
							if ($(this).find(".blog-sub-nav-item-label").html() === 'Processing') {
								m_return.processing = parseInt($(this).find(".blog-sub-nav-item-data").html().replace(",", ""));
							}
							if ($(this).find(".blog-sub-nav-item-label").html() === 'Queue') {
								m_return.queue = parseInt($(this).find(".blog-sub-nav-item-data").html().replace(",", ""));
							}
						});
					}

					window.setTimeout(function() {
						m_account.click();
					}, 500);

					return m_return;

				},

				/**
				 * Whether the page is an "official" tumblr page like the dashboard or
				 * if it is a user-styled page like a blog.
				 * @return {Boolean}
				 */
				is_tumblr_page: function() {
					// Effectively if the href is of the form https://www.tumblr.com
					return !!document.location.href.match(/^https?:\/\/(www\.)?tumblr\.com/);
				},


				/**
				 * Tell Tumblr to reflow the page. Used to recalculate post dimensions
				 * and j/k scrolling.
				 */
				trigger_reflow: XKit.tools.debounce(function() {
					if (this.where().search) {
						// Found by logging calls to Tumblr.Events.trigger on the search page
						// search:post:photo_expanded is where the magic happens
						XKit.tools.add_function(function() {
							Tumblr.Events.trigger("post:photo_expanded");
							Tumblr.Events.trigger("search:post:photo_expanded");
							Tumblr.Events.trigger("search:layout:updated");
						}, true, "");
					} else {
						XKit.tools.add_function(function() {
							Tumblr.Events.trigger("DOMEventor:updateRect");
						}, true, "");
					}
				}, 250),

				show_peepr_for: function(blog, post) {
					var payload = {
						tumblelog_name: blog
					};
					if (post) {
						payload.post_id = post;
					}

					XKit.tools.add_function(function() {
						Tumblr.Events.trigger("peepr-open-request", add_tag);
					}, true, payload);
				}
			});

			XKit.post_listener = {
				callbacks: {},
				add: function(id, func) {
					try {
						if (typeof XKit.post_listener.callbacks[id] === "undefined") {
							XKit.post_listener.callbacks[id] = new Array(func);
						} else {
							XKit.post_listener.callbacks[id].push(func);
						}
					} catch (e) {
						console.error("Could not add function to " + id + "'s post listener callbacks: " + e.message);
					}
				},
				remove: function(id, func) {
					if (typeof func === "undefined") {
						delete XKit.post_listener.callbacks[id];
					} else {
						var index = XKit.post_listener.callbacks[id].indexOf(func);
						if (index !== -1) {
							XKit.post_listener.callbacks[id].splice(index);
						} else {
							console.warn("Could not remove function from " + id + "'s post listener callbacks: not found.");
						}
					}
				},
				check: function() {
					XKit.post_listener.observer.observe($("body")[0], {
						childList: true,
						subtree: true
					});
				}
			};

			/**
			 * Add an XKit notification popup (will appear in bottom left corner)
			 * @param {String} message - Text of notification
			 * @param {String} type - Desired CSS class of notification, see function
			 *                        for possibilities.
			 * @param {boolean} sticky - If true, the notification will not fade out over time.
			 * @param {Function} callback - On click callback for notification
			 */
			XKit.notifications.add = function(message, type, sticky, callback) {
				if ($("#xkit-notifications").length <= 0) {
					setTimeout(function() { XKit.notifications.add(message, type, sticky, callback); }, 500);
					return;
				}

				XKit.notifications.count++;

				var m_class = "";
				if (type === "mail") { m_class = "notification-mail"; }
				if (type === "ok") { m_class = "notification-ok"; }
				if (type === "error") { m_class = "notification-error"; }
				if (type === "warning") { m_class = "notification-warning"; }
				if (type === "pokes") { m_class = "notification-pokes"; }

				if (sticky === true) {
					m_class = m_class + " sticky";
				}

				var m_html = "<div class=\"xkit-notification " + m_class + "\" id=\"xkit_notification_" + XKit.notifications.count + "\">" +
										message +
									"</div>";

				$("#xkit-notifications").append(m_html);

				// console.log(" Notification > " + message);

				var m_notification_id = XKit.notifications.count;
				setTimeout(function() {
					$("#xkit_notification_" + m_notification_id).slideDown('slow');
				}, 100);
				$("#xkit_notification_" + m_notification_id).click(function() {
					if (typeof callback !== "undefined") {
						try {
							callback();
						} catch (e) {
							// Meh.
						}
					}
					$("#xkit_notification_" + m_notification_id).slideUp('slow');
				});
				if (sticky !== true) {
					setTimeout(function() {
						$("#xkit_notification_" + m_notification_id).slideUp('slow');
					}, 5000);
				}
			};

			/**
			 * @param {String} extension
			 * @return {Boolean} Whether the extension is running
			 */
			XKit.installed.is_running = function(extension) {
				return XKit.installed.check(extension) &&
					typeof(XKit.extensions[extension]) !== "undefined" &&
					XKit.extensions[extension].running;
			};

			/**
			 * Schedule a callback to be run only if `extension` is installed and running.
			 * Call an alternate if the extension is not running.
			 * @param {String} extension
			 * @param {Function} onRunning
			 * @param {Function?} onFailure
			 */
			XKit.installed.when_running = function(extension, onRunning, onFailure) {
				if (!XKit.installed.check(extension)) {
					if (onFailure) {
						onFailure();
					}
					return;
				}
				// Wait up to 8 seconds for the extension to begin running
				var tries = 20;
				var timeout = 400;
				function check() {
					if (tries < 0) {
						if (onFailure) {
							onFailure();
						}
						return;
					}
					if (!XKit.installed.is_running(extension)) {
						tries--;
						setTimeout(check, timeout);
						return;
					}
					// The extension exists and has been installed
					onRunning(XKit.extensions[extension]);
				}
				setTimeout(check, 0);
			};

			XKit.toast = {
				count: 0,

				/**
				 * Simulates a tumblr notification ("toast")
				 * @param {Boolean} created - true if post was not queued/drafted
				 * @param {String} action - post action description (i.e. "Reblogged to ")
				 * @param {String} url - tumblr blog name (for both notification and API)
				 * @param {Integer/String} id - created post id for peepr (optional)
				 * @param {String} crumb - arbitrary class for "crumb" (optional)
				 */
				add: function(created, action, url, id, crumb) {
					var toastno = XKit.toast.count;
					XKit.toast.count++;

					if (created) {
						action = "<strong>" + action;
					} else {
						action += "<strong>";
					}

					var endData = "}";
					if (typeof id !== "undefined") {
						endData = `,"postId": ${id}}`;
					}
					if (typeof crumb === "undefined") {
						crumb = "";
					}

					var toast =
						`<li class="toast blog-sub xtoast-${toastno}" data-subview="toast" data-peepr='{"tumblelog": "${url}"${endData}'>
							<img class="toaster avatar" src="https://api.tumblr.com/v2/blog/${url}/avatar/128">
							<div class="crumb ${crumb}"></div>
							<span class="toast-bread">
								${action}${url}</strong>
							</span>
						</li>`;

					$(".toastr").addClass("show-toast");
					$(".multi-toasts").append(toast);

					var $toast = $(".xtoast-" + toastno);
					setTimeout(function() {
						$toast.addClass("fade-out");
					}, 4000);
					setTimeout(function() {
						$toast.remove();
						if (!$(".toast").length) {
							$(".toastr").removeClass("show-toast");
						}
					}, 5000);
				}
			};

			XKit.tools.show_timestamps_help = function() {

				XKit.window.show("Timestamp formatting",
					"This extension allows you to format the date by using a formatting syntax. Make your own and type it in the Timestamp Format box to customize your timestamps.<br/><br/>" +
					"Please be careful while customizing the format. Improper/invalid formatting can render Timestamps unusable. " +
					"In that case, just delete the text you've entered completely and XKit will revert to its default formatting.",

					"info",

					'<div class="xkit-button default" id="xkit-view-moment-formatting">Formatting Syntax</div>' +
					'<div class="xkit-button" id="xkit-close-message">Close</div>'
				);

				$("#xkit-view-moment-formatting").click(function() {
					$("#xkit-view-moment-formatting").off("click");
					XKit.window.show("Timestamps Format",
						"You can customize your timestamps using the syntax below.<br>XKit uses <a href=\"https://momentjs.com/\" target=\"_blank\">moment.js</a>, so it uses it's syntax." +
						`<div class="two-column-table">
							<div class="row header">
								<div class="column-1">Token</div>
								<div class="column-2">Description</div>
								<div class="column-3">Example</div>
							</div>

							<div class="row separator">
								<div class="column-separator">Month</div>
							</div>

							<div class="row">
								<div class="column-1">M</div>
								<div class="column-2">Month number</div>
								<div class="column-3">6</div>
							</div>

							<div class="row">
								<div class="column-1">Mo</div>
								<div class="column-2">Month number</div>
								<div class="column-3">6th</div>
							</div>

							<div class="row">
								<div class="column-1">MM</div>
								<div class="column-2">Month number with leading zeros</div>
								<div class="column-3">06</div>
							</div>

							<div class="row">
								<div class="column-1">MMM</div>
								<div class="column-2">Short month name</div>
								<div class="column-3">Dec</div>
							</div>

							<div class="row">
								<div class="column-1">MMMM</div>
								<div class="column-2">Long month name</div>
								<div class="column-3">December</div>
							</div>

							<div class="row separator">
								<div class="column-separator">Day</div>
							</div>

							<div class="row">
								<div class="column-1">D</div>
								<div class="column-2">Day of month</div>
								<div class="column-3">1</div>
							</div>

							<div class="row">
								<div class="column-1">Do</div>
								<div class="column-2">Day of month</div>
								<div class="column-3">1st</div>
							</div>

							<div class="row">
								<div class="column-1">DD</div>
								<div class="column-2">Day of month with leading zeros</div>
								<div class="column-3">01</div>
							</div>

							<div class="row separator">
								<div class="column-separator">Day of Week</div>
							</div>

							<div class="row">
								<div class="column-1">d</div>
								<div class="column-2">Day of week as a number</div>
								<div class="column-3">0, 1, 2, .... 6</div>
							</div>

							<div class="row">
								<div class="column-1">ddd</div>
								<div class="column-2">Day of week as short text</div>
								<div class="column-3">Sun, Mon, ... Fri, Sat</div>
							</div>

							<div class="row">
								<div class="column-1">dddd</div>
								<div class="column-2">Day of week as long text</div>
								<div class="column-3">Sunday, ... Saturday</div>
							</div>

							<div class="row separator">
								<div class="column-separator">Year</div>
							</div>

							<div class="row">
								<div class="column-1">YY</div>
								<div class="column-2">Short Year</div>
								<div class="column-3">84, 94, 04</div>
							</div>

							<div class="row">
								<div class="column-1">YYYY</div>
								<div class="column-2">Long Year</div>
								<div class="column-3">1984, 1994, 2004</div>
							</div>

							<div class="row separator">
								<div class="column-separator">Time</div>
							</div>

							<div class="row">
								<div class="column-1">A</div>
								<div class="column-2">AM/PM, uppercase</div>
								<div class="column-3">AM</div>
							</div>

							<div class="row">
								<div class="column-1">a</div>
								<div class="column-2">AM/PM, lowercase</div>
								<div class="column-3">am</div>
							</div>

							<div class="row">
								<div class="column-1">h</div>
								<div class="column-2">Hour (12-hour)</div>
								<div class="column-3">1, 2, ... 11, 12</div>
							</div>

							<div class="row">
								<div class="column-1">hh</div>
								<div class="column-2">Hour with leading zeros (12-hour)</div>
								<div class="column-3">01, 02, ... 11, 12</div>
							</div>

							<div class="row">
								<div class="column-1">H</div>
								<div class="column-2">Hour (24-hour)</div>
								<div class="column-3">0, 1, ... 22, 23</div>
							</div>

							<div class="row">
								<div class="column-1">HH</div>
								<div class="column-2">Hour with leading zeros (24-hour)</div>
								<div class="column-3">00, 01 ... 22, 23</div>
							</div>

							<div class="row">
								<div class="column-1">m</div>
								<div class="column-2">Minute</div>
								<div class="column-3">0, 1, ... 58, 59</div>
							</div>

							<div class="row">
								<div class="column-1">mm</div>
								<div class="column-2">Minute with leading zeros</div>
								<div class="column-3">00, 01, ... 58, 59</div>
							</div>

							<div class="row">
								<div class="column-1">s</div>
								<div class="column-2">Second</div>
								<div class="column-3">0, 1, ... 58, 59</div>
							</div>

							<div class="row">
								<div class="column-1">ss</div>
								<div class="column-2">Second with leading zeros</div>
								<div class="column-3">00, 01, ... 58, 59</div>
							</div>


							<div class="row separator">
								<div class="column-separator"> Miscellaneous </div>
							</div>

							<div class="row">
								<div class="column-1">[ <i>text</i> ]</div>
								<div class="column-2">Escape text, used to add text to timestamps</div>
								<div class="column-3">See example below</div>
							</div>

							<div class="row">
								<div class="column-1">Z</div>
								<div class="column-2">Timezone</div>
								<div class="column-3">-07:00</div>
							</div>

							<div class="row">
								<div class="column-1">X</div>
								<div class="column-2">Unix Timestamp</div>
								<div class="column-3">1360033296</div>
							</div>
							<div class="row header">
								<div class="column-1" style="width: 50%">What to type</div>
								<div class="column-2" style="width: 50%; text-align: center">Example</div>
							</div>

							<div class="row">
								<div class="column-1" style="width: 50%">MMMM Do YYYY, h:mm:ss a</div>
								<div class="column-2" style="width: 50%; text-align: center">June 16th 2013, 1:19:00 pm</div>
							</div>

							<div class="row">
								<div class="column-1" style="width: 50%">dddd, h:mm:ss A</div>
								<div class="column-2" style="width: 50%; text-align: center">Sunday, 1:19:00 PM</div>
							</div>

							<div class="row">
								<div class="column-1" style="width: 50%">[on the day] MMM DD [around] hh:mma</div>
								<div class="column-2" style="width: 50%; text-align: center">on the day Jun 16 around 01:19pm</div>
							</div>
						</div>`, "info",
						'<div class="xkit-button default" id="xkit-close-message">OK</div>',
						true
					);
				});
			};
		},
		"7.8.1": function() {
			XKit.download.github_fetch = function(path, callback) {
				var url = 'https://new-xkit.github.io/XKit/Extensions/dist/' + path;
				GM_xmlhttpRequest({
					method: "GET",
					url: url,
					onerror: function(response) {
						console.log("Unable to download '" + path + "'");
						callback({errors: true, server_down: true});
					},
					onload: function(response) {
						// We are done!
						var mdata = {};
						try {
							mdata = JSON.parse(response.responseText);
						} catch (e) {
							// Server returned bad thingy.
							console.log("Unable to download '" + path +
										"', server returned non-json object." + e.message);
							callback({errors: true, server_down: true});
							return;
						}
						callback(mdata);
					}
				});
			};
			XKit.download.extension = function(extension_id, callback) {
				XKit.download.github_fetch(extension_id + '.json', callback);
			};
			XKit.download.page = function(page, callback) {
				if (page === 'list.php') {
					XKit.download.github_fetch('page/list.json', callback);
					return;
				}
				if (page === 'gallery.php') {
					XKit.download.github_fetch('page/gallery.json', callback);
					return;
				}
				if (page === 'themes/index.php') {
					XKit.download.github_fetch('page/themes.json', callback);
					return;
				}
				if (page === 'paperboy/index.php') {
					XKit.download.github_fetch('page/paperboy.json', callback);
					return;
				}
				if (page === 'framework_version.php') {
					XKit.download.github_fetch('page/framework_version.json', callback);
					return;
				}
			};
			delete XKit.servers;
			delete XKit.download.try_count;
			delete XKit.download.max_try_count;
		}
	},

	destroy: function() {
		// console.log = XKit.log_back;
		XKit.tools.remove_css("xkit_patches");
		this.running = false;
	}

});
