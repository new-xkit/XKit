//* TITLE Tag Replacer **//
//* VERSION 1.0.3 **//
//* DESCRIPTION Replace old tags! **//
//* DETAILS Allows you to bulk replace tags of posts. Go to your Posts page on your dashboard and click on the button on the sidebar and enter the tag you want replaced, and the new tag, and Tag Replacer will take care of the rest. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.tag_replacer = new Object({

	running: false,

	run: async function() {

		this.running = true;

		if (!XKit.interface.where().channel || !XKit.interface.where().user_url) {
			return;
		}

		XKit.tools.init_css("tag_replacer");

		if (XKit.page.react) {
			await XKit.interface.react.sidebar.add({
				id: "tag_replacer_sidebar",
				title: "Tag Replacer",
				items: [{
					id: "tag_replacer_button",
					text: "Replace a tag",
					carrot: true
				}]
			});
		} else {
			XKit.interface.sidebar.add({
				id: "tag_replacer_sidebar",
				title: "Tag Replacer",
				items: [{
					id: "tag_replacer_button",
					text: "Replace a tag",
					carrot: true
				}]
			});
		}

		$("#tag_replacer_button").click(() => {
			const url = XKit.interface.where().user_url;
			const shown_warning = XKit.storage.get("tag_replacer", "shown_warning", "false");

			if (shown_warning !== "true") {
				this.warning(url);
			} else {
				this.show(url);
			}
		});

	},

	warning: function(url) {
		XKit.window.show(
			"Important Notice",

			"Usage of Tag Replacer has reportedly caused some accounts to be temporarily terminated. " +
			"We aren't sure exactly why this is or what we can do to fix it.<br><br>" +
			"<b>Please only use this tool if you understand that, in the event that your usage of it triggers Tumblr's spam detector, " +
			"you will have to contact Tumblr support to restore your account.</b><br><br>" +
			"We have provided a link below to Tumblr's support form for you to bookmark. " +
			"(The link opens in a new tab.)<br><br>" +
			"If you accept this risk, this warning will not be shown again.",

			"warning",

			'<div id="xkit-tag-replacer-accept-risk" class="xkit-button default">I understand</div>' +
			'<div id="xkit-close-message" class="xkit-button">Cancel</div>' +
			'<a href="https://www.tumblr.com/support" target="_blank" class="xkit-button">Tumblr support &rarr;</a>'
		);

		$("#xkit-tag-replacer-accept-risk").click(() => {
			XKit.storage.set("tag_replacer", "shown_warning", "true");
			this.show(url);
		});
	},

	show: function(url) {

		XKit.window.show(
			'Tag Replacer',

			'<b>Replace this tag:</b>' +
			'<input type="text" maxlength="150" placeholder="Enter a tag (example: &quot;I like pandas&quot;)" class="xkit-textbox" id="xkit-tag-replacer-replace">' +
			'<div class="xkit-checkbox" id="xkit-tag-replacer-case-sensitive"><b>&nbsp;</b>Case Sensitive Mode</div>' +
			'<div class="xkit-tag-replacer-separator">&nbsp;</div>' +
			'<b>With this tag:</b> (leave blank to delete the tag)' +
			'<input type="text" maxlength="150" placeholder="Enter a new tag (example: &quot;I still like pandas&quot;)" class="xkit-textbox" id="xkit-tag-replacer-with">' +
			'<div class="xkit-checkbox" id="xkit-tag-replacer-append"><b>&nbsp;</b>Don\'t replace the tag but append the tag above</div>' +
			'<div class="xkit-tag-replacer-separator">&nbsp;</div>' +
			'<small>You can replace only one tag at a time.<br/>' +
			'Due to technical reasons, you can\'t edit tags containing dashes or slashes.</small>',

			'question',

			'<div class="xkit-button default" id="xkit-tag-replacer-ok">Go!</div>' +
			'<div class="xkit-button" id="xkit-close-message">Cancel</div>'
		);

		$("#xkit-tag-replacer-case-sensitive").click(function() { $(this).toggleClass("selected"); });
		$("#xkit-tag-replacer-append").click(function() { $(this).toggleClass("selected"); });

		$("#xkit-tag-replacer-ok").click(function() {
			var $replace = $("#xkit-tag-replacer-replace");
			var replace = $replace.val().trim();

			if (!$("#xkit-tag-replacer-case-sensitive").hasClass("selected")) {
				replace = replace.toLowerCase();
			}

			var $replace_with = $("#xkit-tag-replacer-with");
			var replace_with = $replace_with.val().trim();

			function complain($target, message, original) {
				$target
					.css("border-color", "red")
					.attr("placeholder", message)
					.val("")
					.click(() => $target
						.removeAttr("style")
						.attr("placeholder", original)
						.off("click"));
			}

			if (replace.includes(",")) {
				complain($replace, "Tag to search for can not contain commas.", 'Enter a tag (example: "I like pandas")');
				return;
			}

			if (replace === "") {
				complain($replace, "Enter the tag you want replaced.", 'Enter a tag (example: "I like pandas")');
				return;
			}

			if ($("#xkit-tag-replacer-append").hasClass("selected") && replace_with === "") {
				complain($replace_with, "Enter the tag(s) you want to append.", 'Enter a new tag (example: "I still like pandas")');
				return;
			}

			XKit.extensions.tag_replacer.start(url, replace, replace_with);

		});

	},

	url: "",
	replace: "",
	replace_with: "",
	post_ids: [],
	post_count: 0,
	append_mode: false,
	case_sensitive: false,
	success_count: 0,
	fail_count: 0,

	start: function(url, replace, replace_with) {

		Object.assign(this, {
			url: url,
			replace: replace,
			replace_with: replace_with,
			post_ids: [],
			post_count: 0,
			success_count: 0,
			fail_count: 0,
			append_mode: $("#xkit-tag-replacer-append").hasClass("selected"),
			case_sensitive: $("#xkit-tag-replacer-case-sensitive").hasClass("selected")
		});

		XKit.window.show(
			'Working...',

			'Tag Replacer is trying to find posts with the tag you\'ve entered, please wait. This might take a while.' +
			'<div id="xkit-tag-replacer-loaded">Initializing...</div>',

			'info'
		);

		this.fetch_posts();
	},

	fetch_posts: function(page = 0) {
		GM_xmlhttpRequest({
			method: "GET",
			url: `https://api.tumblr.com/v2/blog/${this.url}/posts?` + $.param({
				"api_key": XKit.api_key,
				"tag": this.replace,
				"limit": 50,
				"offset": page * 50
			}),
			onload: response => {
				let data = JSON.parse(response.responseText);

				if (data.response.posts.length === 0) {
					this.start_replace();
					return;
				}

				data.response.posts.forEach(post => this.post_ids.push(post.id_string));
				$("#xkit-tag-replacer-loaded").html(`Loaded ${this.post_ids.length} tagged posts...`);

				this.fetch_posts(page + 1);
			},
			onerror: () => this.show_error(
				"Can't fetch posts",

				"Tag Replacer could not fetch a list of tagged posts. This is usually due to your blog being private.<br>" +
				"Please check your blog settings and try again."
			)
		});
	},

	start_replace: function() {
		this.post_count = this.post_ids.length;

		if (this.post_count === 0) {
			XKit.window.show(
				'Nothing for me to do.',

				`Tag Replacer could not find any posts tagged <br><b>#${this.replace}</b>.`,

				'info',

				'<div id="xkit-close-message" class="xkit-button default">OK</div>'
			);
			return;
		}

		XKit.window.show(
			'Working...',

			`Tag Replacer is ${this.append_mode ? "appending" : "replacing"} tags.
			${XKit.progress.add("tag-replacer-progress")}
			This might take a long, long, long time.`,

			'info'
		);

		this.replace_tag();
	},

	replace_tag: function() {
		const post_id = this.post_ids.shift();

		if (post_id === undefined) {
			this.done_replacing();
			return;
		}

		XKit.interface.fetch({"id": post_id}, response => {
			if (response.error) {
				this.show_error(
					"Can't fetch post.",
					"Try again later."
				);
				return;
			}

			let tags = response.data.post.tags.split(",");
			let edited = false;

			if (this.append_mode) {
				tags.push(this.replace_with);
				edited = true;
			} else {
				for (let tag of tags) {
					let i = tags.indexOf(tag);

					if (!this.case_sensitive) {
						tag = tag.toLowerCase();
					}

					if (tag === this.replace) {
						tags[i] = this.replace_with;
						edited = true;
						break;
					}
				}
			}

			if (!edited) {
				this.update_progress();
				this.replace_tag();
				return;
			}

			let edited_post = XKit.interface.edit_post_object(response.data, {
				tags: tags.join(",")
			});

			XKit.interface.edit(edited_post, edit_response => {
				if (edit_response.error) {
					this.fail_count++;
				} else {
					this.success_count++;
				}

				this.update_progress();
				setTimeout(() => this.replace_tag(), 5000);
			});
		});
	},

	update_progress: function() {
		let done = this.post_count - this.post_ids.length;
		let percentage = Math.round((done * 100) / this.post_count);
		XKit.progress.value("tag-replacer-progress", percentage);
	},

	done_replacing: function() {
		if (this.fail_count == this.post_count) {
			this.show_error(
				"Oh dear...",
				"I was unable to replace tags on any of the posts.<br>Try again later?"
			);
			return;
		}

		XKit.window.show(
			'All done!',

			`Tag Replacer successfully ${this.append_mode ? "appended" : "replaced"} tags on <b>${this.success_count}</b> posts.<br>
			(Failed: ${this.fail_count})`,

			'info',

			'<div id="xkit-close-message" class="xkit-button default">Yay!</div>'
		);
	},

	show_error: (title, message) => XKit.window.show(
		title, message,

		'error',

		'<div class="xkit-button default" id="xkit-close-message">OK</div>' +
		'<a href="https://new-xkit-support.tumblr.com/" target="_blank" class="xkit-button">New XKit support</a>'
	),

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("tag_replacer");
		XKit.interface.sidebar.remove("tag_replacer_sidebar");
	}

});
