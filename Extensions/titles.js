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
	titleFuncs: {
		blog: url => {
			if (url.length > 2) {
				if (url[2] == "new") {
					// new post
					return "Post to " + url[1];
				} else if (url[2] == "review") {
					return url[1] + "’s flagged posts";
				} else if (url[2] != "delete") {
					// e.g. drafts, queue
					return url[1] + "’s " + url[2];
				} else {
					return "Delete " + url[1];
				}
			}
			// a plain blog page
			return url[1];
		},

		explore: url => "Explore: " + {
			"recommended-for-you": "Recommended for you",
			"trending":            "Trending",
			"staff-picks":         "Staff picks",
			"text":                "Text posts",
			"photos":              "Photo posts",
			"gifs":                "GIF posts",
			"quotes":              "Quote posts",
			"links":               "Link posts",
			"chats":               "Chat posts",
			"audio":               "Audio posts",
			"video":               "Video posts",
			"asks":                "Ask posts"
		}[url[1]],

		dashboard: url => "Dashboard",
		inbox: url => "Inbox",
		tagged: url => "#" + url[1],
		search: url => "Search: " + url[1],
		likes: url => "Likes",
		following: url => "Following",

		settings: url => url[1] == "blog"
			? "Settings for " + url[2]
			: document.title,

		"new": url => url[1] == "blog"
			? "Hoard a URL"
			: "Post to " + XKit.interface.post_window.blog(),

		reblog: url => "Reblog from " + XKit.interface.post_window.reblogging_from(),
		"mega-editor": url => "Mass editing " + url[1]
	},

	// new page title from an array of directory names
	getTitle: function(url) {
		return this.titleFuncs[url[0]](url);
	},

	urlComponents: () => new window.URL(document.URL).pathname
			.split("/").filter(component => component),

	// trims text after a `|` in a string; used for titles like
	// "Dashboard | Tumblr"
	trimPipe: txt => {
		let pipe = txt.indexOf("|");
		if (pipe != -1) {
			return txt.substring(0, pipe);
		}
		return txt.trim();
	},

	run: function() {
		this.running = true;
		document.title = this.trimPipe(document.title);
		// array of non-empty directory names, like ['blog', 'new-xkit']
		let url = this.urlComponents();

		window.addEventListener("hashchange", e => {
			if (this.running) {
				document.title = this.getTitle(url);
			}
		});

		document.title = this.getTitle(url);
	},

	destroy: function() {
		this.running = false;
	}
});
