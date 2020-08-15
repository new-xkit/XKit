//* TITLE Post Limit Checker **//
//* VERSION 1.0.0 **//
//* DESCRIPTION Are you close to the limit? **//
//* DETAILS Shows you how many posts you can make or reblog today. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.post_limit_checker = new Object({

	running: false,
	apiKey: XKit.api_key,

	run: async function() {
		this.running = true;

		XKit.tools.init_css("post_limit_checker");

		if (!XKit.interface.where().dashboard && !XKit.interface.where().channel) {
			return;
		}

		if (XKit.page.react) {
			await XKit.interface.react.sidebar.add({
				id: "post_limit_checker_sidebar",
				title: "Post Limit",
				items: [{
					id: "post_limit_checker_view",
					text: "Check Post Limit"
				}]
			});
		} else {
			XKit.interface.sidebar.add({
				id: "post_limit_checker_sidebar",
				title: "Post Limit",
				items: [{
					id: "post_limit_checker_view",
					text: "Check Post Limit"
				}]
			});
		}

		$("#post_limit_checker_view").click(() => this.start());
	},

	staticBlogs: [],

	blogs: [],
	posts: {},
	cutoff: 0,

	start: function() {

		XKit.window.show(
			'Important!',

			'Before beginning, please read the following carefully.' +
			'<div id="xkit-plc-list" class="nano">' +
				'<div id="xkit-plc-list-content" class="content">' +
					'<div class="xkit-warning-plc-text"><b>Deleted posts</b><br>Deleted posts are counted by Tumblr, but this tool can\'t count them. For example, if you\'ve made 250 posts since the last reset but then deleted 50 of them, this tool will tell you that you have 50 more posts to go, but in reality you\'ve already hit your post limit.</div>' +
					'<div class="xkit-warning-plc-text"><b>Original photo posts</b><br>There is a separate limit for media uploads of 150. This extension does not check for that.</div>' +
					'<div class="xkit-warning-plc-text"><b>Edited timestamps</b><br>This tool relies on the time and date on posts being accurate. If you have set a custom post date on any recent posts, inaccurate data will be shown.</div>' +
					'<div class="xkit-warning-plc-text"><b>Group blogs</b><br>If you are a member of a group blog that has posted today, this tool cannot tell if those posts were made by your account or not.</div>' +
					'<div class="xkit-warning-plc-text"><b>No Guarantee</b><br>The New XKit Team is not making any guarantees about the reliability of this tool.</div>' +
				'</div>' +
			'</div>',

			'warning',

			'<div class="xkit-button default" id="xkit-plc-continue">Continue</div>' +
			'<div class="xkit-button default" id="xkit-close-message">Cancel</div>'
		);

		$("#xkit-plc-list").nanoScroller();
		$("#xkit-plc-list").nanoScroller({ scroll: 'top' });

		$("#xkit-plc-continue").click(() => {
			XKit.window.show(
				'Please wait',

				'Gathering the information I need:<br>' +
				'<span id="xkit-plc-progress">Initialising...</span>',

				'info'
			);

			this.staticBlogs = XKit.tools.get_blogs();

			this.blogs = [...this.staticBlogs];
			this.posts = {};
			this.cutoff = Math.floor(this.get_cutoff());

			this.scan_next_blog();
		});

	},

	get_cutoff: function() {
		let now = new Date();

		if (now.getUTCHours() >= 5) {
			return now.setUTCHours(5, 0, 0) / 1000;
		} else {
			return now.setUTCHours(5 - 24, 0, 0) / 1000;
		}
	},

	scan_next_blog: function() {
		const blog = this.blogs.shift();
		if (blog === undefined) {
			this.done();
			return;
		}

		$('#xkit-plc-progress').html(`Checking posts on <b>${blog}</b>...`);
		this.posts[blog] = 0;
		this.next(blog);
	},

	next: function(blog, page = 0) {

		XKit.svc.indash_blog({
			tumblelog_name_or_id: blog,
			limit: 50,
			offset: page * 50
		}).then(response => {
			const posts = response.json().response.posts;

			if (!posts.length) {
				this.scan_next_blog();
				return;
			}

			for (let post of posts) {
				if (post.timestamp > this.cutoff) {
					this.posts[blog]++;
				} else {
					this.scan_next_blog();
					return;
				}
			}

			this.next(blog, page + 1);
		}).catch(this.show_error);
	},

	done: function() {
		const remaining = 250 - Object.values(this.posts).reduce((total, x) => total + x);
		const nextReset = new Date((this.cutoff + 86400) * 1000);

		XKit.window.show(
			'Results',

			`You have <b>${remaining}</b> posts remaining today.<br>
			In your timezone, the limit resets each day at ${nextReset.toLocaleTimeString()}.<br><br>` +
			'<table style="width:100%">' +
				'<tr>' +
					'<th><b>Blog</b></th>' +
					'<th><b>Posts made today</b></th>' +
				'</tr>' + this.staticBlogs.map(blog => `
				<tr>
					<td>${blog}</td>
					<td>${this.posts[blog]}</td>
				</tr>`).join("") +
			'</table>',

			'info',

			'<div id="xkit-close-message" class="xkit-button default">OK</div>'
		);
	},

	show_error: function(error) {
		XKit.window.show(
			'Something went wrong.',

			'I was unable to process a blog.<br>Please refresh the page and try again.<br><br>' +
			`Here's what I know about this error: <p style="overflow-x:scroll">${error.message || error.responseText || error}</p>`,

			'error',

			'<div id="xkit-close-message" class="xkit-button default">OK</div>' +
			'<div id="xkit-plc-refresh" class="xkit-button">Refresh now</div>'
		);

		$("#xkit-plc-refresh").click(() => location.reload(true));
	},

	destroy: function() {
		XKit.interface.sidebar.remove("post_limit_checker_sidebar");
		$("#post_limit_checker_view").remove();
		this.running = false;
	}

});
