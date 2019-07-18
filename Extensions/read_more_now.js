//* TITLE Read More Now **//
//* VERSION 2.0.1 **//
//* DESCRIPTION Read Mores in your dash **//
//* DETAILS This extension allows you to read &quot;Keep Reading&quot; posts without leaving your dash. Just click on the &quot;Read More Now!&quot; button on posts and XKit will automatically load and display the post on your dashboard. **//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.read_more_now = new Object({

	running: false,
	cache: {},

	run: function() {
		this.running = true;
		XKit.post_listener.add("read_more_now", this.find_links);
		this.find_links();

		$(document).on("click", ".xreadmore:not(.disabled)", function() {
			XKit.extensions.read_more_now.add_content($(this));
		});
	},

	find_links: function() {
		$("a.tmblr-truncated-link:not(.xreadmore-done)")
			.addClass("xreadmore-done")
			.each(function() {
				XKit.extensions.read_more_now.add_button($(this));
			});
	},

	add_button: function($link) {
		const href = $link.attr("href");
		let url;
		let postID;

		if (!href.includes("t.umblr.com")) {
			[url, /* discard */, postID] = href.split("://")[1].split("/");
		} else {
			let $user_link = $link.parents(".reblog-list-item").find(".reblog-tumblelog-name");
			if (!$user_link.hasClass("inactive") && $user_link.attr("data-peepr")) {
				try {
					let data = JSON.parse($user_link.attr("data-peepr"));
					url = data.tumblelog;
					postID = data.postId;
				} catch (e) {
					return;
				}
			} else {
				return;
			}
		}

		this.get_username(url).then(username =>
			$link.parent().after(
				`<div class="xkit-button default xreadmore block" style="text-align:center" xreadmore-url="${username}" xreadmore-id="${postID}">
					Read More Now!
				</div>`
			)
		);
	},

	get_username: url => {
		if (url.includes(".tumblr.com") || !url.includes(".")) {
			let [username] = url.split(".");
			return Promise.resolve(username);
		} else {
			return fetch(`https://www.tumblr.com/api/v2/blog/${url}/info?api_key=${XKit.api_key}`)
				.then(response => response.json())
				.then(responseData => responseData.response.blog.name);
		}
	},

	add_content: function($button) {
		$button.addClass("disabled");
		let username = $button.attr("xreadmore-url");
		let postID = $button.attr("xreadmore-id");

		if (this.cache[postID] !== undefined) {
			$button
				.attr("style", "display: none !important")
				.after(this.cache[postID]);
		} else {
			$button.text("Loading...");

			XKit.svc.indash_blog({
				tumblelog_name_or_id: username,
				post_id: postID,
				limit: 1,
				should_bypass_safemode: true,
				should_bypass_tagfiltering: true
			})
				.then(response => {
					let responseData = response.json().response;
					if (responseData.post_not_found_message) {
						throw 404;
					}

					let comment = responseData.posts[0].reblog.comment;
					let readmore = comment.substring(comment.indexOf("[[MORE]]") + 8);
					this.cache[postID] = readmore;
					$button
						.attr("style", "display: none !important")
						.after(readmore);
				})
				.catch(() =>
					$button.text("Couldn't load! Maybe it's deleted?")
				);
		}
	},

	destroy: function() {
		this.running = false;
		$(document).off("click", ".xreadmore:not(.disabled)");
		XKit.post_listener.remove("read_more_now");
		$(".xreadmore-done").removeClass("xreadmore-done");
		$(".xreadmore, .xreadmore ~ *").remove();
	}

});
