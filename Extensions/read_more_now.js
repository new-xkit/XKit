//* TITLE Read More Now **//
//* VERSION 2.0.0 **//
//* DESCRIPTION Read Mores in your dash **//
//* DETAILS This extension changes &quot;Keep Reading&quot; links into collapsible elements for easy viewing. **//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.read_more_now = new Object({

	running: false,
	cache: {},

	run: function() {
		this.running = true;
		XKit.tools.init_css("read_more_now");
		XKit.post_listener.add("read_more_now", this.find_links);
		this.find_links();
	},

	find_links: function() {
		$("a.tmblr-truncated-link:not(.xreadmore-done)")
		.addClass("xreadmore-done")
		.each(function() {
			const $link = $(this);
			const href = $link.attr("href");
			let url;
			let postID;

			if (!href.includes("t.umblr.com")) {
				let link_parts = href.split("://")[1].split("/");
				url = link_parts[0];
				postID = link_parts[2];
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

			let cached_content = XKit.extensions.read_more_now.cache[postID];
			if (cached_content === undefined) {
				XKit.extensions.read_more_now.get_username(url)
				.then(username => XKit.svc.indash_blog({
					tumblelog_name_or_id: username,
					post_id: postID,
					limit: 1,
					should_bypass_safemode: true,
					should_bypass_tagfiltering: true
				}))
				.then(response => {
					let comment = response.json().response.posts[0].reblog.comment;
					let readmore = comment.substring(comment.indexOf("[[MORE]]") + 8).replace(/\[\[MORE\]\]/g, "");
					XKit.extensions.read_more_now.cache[postID] = readmore;
					XKit.extensions.read_more_now.transform_link($link.parent(), readmore);
				});
			} else {
				XKit.extensions.read_more_now.transform_link($link.parent(), cached_content);
			}
		});
	},

	get_username: url => {
		if (url.includes(".tumblr.com") || !url.includes(".")) {
			return new Promise(resolve => resolve(url.split(".")[0]));
		} else {
			return fetch(`https://www.tumblr.com/api/v2/blog/${url}/info?api_key=${XKit.api_key}`)
			.then(response => response.json())
			.then(responseData => responseData.response.blog.name);
		}
	},

	transform_link: function($container, content) {
		$container
		.before(`
			<details class="tmblr-truncated read_more_container">
				<summary class="tmblr-truncated-link read_more">${$container.find("a.tmblr-truncated-link").text().trim()}</summary>
				${content}
			</details>
		`);
	},

	destroy: function() {
		this.running = false;
		$("details.tmblr-truncated").remove();
		$(".xreadmore-done").removeClass("xreadmore-done");
		XKit.post_listener.remove("read_more_now");
		XKit.tools.remove_css("read_more_now");
	}

});
