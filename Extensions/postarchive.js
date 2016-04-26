//* TITLE Post Archiver **//
//* VERSION 1.0.1 **//
//* DESCRIPTION Never lose a post again. **//
//* DETAILS Post Archiver lets you save posts to your XKit.<br><br>Found a good recipe? Think those hotline numbers on that signal boost post might come in handy in the future?<br><br>Click on the save button, then click on the My Archive button on your sidebar anytime to access those posts. You can also name and categorize posts. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.postarchive = {

	running: false,

	button_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6NDQ5RTU4RTU3MjVEMTFFMzkxNjc4NTlFOTA5MTY1RjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6NDQ5RTU4RTY3MjVEMTFFMzkxNjc4NTlFOTA5MTY1RjciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo0NDlFNThFMzcyNUQxMUUzOTE2Nzg1OUU5MDkxNjVGNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo0NDlFNThFNDcyNUQxMUUzOTE2Nzg1OUU5MDkxNjVGNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pu91pc8AAACgSURBVHjaYvz//z8D1QDIMGSMLo0Fz8Sln4mBimCEGMaCRawLiKXx6HEC4qVQ9lwg3ocvNm2A+A+OmETGh4GYGUUvjqRRQcCgVzDXE2MYCGzBY5grNp/hM0wIiB9iMagRV6IllAMsgfgnkkF7QeGE0zA0W7GBIqjccyCWwJYjkfUTMgwE1kGTBAM+wxjRDGEkp6ygSQ5gJOC9YZLRAQIMAENzviFg3gnxAAAAAElFTkSuQmCC",
	button_on: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTU0NzMyOUU3MjVEMTFFMzkxNjc4NTlFOTA5MTY1RjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTU0NzMyOUY3MjVEMTFFMzkxNjc4NTlFOTA5MTY1RjciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFNTQ3MzI5QzcyNUQxMUUzOTE2Nzg1OUU5MDkxNjVGNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFNTQ3MzI5RDcyNUQxMUUzOTE2Nzg1OUU5MDkxNjVGNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pn1307MAAAC0SURBVHjaYvz//z8DtQBj/hK88thsmgXE6TDOhGiEEiYGKoIRYhgLFrEuIJbGo8cJiJdC2XOBeB8+wzYB8QEgZsZhmAoUHwHig4S8CVJUQ8BHr4E4Aoj/EhNmHUC8FY9h0UD8lJQIiAPiR1jEm4B4N6mx+Q7qlV9IYvughuGMTeQsw4gmfxyIK4G4F4hfQL2HEk4FSxn/44tNdNAHxDZAPAVqIEnpDBsIGvAc8H94ZnSAAAMAwKElB0jQE0QAAAAASUVORK5CYII=",

	apiKey: "fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4",

	archived_posts: [],
	categories: [],

	frame_run: function() {

		if ($(".btn.like").length === 0 && $(".btn.edit").length === 0) { return; }

		XKit.tools.init_css("postarchive");

		XKit.extensions.postarchive.load_posts();

		var m_css = "#iframe_controls { width: auto !important; } " +
				"#xkit_postarchive_inblog_button:before {" +
					" background-size: auto; " +
					" background-position: 50% 50%; " +
					" background-repeat: no-repeat; " +
					" background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTQ0NUQ3NjA3Mjg4MTFFMzkxNjc4NTlFOTA5MTY1RjciIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTQ0NUQ3NjE3Mjg4MTFFMzkxNjc4NTlFOTA5MTY1RjciPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5NDQ1RDc1RTcyODgxMUUzOTE2Nzg1OUU5MDkxNjVGNyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo5NDQ1RDc1RjcyODgxMUUzOTE2Nzg1OUU5MDkxNjVGNyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PtuUengAAACQSURBVHjaYvz//z8DOYAJi5gxEP9Hw8bEaCTZRjYglgNiCSzqJKBybHARkB+hmA2Iz//HDc5D1YDVI2sEYRUg/oxF02eoHAMujSAcgkVjCLo6bBpBeDKSpsnY1DDiiEdQIByDsq2A+Be6AphGmG5GJDlRKP0aSQyuDp9GbACujgWHBFlJjijAQqQTMQBAgAEAoAjV0Rb+PnUAAAAASUVORK5CYII=); " +
				"}" +
				".btn.xkit-post-archive-inblog-button-done { background-color: #59982a !important; }";

		XKit.tools.add_css(m_css, "post_archive_in_blog");

		var m_html = "<a id=\"xkit_postarchive_inblog_button\" onclick=\"return false\" class=\"btn icon no_label\" title=\"Archive this post\">Post Archiver</a>";

		$(".btn.dashboard").before(m_html);

		var post_id = "";

		if ($(".btn.like").length > 0) {
			post_id = $(".btn.like").attr('data-id');
		} else {
			var postid_start = document.location.href.search("&pid=");
			if (postid_start === -1) { return; }
			var postid_end =  document.location.href.indexOf("&", postid_start + 2);
			post_id = document.location.href.substring(postid_start + 5, postid_end);
		}

		if (XKit.extensions.postarchive.is_post_in_archive(post_id) !== false) {

			$("#xkit_postarchive_inblog_button").addClass("xkit-post-archive-inblog-button-done");

		}

		$("#xkit_postarchive_inblog_button").click(function() {

			var blog_url = $("#tumblelog_name").attr('data-tumblelog-name');

			XKit.iframe.full();

			XKit.extensions.postarchive.archive(post_id, this, true);


		});

	},

	run: function() {

		this.running = true;

		XKit.tools.init_css("postarchive");

		XKit.extensions.postarchive.load_posts();

		if (XKit.interface.where().inbox === true) { return; }

		if ($('#postarchive_ul').length === 0) {
			var xf_html = '<ul class="controls_section" id="postarchive_ul">' +
				'<li class="section_header selected">Post Archive</li>' +
					'<li class="no_push" style="height: 36px;"><a href="#" id="postarchive_view">' +
						'<div class="hide_overflow" style="color: rgba(255, 255, 255, 0.5) !important; font-weight: bold; padding-left: 10px; padding-top: 8px;">My Archive <span class="count" id="postarchive_view_count" style="padding-top: 8px;">' + XKit.extensions.postarchive.archived_posts.length + '</span></div>' +
					'</a></li>' +
				'</ul>';

			$(".controls_section_radar").before(xf_html);
		}

		$("#postarchive_view").click(function() {

			XKit.extensions.postarchive.view();

			return false;
		});

		if ($(".posts .post").length > 0) {

			XKit.interface.create_control_button("xkit-postarchive", this.button_icon, "Archive this post", "", this.button_on);
			XKit.extensions.postarchive.init();
			XKit.post_listener.add("postarchive", XKit.extensions.postarchive.do);
			XKit.extensions.postarchive.do();
		}

	},

	render_posts_uncategorized: function() {

		var m_post_list_html = "";

		for (var i=0;i<XKit.extensions.postarchive.archived_posts.length;i++) {

			if (!XKit.extensions.postarchive.archived_posts[i].category) {

				var m_x_list_div = "<div data-category=\"\" data-post-id=\"" + XKit.extensions.postarchive.archived_posts[i].post_id + "\" class=\"xkit-postarchive-post\">" + XKit.extensions.postarchive.archived_posts[i].title + "</div>";
				m_post_list_html = m_post_list_html + m_x_list_div;

			}

		}

		return m_post_list_html;

	},

	render_posts_on_category: function(category, additional_classes) {

		var m_post_list_html = "";

		if (typeof additional_classes === "undefined") { additional_classes = ""; }

		for (var i=0;i<XKit.extensions.postarchive.archived_posts.length;i++) {

			if (typeof XKit.extensions.postarchive.archived_posts[i].category !== "undefined") {

				if (XKit.extensions.postarchive.archived_posts[i].category == category) {

					var m_x_list_div = "<div data-category=\"" + XKit.extensions.postarchive.archived_posts[i].category + "\" data-post-id=\"" + XKit.extensions.postarchive.archived_posts[i].post_id + "\" class=\"xkit-postarchive-post " + additional_classes + "\">" + XKit.extensions.postarchive.archived_posts[i].title + "</div>";
					m_post_list_html = m_post_list_html + m_x_list_div;

				}

			}

		}

		return m_post_list_html;

	},

	show_items_in_category: function(category_id, show) {

		$(".xkit-postarchive-post, .xkit-postarchive-no-posts-index").each(function() {

			if ($(this).attr('data-category') === category_id) {

				if (show !== true) {

					$(this).addClass("xkit-postarchive-hidden-category-item");

				} else {

					$(this).removeClass("xkit-postarchive-hidden-category-item");

				}

			}

		});

		XKit.extensions.postarchive.save_category_collapse(category_id, show);

	},

	save_category_collapse: function(category_id, show) {

		if (category_id === "") {
			// we have a storage bug on chrome.
			if (show === true) {
				XKit.storage.set("postarchive","collapse_uncategorized", "false");
			} else {
				XKit.storage.set("postarchive","collapse_uncategorized", "true");
			}
			return;
		}

		XKit.extensions.postarchive.load_posts();

		for (var i=0;i<XKit.extensions.postarchive.categories.length;i++) {

			if (category_id === XKit.extensions.postarchive.categories[i].id) {

				XKit.extensions.postarchive.categories[i].collapsed = !show;
				XKit.extensions.postarchive.save_posts();

			}

		}

	},

	view: function(open_this_id) {

		XKit.extensions.postarchive.load_posts();

		if ($("#xkit-postarchive-background").length > 0) {

			$("#xkit-postarchive-background").remove();
			$("#xkit-postarchive-container").remove();

		}

		if (XKit.extensions.postarchive.archived_posts.length === 0) {

			XKit.window.show("No posts yet.","<b>You have no archived posts yet.</b><br/>If you've archived them on another computer, you might need to sync them using XCloud.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");

		}

		var m_post_list_html = "";

		m_post_list_html = m_post_list_html + "<div data-category=\"\" class=\"xkit-postarchive-cat-separator-uncategorized xkit-postarchive-cat-separator xkit-pac-opened\"><div class=\"xkit-postarchive-cat-separator-title\">Uncategorized</div></div>";
		m_post_list_html = m_post_list_html + XKit.extensions.postarchive.render_posts_uncategorized();


		if (XKit.extensions.postarchive.categories.length > 0) {

			for (var i=0;i<XKit.extensions.postarchive.categories.length;i++) {

				var m_collapse_class = "xkit-pac-opened";
				var m_collapse_class_post = "";

				if (XKit.extensions.postarchive.categories[i].collapsed === true) { m_collapse_class = ""; m_collapse_class_post = "xkit-postarchive-hidden-category-item"; }

				m_post_list_html = m_post_list_html + "<div data-category=\"" + XKit.extensions.postarchive.categories[i].id + "\" class=\"xkit-postarchive-cat-separator " + m_collapse_class + "\"><div class=\"xkit-postarchive-cat-separator-title\">" + XKit.extensions.postarchive.categories[i].title + "</div></div>";

				var cat_index = XKit.extensions.postarchive.render_posts_on_category(XKit.extensions.postarchive.categories[i].id, m_collapse_class_post);

				if (cat_index !== "") {

					m_post_list_html = m_post_list_html + cat_index;

				} else {

					m_post_list_html = m_post_list_html + "<div data-category=\"" + XKit.extensions.postarchive.categories[i].id + "\" class=\"xkit-postarchive-no-posts-index " + m_collapse_class_post + "\">No posts</div>";

				}

			}

		}

		var m_html = "<div id=\"xkit-postarchive-background\">&nbsp;</div>" +
				"<div id=\"xkit-postarchive-container\">" +
					"<div id=\"xkit-postarchive-sidebar\" class=\"nano\">" +
						"<div id=\"xkit-postarchive-sidebar-content\" class=\"content\">" +
							m_post_list_html +
						"</div>" +
					"</div>" +
					"<input type=\"text\" placeholder=\"Search archived post titles..\" id=\"xkit-postarchive-search\">" +
					"<div id=\"xkit-postarchive-export\" class=\"xkit-button\">Export</div>" +
					"<div id=\"xkit-postarchive-import\" class=\"xkit-button\">Import</div>" +
					"<div id=\"xkit-postarchive-content\" class=\"xkit-postarchive-no-post-selected\">" +
						"Select a post from the right to get started." +
					"</div>" +
					"<div id=\"xkit-postarchive-remove-this\" class=\"xkit-button hidden\">remove</div>" +
					"<div id=\"xkit-postarchive-recategorize-this\" class=\"xkit-button hidden\">recategorize</div>" +
					"<div id=\"xkit-postarchive-rename-this\" class=\"xkit-button hidden\">rename</div>" +
				"</div>";

		$("body").append(m_html);

		if ($("#xkit-postarchive-sidebar .xkit-postarchive-post").length > 8) {

			$("#xkit-postarchive-sidebar .xkit-postarchive-post:last-child").css("border-bottom","0px");

		}

		$(".xkit-postarchive-cat-separator").click(function() {

			$(this).toggleClass("xkit-pac-opened");

			if ($(this).hasClass("xkit-pac-opened")) {

				XKit.extensions.postarchive.show_items_in_category($(this).attr('data-category'), true);

			} else {

				XKit.extensions.postarchive.show_items_in_category($(this).attr('data-category'), false);

			}

		});

		$("#xkit-postarchive-sidebar").nanoScroller();
		$("#xkit-postarchive-sidebar").nanoScroller({ scroll: 'top' });

		$("#xkit-postarchive-sidebar  .xkit-postarchive-post").click(function() {

			$("#xkit-postarchive-sidebar  .xkit-postarchive-post").removeClass("selected");

			$(this).addClass("selected");

			XKit.extensions.postarchive.render_post($(this).attr('data-post-id'));

		});

		$("#xkit-postarchive-background").click(function() {

			$("#xkit-postarchive-background, #xkit-postarchive-container").fadeOut('fast', function() { $(this).remove(); });

		});

		if (typeof open_this_id !== "undefined") {

			$(".xkit-postarchive-post").each(function() {

				if ($(this).attr('data-post-id') === open_this_id) {

					$(this).trigger("click");

				}

			});

		}

		$("#xkit-postarchive-export").on("click", function() {

			var m_data = {};

			m_data.posts = XKit.storage.get("postarchive", "archived_posts","");
			m_data.categories = XKit.storage.get("postarchive", "categories","");

			var blob = new Blob([JSON.stringify(m_data)], {type: 'text/plain'});

			XKit.window.show("Export Archive","Click OK to download a file with the contents of your Archive.","info","<a id='xkit-postarchive-download-export'><div class=\"xkit-button default\" id=\"xkit-postarchive-export-confirm\">OK</div></a>");
			var a = $('#xkit-postarchive-download-export')[0];
			a.href = window.URL.createObjectURL(blob);
			a.download = 'PostArchive export - ' + Date() + '.txt';

			$("#xkit-postarchive-export-confirm").click(function() {

				XKit.window.close();
				XKit.extensions.postarchive.view();

			});

		});

		$("#xkit-postarchive-import").on("click", function() { //Import Function

			XKit.window.show("Import","<b>You can import settings from XKit.</b><br/>Click XKit's Export button and select the file here (or drag and drop it).<br/><br/>If you need to import your archive from old XKit, click <a href='http://new-xkit-extension.tumblr.com/postarchive-migration'>here for the PostArchive migration guide.</a><br/><br/><input type='file' accept='text/plain' id=\"xkit-postarchive-import-file\" />","question","<div class=\"xkit-button default\" id=\"xkit-postarchive-add-words\">Import!</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

			$("#xkit-postarchive-replace-on-import").click(function() {
				$(this).toggleClass("selected");
			});

			$("#xkit-postarchive-add-words").click(function() {

				var file = $("#xkit-postarchive-import-file")[0].files[0];
				// TODO: check if import will push XKit over browser storage limit

				var f_reader = new FileReader();

				var progress_bar = XKit.progress.add('postarchive-import-progress');

				$('.xkit-window-msg').append(progress_bar);
				$('.xkit-window-title').text('Importing...');

				f_reader.onload = function(event) {
					var m_data = event.target.result;

					var m_obj = null;
					try {
						m_obj = JSON.parse(m_data);
					} catch (e) {
						XKit.extensions.postarchive.show_error("Invalid/Corrupt JSON object found.\nImport can not continue.");
						return;
					}

					m_posts = JSON.parse(m_obj.posts);
					m_categories = JSON.parse(m_obj.categories);

					XKit.extensions.postarchive.load_posts();

					Array.prototype.push.apply(XKit.extensions.postarchive.categories, m_categories);
					Array.prototype.push.apply(XKit.extensions.postarchive.archived_posts, m_posts);
					XKit.extensions.postarchive.save_posts();

					XKit.extensions.postarchive.update_sidebar();

					XKit.window.show("Done!", "Your posts should exist!", "info","<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");
					XKit.extensions.postarchive.view();
					return;

				};

				f_reader.onprogress = function(event) {
					XKit.progress.value('postarchive-import-progress', 100*event.loaded/file.size);
				};

				f_reader.readAsText(file);

			});

		});

		$("#xkit-postarchive-search").keyup(function() {

			var m_value = $(this).val().toLowerCase();
			m_value = $.trim(m_value);

			if (m_value === "") {

				$(".xkit-postarchive-post").removeClass("xkit-this-post-is-pretty-hidden");
				$("#xkit-postarchive-not-found").remove();
				$(".xkit-postarchive-cat-separator").removeClass("xkit-this-post-is-pretty-hidden");
				$(".xkit-postarchive-no-posts-index").removeClass("xkit-this-post-is-pretty-hidden");

			} else {

				$(".xkit-postarchive-cat-separator").addClass("xkit-this-post-is-pretty-hidden");
				$(".xkit-postarchive-no-posts-index").addClass("xkit-this-post-is-pretty-hidden");

			}

			var found_count = 0;

			$(".xkit-postarchive-post").each(function() {

				if ($(this).html().toLowerCase().indexOf(m_value) !== -1) {

					found_count++;
					$(this).removeClass("xkit-this-post-is-pretty-hidden");

				} else {

					$(this).addClass("xkit-this-post-is-pretty-hidden");

				}

			});

			if (found_count === 0){

				if ($("#xkit-postarchive-not-found").length === 0) {
					$("#xkit-postarchive-sidebar-content").append("<div id=\"xkit-postarchive-not-found\">Not found.</div>");
				}

			}

			$("#xkit-postarchive-sidebar").nanoScroller();
			$("#xkit-postarchive-sidebar").nanoScroller({ scroll: 'top' });

		});

		var collapse_uncat = XKit.storage.get("postarchive","collapse_uncategorized", "false");
		if (collapse_uncat === "true" || collapse_uncat === true) {

			// dirty coding.
			$(".xkit-postarchive-cat-separator-uncategorized").trigger('click');

		}

	},

	get_photo: function(data, index, width) {

		for (var i=0;i<data.photos[index].alt_sizes.length;i++) {
			if (parseInt(data.photos[index].alt_sizes[i].width) === parseInt(width)) {
				return data.photos[index].alt_sizes[i].url;
			}
		}

		return data.photos[index].alt_sizes[0].url;

	},

	get_photo_height: function(data, index, width) {

		for (var i=0;i<data.photos[index].alt_sizes.length;i++) {
			if (parseInt(data.photos[index].alt_sizes[i].width) === parseInt(width)) {
				return data.photos[index].alt_sizes[i].height;
			}
		}

		return data.photos[index].alt_sizes[0].height;

	},

	parse_item: function(data, username) {

		var m_html = "<li class=\"post_container\">";
		var post_class = "";
		var additional_classes_for_post = "";

		var post_tags = "";
		var post_contents = "";

		if (data.type === "text") {

			post_class = "is_regular";

			if (data.title !== "" && data.title !== null) {
				post_contents = post_contents + "<div class=\"post_title\">" + data.title + "</div>";
			}

			if (data.body !== "" && data.body !== null) {
				post_contents = post_contents + "<div class=\"post_body\">" + data.body + "</div>";
			}

		}

		if (data.type === "quote") {

			post_class = "is_quote";

			if (data.text !== "" && data.text !== null) {
				post_contents = post_contents + '<div class="post_title medium"><span class="quote">"' + data.text + '"</span></div>';
			}

			if (data.source !== "" && data.source !== null) {
				post_contents = post_contents + '<div class="post_body"><table class="quote_source_table"><tbody><tr><td valign="top" class="quote_source_mdash">&nbsp;</td><td valign="top" class="quote_source">- ' + data.source + '</td></tr></tbody></table></div>';
			}

		}

		if (data.type === "link") {

			post_class = "is_link";

			if (data.link_image !== "" && data.link_image !== null && typeof data.link_image !== "undefined") {

				post_contents = post_contents + '<div class="post_media"><div class="link_button clickable"><div class="link_thumbnail_container"><a href="' + data.url + '" target="_blank" class="link_thumbnail_click"><img class="link_thumbnail" src="' + data.link_image + '" alt=""></a></div><div class="link_text_container"><div class="link_text_outer"><div class="link_text"><a href="' + data.url + '" target="_blank" class="link_title">' + data.title + '</a><a href="' + data.url + '" target="_blank" class="link_source">' + data.url + '</a></div></div></div></div></div>';

			} else {

				var link_title = data.url;

				if (data.title !== "" && data.title !== null && typeof data.title !== "undefined") {

					link_title = data.title;

				}

				post_contents = post_contents + '<div class="post_media"><div class="link_button clickable"><div class="link_text_container"><div class="link_text_outer"><div class="link_text"><a href="' + data.url + '" target="_blank" class="link_title">' + link_title + '</a></div></div></div></div></div>';

			}

			if (data.description !== "" && data.description !== null) {

				post_contents = post_contents + '<div class="post_body">' + data.description + '</div>';

			}

		}

		if (data.type === "answer") {

			post_class = "is_note";

			post_contents = post_contents + '<div class="post_body"><div class="note_item"><div class="text"><p class="asker"><span class="name">' + data.asking_name + '</span><span>&nbsp;asked:</span></p><p>' + data.question + '</p></div><div class="nipple"></div></div><div class="avatar"><img src="http://assets.tumblr.com/images/anonymous_avatar_96.gif" alt="" width="40" height="40"></div><div class="answer post_info">' + data.answer + '</div></div>';

		}

		if (data.type === "video") {

			post_class = "is_video";

			var m_post_inner_html = "";

			var last_width = 0;
			for (var obj in data.player) {
				if (data.player[obj].width > last_width && data.player[obj].width <= 540) {
					m_post_inner_html = data.player[obj].embed_code;
					last_width = data.player[obj].width;
				}
			}
			if (m_post_inner_html.indexOf("<video") !== -1) {
				m_post_inner_html = m_post_inner_html.slice(0,8) + ' controls ' + m_post_inner_html.slice(8);
			} else {
				m_post_inner_html = m_post_inner_html.replace('width="500"','width="540"');
			}

			post_contents = post_contents + "<div class=\"post_media\">" + m_post_inner_html + "</div>";

			if (data.caption !== "" && data.caption !== null) {
				post_contents = post_contents + "<div class=\"post_body\">" + data.caption + "</div>";
			}

		}

		if (data.type === "audio") {

			post_class = "is_audio";

			post_contents = post_contents + "<div class=\"post_media\">" + data.embed + "</div>";

			if (data.caption !== "" && data.caption !== null) {
				post_contents = post_contents + "<div class=\"post_body\">" + data.caption + "</div>";
			}

		}

		if (data.type === "photo") {

			post_class = "is_photo";

			if (data.photos.length === 1) { post_class = "is_photo"; } else { post_class = "is_photoset"; }

			var photo_post_inner_html = "";

			if (data.photos.length === 1) {

				photo_post_inner_html = '<img class="image" width="540" alt="" src="' + XKit.extensions.postarchive.get_photo(data, 0, "540") + '" data-thumbnail="' + XKit.extensions.postarchive.get_photo(data, 0, "100") + '">';

			} else {

				var rows = [];

				for (var i=0;i<data.photoset_layout.length;i++) {
					rows.push(data.photoset_layout[i]);
				}

				photo_post_inner_html = "<div class=\"photoset\" style=\"margin-bottom: 11px;\">";

				var current_photo = 0;

				rows.forEach(function(row) {
					var shortest = 0;
					var m_width = 540 / row;
					if (row > 1) {
						m_width -= row;
					}

					// Calculate the shortest!
					var m_temp_photo = current_photo;

					if (row >= 2) {

						for (var m=1;m<row;m++){

							var scaled_height = (m_width * XKit.extensions.postarchive.get_photo_height(data, m_temp_photo, "500")) / 500;

							if (scaled_height <= shortest || shortest === 0) {
								shortest = scaled_height;
							}

							m_temp_photo++;

						}

					} else {

						shortest = XKit.extensions.postarchive.get_photo_height(data, m_temp_photo, "500");

					}

					var in_row_html = "";

					for (var x=0;x<row;x++) {

						var m_height = (m_width * XKit.extensions.postarchive.get_photo_height(data, current_photo, "500")) / 500;
						var margin_top = 0;

						if (m_height > shortest) {
							margin_top = (m_height - shortest) / 2;
						}

						in_row_html = in_row_html + '<a href="' + XKit.extensions.postarchive.get_photo(data, current_photo, "500") + '" class="photoset_photo xkit-postarchive-photoset-photo" onclick="return false;" id="photoset_link_' + data.id + '_' + current_photo + '">';
						in_row_html = in_row_html + '<img style="margin-top: -' + margin_top + 'px;" class="photoset_photo" width="' + m_width + '" alt="" src="' + XKit.extensions.postarchive.get_photo(data, current_photo, "500") + '" data-thumbnail="' + XKit.extensions.postarchive.get_photo(data, current_photo, "100") + '">';
						in_row_html = in_row_html + '</a>';

						current_photo++;

					}

					photo_post_inner_html = photo_post_inner_html + "<div class=\"photoset_row photoset_row_" + row + "\" style=\"height: " + shortest + "px;\">" + in_row_html + "</div>";

				});

				photo_post_inner_html = photo_post_inner_html + "</div>";

			}

			post_contents = post_contents + "<div class=\"post_media\">" + photo_post_inner_html + "</div>";

			if (data.caption !== "" && data.caption !== null) {
				post_contents = post_contents + "<div class=\"post_body\">" + data.caption + "</div>";
			}

		}

		if (typeof data.tags !== "undefined") {

			post_tags = "<div class=\"post_tags\"><div class=\"post_tags_inner\">";

			data.tags.forEach(function(tag) {
				var fixed_tag_url = XKit.tools.replace_all(tag, + " ", "-");
				post_tags = post_tags + "<a class=\"post_tag\" href=\"http://tumblr.com/tagged/" + fixed_tag_url + "\">#" + tag + "</a>";
			});

			post_tags = post_tags + "</div></div>";

		}

		var source_div = "";
		var reblog_div = "";

		if (data.source_url !== "" && typeof data.source_url !== "undefined") {

			source_div = '<div class="post_source"><a class="post_source_link" target="_blank" href="' + data.source_url + '" title="' + data.source_title + '">' + data.source_title + '</a><span class="post_source_name_prefix">Source: </span></div>';

		}

		if (data.reblogged_from_id !== "" && typeof data.reblogged_from_id !== "undefined") {

			reblog_div = '<span class="reblog_source"><span class="reblog_icon" title="' + username + ' reblogged ' + data.reblogged_from_name + '">reblogged</span><a target="_BLANK" title="' + data.reblogged_from_name + '" href="' + data.reblogged_from_url + '" style="">' + data.reblogged_from_name + '</a></span>';

		}

		m_html = m_html + "<div class=\"xkit-dont-run-extensions post post_full " + post_class + " same_user_as_last with_permalink no_source xkit_view_on_dash_post\" id=\"post_" + data.id + "\"  data-post-id='" + data.id + "' data-root_id='" + data.id + "' data-tumblelog-name='" + username + "' data-reblog-key='" + data.reblog_key + "' data-type='" + data.type + "'>" +
					"<div class=\"post_wrapper\">" +
						"<div class=\"post_header\">" +
							"<div class=\"post_info\">" +
								"<img src=\"http://api.tumblr.com/v2/blog/" + data.blog_name + ".tumblr.com/avatar/48\" class=\"xkit-post-archive-avatar\"><span style=\"font-weight:normal; margin-right: 8px;\">Archived from:</span><a target=\"_BLANK\" href=\"" + data.post_url + "\">" + data.blog_name + "</a>" +
							"</div>" +
							source_div +
						"</div>" +
						"<div class=\"post_content clearfix\">" +
							"<div class=\"post_content_inner clearfix\">" +
								"<div class=\"post_container\">" +
									post_contents +
								"</div>" +
							"</div>" +
						"</div>" +
					post_tags +
				"</div>" +
			"</div>" +
		"</li>";

		return m_html;

	},

	current_post_id: "",

	render_post: function(post_id) {

		var m_post = XKit.extensions.postarchive.get_from_archive(post_id);
		if (m_post === false) { alert("Can not fetch post (error PAC-302)"); return; }

		var post_obj = "";
		if (m_post.post.substring(0, 11) === "XKIT-BTOA!!") {
			//alert("bfore: " + m_post.post);
			var tmp_dt = m_post.post.substring(11, m_post.post.length);
			//alert("after: " + m_post.post);
			post_obj = JSON.parse(decodeURIComponent(escape(window.atob(tmp_dt))));
		} else {
			try {
				post_obj = JSON.parse(m_post.post);
			} catch(e) {
				post_obj = JSON.parse(decodeURIComponent(escape(window.atob(m_post.post))));
			}
		}

		XKit.extensions.postarchive.current_post_id = post_id;

		$("#xkit-postarchive-content").removeClass("xkit-postarchive-no-post-selected").html(XKit.extensions.postarchive.parse_item(post_obj, "xenix"));

		$("#xkit-postarchive-remove-this").removeClass("hidden");
		$("#xkit-postarchive-recategorize-this").removeClass("hidden");
		$("#xkit-postarchive-rename-this").removeClass("hidden");

		$("#xkit-postarchive-remove-this").off("click");
		$("#xkit-postarchive-remove-this").on("click", function() {

			XKit.window.show("Remove","You sure you want to remove this?","warning","<div class=\"xkit-button default\" id=\"xkit-postarchive-remove-item-confirm\">Remove</div><div id=\"xkit-close-message\" class=\"xkit-button\">Cancel</div>");

			$("#xkit-postarchive-remove-item-confirm").click(function() {

				XKit.extensions.postarchive.remove_from_archive(post_id);
				XKit.window.close();
				XKit.extensions.postarchive.view();

			});

		});

		$("#xkit-postarchive-rename-this").off("click");
		$("#xkit-postarchive-rename-this").on("click", function() {

			XKit.window.show("Rename This Post", "<b>Title:</b><input type=\"text\" value=\"" + m_post.title + "\"maxlength=\"150\" placeholder=\"Enter a title (example: 'hotline phone list')\" class=\"xkit-textbox\" id=\"xkit-postarchive-title\">", "question", "<div class=\"xkit-button default\" id=\"xkit-postarchive-save-new-name\">Save</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

			$("#xkit-postarchive-save-new-name").click(function() {

				var m_title = $("#xkit-postarchive-title").val();

				if ($.trim(m_title) === "") { XKit.window.close(); }

				XKit.extensions.postarchive.rename_archived_post(post_id, m_title);

				$(".xkit-postarchive-post").each(function() {

					if ($(this).attr('data-post-id') === post_id) {

						$(this).html(m_title);

					}

				});

				XKit.window.close();

			});

		});

		$("#xkit-postarchive-recategorize-this").off("click");
		$("#xkit-postarchive-recategorize-this").on("click", function() {

			if (XKit.extensions.postarchive.categories.length === 0) {

				XKit.window.show("No categories","You have no categories. You can add some from the Post Archiver control panel.","warning", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
				return;

			}

			var m_categories = "";

			if (XKit.extensions.postarchive.categories.length === 0) {

				m_categories = "You have no categories. You can add some from XKit Control Panel > Post Archiver > Add Category.";

			} else {

				for (var i=0;i<XKit.extensions.postarchive.categories.length;i++) {

					m_categories = m_categories + "<option value=\"" + XKit.extensions.postarchive.categories[i].id + "\">" + XKit.extensions.postarchive.categories[i].title + "</div>";

				}

				m_categories = "<option value=\"\">Uncategorized</option>" + m_categories;
				m_categories = "<select id=\"xkit-postarchive-category\">" + m_categories + "</select>";

			}

			XKit.window.show("Recategorize This Post", "<b>Category:</b>" + m_categories, "question", "<div class=\"xkit-button default\" id=\"xkit-postarchive-save-new-category\">Save</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

			$("#xkit-postarchive-save-new-category").click(function() {

				XKit.extensions.postarchive.recategorize_archived_post(post_id, $("#xkit-postarchive-category").val());

				// to-do refresh view.
				XKit.extensions.postarchive.view(post_id);

				XKit.window.close();

			});

		});

		$("#xkit-postarchive-content").find(".post").css("display","block").css("visibility","visible");

		XKit.tools.add_function(function() {
			Tumblr.Events.trigger("posts:load");
		}, true, "");

		XKit.post_listener.check(true);

	},

	load_posts: function() {

		var m_storage = XKit.storage.get("postarchive", "archived_posts","");

		if (m_storage !== "") {
			try {
				XKit.extensions.postarchive.archived_posts = JSON.parse(m_storage);
				console.log(" --- Storage loaded successfully.. (" + XKit.extensions.postarchive.archived_posts.length + " items)");
			} catch(e) {
				XKit.extensions.postarchive.archived_posts = [];
				XKit.notifications.add("Post Archiver storage error: POSTA-101<br/>Please refresh the page and/or file a bug report.", "error");
				console.log(" --- Storage Error!! " + e.message);
			}
		} else {
			console.log(" --- Storage is empty");
			XKit.extensions.postarchive.archived_posts = [];
		}

		m_storage = XKit.storage.get("postarchive", "categories","");

		if (m_storage !== "") {
			try {
				XKit.extensions.postarchive.categories = JSON.parse(m_storage);
			} catch(e) {
				XKit.extensions.postarchive.categories = [];
			}
		} else {
			XKit.extensions.postarchive.categories = [];
		}

	},

	save_posts: function() {

		try {
			XKit.storage.set("postarchive", "archived_posts", JSON.stringify(XKit.extensions.postarchive.archived_posts));
			XKit.storage.set("postarchive", "categories", JSON.stringify(XKit.extensions.postarchive.categories));
		} catch(e) {
			XKit.window.show("Unable to save data","Post Archiver could not save data<br/><br/>Error:<br/>" + e.message, "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
		}
	},

	init: function() {

		$(document).on("click", ".xkit-postarchive", function(event) {
			var post_id = $(this).attr('data-post-id');
			XKit.extensions.postarchive.archive(post_id, this);
		});

	},

	is_post_in_archive: function(post_id) {

		for (var i=0;i<XKit.extensions.postarchive.archived_posts.length;i++) {
			if (XKit.extensions.postarchive.archived_posts[i].post_id == post_id) {
				return true;
			}
		}

		return false;

	},

	get_from_archive: function(post_id) {

		for (var i=0;i<XKit.extensions.postarchive.archived_posts.length;i++) {
			if (XKit.extensions.postarchive.archived_posts[i].post_id == post_id) {
				return XKit.extensions.postarchive.archived_posts[i];
			}
		}

		return false;

	},

	remove_from_archive: function(post_id) {

		for (var i=0;i<XKit.extensions.postarchive.archived_posts.length;i++) {
			if (XKit.extensions.postarchive.archived_posts[i].post_id == post_id) {
				XKit.extensions.postarchive.archived_posts.splice(i, 1);
				XKit.extensions.postarchive.save_posts();
			}
		}

		return false;

	},

	rename_archived_post: function(post_id, title) {

		for (var i=0;i<XKit.extensions.postarchive.archived_posts.length;i++) {
			if (XKit.extensions.postarchive.archived_posts[i].post_id == post_id) {
				XKit.extensions.postarchive.archived_posts[i].title = title;
				XKit.extensions.postarchive.save_posts();
			}
		}

		return false;

	},

	recategorize_archived_post: function(post_id, category) {

		for (var i=0;i<XKit.extensions.postarchive.archived_posts.length;i++) {
			if (XKit.extensions.postarchive.archived_posts[i].post_id == post_id) {
				XKit.extensions.postarchive.archived_posts[i].category = category;
				XKit.extensions.postarchive.save_posts();
			}
		}

		return false;

	},

	update_sidebar: function() {

		$("#postarchive_view_count").html(XKit.extensions.postarchive.archived_posts.length);

	},

	archive: function(post_id, obj, in_blog_mode) {

		XKit.extensions.postarchive.load_posts();

		if (XKit.interface.where().drafts === true) { XKit.window.show("Oops","Unfortunately, Post Archiver does not yet support archiving from the drafts, but I'm working on it. Thank you for your patience.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>"); return; }

		if (XKit.extensions.postarchive.is_post_in_archive(post_id) !== false) {

			XKit.window.show("Already in archive.","Would you like to remove this post from the archive?", "question", "<div class=\"xkit-button default\" id=\"xkit-postarchive-remove-from-archive\">Yes, remove from archive</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

			$("#xkit-postarchive-remove-from-archive").click(function() {

				XKit.window.close();

				XKit.extensions.postarchive.remove_from_archive(post_id);

				if (!in_blog_mode) {

					XKit.interface.completed_control_button(obj, false);

					XKit.notifications.add("Post removed from Archive.", "ok");

					XKit.extensions.postarchive.update_sidebar();

				} else {

					$(obj).removeClass("xkit-post-archive-inblog-button-done");
					setTimeout(function() { XKit.iframe.restore();	}, 300);

				}

			});

			return;

		}

		var m_categories = "";

		if (XKit.extensions.postarchive.categories.length === 0) {

			m_categories = "You have no categories. You can add some from XKit Control Panel > Post Archiver > Add Category.";

		} else {

			for (var i=0;i<XKit.extensions.postarchive.categories.length;i++) {

				m_categories = m_categories + "<option value=\"" + XKit.extensions.postarchive.categories[i].id + "\">" + XKit.extensions.postarchive.categories[i].title + "</div>";

			}

			m_categories = "<option value=\"\">Uncategorized</option>" + m_categories;
			m_categories = "<select id=\"xkit-postarchive-category\">" + m_categories + "</select>";

		}

		var m_title = "";
		if ($("#post_" + post_id).length > 0) {

			var dpostobj = $("#post_" + post_id);

			if ($(dpostobj).find(".post-title").length > 0) {

				m_title = $(dpostobj).find(".post-title").text();

			} else if ($(dpostobj).find(".post_title").length > 0) {

				m_title = $(dpostobj).find(".post_title").text();

			} else if ($(dpostobj).find(".title").length > 0) {

				m_title = $(dpostobj).find(".title").text();

			} else if ($(dpostobj).find(".reblog-title").length > 0) {

				m_title = $(dpostobj).find(".reblog-title").text();

			} else if ($(dpostobj).find(".post_body").length > 0) {

				m_title = $(dpostobj).find(".post_body").text();

			} else if ($(dpostobj).find(".track_name").length > 0) {

				m_title = $(dpostobj).find(".track_name").text();

			} else if ($(dpostobj).find(".chat_line").length > 0) {

				m_title = $(dpostobj).find(".chat_line:first").text();

			} else if ($(dpostobj).find('.reblog-list').length > 0) {

				m_title = $(dpostobj).find('.reblog-list-item:first .reblog-content').text();

			}

		}

		if (m_title.length > 30) {
			m_title = m_title.substring(0,29) + "...";
		}

		XKit.window.show("Archive This Post", "<b>Title:</b><input type=\"text\" value=\"" + m_title + "\" maxlength=\"150\" placeholder=\"Enter a title (example: 'hotline phone list')\" class=\"xkit-textbox\" id=\"xkit-postarchive-title\"><b>Category:</b><br/>" + m_categories, "question", "<div class=\"xkit-button default\" id=\"xkit-postarchive-save\">Save</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

		$("#xkit-postarchive-save").click(function() {

			var m_title = $("#xkit-postarchive-title").val();

			if ($(this).hasClass("disabled")) { return; }

			if ($.trim(m_title) === "") {
				alert("Please enter a title for this post.");
				return;
			}

			var m_category = "";

			if ($("#xkit-postarchive-category").length > 0) {

				m_category = $("#xkit-postarchive-category").val();

			}

			XKit.extensions.postarchive.save_using_api(post_id, obj, m_title, m_category, in_blog_mode);

		});

	},

	save_using_api: function(post_id, obj, title, m_category, in_blog_mode) {

		$("#xkit-postarchive-save").addClass("disabled");

		var m_post = XKit.interface.find_post(post_id);
		var blog_url = m_post.owner;

		if (!blog_url) {
			blog_url = window.location.href.split('%2F')[2].split('.')[0];
		}

		var api_url = "http://api.tumblr.com/v2/blog/" + blog_url + ".tumblr.com/posts/?api_key=" + XKit.extensions.postarchive.apiKey + "&id=" + post_id;

		GM_xmlhttpRequest({
			method: "GET",
			url: api_url,
			json: true,
			onerror: function(response) {
				XKit.extensions.postarchive.show_error("<b>Unable to get the blog information.</b><br/>Please try again later.<br/><br/>Error Code: POA-230 <br/><br/>"+blog_url);
				return;
			},
			onload: function(response) {

				try {

					data = JSON.parse(response.responseText).response;

					var m_object = {};

					m_object.title = title;

					if (XKit.browser().firefox === true) {
						// Firefox is a fucking bitch.
						m_object.post = "XKIT-BTOA!!" + window.btoa(unescape(encodeURIComponent(JSON.stringify(data.posts[0]))));
						// alert("tosave: " + m_object.post);
					} else {
						m_object.post = JSON.stringify(data.posts[0]);
					}

					m_object.post_id = post_id;
					m_object.date = new Date().getTime();
					m_object.category = m_category;

					console.log("Fetched contents, trying to save...");

					XKit.extensions.postarchive.load_posts();

					setTimeout(function() {

						XKit.extensions.postarchive.archived_posts.push(m_object);
						console.log(XKit.extensions.postarchive.archived_posts);
						XKit.extensions.postarchive.save_posts();

						if (!in_blog_mode) {

							XKit.interface.completed_control_button(obj, true);
							XKit.notifications.add("Post added to Archive.", "ok");
							XKit.extensions.postarchive.update_sidebar();
							XKit.window.close();


						} else {

							$(obj).addClass("xkit-post-archive-inblog-button-done");
							XKit.window.close();
							setTimeout(function() { XKit.iframe.restore();	}, 300);

						}

					}, 1);

				} catch(e) {
					XKit.extensions.postarchive.show_error("<b>Unable to read JSON received from API calls.</b><br/>Please try again later.<br/><br/>Error Code: POS-535<br>" + e.message);
					return;
				}

			}
		});

	},

	do: function() {

		var posts = XKit.interface.get_posts("xkit-postarchive-done");

		$(posts).each(function() {

			$(this).addClass("xkit-postarchive-done");

			var m_post = XKit.interface.post($(this));

			XKit.interface.add_control_button(this, "xkit-postarchive", "data-xkit-postarchive-tumblelog-key=\"" + m_post.tumblelog_key + "\" data-xkit-postarchive-tumblelog-name=\"" + m_post.owner + "\"");

			if (XKit.extensions.postarchive.is_post_in_archive(m_post.id)) {

				XKit.interface.completed_control_button($(this).find(".xkit-interface-control-button.xkit-postarchive"), true);

			}

		});

	},

	show_error: function(message) {

		XKit.window.show("Post Archiver encountered an error", message, "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");

	},

	cpanel: function(m_div) {

		XKit.extensions.postarchive.load_posts();

		if ($("#xkit-postarchive-custom-panel").length > 0) {
			// Panel already exists, probably in refresh mode.
			// Remove it first.
			$("#xkit-postarchive-custom-panel").remove();
		}

		var cat_list = "";

		if (XKit.extensions.postarchive.categories.length === 0) {
			cat_list = "<div class=\"xkit-postarchive-no-categories\">You have no categories set.</div>";
		} else {

			for (var i=0;i<XKit.extensions.postarchive.categories.length;i++) {

				cat_list = cat_list + "<div class=\"xkit-postarchive-cp-item\" data-id=\"" + XKit.extensions.postarchive.categories[i].id + "\">" + XKit.extensions.postarchive.categories[i].title + "</div>";

			}
		}

		var m_html = "<div id=\"xkit-postarchive-custom-panel\">" +
					"<div id=\"xkit-postarchive-custom-panel-toolbar\">" +
						"<div id=\"xkit-postarchive-add-category\" class=\"xkit-button\">Add new category</div>" +
					"</div>" +
					cat_list +
				"</div>";

		$(m_div).html(m_html);

		$("#xkit-extensions-panel-right").nanoScroller();
		$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });

		$("#xkit-postarchive-add-category").click(function() {

			XKit.window.show("New category","<b>Category Name:</b><input type=\"text\" maxlength=\"40\" placeholder=\"eg: Recipes\" class=\"xkit-textbox\" id=\"xkit-postarchive-category-add-title\">","question","<div class=\"xkit-button default\" id=\"xkit-postarchive-create-category\">Create Category</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

			$("#xkit-postarchive-create-category").click(function() {

				var m_title = $("#xkit-postarchive-category-add-title").val();

				if ($.trim(m_title) === "") { XKit.window.close(); return; }

				if (XKit.extensions.postarchive.category_exists(m_title)) {
					alert("A category with this name already exists.");
					return;
				}

				var m_obj = {};
				m_obj.id = XKit.tools.random_string() + new Date().getTime();
				m_obj.title = m_title;

				XKit.extensions.postarchive.load_posts();

				XKit.extensions.postarchive.categories.push(m_obj);

				XKit.extensions.postarchive.save_posts();
				XKit.extensions.postarchive.cpanel(m_div);
				XKit.window.close();

			});

		});

		$(".xkit-postarchive-cp-item").click(function() {

			var m_cat_obj = XKit.extensions.postarchive.get_category($(this).attr('data-id'));

			if (m_cat_obj === false) { alert("Unknown error PAS-30"); return; }

			XKit.window.show("Edit category","<b>Category Name:</b><input type=\"text\" maxlength=\"40\" placeholder=\"eg: Recipes\" class=\"xkit-textbox\" id=\"xkit-postarchive-category-add-title\" value=\"" + m_cat_obj.title + "\"><br/>If you delete this category, items saved in this category will be marked \"Uncategorized.\"","question","<div class=\"xkit-button default\" id=\"xkit-postarchive-save-category\">Save Category</div><div class=\"xkit-button\" id=\"xkit-postarchive-delete-category\">Delete</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

			$("#xkit-postarchive-save-category").click(function() {

				XKit.extensions.postarchive.load_posts();

				for (var i=0;i<XKit.extensions.postarchive.categories.length;i++) {

					if (m_cat_obj.id === XKit.extensions.postarchive.categories[i].id) {

						XKit.extensions.postarchive.categories[i].title = $("#xkit-postarchive-category-add-title").val();
						XKit.extensions.postarchive.save_posts();

						XKit.window.close();

						XKit.extensions.postarchive.cpanel(m_div);

					}

				}

			});

			$("#xkit-postarchive-delete-category").click(function() {

				XKit.window.show("You sure?","Delete category <b>\"" + m_cat_obj.title + "\"</b>?","warning","<div class=\"xkit-button default\" id=\"xkit-postarchive-delete-category-confirm\">Confirm</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

				$("#xkit-postarchive-delete-category-confirm").click(function() {

					XKit.extensions.postarchive.load_posts();

					for (var i=0;i<XKit.extensions.postarchive.archived_posts.length;i++) {

						if (typeof XKit.extensions.postarchive.archived_posts[i].category !== "undefined") {

							if (XKit.extensions.postarchive.archived_posts[i].category === m_cat_obj.id) {

								XKit.extensions.postarchive.archived_posts[i].category = "";

							}

						}

					}

					for (var j=0;j<XKit.extensions.postarchive.categories.length;j++) {

						if (m_cat_obj.id === XKit.extensions.postarchive.categories[j].id) {

							XKit.extensions.postarchive.categories.splice(j, 1);

						}

					}

					XKit.extensions.postarchive.save_posts();
					XKit.extensions.postarchive.cpanel(m_div);
					XKit.window.close();

				});

			});

		});

	},

	get_category: function(id) {

		for (var i=0;i<XKit.extensions.postarchive.categories.length;i++) {

			if (id === XKit.extensions.postarchive.categories[i].id) {

				return XKit.extensions.postarchive.categories[i];

			}

		}

		return false;

	},

	category_exists: function(title) {

		title = title.toLowerCase();

		for (var i=0;i<XKit.extensions.postarchive.categories.length;i++) {

			if (title === XKit.extensions.postarchive.categories[i].title.toLowerCase()) {

				return true;

			}

		}

		return false;

	},

	destroy: function() {
		this.running = false;
		$("#postarchive_ul").remove();
		XKit.post_listener.remove("postarchive");


	}

};
