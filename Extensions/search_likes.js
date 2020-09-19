//* TITLE Search Likes **//
//* VERSION 0.3.4 **//
//* DESCRIPTION Lets you search likes **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS This is a very experimental extension that lets you search the posts you've liked by URL or text. Just go to your likes page, then click on Search button to get started. **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.search_likes = new Object({

	running: false,

	max_results: 200,
	preferences: {
		'highlight': {
			text: 'Highlight search results (bug: breaks hyperlinks)',
			default: true,
			value: true,
			slow: true
		},
		'max_results': {
			text: 'Maximum search results (default: 200)',
			type: 'text',
			default: '200',
			value: '200'
		},
	},

	searching: false,
	term: null,
	results: 0,
	posts_loaded: 0,

	highlight_selector: '',
	endless_scrolling_disabled: false,

	run: async function() {
		this.running = true;
		if (!XKit.interface.where().likes) { return; }

		const nextAriaLabel = await XKit.interface.translate('Next');
		if ($(`button[aria-label="${nextAriaLabel}"]`).length) {
			this.endless_scrolling_disabled = true;
		}

		const max_results = parseInt(this.preferences.max_results.value);
		this.max_results = !isNaN(max_results) && max_results > 0 ? max_results : 200;

		await XKit.css_map.getCssMap();
		this.highlight_selector =
			XKit.css_map.keyToCss('textBlock') + ', ' +
			XKit.css_map.keyToCss('tag') + ', ' +
			XKit.css_map.keyToCss('attribution') + ', ' +
			XKit.css_map.keyToCss('contentSource');

		XKit.tools.init_css('search_likes');

		if (!$('#xkit_react_sidebar').length) {
			await XKit.interface.react.sidebar.init();
		}
		const search_box_html =
			`<div id='search-likes-box'>
				<input type='text' placeholder='Search Likes' autocomplete="off" id='search-likes-input'>
			</div>`;
		$('#xkit_react_sidebar').prepend(search_box_html);
		$('#search-likes-input').keydown(event => event.stopPropagation());
		$('#search-likes-input').click(this.new_search_term);

		const new_search_debounced = XKit.tools.debounce(this.new_search_term, 500);
		$('#search-likes-input').keyup(new_search_debounced);
	},

	new_search_term: async function() {
		const {search_likes} = XKit.extensions;
		var term = $(this).val().toLowerCase().trim();
		if (term.length < 2) {
			term = '';
		}
		if (search_likes.term != term) {
			if (!search_likes.searching) {
				await search_likes.init_search();
			}
			search_likes.term = term;
			search_likes.results = 0;
			const $allPosts = $('#search-likes-timeline [data-id]');
			search_likes.posts_loaded = $allPosts.length;
			search_likes.update_status_bar(`Searching for <b>"${search_likes.term}"</b>, please wait...`);

			search_likes.wait_for_render().then(() => {
				$('#search-likes-timeline mark').contents().unwrap();
				$allPosts
				.removeClass('search-likes-done')
				.removeClass('search-likes-shown');
				XKit.extensions.search_likes.filter_posts(search_likes.term);
			});
		}
	},

	init_search: async function() {
		const {search_likes} = XKit.extensions;
		search_likes.searching = true;
		XKit.post_listener.add('search_likes', XKit.extensions.search_likes.process_new_posts);
		$(XKit.css_map.keyToCss('timeline')).attr('id', 'search-likes-timeline');
		$(XKit.css_map.descendantSelector('timeline', 'loader')).attr('id', 'search-likes-loader');
		$('#search-likes-timeline').after(`<div id='prevent-load'></div>`);

		search_likes.update_status_bar(`Searching for <b>"${search_likes.term}"</b>`);
		search_likes.wait_for_render().then(() => {
			XKit.tools.add_css(`
				#search-likes-timeline {
					min-height: calc(100vh - ${$('#search-likes-timeline').offset().top - 10}px);
				}
			`, 'search-likes-searching');
			XKit.interface.hide('[data-id]:not(.search-likes-shown)', 'search-likes-searching');
		});
	},

	destroy_search: function() {
		const {search_likes} = XKit.extensions;
		search_likes.searching = false;
		try {
			XKit.post_listener.remove('search_likes');
		} catch (error) {
			// Nothing to remove
		}
		search_likes.term = null;
		$('#search-likes-input').val('');
		$('#search-likes-timeline mark').contents().unwrap();
		$('#search-likes-timeline [data-id]')
			.removeClass('search-likes-done')
			.removeClass('search-likes-shown');
		$('.search-likes-status-bar').remove();
		$('#prevent-load').remove();
		$('#search-likes-timeline').removeAttr('id');
		XKit.tools.remove_css('search-likes-searching');
	},

	process_new_posts: async function() {
		const {search_likes} = XKit.extensions;
		if (!search_likes.searching) { return; }
		if (!XKit.interface.where().likes) {
			XKit.post_listener.remove('search_likes');
			return;
		}
		const $allPosts = $('#search-likes-timeline [data-id]');
		if ($allPosts.length <= search_likes.posts_loaded) { return; }
		search_likes.posts_loaded = $allPosts.length;
		if (!search_likes.term) {
			search_likes.update_status_bar('...');
			return;
		}

		search_likes.wait_for_render().then(() => {
			XKit.extensions.search_likes.filter_posts(search_likes.term);
		});
	},

	filter_posts: async function(term) {
		const {search_likes} = XKit.extensions;
		var posts_to_show = [];
		if (!term) {
			search_likes.update_status_bar('...');
			return;
		}

		const $posts = $('#search-likes-timeline [data-id]:not(.search-likes-done)')
		.addClass('search-likes-done');

		search_likes.update_status_bar(`Searching for <b>"${search_likes.term}"</b>, please wait...`);

		let render_chunk_size = 3;
		const render = function() {
			for (const post_to_show of posts_to_show) {
				post_to_show.classList.add('search-likes-shown');
				if (XKit.extensions.search_likes.preferences.highlight.value) {
					$(post_to_show).find(search_likes.highlight_selector).each(function() {
						$(this).html(search_likes.return_highlighted_html($(this).html(), search_likes.term));
					});
				}
			}
			posts_to_show = [];
			search_likes.update_status_bar(`Searching for <b>"${search_likes.term}"</b>, please wait...`);
		};

		for (const post of $posts) {
			if (search_likes.term != term) { return; }
			if (search_likes.results >= search_likes.max_results) {
				search_likes.update_status_bar(`Searching for <b>"${term}"</b>`);
				break;
			}
			let text = await search_likes.get_post_text(post);

			if (text.toLowerCase().indexOf(term) > -1) {
				posts_to_show.push(post);
				search_likes.results++;

				if (posts_to_show.length >= render_chunk_size) {
					if (search_likes.term != term) {
						//search term has changed while we were processing
						return;
					}
					render_chunk_size = 13;
					render();
					await search_likes.wait_for_render();
				}
			}
		}
		render();
		search_likes.update_status_bar(`Searching for <b>"${term}"</b>`);
	},

	get_post_text: async function(post) {
		var text = [];
		const {blogName, rebloggedFromName, rebloggedRootname, sourceTitle, askingName, content, trail, postAuthor, tags} =
			await XKit.interface.react.post_props(post.getAttribute('data-id'));
		text.push(blogName, rebloggedFromName, rebloggedRootname);
		if (askingName) {
			text.push(askingName + ' asked:');
		}

		const process_content = function(input) {
			for (let block of input) {
				if (block.attribution) {
					text.push(block.attribution.appName, block.attribution.displayText, block.attribution.url);
				}
				if (block.description) {
					text.push(block.description);
				}
				if (block.displayUrl) {
					text.push(block.displayUrl);
				}
				if (block.title) {
					text.push(block.title);
				}
				if (block.artist) {
					text.push(block.artist);
				}
				if (block.artist) {
					text.push(block.album);
				}
				if (block.text) {
					text.push(block.text);
				}
				if (block.formatting) {
					for (let formatblock of block.formatting) {
						if (formatblock.url) {
							// Follow tumblr-redirected URLs
							if (formatblock.url.indexOf('t.umblr.com/redirect') > -1) {
								text.push(new URL(formatblock.url).searchParams.get('z'));
							} else {
								text.push(formatblock.url);
							}
						}
					}
				}
			}
		};

		if (trail) {
			for (let reblog of trail) {
				if (reblog.blog) {
					text.push(reblog.blog.name);
				}
				if (reblog.brokenBlog) {
					text.push(reblog.brokenBlog.name);
				}
				if (reblog.content) {
					process_content(reblog.content);
				}
			}
		}
		if (content) {
			process_content(content);
		}

		if (sourceTitle) {
			text.push("source: " + sourceTitle);
		}
		if (postAuthor) {
			text.push("submitted by: " + postAuthor);
		}
		if (tags) {
			for (let tag of tags) {
				text.push('#' + tag);
			}
		}
		return text.join('\n');
	},

	simple_get_post_text: function(post) {
		const text = post.innerHTML
			.replace(/&nbsp;/ig, '')
			.toLowerCase()
			.trim()
			.split(/<[^>]+>/ig)
			.filter(Boolean)
			.join('\n');

		console.log(text);
		return text;
	},

	update_status_bar: function(status) {
		const {results, max_results, posts_loaded, destroy_search, endless_scrolling_disabled} =
			XKit.extensions.search_likes;
		let status_html;
		if (results >= max_results) {
			status_html = status +
				`<br/>Showing the first ${max_results} results found out of ${posts_loaded} loaded posts.<br/>
				Increase the maximum result count in Search Likes' preferences.<br/>
				<a class='destroy-button'>Exit search and show all posts</a>`;

		} else if (endless_scrolling_disabled) {
			status_html = status +
				`<br/>${results} results on this page.<br/>
				Enabling endless scrolling is recommended with the Search Likes extension.<br/>
				<a class='destroy-button'>Exit search and show all posts</a>`;
		} else {
			status_html = status +
				`<br/>${results} results found out of ${posts_loaded} loaded posts.<br/>
				Scroll down to load more posts and results.<br/>
				<a class='destroy-button'>Exit search and show all posts</a>`;
		}

		if (results > 0 || endless_scrolling_disabled) {
			if ($('#search-likes-status-bar-top').length > 0) {
				$('#search-likes-status-bar-top').html(status_html);
			 } else {
				$('#search-likes-timeline').before(`<div id='search-likes-status-bar-top' class='search-likes-status-bar'>${status_html}</div>`);
				$('#search-likes-status-bar-top').on('click', '.destroy-button', destroy_search);
			}
		} else {
			$('#search-likes-status-bar-top').remove();
		}

		if ($('#search-likes-status-bar-bottom').length > 0) {
			$('#search-likes-status-bar-bottom').html(status_html);
		 } else {
			$('#search-likes-loader').prepend(`<div id='search-likes-status-bar-bottom' class='search-likes-status-bar'>${status_html}</div>`);
			$('#search-likes-status-bar-bottom').on('click', '.destroy-button', destroy_search);
		}
	},

	/**
	 * Returns a promise that resolves only once any changes previously made to the DOM have been
	 * rendered on the page.
	 *
	 * @return {Promise}
	 */
	wait_for_render: function() {
		return new Promise((resolve) => {
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					resolve();
				});
			});
		});
	},

	return_highlighted_html: function(src_str, term) {

		/* from http://jsfiddle.net/UPs3V/ */

		try {

			term = term.replace(/(\s+)/, "(<[^>]+>)*$1(<[^>]+>)*");
			var pattern = new RegExp("(" + term + ")", "i");

			src_str = src_str.replace(pattern, "<mark>$1</mark>");
			src_str = src_str.replace(/(<mark>[^<>]*)((<[^>]+>)+)([^<>]*<\/mark>)/, "$1</mark>$2<mark>$4");

			return src_str;

		} catch (e) {

			return src_str;

		}

	},

	destroy: function() {
		const {search_likes} = XKit.extensions;
		this.running = false;
		search_likes.destroy_search();
		XKit.tools.remove_css('search_likes');
		$('#search-likes-box').remove();
	}

});
