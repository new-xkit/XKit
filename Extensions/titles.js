//* TITLE Tab titles **//
//* VERSION 1.0.0 **//
//* DESCRIPTION Descriptive tab titles, rather than just “Tumblr” **//
//* DEVELOPER Rebecca Turner **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.max_img_width = new Object({
	running: false,

	// the blog being posted to can't always be inferred from the url...
	postingTo: () => $("span.caption").innerText,

	/* object mapping the first url folder component to a function which takes
	 * an array of url components (like ['blog', 'xkit'] for '/blog/xkit') and
	 * returns the new page title
	 */
	getTitle: {
		blog: url => {
			if (url.length > 2) {
				if (url[2] == "new") {
					// new post
					return "Post to " + url[1];
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
			: "Post to " + this.postingTo(),

		reblog: url => "Reblog from " + $("span.reblog_name").innerText,
		"mega-editor": url => "Mass editing " + url[2]
	},

	trimPipe: txt => {
		let pipe = txt.indexOf("|");
		if (pipe != -1) {
			return txt.substring(0, pipe);
		}
		return txt;
	},

	run: function() {
		this.running = true;
		document.title = this.trimPipe(document.title);
		// array of non-empty directory names
		let url = new window.URL(document.URL).pathname
			.split("/").filter(component => component);

		window.addEventListener("hashchange", e => {
			if (this.running) {
				document.title = this.getTitle[url[0]](url);
			}
		});

		window.dispatchEvent(new window.Event("hashchange"));
	},

	destroy: function() {
		this.running = false;
	}
});

