//* TITLE CleanFeed **//
//* VERSION 1.5.3 **//
//* DESCRIPTION Browse safely in public **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS This extension, when enabled, hides photo posts until you hover over them. Useful to browse Tumblr in a workspace or in public, and not worry about NSFW stuff appearing. You can also set it to hide avatars and not show non-text posts at all. To activate or disable it, click on the CleanFeed button on your sidebar. It will remember it's on/off setting. **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.cleanfeed = new Object({

	running: false,
	slow: true,
	added_css: false,
	added_full_block_css: false,

	img_blank: "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH/C1hNUCBEYXRhWE1QPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4wLWMwNjAgNjEuMTM0Nzc3LCAyMDEwLzAyLzEyLTE3OjMyOjAwICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ1M1IE1hY2ludG9zaCIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpEMUQxREZBOEJFNjgxMUUyQUNEN0YzQjYzNTI1Mzg4OCIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpEMUQxREZBOUJFNjgxMUUyQUNEN0YzQjYzNTI1Mzg4OCI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOkNERTg1MkZGQkU2NzExRTJBQ0Q3RjNCNjM1MjUzODg4IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOkNERTg1MzAwQkU2NzExRTJBQ0Q3RjNCNjM1MjUzODg4Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkEAQAAAAAsAAAAAAEAAQAAAgJEAQA7",
	img_lock: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAAMCAYAAAC0qUeeAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6Q0RFODUyRkRCRTY3MTFFMkFDRDdGM0I2MzUyNTM4ODgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6Q0RFODUyRkVCRTY3MTFFMkFDRDdGM0I2MzUyNTM4ODgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpDREU4NTJGQkJFNjcxMUUyQUNEN0YzQjYzNTI1Mzg4OCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpDREU4NTJGQ0JFNjcxMUUyQUNEN0YzQjYzNTI1Mzg4OCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PqIiqz8AAABKSURBVHjaYvj//z8DCANBPRD/x4Lr4WqgCvlxKARjfIr1oWL26IoZoRIMjIyMYAaQz8gABdjE3uNzAhJ+zwhlEAWGvWKSgg4gwAAexVkCfEIqQgAAAABJRU5ErkJggg==",
	img_avatar: "data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAAA/AAD/4QMraHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjAtYzA2MCA2MS4xMzQ3NzcsIDIwMTAvMDIvMTItMTc6MzI6MDAgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzUgTWFjaW50b3NoIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQxRDFERkFDQkU2ODExRTJBQ0Q3RjNCNjM1MjUzODg4IiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQxRDFERkFEQkU2ODExRTJBQ0Q3RjNCNjM1MjUzODg4Ij4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6RDFEMURGQUFCRTY4MTFFMkFDRDdGM0I2MzUyNTM4ODgiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6RDFEMURGQUJCRTY4MTFFMkFDRDdGM0I2MzUyNTM4ODgiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAOQWRvYmUAZMAAAAAB/9sAhAAGBAQEBAQGBAQGCAUFBQgKBwYG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",

	preferences: {
		sep1: {
			text: "Level of Blockage",
			type: "separator"
		},
		full_block: {
			text: "Use Full Block: Completely hide non-text things (audio, video, photos) on the dash",
			default: false,
			value: false
		},
		sep2: {
			text: "Avatars",
			type: "separator"
		},
		hide_avatars: {
			text: "Hide avatars when I turn on CleanFeed",
			default: false,
			value: false
		},
		sep3: {
			text: "Photosets",
			type: "separator"
		},
		show_all_photoset_photos: {
			text: "Show all photos at once when I hover over a photoset photo",
			default: false,
			value: false
		}
	},

	status: "false",
	lbl_on: "on",
	lbl_off: "off",

	run: function() {
		this.running = true;
		if ($("ol#posts").length > 0) {
			XKit.extensions.cleanfeed.init();
		}
	},

	init: function() {

		XKit.tools.init_css("cleanfeed");

		XKit.extensions.cleanfeed.status = XKit.storage.get("cleanfeed", "status", "false");
		XKit.extensions.cleanfeed.mode = XKit.storage.get("cleanfeed", "mode", "normal");

		var normal_text = "";
		if (XKit.extensions.cleanfeed.mode === "normal") {
			normal_text = "Normal";
		} else {
			normal_text = "Smart";
		}


		var xf_html = '<ul class="controls_section" id="xcleanfeed_ul">' +
			'<li class="section_header selected">CLEANFEED</li>' +
			'<li class="no_push" style="height: 36px;"><a href="#" id="xcleanfeed_button">' +
			'<div class="hide_overflow" style="color: rgba(255, 255, 255, 0.5) !important; font-weight: bold; padding-left: 10px; padding-top: 8px;">Filtering</div>' +
			'<div class="count" id="xcleanfeedstatus" style="padding-top: 8px;">' + XKit.extensions.cleanfeed.lbl_off + '</div>' +
			'<div id="xcleanfeedindicator">&nbsp;</div>' +
			'</a></li>' +
			'<div class="small_links by-xkit-cleanfeed">' +
				'<a id="xkit-cleanfeed-mode">Mode: ' + normal_text + '</a>' +
				'<a id="xkit-cleanfeed-mode-change" href="#">change/help</a>' +
			'</div>' +
			'</ul>';
		$("ul.controls_section:first").before(xf_html);

		XKit.extensions.cleanfeed.update_button();

		$("#xkit-cleanfeed-mode-change").click(function() {

			var opt_1 = "";
			var opt_2 = "";

			if (XKit.extensions.cleanfeed.mode === "normal") {
				opt_1 = "selected";
			} else {
				opt_2 = "selected";
			}

			var m_html = "<div data-mode=\"normal\" id=\"xkit-cleanfeed-mode-normal\" class=\"" + opt_1 + " xkit-checkbox xkit-cleanfeed-mode-toggle\" style=\"display: block; padding-left: 0px; margin-top: 10px; margin-bottom: 5px;\"><b>&nbsp;</b><span style=\"font-weight: bold; margin-right: 3px;\">Normal:</span>Hide everything from everyone.</div>" +
					"<div data-mode=\"smart\" id=\"xkit-cleanfeed-mode-smart\" class=\"" + opt_2 + " xkit-checkbox xkit-cleanfeed-mode-toggle\" style=\"display: block; padding-left: 0px;\"><b>&nbsp;</b><span style=\"font-weight: bold; margin-right: 3px;\">Smart:</span>Only hide stuff from NSFW/Adult blogs.</div>" +
					"<div id=\"xkit-cleanfeed-mode-warning\">" +
						"<b>Important:</b> Smart mode depends on the blog rating gathered from Tumblr servers. If you turn on Smart mode and a blog is not set as a NSFW/Adult blog, either by the blogger or Tumblr, then their posts will appear on your dashboard without any filtering. Turn on Normal mode for maximum protection against genitalia in public." +
					"</div>";

			XKit.window.show("Change Mode", "<b>Change the mode CleanFeed works on:</b>" + m_html, "question", "<div class=\"xkit-button default\" id=\"xkit-cleanfeed-accept-message\">OK</div><div id=\"xkit-close-message\" class=\"xkit-button\">Cancel</div>");

			$(".xkit-cleanfeed-mode-toggle").click(function() {

				$(".xkit-cleanfeed-mode-toggle").not(this).removeClass("selected");
				$(this).addClass("selected");

			});

			$("#xkit-cleanfeed-accept-message").click(function() {

				var mode = $(".xkit-cleanfeed-mode-toggle.selected").attr('data-mode');
				XKit.extensions.cleanfeed.change_mode(mode);

				XKit.window.close();

			});

			return false;
		});

		$("#xcleanfeed_button").click(function() {

			XKit.extensions.cleanfeed.toggle();

			return false;
		});

		if (XKit.extensions.cleanfeed.preferences.full_block.value) {
			XKit.extensions.cleanfeed.added_full_block_css = true;
			XKit.tools.add_css(" .post.is_video, .post.is_photo, .post.is_photoset, .post.is_audio { display: none !important; }", "cleanfeed_full_block");
		}

		XKit.post_listener.add("cleanfeed", XKit.extensions.cleanfeed.do);
		XKit.extensions.cleanfeed.do();

		$(document).keydown(XKit.extensions.cleanfeed.key_down);

	},

	change_mode: function(mode) {

		var mode_text = "Normal";
		if (mode === "smart") { mode_text = "Smart"; }

		XKit.storage.set("cleanfeed", "mode", mode);

		XKit.extensions.cleanfeed.mode = mode;

		$("#xkit-cleanfeed-mode").html("Mode: " + mode_text);

		if (XKit.extensions.cleanfeed.status == "true") {

			XKit.extensions.cleanfeed.update_images(false);
			setTimeout(function() { XKit.extensions.cleanfeed.update_images(true); }, 100);

		}

	},

	key_down: function(e) {

		if (e.altKey) {
			if (e.which === 88) {
				XKit.extensions.cleanfeed.toggle();
			}
		}

	},

	update_button: function() {

		if (XKit.extensions.cleanfeed.status == "true") {
			$("#xcleanfeedindicator").addClass("on");
			$("#xcleanfeedstatus").html(XKit.extensions.cleanfeed.lbl_on);
		} else {
			$("#xcleanfeedindicator").removeClass("on");
			$("#xcleanfeedstatus").html(XKit.extensions.cleanfeed.lbl_off);
		}

	},

	do: function() {

		if (XKit.extensions.cleanfeed.status == "true") {
			XKit.extensions.cleanfeed.update_images(true);
		} else {
			XKit.extensions.cleanfeed.update_images(false);
		}


	},

	m_enter: function(e) {

		if (XKit.extensions.cleanfeed.status !== "true") { return; }
		XKit.extensions.cleanfeed.show_thumbnail(e.target);

	},

	m_leave: function(e) {

		if (XKit.extensions.cleanfeed.status !== "true") { return; }
		XKit.extensions.cleanfeed.hide_thumbnail(e.target);

	},

	m_ps_enter: function(e, open_all_mode) {

		if (XKit.extensions.cleanfeed.status !== "true") { return; }

		if (open_all_mode) {
			XKit.extensions.cleanfeed.show_photoset_picture(e);
			return;
		}

		XKit.extensions.cleanfeed.show_photoset_picture(e.target);

		if ($(e.target).parent().hasClass("photoset_photo")) {
			if (XKit.extensions.cleanfeed.preferences.show_all_photoset_photos.value) {
				var parent_post = $(e.target).parentsUntil('.post_content');
				$(parent_post).find(".photoset_row img").each(function() {
					XKit.extensions.cleanfeed.m_ps_enter($(this), true);
				});
			}
		}
	},

	m_ps_leave: function(e, close_all_mode) {

		if (XKit.extensions.cleanfeed.status !== "true") { return; }

		if (close_all_mode) {
			XKit.extensions.cleanfeed.hide_photoset_picture(e);
			return;
		}

		XKit.extensions.cleanfeed.hide_photoset_picture(e.target);

		if ($(e.target).parent().hasClass("photoset_photo")) {
			if (XKit.extensions.cleanfeed.preferences.show_all_photoset_photos.value) {
				var parent_post = $(e.target).parentsUntil('.post_content');
				$(parent_post).find(".photoset_row img").each(function() {
					XKit.extensions.cleanfeed.m_ps_leave($(this), true);
				});
			}
		}

	},

	hide_thumbnail: function(j) {

		$(j).attr('src', XKit.extensions.cleanfeed.img_blank);
		$(j).css("background", "#d5e3f3 no-repeat 50% 50% url(" + XKit.extensions.cleanfeed.img_lock + ")");
		$(j).css("visibility", "visible");

	},

	show_thumbnail: function(j) {

		$(j).attr('src', $(j).attr('data-thumbnail'));
		$(j).css("background", "transparent");

	},

	hide_photoset_picture: function(j) {

		$(j).attr('src', XKit.extensions.cleanfeed.img_blank);
		$(j).css("background", "#d5e3f3 no-repeat 50% 50% url(" + XKit.extensions.cleanfeed.img_lock + ")");
		$(j).css("visibility", "visible");

	},

	show_photoset_picture: function(j) {

		$(j).attr('src', $(j).attr('data-xkit-old-src'));
		$(j).css("background", "transparent");

	},

	smart_update_images: function() {

		$(document).on("mouseenter", ".xkit-cleanfeed-smart-checked-flagged .image_thumbnail", XKit.extensions.cleanfeed.m_enter);
		$(document).on("mouseleave", ".xkit-cleanfeed-smart-checked-flagged .image_thumbnail", XKit.extensions.cleanfeed.m_leave);

		$(document).on("mouseenter", ".xkit-cleanfeed-smart-checked-flagged .photoset_row img, .post.xkit-cleanfeed-smart-checked-flagged .image, .post.xkit-cleanfeed-smart-checked-flagged .panorama img", XKit.extensions.cleanfeed.m_ps_enter);
		$(document).on("mouseleave", ".xkit-cleanfeed-smart-checked-flagged .photoset_row img, .post.xkit-cleanfeed-smart-checked-flagged .image, .post.xkit-cleanfeed-smart-checked-flagged .panorama img", XKit.extensions.cleanfeed.m_ps_leave);

		if (!XKit.extensions.cleanfeed.added_full_block_css && XKit.extensions.cleanfeed.preferences.full_block.value) {
			XKit.tools.add_css(" .post.xkit-cleanfeed-smart-checked-flagged.video, .post.xkit-cleanfeed-smart-checked-flagged.photo, .post.xkit-cleanfeed-smart-checked-flagged.audio, .post.xkit-cleanfeed-smart-checked-flagged.is_video, .post.xkit-cleanfeed-smart-checked-flagged.is_photo, .post.xkit-cleanfeed-smart-checked-flagged.is_audio, .post.xkit-cleanfeed-smart-checked-flagged.is_photoset, { display: none !important; }", "cleanfeed_full_block");
			XKit.extensions.cleanfeed.added_full_block_css = true;
		}

		if (!XKit.extensions.cleanfeed.added_css) {
			XKit.tools.add_css(" .xkit-cleanfeed-smart-checked-flagged.post .inline_image { opacity: 0.15; } .xkit-cleanfeed-smart-checked-flagged.post .inline_image:hover { opacity: 1; } .xkit-cleanfeed-smart-checked-flagged .image_thumbnail, .xkit-cleanfeed-smart-checked-flagged .photoset_row img, .xkit-cleanfeed-smart-checked-flagged.post .image, .xkit-cleanfeed-smart-checked-flagged.post .panorama { visibility: hidden; } .post.xkit-cleanfeed-smart-checked-flagged.video, .post.xkit-cleanfeed-smart-checked-flagged.is_video { display: none !important; }", "cleanfeed_on");
			XKit.extensions.cleanfeed.added_css = true;
		}

		$(".posts .post").not(".xkit-cleanfeed-smart-checked").each(function() {

			var rating = $(this).attr('data-tumblelog-content-rating');
			var is_nsfw = false;
			if (rating === "nsfw" || rating === "adult") { is_nsfw = true; }

			$(this).addClass("xkit-cleanfeed-smart-checked");

			if (!is_nsfw) { return; }

			$(this).addClass("xkit-cleanfeed-smart-checked-flagged");

			if (XKit.extensions.cleanfeed.preferences.hide_avatars.value) {
				$(this).find(".post_avatar_link").not(".flat.lighter_blue").each(function() {
					$(this).css("background-image", "url(" + XKit.extensions.cleanfeed.img_avatar + ")");
				});
			}

			$(this).find(".image_thumbnail").each(function() {

				XKit.extensions.cleanfeed.hide_thumbnail(this);

			});

			$(this).find(".photoset_row img, .post .image, .post .panorama img").each(function() {

				XKit.extensions.cleanfeed.hide_photoset_picture(this);

			});


		});

	},

	update_images: function(hide) {

		$(".photoset_row img, .post .image, .post .inline_image, .post .panorama img").not(".cleanfeed_done_saving").each(function() {

			$(this).addClass("cleanfeed_done_saving");
			$(this).attr('data-xkit-old-src', $(this).attr('src'));

		});

		$(".post_avatar_link").each(function() {

			if (typeof $(this).attr('data-user-avatar-url') === "undefined" || $(this).attr('data-user-avatar-url') === "") {
				$(this).attr('data-user-avatar-url', $(this).css('background-image'));
			}

		});

		if (XKit.extensions.cleanfeed.mode === "smart" && hide) {

			XKit.extensions.cleanfeed.smart_update_images();
			return;

		}

		if (!hide) {

			$(".posts .post").removeClass("xkit-cleanfeed-smart-checked").removeClass("xkit-cleanfeed-smart-checked-flagged");

		}

		if (hide) {

			if (XKit.extensions.cleanfeed.preferences.hide_avatars.value) {
				$(".post_avatar_link").not(".flat.lighter_blue").each(function() {
					$(this).css("background-image", "url(" + XKit.extensions.cleanfeed.img_avatar + ")");
				});
			}

			if (!XKit.extensions.cleanfeed.added_css) {
				XKit.tools.add_css(" .post .inline_image { opacity: 0.15; } .post .inline_image:hover { opacity: 1; } .image_thumbnail, .photoset_row img, .post .image, .post .panorama { visibility: hidden; } .post.video, .post.is_video { display: none !important; }", "cleanfeed_on");
				XKit.extensions.cleanfeed.added_css = true;
			}

			if (!XKit.extensions.cleanfeed.added_full_block_css && XKit.extensions.cleanfeed.preferences.full_block.value) {
				XKit.tools.add_css(" .post.video, .post.photo, .post.audio, .post.is_video, .post.is_photo, .post.is_audio, .post.is_photoset, { display: none !important; }", "cleanfeed_full_block");
				XKit.extensions.cleanfeed.added_full_block_css = true;
			}

			$(document).on("mouseenter", ".image_thumbnail", XKit.extensions.cleanfeed.m_enter);
			$(document).on("mouseleave", ".image_thumbnail", XKit.extensions.cleanfeed.m_leave);

			$(document).on("mouseenter", ".photoset_row img, .post .image, .post .panorama img", XKit.extensions.cleanfeed.m_ps_enter);
			$(document).on("mouseleave", ".photoset_row img, .post .image, .post .panorama img", XKit.extensions.cleanfeed.m_ps_leave);

		} else {

			XKit.tools.remove_css("cleanfeed_full_block");
			XKit.extensions.cleanfeed.added_full_block_css = false;

			$(".post_avatar_link").each(function() {

				var m_url = $(this).find(".post_avatar_image").attr('src');

				if (typeof m_url === "undefined" || m_url === "") {

					m_url = $(this).attr('data-user-avatar-url');

				}

				if (m_url.indexOf('url(') !== -1) {
					$(this).css("background-image", m_url);
				} else {
					$(this).css("background-image", "url(" + m_url + ")");
				}



			});

			XKit.tools.remove_css("cleanfeed_on");
			XKit.extensions.cleanfeed.added_css = false;

			$(document).off("mouseenter", ".image_thumbnail", XKit.extensions.cleanfeed.m_enter);
			$(document).off("mouseleave", ".image_thumbnail", XKit.extensions.cleanfeed.m_leave);
			$(document).off("mouseenter", ".photoset_row img, .post .image, .post .panorama img", XKit.extensions.cleanfeed.m_ps_enter);
			$(document).off("mouseleave", ".photoset_row img, .post .image, .post .panorama img", XKit.extensions.cleanfeed.m_ps_leave);

		}

		$(".image_thumbnail").each(function() {

			if (hide) {
				XKit.extensions.cleanfeed.hide_thumbnail(this);
			} else {
				XKit.extensions.cleanfeed.show_thumbnail(this);
			}

		});

		$(".photoset_row img, .post .image, .post .panorama img").each(function() {

			if (hide) {
				XKit.extensions.cleanfeed.hide_photoset_picture(this);
			} else {
				XKit.extensions.cleanfeed.show_photoset_picture(this);
			}

		});

	},

	toggle: function() {

		if (XKit.extensions.cleanfeed.status == "true") {
			XKit.extensions.cleanfeed.status = "false";
			XKit.extensions.cleanfeed.update_images(false);
		} else {
			XKit.extensions.cleanfeed.status = "true";
			XKit.extensions.cleanfeed.update_images(true);
		}

		XKit.extensions.cleanfeed.update_button();
		XKit.storage.set("cleanfeed", "status", XKit.extensions.cleanfeed.status);

	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("cleanfeed_on");
		XKit.tools.remove_css("cleanfeed_full_block");
		$("#xcleanfeed_ul").remove();
		XKit.extensions.cleanfeed.update_images(false);
	}

});
