//* TITLE Tab titles **//
//* VERSION 1.0.0 **//
//* DESCRIPTION Descriptive tab titles, rather than just “Tumblr” **//
//* DEVELOPER Rebecca Turner **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.titles = new Object({
	running: false,

	/* object mapping the first url folder component to a function which takes
	 * an array of url components (like ['blog', 'xkit'] for '/blog/xkit') and
	 * returns the new page title
	 */
	titleForPath: {
		blog: path => {
			if (path.length > 2) {
				const [blogName, route] = path;
				return {
					"new": `Post to ${blogName}`,
					review: `${blogName}’s flagged posts`,
					delete: `Delete ${blogName}`
				}[route] || `${blogName}’s ${route}`;
			}
			// a plain blog page
			return path[1];
		},

		explore: path => "Explore: " + {
			"recommended-for-you": "Recommended for you",
			trending: "Trending",
			"staff-picks": "Staff picks",
			text: "Text posts",
			photos: "Photo posts",
			gifs: "GIF posts",
			quotes: "Quote posts",
			links: "Link posts",
			chats: "Chat posts",
			audio: "Audio posts",
			video: "Video posts",
			asks: "Ask posts"
		}[path[1]],

		dashboard: path => "Dashboard",
		inbox: path => "Inbox",
		tagged: path => `#${path[1]}`,
		search: path => `Search: ${path[1]}`,
		likes: path => "Likes",
		following: path => "Following",

		"new": path => path[1] == "blog"
			? "Hoard a URL"
			: `Post to ${XKit.interface.post_window.blog()}`,

		reblog: path => `Reblog from ${XKit.interface.post_window.reblogging_from()}`,
		"mega-editor": path => `Mass editing ${path[1]}`
	},

	// trims text after a `|` in a string; used for titles like
	// "Dashboard | Tumblr"
	trimTitle: title => title.split("|")[0].trim(),

	// Gets a new page title from an array of directory names. This actually
	// has to be a function() and not a lambda because it uses `this`.
	getTitle: function(pathComponents) {
		let fn = this.titleFuncs[pathComponents[0]];
		if (fn) {
			return fn(pathComponents);
		} else {
			// unrecognized path; clean up title a bit anyways
			return this.trimTitle(document.title);
		}
	},

	pathComponents: () => document.location.pathname
			.split("/").filter(component => component),

	run: function() {
		this.running = true;
		document.title = this.getTitle(this.pathComponents());
	},

	destroy: function() {
		this.running = false;
	}
});
