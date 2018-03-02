//* TITLE       Retags **//
//* DEVELOPER   new-xkit **//
//* VERSION     1.2.5 **//
//* DESCRIPTION Adds tags to reblog notes **//
//* FRAME       false **//
//* SLOW        false **//
//* BETA        false **//

XKit.extensions.retags = {
	running: false,
	api_key: XKit.api_key,
	selectors: '.type_2,.type_8,.type_6,.reblog:not(.ui_avatar_link, .retags_has_processed),.is_reblog,.is_reblog_naked,.notification_reblog,.is_reply,.is_answer,.is_user_mention,.notification_user_mention',
	blog_name: "",

	run: function() {
		this.running = true;
		XKit.tools.init_css("retags");
		try {
			this.blog_name = $('body').data('new-root').split('/').pop();
		} catch (e) {}
		this.add_toggle();
		this.observer.observe($('body')[0], {
			childList:true,
			subtree:true
		});
		this.tag(this.selectors);
	},

	observer: new MutationObserver(function(ms) {
		var notesProcessed = false;
		ms.forEach(function(mutation) {
			var $baseMutatedElements = $(mutation.addedNodes);
			var activityNotes = $baseMutatedElements.find('.activity-notification');
			var fallbackNotes = $baseMutatedElements.find('.note:not(.ui_post_badge)');
			if ($baseMutatedElements.hasClass('note-list')) {
				//remove existing retags items (if tabbing between popover views)
				$baseMutatedElements.find('.retags-wrapper').remove();
				var elements = $baseMutatedElements.find('.post-activity-note');
				notesProcessed = true;
				XKit.extensions.retags.tag_popover(elements.filter(XKit.extensions.retags.selectors));
			} else if ($baseMutatedElements.hasClass('post-activity-note') && !notesProcessed) {
				XKit.extensions.retags.tag_popover($baseMutatedElements.filter(XKit.extensions.retags.selectors));
			} else if (activityNotes.length > 0) {
				XKit.extensions.retags.tag(activityNotes.filter(XKit.extensions.retags.selectors));
			} else if (fallbackNotes.length > 0) {
				XKit.extensions.retags.tag(fallbackNotes.filter(XKit.extensions.retags.selectors));
			} else {
				XKit.extensions.retags.tag($baseMutatedElements.filter(XKit.extensions.retags.selectors));
			}
		});
	}),

	tag_popover: function(elements) {
		$(elements).each(function() {
			var $element = $(this), retagClass, $target, host, id;
			if ($element.find('div.retags, p.note-added-tags').length) {
				return false;
			}
			if ($element.is('.is_reply, .is_answer, .type_6')) {
				return;
			}
			// popover
			if ($element.hasClass('note-item')) {
				retagClass = 'with_commentary';
				$target = $element;
				var peepr_data = $target.find('.note-text-link').data('peepr');
				if (peepr_data) {
					host = peepr_data.tumblelog.trim() + '.tumblr.com';
					id = peepr_data.postId.trim();
				}
			}
			if (host && id) {
				XKit.extensions.retags.request(host, id).then(function(tags) {
					XKit.extensions.retags.append_tag_popover($element, retagClass, $target, tags);
				}).fail(function(errorResponse) {
					var tagError = 'ERROR: ' + errorResponse.status;
					XKit.extensions.retags.append_tag_popover($element, retagClass, $target, tagError);
				});
			}
		});
	},

	append_tag_popover: function($element, retagClass, $target, data) {
		if (!data || !data.length) {
			return;
		}
		var retags = XKit.extensions.retags.build_tag_collection($element, retagClass, data);
		retags = "<li class='retags-wrapper'>" + retags[0].outerHTML + "</li>";
		$target.after(retags);
	},

	tag: function(elements) {
		$(elements).each(function() {
			var $element = $(this).addClass("retags_has_processed"), retagClass, $target, url, host, id;
			if ($element.find('div.retags').length) {
				return false;
			}
			//we don't need to put tags on a reply, but we also don't need to hide it
			if ($element.is('.is_reply, .is_answer, .type_6')) {
				return;
			}
			//blog
			if ($element.hasClass('note')) {
				   retagClass = 'with_commentary';
				   $target = $element;
				   url = $target.find('.action').data('post-url');
			// Activity (page/dropdown)
			} else if ($element.hasClass('activity-notification')) {
				retagClass = 'is_retags';
				$target = $element;
				var glass = $($element).find('.activity-notification__glass');
				url = glass.attr('href');
				// dashboard
			} else if ($element.hasClass('notification') && !XKit.browser().mobile) {
				$target = $element.find('.notification_sentence');
				url = $target.find('.notification_target').attr('href');
			// mobile
			} else if ($element.hasClass('notification') && XKit.browser().mobile) {
				retagClass = 'is_retags';
				$target = $element.find('.notification-wrapper');
				url = $target.find('a').not('.notification-username').attr('href');
			}
			if (url) {
				url = url.split('/');
				host = url[2];
				id = url[4];
				XKit.extensions.retags.request(host, id).then(function(tags) {
					XKit.extensions.retags.append_tag($element, retagClass, $target, tags);
				}).fail(function(errorResponse) {
					var tagError = 'ERROR: ' + errorResponse.status;
					XKit.extensions.retags.append_tag($element, retagClass, $target, tagError);
				});
			}
		});
	},

	append_tag: function($element, retagClass, $target, data) {
		var retags = XKit.extensions.retags.build_tag_collection($element, retagClass, data);
		$target.append(retags);
	},

	request: function(host, id) {
		var url = 'https://api.tumblr.com/v2/blog/' + host + '/posts/info?id=' + id + '&api_key=' + XKit.extensions.retags.api_key;
		var cache_label = 'post_' + id;
		//if it's already cached, get from cache
		if (XKit.storage.get('retags', cache_label, null) !== null) {
			return $.Deferred().resolve(XKit.storage.get('retags', cache_label));
		}
		//otherwise make API call
		var tags = [];
		var deferred = $.Deferred();
		GM_xmlhttpRequest({
			method: 'GET',
			url: url,
			onload: function(data) {
				tags = JSON.parse(data.responseText).response.posts[0].tags;
				if (XKit.extensions.retags.should_clear_posts()) {
					XKit.extensions.retags.clear_old_posts();
				}
				XKit.storage.set('retags', cache_label, tags);
				deferred.resolve(tags);
			},
			onerror: function(error) {
				deferred.reject(error);
			}
		});
		return deferred;
	},

	build_tag_collection: function($element, retagClass, tags) {
		if (tags.length) {
			var $retags = $('<div class="retags">');
			if (typeof tags === 'string') {
				$retags.append(tags).addClass('error');
			} else {
				tags.forEach(function(tag) {
					$retags.append('<a href="//tumblr.com/tagged/' + tag.replace(/ /g, '-') + '">#' + tag + '</a>');
				});
			}
			$element.addClass(retagClass);
			return $retags;
		}
	},

	/******* Cache **********/

	// The number of old posts that will be kept in the cache when it's cleared.
	POST_CACHE_CLEAR_PRESERVED: 100,
	// The number of posts that are allowed to be cached before the cache is cleared.
	POST_CACHE_CLEAR_THRESHOLD: 1000,

	count_cached_posts: function() {
		var cache = XKit.storage.get_all('retags');
		return Object.keys(cache).filter(function(key) {
			return key.match(/^post_[0-9]+$/);
		}).length;
	},

	should_clear_posts: function() {
		return XKit.extensions.retags.count_cached_posts() > XKit.extensions.retags.POST_CACHE_CLEAR_THRESHOLD || XKit.storage.quota('retags') < 100;
	},

	clear_old_posts: function() {
		// There's no API call to delete specific keys from the storage, so we'll
		// clear all of them and then restore the ones we want to keep.
		var cache = XKit.storage.get_all('retags');
		XKit.storage.clear('retags');

		// We always want to keep every setting key, but we only want to keep
		// some of the cached posts, so we need to partition the keys like so.
		var settingKeys = [], postIds = [];
		Object.keys(cache).forEach(function(key) {
			var id_match;
			if ((id_match = key.match(/^post_([0-9]+)$/))) {
				postIds.push(parseInt(id_match[1], 10));
			} else {
				settingKeys.push(key);
			}
		});

		// Now sort the post IDs in descending order and take only the first
		// few, so we only keep the newest posts.
		postIds.sort(function(id_one, id_two) { return id_two - id_one; });
		if (postIds.length > XKit.extensions.retags.POST_CACHE_CLEAR_PRESERVED) {
			postIds.length = XKit.extensions.retags.POST_CACHE_CLEAR_PRESERVED;
		}
		postIds.forEach(function(id) {
			settingKeys.push('post_' + id);
		});

		// And finally write back to storage!
		settingKeys.forEach(function(key) {
			XKit.storage.set('retags', key, cache[key].value);
		});
	},

	//********** Activity Page Toggle ********/

	add_toggle: function() {
		var toggle = 'toggle_' + this.blog_name;
		if (XKit.browser().mobile) {
			this.html_toggle.appendTo('.primary-nav');
			XKit.tools.add_css('label.retags .binary_switch_label {font-size:15px; color:white; padding-bottom:15px; }', 'retags_mobile_label');
		} else {
			this.html_toggle.appendTo('.ui_notes_switcher .part-toggle');
		}
		$('#retags-toggle').change(function() {
			if ($(this).prop('checked')) {
				XKit.storage.set('retags', toggle, 'true');
				XKit.extensions.retags.css_toggle.appendTo('head');
				if (XKit.browser().mobile) {
					XKit.extensions.retags.mobile_toggle.appendTo('head');
				}
			} else {
				XKit.storage.set('retags', toggle, 'false');
				XKit.extensions.retags.css_toggle.detach();
			}
		});
		if (XKit.storage.get('retags', toggle) === 'true') {
			$('#retags-toggle').click();
		}
	},

	css_toggle:
	$('<style class="retags"> ' +
		'.ui_note, .ui_notes .activity-notification { display: none; } ' +
		'.ui_note.is_retags, .ui_note.is_reply, .ui_note.is_response, .ui_note.is_user_mention { display: block; } ' +
		'.activity-notification.is_retags, .activity-notification.is_reply, .activity-notification.is_reblog:not(.naked), .activity-notification.user_mention, .activity-notification.note_mention { display: flex; }' +
	'</style>'),

	mobile_toggle:
	$('<style class="retags">' +
		'.note, .mh_post.post.post_type_notification.notification { display: none; } ' +
		'.note.with_commentary, .note.is_reply, .mh_post.post.post_type_notification.notification.is_retags { display: block; }' +
	'</style>'),

	html_toggle:
	$('<label class="retags binary_switch">' +
		'<input id="retags-toggle" type="checkbox">' +
		'<span class="binary_switch_track"></span>' +
		'<span class="binary_switch_button"></span>' +
		'<span class="binary_switch_label">Show only retags / responses</span>' +
	'</label>'),

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("retags");
		XKit.tools.remove_css('retags_mobile');
		this.css_toggle.detach();
		this.html_toggle.detach();
		this.mobile_toggle.detach();
		this.observer.disconnect();
		$('.retags').remove();
		$('body').off('.retags');
	}
};
