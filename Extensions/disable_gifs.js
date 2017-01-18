//* TITLE Disable Gifs **//
//* VERSION 0.3.1 **//
//* DESCRIPTION Stops GIFs on dashboard **//
//* DETAILS This is a very early preview version of an extension that allows you to stop the GIFs from playing on your dashboard. If you still would like to view them, you can click on the Play button on the post. Please note that for now, this extension can't stop GIFs added to text posts. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.disable_gifs = new Object({

	running: false,
	button_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkRFQzJCQjcyQjRCMTFFMzk3NjJBMTk2OEYyM0IxREYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkRFQzJCQjgyQjRCMTFFMzk3NjJBMTk2OEYyM0IxREYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpENTA1MTcyNjJBRUMxMUUzOTc2MkExOTY4RjIzQjFERiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGREVDMkJCNjJCNEIxMUUzOTc2MkExOTY4RjIzQjFERiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PgYTp9MAAACOSURBVHjavJQNCsAgCEb3Dc/UMbb7n8YVFIlMa2ETjP6UZ2pg5iNKqAwAPnvMENB75xEopNaYgbIOtpJ5bzSkp9lQcpKGCfk1THh1WGnZTIA0lvNSi1lTC/c17GrATeW6zJuKO0nRdrsFZ2w5I6s1HLnd+tHqEFxGGXWyQbamW41W+3B7byLycwwlewQYAABheN9oKlBYAAAAAElFTkSuQmCC",
	on_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RkRFQzJCQkIyQjRCMTFFMzk3NjJBMTk2OEYyM0IxREYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RkRFQzJCQkMyQjRCMTFFMzk3NjJBMTk2OEYyM0IxREYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGREVDMkJCOTJCNEIxMUUzOTc2MkExOTY4RjIzQjFERiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGREVDMkJCQTJCNEIxMUUzOTc2MkExOTY4RjIzQjFERiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmuI/CcAAABySURBVHjaYvz//z8DtQALiMhZqkOyiVOirzCiizExUBGwELINHeDzBe1cRm5Y4TWM3AihnzdJjRCiXQbSBMRm+NQwkRhWJ/EZSE6YncQbZsSEDRLwp5bL/IEWb6I40RLjehZy8yHN8yYjNQtHqroMIMAAFUUpurj2PsEAAAAASUVORK5CYII=",
	slow: true,

	preferences: {
		"hide_completely": {
			text: "Completely hide posts with GIFs.",
			default: false,
			value: false
		}
	},

	run: function() {
		this.running = true;
		XKit.tools.init_css("disable_gifs");
		if ($("#posts").length > 0) {
			$(document).on('click', '.disable_gifs_button', XKit.extensions.disable_gifs.on_click);
			//$(document).on('click','.xkit-disable-gifs-canvas-thumbnail', XKit.extensions.disable_gifs.toggle_enlarge);

			XKit.interface.create_control_button("disable_gifs_button", this.button_icon, "Play Gif", "", this.on_icon);
			XKit.post_listener.add("disable_gifs", XKit.extensions.disable_gifs.do);
			XKit.extensions.disable_gifs.do();
		}

	},

	redraw_canvases: function(obj) {

		$(obj).find(".xkit-disable-gifs-canvas-container").each(function() {

			var image = new Image();
			image.src = $(this).attr('data-url');

			var v_object = $(this).find(".xkit-disable-gifs-canvas-thumbnail");

			image.onload = (function() {
				$(v_object)[0].getContext("2d").drawImage(image, 0, 0);

				if ($(v_object).hasClass("xkit-disable-gifs-for-photoset")) {return; }

				$(v_object).click(function() {

					$(this).parentsUntil(".post_media").parent().find(".image_thumbnail").trigger('click');

					$(this).toggleClass("enlarged-canvas");
					if ($(this).hasClass("enlarged-canvas")) {
						$(this).css("width", $(this).attr('data-width'));
						$(this).css("height", $(this).attr('data-height'));
						$(this).parent().css("width", $(this).attr('data-width'));
						$(this).parent().css("height", $(this).attr('data-height'));
					} else {
						$(this).css("width", $(this).attr('data-width-thumb'));
						$(this).css("height", $(this).attr('data-height-thumb'));
						$(this).parent().css("width", $(this).attr('data-width-thumb'));
						$(this).parent().css("height", $(this).attr('data-height-thumb'));
					}

				});

			});



		});

	},

	return_as_jpg_photoset: function(url, width, height, post_id, obj, post_obj, row_container, box_container, img_id) {

		console.log("return_as_jpg_photoset for " + url + " | height = " + height + " | width = " + width);

		if (parseInt(height) === 0) {
			height = $(row_container).height();
		}

		var m_canvas_html = "<div data-url=\"" + url + "\" id=\"xkit-disable-gifs-canvas-container-for-" + post_id + "___" + img_id + "\" class=\"xkit-disable-gifs-canvas-container\"><canvas class=\"xkit-disable-gifs-canvas-thumbnail xkit-disable-gifs-for-photoset\" style=\"display: block;\" id=\"xkit-disable-gifs-canvas-for-" + post_id + "___" + img_id + "\"></canvas><img class=\"xkit-disable-gifs-indicator\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDUwNTE3MjQyQUVDMTFFMzk3NjJBMTk2OEYyM0IxREYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDUwNTE3MjUyQUVDMTFFMzk3NjJBMTk2OEYyM0IxREYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpENTA1MTcyMjJBRUMxMUUzOTc2MkExOTY4RjIzQjFERiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpENTA1MTcyMzJBRUMxMUUzOTc2MkExOTY4RjIzQjFERiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrQbdTIAAAH5SURBVHjazJi/SsRAEMYnuRAs0hgET8ROsL9CsBJ7C1/BysoHsLrSx7inULAQaxHEzsrGoHhNComIkfOc4TY6xs2f3WySHfjuuCS3+Wby20myDvzGFmobtY5agm7jE/WEuhMCR+zYRe2BHXGDOhvgxwbqgJnsO+iKTcnYPmoF7IrQxY8h2BerZMy30NjAK9jhz+fzk6ajO45zil+pzn/dgu2Bocy1xymsGMv6VjFrqvYoP44pYzweULFKlTCZWCSTtmmMThJ3zZzbNiu643h1uVFg7ocxcSzoMOdpZF3FXMYYxVQYVGZOxxid5KXtXuf20aPqjOM1GLDVXucZyppzRyc9FIYnAn7+mxIIUSPTjJVxB+KkWSS545K6zdqUMeklllym2u3CBUujsmLIx1HGCmNoLIF5bNKYzi0paLF1VFYsxSqdC5BjSVOkfUM25YEdzydEqvvoU2QsES0gEoMHuX00A9/YlM+2RTw5sT00WrFcpXzG3J8exbYf98GYDnftzkoJc1DCXVjRhI0/XXDmoIS7qCw5yZ2gecUkVfrHnS2M9dv5FbjTvfmnpo3ludNKrog7MvYBegt1qeL7pkrMiLFHCxGLyNgVLJYabYkv1CUt3L2jXlGbtPzTs6kZ6gJ1z5c3l1E7sFhqXOu4lVBzfkZdZ++i3wIMADlboIdWns5XAAAAAElFTkSuQmCC\" /></div>";

		$(box_container).append(m_canvas_html);

		$("#xkit-disable-gifs-canvas-for-" + post_id + "___" + img_id).attr("width", width);
		$("#xkit-disable-gifs-canvas-for-" + post_id + "___" + img_id).attr("height", height);

		var image = new Image();
		image.src = url;

		image.onload = (function() {

			console.log("return_as_jpg for " + url + " ---> Complete loading image.");

			$("#xkit-disable-gifs-canvas-for-" + post_id + "___" + img_id)[0].getContext("2d").drawImage(image, 0, 0, width, height);
			//var image_src = $("#xkit-disable-gifs-canvas-for-" + post_id)[0].toDataURL("image/jpg");

		});

	},

	return_as_jpg: function(url, width, height, post_id, obj, post_obj, photoset_mode) {

		console.log("return_as_jpg for " + url);

		var m_canvas_html = "<div data-url=\"" + url + "\" id=\"xkit-disable-gifs-canvas-container-for-" + post_id + "\" class=\"xkit-disable-gifs-canvas-container\"><canvas class=\"xkit-disable-gifs-canvas-thumbnail\" style=\"display: block;\" id=\"xkit-disable-gifs-canvas-for-" + post_id + "\"></canvas><img class=\"xkit-disable-gifs-indicator\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RDUwNTE3MjQyQUVDMTFFMzk3NjJBMTk2OEYyM0IxREYiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RDUwNTE3MjUyQUVDMTFFMzk3NjJBMTk2OEYyM0IxREYiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpENTA1MTcyMjJBRUMxMUUzOTc2MkExOTY4RjIzQjFERiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpENTA1MTcyMzJBRUMxMUUzOTc2MkExOTY4RjIzQjFERiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PrQbdTIAAAH5SURBVHjazJi/SsRAEMYnuRAs0hgET8ROsL9CsBJ7C1/BysoHsLrSx7inULAQaxHEzsrGoHhNComIkfOc4TY6xs2f3WySHfjuuCS3+Wby20myDvzGFmobtY5agm7jE/WEuhMCR+zYRe2BHXGDOhvgxwbqgJnsO+iKTcnYPmoF7IrQxY8h2BerZMy30NjAK9jhz+fzk6ajO45zil+pzn/dgu2Bocy1xymsGMv6VjFrqvYoP44pYzweULFKlTCZWCSTtmmMThJ3zZzbNiu643h1uVFg7ocxcSzoMOdpZF3FXMYYxVQYVGZOxxid5KXtXuf20aPqjOM1GLDVXucZyppzRyc9FIYnAn7+mxIIUSPTjJVxB+KkWSS545K6zdqUMeklllym2u3CBUujsmLIx1HGCmNoLIF5bNKYzi0paLF1VFYsxSqdC5BjSVOkfUM25YEdzydEqvvoU2QsES0gEoMHuX00A9/YlM+2RTw5sT00WrFcpXzG3J8exbYf98GYDnftzkoJc1DCXVjRhI0/XXDmoIS7qCw5yZ2gecUkVfrHnS2M9dv5FbjTvfmnpo3ludNKrog7MvYBegt1qeL7pkrMiLFHCxGLyNgVLJYabYkv1CUt3L2jXlGbtPzTs6kZ6gJ1z5c3l1E7sFhqXOu4lVBzfkZdZ++i3wIMADlboIdWns5XAAAAAElFTkSuQmCC\" /></div>";

		if ($(post_obj).find(".photo_info").length > 0) {
			$(post_obj).find(".photo_info").before(m_canvas_html);
		} else {
			$(post_obj).find(".post_media").append(m_canvas_html);
		}
		$("#xkit-disable-gifs-canvas-for-" + post_id).attr("width", width);
		$("#xkit-disable-gifs-canvas-for-" + post_id).attr("height", height);

		$("#xkit-disable-gifs-canvas-container-for-" + post_id).css("width", width + "px");
		$("#xkit-disable-gifs-canvas-container-for-" + post_id).css("height", height + "px");

		var image = new Image();
		image.src = url;

		image.onload = (function() {

			console.log("return_as_jpg for " + url + " ---> Complete loading image.");

			$("#xkit-disable-gifs-canvas-for-" + post_id)[0].getContext("2d").drawImage(image, 0, 0, width, height);
			//var image_src = $("#xkit-disable-gifs-canvas-for-" + post_id)[0].toDataURL("image/jpg");

			var m_width = $(obj).attr('data-width');
			var m_height = $(obj).attr('data-height');

			$("#xkit-disable-gifs-canvas-for-" + post_id).attr('data-height', m_height);
			$("#xkit-disable-gifs-canvas-for-" + post_id).attr('data-width', m_width);

			$("#xkit-disable-gifs-canvas-for-" + post_id).attr('data-height-thumb', height);
			$("#xkit-disable-gifs-canvas-for-" + post_id).attr('data-width-thumb', width);

			if (!photoset_mode) {

				$("#xkit-disable-gifs-canvas-for-" + post_id).click(function() {

					$(this).parentsUntil(".post_media").parent().find(".image_thumbnail").trigger('click');

					$(this).toggleClass("enlarged-canvas");
					if ($(this).hasClass("enlarged-canvas")) {
						$(this).css("width", $(this).attr('data-width'));
						$(this).css("height", $(this).attr('data-height'));
						$(this).parent().css("width", $(this).attr('data-width'));
						$(this).parent().css("height", $(this).attr('data-height'));
					} else {
						$(this).css("width", $(this).attr('data-width-thumb'));
						$(this).css("height", $(this).attr('data-height-thumb'));
						$(this).parent().css("width", $(this).attr('data-width-thumb'));
						$(this).parent().css("height", $(this).attr('data-height-thumb'));
					}

				});

			} else {



			}

		});

	},

	check_if_animated: function(obj) {

		try {

			var m_post = XKit.interface.post($(obj));
			if (m_post.animated === true) { return true; }

			if ($(obj).find(".image_thumbnail").length > 0) {
				return ($(obj).find(".image_thumbnail").attr('src').indexOf(".gif") !== -1);
			} else {
				if ($(obj).find(".image").length > 0) {
					return ($(obj).find(".image").attr('src').indexOf(".gif") !== -1);
				} else {
					if ($(obj).find(".photoset_photo").length > 0) {
						// do something here?
						if (typeof $(obj).find(".photoset_photo").attr('src') !== "undefined") {
							return ($(obj).find(".photoset_photo").attr('src').indexOf(".gif") !== -1);
						} else {
							return ($(obj).find(".photoset_photo").attr('href').indexOf(".gif") !== -1);
						}
					}
				}
			}

		} catch (e) {

			console.log("[!!!!!!]check_if_animated --> " + e.message);

		}

		return false;

	},

	do: function() {

		var posts = XKit.interface.get_posts("disable-gifs-checked");

		$(posts).each(function() {

			$(this).addClass("disable-gifs-checked");

			if ($(this).hasClass("xkit-dont-run-extensions")) { return; }

			var m_post = XKit.interface.post($(this));
			// if (m_post.animated !== true) { return; }

			//alert(XKit.extensions.disable_gifs.check_if_animated($(this)));
			if (XKit.extensions.disable_gifs.check_if_animated($(this)) === false) {
				return;
			}

			if (XKit.extensions.disable_gifs.preferences.hide_completely.value === true) {
				$(this).addClass("xkit-disable-gifs-completely");
				return;
			}

			if ($(this).find(".image_thumbnail").length > 0) {
				$(this).find(".image_thumbnail").css("display", "none");
				XKit.extensions.disable_gifs.return_as_jpg($(this).find(".image_thumbnail").attr('src'), $(this).find(".image_thumbnail").attr('width'), $(this).find(".image_thumbnail").attr('height'), m_post.id, $(this).find(".image_thumbnail"), this);
			} else {
				if ($(this).find(".image").length > 0) {
					$(this).find(".image").css("display", "none");
					XKit.extensions.disable_gifs.return_as_jpg($(this).find(".image").attr('src'), $(this).find(".image").attr('width'), $(this).find(".image").attr('height'), m_post.id, $(this).find(".image"), this);
				} else {
					if ($(this).find(".photoset_photo").length > 0) {
						// do something here?
						var img_id = 0;
						var m_parent = $(this);
						$(this).find(".photoset_photo").each(function() {
							$(this).find("img").css("display", "none");
							img_id++;
							XKit.extensions.disable_gifs.return_as_jpg_photoset($(this).find("img").attr('src'), $(this).find("img").css('width').replace("px", ""), $(this).find("img").css('height').replace("px", ""), m_post.id, $(this), m_parent, $(this).parent(), $(this), img_id, "es");
						});
					}
				}
			}

			var this_id = m_post.root_id;
			XKit.interface.add_control_button(this, "disable_gifs_button", "data-root_id=\"" + this_id + "\"");

		});

	},

	on_click: function(e) {

		var obj = e.target || e.srcElement;
		var parent = $(obj).parentsUntil("#posts");

		$(parent).toggleClass("xkit-disable-gifs-playing");


		if ($(parent).hasClass("xkit-disable-gifs-playing")) {
			XKit.interface.completed_control_button(obj, true);
			$(parent).find(".image, .image_thumbnail, .photoset_photo img").css("display", "block");
			$(parent).find(".xkit-disable-gifs-canvas-container").css("display", "none");
		} else {
			XKit.interface.completed_control_button(obj, false);
			$(parent).find(".image, .image_thumbnail, .photoset_photo img").css("display", "none");
			$(parent).find(".xkit-disable-gifs-canvas-container").css("display", "block");
		}

	},

	destroy: function() {
		XKit.tools.remove_css("disable_gifs");
		this.running = false;
	}

});
