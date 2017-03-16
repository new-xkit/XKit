//* TITLE Hide Avatars **//
//* VERSION 0.1.5 **//
//* DESCRIPTION Hides avatars on a per-url basis **//
//* DEVELOPER dlmarquis **//
//* FRAME false **//
//* BETA true **//

XKit.extensions.hideavatars = new Object({

	running: false,

	blognames: [],

	run: function() {

		this.running = true;

		XKit.tools.init_css("hideavatars");

		XKit.extensions.hideavatars.load_blogs();

		XKit.post_listener.add("hide_avatars", XKit.extensions.hideavatars.hide_avatars);
		XKit.extensions.hideavatars.hide_avatars();

	},

	hide_avatars: function() {
		var hidden_avatar = 'data:image/png;base64,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';

		if (XKit.interface.where().dashboard) {
			//Regular avatars
			XKit.extensions.hideavatars.blognames.forEach(function(blogname) {
				$(".post_avatar_link").filter(function() {
					return $(this).attr("href").slice(7).split(".")[0] === blogname.title;
				}).attr("style", "opacity: 0.5; background-image: url('" + hidden_avatar + "');");

			//Avatars in notifications
				$(".notification a").filter(function() {
					return $(this).attr("href").slice(7).split(".")[0] === blogname.title;
				}).find(".avatar").attr("src", hidden_avatar).attr("style", "opacity: 0.5");
			});
		}

		if (XKit.interface.where().inbox) {
			XKit.extensions.hideavatars.blognames.forEach(function(blogname) {
				$(".post_avatar_link").filter(function() {
					return $(this).attr("href").slice(7).split(".")[0] === blogname.title;
				}).find(".post_avatar_image").attr("src", hidden_avatar);

				$(".post_avatar_link").filter(function() {
					return $(this).attr("href").slice(7).split(".")[0] === blogname.title;
				}).attr("style", "opacity: 0.5; background-image: url('" + hidden_avatar + "');");
			});
		}

		if (XKit.interface.where().activity) {
			//Top-four avatars
			XKit.extensions.hideavatars.blognames.forEach(function(blogname) {
				$(".ui_jumbo_avatar").filter(function() {
					return $(this).attr("title") === blogname.title;
				}).attr("style", "opacity: 0.5; background-image: url('" + hidden_avatar + "');");

			//Avatars in activity lines
				$(".ui_avatar_link").filter(function() {
					return $(this).attr("title") === blogname.title;
				}).find(".avatar").attr("style", "opacity: 0.5; background-image: url('" + hidden_avatar + "');");
			});
		}
	},

	load_blogs: function() {

		var m_storage = XKit.storage.get("hideavatars", "blognames", "");

		if (m_storage !== "") {
			try {
				XKit.extensions.hideavatars.blognames = JSON.parse(m_storage);
			} catch (e) {
				XKit.extensions.hideavatars.blognames = [];
				XKit.console.add("Failed to parse m_storage in XKit.extensions.hideavatars.load_blogs");
			}
		} else {
			XKit.extensions.hideavatars.blognames = [];
		}

	},

	save_blogs: function() {

		try {
			console.log("Trying to save " + XKit.extensions.hideavatars.blognames.length + " blogs..");
			console.log(JSON.stringify(XKit.extensions.hideavatars.blognames));
			XKit.storage.set("hideavatars", "blognames", JSON.stringify(XKit.extensions.hideavatars.blognames));
		} catch (e) {
			XKit.window.show("Unable to save data", "Hide Avatars could not save data<br/><br/>Error:<br/>" + e.message, "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
			alert("Can't save data:\n" + e.message);
		}

	},

	cpanel: function(m_div) {

		XKit.extensions.hideavatars.load_blogs();

		if ($("#xkit-hideavatars-custom-panel").length > 0) {
			// Panel already exists, probably in refresh mode.
			// Remove it first.
			$("#xkit-hideavatars-custom-panel").remove();
		}

		var cat_list = "";

		if (XKit.extensions.hideavatars.blognames.length === 0) {
			cat_list = "<div class=\"xkit-hideavatars-no-blognames\">You have no blogs set.</div>";
		} else {

			for (var j = 0; j < XKit.extensions.hideavatars.blognames.length; j++) {

				cat_list = cat_list + "<div class=\"xkit-hideavatars-cp-item\" data-id=\"" + XKit.extensions.hideavatars.blognames[j].id + "\">" + XKit.extensions.hideavatars.blognames[j].title + "</div>";

			}
		}

		var m_html = "<div id=\"xkit-hideavatars-custom-panel\">" +
					"<div id=\"xkit-hideavatars-custom-panel-toolbar\">" +
						"<div id=\"xkit-hideavatars-add-blogname\" class=\"xkit-button\">Add new blog</div>" +
					"</div>" +
					cat_list +
				"</div>";

		$(m_div).html(m_html);

		$("#xkit-extensions-panel-right").nanoScroller();
		$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });

		$("#xkit-hideavatars-add-blogname").click(function() {

			XKit.window.show("New blog", "<b>Blog Name:</b><input type=\"text\" maxlength=\"40\" placeholder=\"\" class=\"xkit-textbox\" id=\"xkit-hideavatars-blogname-add-title\">", "question", "<div class=\"xkit-button default\" id=\"xkit-hideavatars-create-blogname\">Add Blog</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

			$("#xkit-hideavatars-create-blogname").click(function() {

				var m_title = $("#xkit-hideavatars-blogname-add-title").val();

				if ($.trim(m_title) === "") { XKit.window.close(); return; }

				if (XKit.extensions.hideavatars.blogname_exists(m_title)) {
					alert("You've already added this blog!");
					return;
				}

				XKit.extensions.hideavatars.load_blogs();

				XKit.extensions.hideavatars.blognames.push({
					id: XKit.tools.random_string() + new Date().getTime(),
					title: m_title
				});

				XKit.extensions.hideavatars.save_blogs();
				XKit.extensions.hideavatars.cpanel(m_div);
				XKit.window.close();

			});

		});

		$(".xkit-hideavatars-cp-item").click(function() {

			var m_cat_obj = XKit.extensions.hideavatars.get_blogname($(this).attr('data-id'));

			if (m_cat_obj === false) { alert("Error HAV-136: Could not find blog name with data-id " + $(this).attr('data-id') ); return; }

			XKit.window.show("Edit blog name", "<b>Blog Name:</b><input type=\"text\" maxlength=\"40\" placeholder=\"\" class=\"xkit-textbox\" id=\"xkit-hideavatars-blogname-add-title\" value=\"" + m_cat_obj.title + "\"><br/>If you delete this blog, its avatar will show again", "question", "<div class=\"xkit-button default\" id=\"xkit-hideavatars-save-blogname\">Save blogname</div><div class=\"xkit-button\" id=\"xkit-hideavatars-delete-blogname\">Delete</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

			$("#xkit-hideavatars-save-blogname").click(function() {

				XKit.extensions.hideavatars.load_blogs();

				for (var i = 0; i < XKit.extensions.hideavatars.blognames.length; i++) {

					if (m_cat_obj.id === XKit.extensions.hideavatars.blognames[i].id) {

						XKit.extensions.hideavatars.blognames[i].title = $("#xkit-hideavatars-blogname-add-title").val();
						XKit.extensions.hideavatars.save_blogs();

						XKit.window.close();

						XKit.extensions.hideavatars.cpanel(m_div);

					}

				}

			});

			$("#xkit-hideavatars-delete-blogname").click(function() {

				XKit.window.show("You sure?", "Delete blog <b>\"" + m_cat_obj.title + "\"</b>?", "warning", "<div class=\"xkit-button default\" id=\"xkit-hideavatars-delete-blogname-confirm\">Confirm</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

				$("#xkit-hideavatars-delete-blogname-confirm").click(function() {

					XKit.extensions.hideavatars.load_blogs();

					for (var i = 0; i < XKit.extensions.hideavatars.blognames.length; i++) {

						if (m_cat_obj.id === XKit.extensions.hideavatars.blognames[i].id) {

							XKit.extensions.hideavatars.blognames.splice(i, 1);

						}

					}

					XKit.extensions.hideavatars.save_blogs();
					XKit.extensions.hideavatars.cpanel(m_div);
					XKit.window.close();

				});

			});

		});

	},

	get_blogname: function(id) {

		for (var i = 0; i < XKit.extensions.hideavatars.blognames.length; i++) {

			if (id === XKit.extensions.hideavatars.blognames[i].id) {

				return XKit.extensions.hideavatars.blognames[i];

			}

		}

		return false;

	},

	blogname_exists: function(title) {

		title = title.toLowerCase();

		for (var i = 0; i < XKit.extensions.hideavatars.blognames.length; i++) {

			if (title === XKit.extensions.hideavatars.blognames[i].title.toLowerCase()) {

				return true;

			}

		}

		return false;

	},




	destroy: function() {
		XKit.tools.remove_css("hideavatars");
	}
});
