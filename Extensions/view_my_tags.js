//* TITLE View My Tags **//
//* VERSION 0.4.3 **//
//* DESCRIPTION Lets you view your recently used tags **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.view_my_tags = new Object({

	running: false,
	apiKey: "fuiKNFp9vQFvjLNvx4sUwti4Yb5yGutBN4Xh10LXZhhRKjWlV4",
	url: "",

	button_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAACNiR0NAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OEY5QzJBRTkzRTlGMTFFM0JFOUNFQjdCODYyOTc5RjMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OEY5QzJBRUEzRTlGMTFFM0JFOUNFQjdCODYyOTc5RjMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo4RjlDMkFFNzNFOUYxMUUzQkU5Q0VCN0I4NjI5NzlGMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo4RjlDMkFFODNFOUYxMUUzQkU5Q0VCN0I4NjI5NzlGMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pr7xRK4AAAFxSURBVHjarJQ7SwNBFIV3fTXughYWglYBQVCxsTadf8NebASxNYW92vgPtBZsBBs7A5pGC58gsUkRQsDga43ruXAGJpM7u1Ey8GXuZGZOzp07kzBN06CfbSDocxsyQRiGeVZjZNP6i8PvnLUX+NEo16KcIc/xTYYUPgRXHNvcgsjs0dAEt8EwmBJXiugd01cFtaK8YiJBXwM/yvwMKHvTVxzWwR44UdzZ3Ej6XTqW4Ke1OHHGPh4kfZ9gqweB1FOoWBNc55llbW5npB+7gtLO/unSVD/qvkdBMAE+wCU4Bu+gyu/ajH1Oj+ynV2S4CGbBCpgEG2AeXIMGWAbnvA3utUtsZ/LRBM+MG+wr7MVZiXGBjm13j2DEFdwFRcZj4IkbKyxYlU9z1BG7FzHtpTSd+IUvZk1OBUyDHbBvrROxOfDV8feV0eQIyizEILOoc04qu2DE3KeX1Q6slJc6ronzjHsVXAVbYBycgk1XzAj+CjAAVzNAhdtS9LcAAAAASUVORK5CYII=",

	preferences: {
		"sep0": {
			text: "Options",
			type: "separator"
		},
		"only_in_post_window": {
			text: "Only show View My Tags button when I'm creating/editing a post",
			value: false,
			default: false
		},
		"sort_by_az": {
			text: "Sort my tags alphabetically",
			value: true,
			default: true
		},
	},

	run: function() {
		this.running = true;
		if ($("#post_controls_avatar").length === 1) {
			// For now, this will only work on pages where the user's avatar is visible
			this.url = $("#post_controls_avatar").attr("href").replace("http://", "").replace("/", "");
		}

		$("body").append("<div id=\"xkit-view-my-tags-data\"></div>");

		XKit.tools.init_css("view_my_tags");

		XKit.interface.post_window.create_control_button("xkit-view-my-tags-window", this.button_icon, "View my Tags");
		XKit.interface.post_window_listener.add("view_my_tags", XKit.extensions.view_my_tags.post_window);
		$(document).on("click",".xkit-view-my-tags-window", XKit.extensions.view_my_tags.post_window_icon);

		if (XKit.extensions.view_my_tags.url !== "") {
			var api_url = "https://api.tumblr.com/v2/blog/" +  XKit.extensions.view_my_tags.url + "/posts?api_key=" + XKit.extensions.view_my_tags.apiKey + "&limit=20";

			GM_xmlhttpRequest({
				method: "GET",
				url: api_url,
				json: true,
				onload: function(response) {
					var data = JSON.parse(response.responseText);
					var user_tags_array = [];
					var user_tags_hashmap = {};
					data.response.posts.forEach(function(post){
						post.tags.forEach(function(tag){
							if (!user_tags_hashmap.hasOwnProperty(tag)) {
								user_tags_array.push(tag);
								user_tags_hashmap[tag] = 1;
							}
						});
					});

					$("#xkit-view-my-tags-data").html(JSON.stringify(user_tags_array));
				}
			});
		}

		var xf_html = '<ul class="controls_section" id="view_my_tags_ul">' +
					'<li class="section_header selected">VIEW MY TAGS</li>' +
					'<li class="no_push" style="height: 36px;"><a href="#" id="view_my_tags_view">' +
						'<div class="hide_overflow" style="color: rgba(255, 255, 255, 0.5) !important; font-weight: bold; padding-left: 10px; padding-top: 8px;">View recent tags</div>' +
					'</a></li>' +
				'</ul>';

		if (XKit.extensions.view_my_tags.preferences.only_in_post_window.value === false) {

			if ($("#xstats_ul").length > 0) {

				xf_html = '<li class="no_push"><a href="#" id="view_my_tags_view">' +
							'<div class="hide_overflow">View recent tags</div>' +
						'</a></li>';

				$("#xstats_ul").append(xf_html);

			} else {

				$(".controls_section_radar").before(xf_html);

			}

			$("#view_my_tags_view").click(function() {
				XKit.extensions.view_my_tags.show();

				return false;
			});

		}


	},

	post_window: function() {

		XKit.interface.post_window.add_control_button("xkit-view-my-tags-window", "data-in-window=\"true\"");

	},

	post_window_icon: function() {

		XKit.extensions.view_my_tags.show(true);

	},

	show: function(in_post_window) {

		var m_data = $("#xkit-view-my-tags-data").html();

		if (m_data === "") { XKit.extensions.view_my_tags.show_error("VMT-509"); }

		try {

			var m_array = JSON.parse(m_data);

			console.log(m_array);

			var m_html = "<div class=\"nano\" id=\"view-my-tags-window-outer\">" +
				"<div class=\"content\" id=\"view-my-tags-window\">";

			if (XKit.extensions.view_my_tags.preferences.sort_by_az.value === true) {

				m_array.sort();

			}

			for (var i=0;i<m_array.length;i++) {

				if (!in_post_window) {
					m_html = m_html + "<div class=\"xkit-view-my-tags-tag\">" + m_array[i] + "</div>";
				} else{
					var extra_tags = "";
					console.log(m_array[i] + "=" + XKit.interface.post_window.tag_exists(m_array[i]));
					if (XKit.interface.post_window.tag_exists(m_array[i]) === true) { extra_tags = "xkit-view-tags-green"; }
					m_html = m_html + "<div data-the-tag=\"" + m_array[i] + "\" class=\"xkit-view-my-tags-tag " + extra_tags + " xkit-with-ability-to-add-to-the-window-hoorray\">" + m_array[i] + "</div>";
				}

			}

			m_html = m_html + "</div></div>";

			XKit.window.show("View My Tags", m_html, "info", "<div id=\"xkit-close-message-view-my-tags\" class=\"xkit-button\">Close</div><input type=\"text\" placeholder=\"Search tags...\" id=\"xkit-view-my-tags-search\">");

			$("body").css("overflow","hidden");

			$("#view-my-tags-window-outer").nanoScroller();

			$("#xkit-close-message-view-my-tags").click(function() {

				$("body").css("overflow","auto");
				XKit.window.close();

			});

			$("#xkit-view-my-tags-search").keyup(function() {

				var m_value = $(this).val().toLowerCase();
				m_value = $.trim(m_value);
				if (m_value === "") {
					$(".xkit-view-my-tags-tag").removeClass("xkit-view-tags-hidden");
				}

				var m_count = 0;

				$(".xkit-view-my-tags-tag").each(function() {

					if ($(this).html().toLowerCase().indexOf(m_value) !== -1) {

						$(this).removeClass("xkit-view-tags-hidden");
						m_count++;

					} else {

						$(this).addClass("xkit-view-tags-hidden");

					}

				});

				$("#view-my-tags-window-outer").nanoScroller();

			});

			$(".xkit-view-my-tags-tag.xkit-with-ability-to-add-to-the-window-hoorray").click(function() {

				if ($(this).hasClass("xkit-view-tags-green")) {

					XKit.interface.post_window.remove_tag($(this).attr('data-the-tag'));
					$(this).removeClass("xkit-view-tags-green");

				} else {

					XKit.interface.post_window.add_tag($(this).attr('data-the-tag'));
					$(this).addClass("xkit-view-tags-green");

				}

			});

		} catch(e) {

			XKit.extensions.view_my_tags.show_error("VMT-510: " + e.message);

		}

	},

	show_error: function(error_code) {

		XKit.window.show("Unable to retrieve tags","View My Tags were unable to retrieve your latest tags.<br/>Please try again later.<br/><br/>Error Code:<br/>" + error_code,"error","<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div>");

	},

	destroy: function() {
		this.running = false;
		$("#view_my_tags_ul").remove();
		$("#view_my_tags_view").remove();
		XKit.interface.post_window_listener.remove("view_my_tags");
	}

});
