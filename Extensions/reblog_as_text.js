//* TITLE Reblog As Text **//
//* VERSION 1.1.1 **//
//* DESCRIPTION Text posts remain text **//
//* DETAILS This post allows you to always reblog text posts as text posts, and not as links. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.reblog_as_text = new Object({

	running: false,

	run: function() {
		this.running = true;

		if (document.location.href.indexOf("://www.tumblr.com/reblog/") !== -1) {
			setTimeout(function() { XKit.extensions.reblog_as_text.fix_page(); }, 10);
		}

		if ($(".posts .post").length > 0) {
			$(document).on("click", ".reblog_button, .post_control.reblog", XKit.extensions.reblog_as_text.fix_page);
		}

	},

	fix_page: function() {

		if ($("#tumblelog_choices").length === 0 || $(".mceEditor").length === 0) {
			XKit.console.add("Reblog window Not active yet, delaying..");
			setTimeout(function() { XKit.extensions.reblog_as_text.fix_page(); }, 100);
			return;
		}

		if ($("#reblog_as").length === 0) {
			// Already probably reblogging as a text.
			XKit.console.add("\"Reblog As\" div not found, quitting.");
			return;
		}

		XKit.console.add("Switching to reblog as text mode.");
		var do_this = false;
		if ($("#reblog_select").find(".option:first-child").attr('data-option-value') === "text") {
			do_this = true;
		}

		var m_tags = "";
		// Get tags, if possible.
		if ($(".main_content").find(".tags").length > 0) {
			$(".main_content").find(".tags").find(".tag").each(function() {
				m_tags = m_tags + "," + $(this).html();
			});
		}

		if (!do_this) {
			return;
		}

		function m_function() {
			xkit_do_switch_to_text();

			function xkit_do_switch_to_text() {
				if (jQuery(".mceLayout").length <= 0) {
					setTimeout(function() {
						xkit_do_switch_to_text();
					}, 100);
					return;
				}
				var inner = jQuery(".post_form_wrapper_inner");
				var height = inner.height();
				inner.empty().append(jQuery('<div class="dummy"/>').height(height));
				if (this.destroy_preview) {
					this.destroy_preview();
				}
				Tumblr.PostForms.change_reblog_type("text", jQuery('body').attr('data-page-root'), inner, height, "");
			}
		}

		try {
			var script = document.createElement("script");
			script.textContent = script.textContent + "(" + m_function.toString() + ")();";
			document.body.appendChild(script);
		} catch (e) { alert(e.message); }

		// If reblog yourself is installed, call it.
		XKit.installed.when_running("reblog_yourself", function() {
			setTimeout(function() {
				XKit.extensions.reblog_yourself.fix_page();
			}, 500);
		});

		// Import links if possible.
		if (m_tags !== "") {
			setTimeout(function() {
				XKit.extensions.reblog_as_text.try_to_inject_tags(m_tags);
			}, 1000);
		}
	},

	try_to_inject_tags: function(to_add) {

		if ($("#post_content").length <= 0) {
			setTimeout(function() {
				XKit.extensions.reblog_as_text.try_to_inject_tags(to_add);
			}, 200);
			return;
		}

		var tag_to_be_added = "";
		var tags = to_add.split(",");
		for (var i = 0; i < tags.length; i++) {
			tag_to_be_added = tags[i];
			if (tag_to_be_added !== "") {
				var old_tags = $("#post_content").find(".tags").find(".post_tags").val();
				$("#post_content").find(".tags").find(".post_tags").val(old_tags + "," + tag_to_be_added);
				$("#post_content").find(".tags").find(".editor_wrapper").before('<span class="tag">' + tag_to_be_added + '</span>');
			}
		}
		$("#post_tags_label").css('display', 'none');
		$("#post_tags").val(to_add);

	},

	destroy: function() {
		$(document).off("click", ".reblog_button, .post_control.reblog", XKit.extensions.reblog_as_text.fix_page);
		this.running = false;
	}

});
