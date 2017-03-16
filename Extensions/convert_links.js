//* TITLE Convert Links **//
//* VERSION 0.1 REV B **//
//* DESCRIPTION Clickable links on asks **//
//* DETAILS This extension allows you to turn the 'encrypted' links that people can send you using asks to clickable ones. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.convert_links = new Object({

	running: false,

	button_icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAByUDbMAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0YwNkY2N0QyNjEwMTFFM0E4QURBMkY5NDVFMjREMzgiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0YwNkY2N0UyNjEwMTFFM0E4QURBMkY5NDVFMjREMzgiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDozRjA2RjY3QjI2MTAxMUUzQThBREEyRjk0NUUyNEQzOCIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDozRjA2RjY3QzI2MTAxMUUzQThBREEyRjk0NUUyNEQzOCIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpwA9qcAAAEiSURBVHjaYmDADRSAuBmItwDxYyA+DcQVQMzBQAKIBuL/aPgdEF9B4j8CYnVCBp2GKt4PxHpA7IBFzTwkQ3NwGXQcyRXIIA7qVXUsLgbhRHSDYpEkv6PJPYeKg4AjEN/BYiAKQJZoJBAUMlgMuwCTVMZnCxpYDlXzF4uBLCAFLUQapogjzGA4kwlIaKBpMsBh2BoCrtYEGSaJJtiLxL4JxHugbCMChoHNWYLFyU5YIoYQ7gK57BwWW0CuMQZiRigmBoASPAMXHtt+ATE/EJtCs5AvlF0IxEdxRdxbAl74gcM1tlD5WciCqgQMe4PDMJzJKRuPYRfxGMSHKxAT8Rh4H4ulQsTEzDkC3l6JTRO+aAclmwxoDpGEugxUgvTj0gAQYAB9HpoNDcJdTAAAAABJRU5ErkJggg==",

	run: function() {
		this.running = true;

		if (XKit.interface.where().inbox !== true) { return; }

		$(document).on('click', '.xkit-convert-links-button', XKit.extensions.convert_links.on_click);
		XKit.interface.create_control_button("xkit-convert-links-button", this.button_icon, "Convert Links", "");

		XKit.post_listener.add("convert_links", XKit.extensions.convert_links.do);
		XKit.extensions.convert_links.do();

	},

	on_click: function(e) {

		var obj = e.target || e.srcElement;
		var parent = $(obj).parentsUntil("#posts");

		var m_post = XKit.interface.find_post($(obj).attr('data-ask-id'));

		var m_content = $(".post_body", "<div>" + m_post.body + "</div>").html();
		var m_html = m_content.substring(m_content.indexOf("<div "));

		m_content = m_content.substring(0, m_content.indexOf("<div "));

		m_content = XKit.tools.replace_all(m_content, '\\\)', '');
		m_content = XKit.tools.replace_all(m_content, '\\\(', '');
		m_content = XKit.tools.replace_all(m_content, '[.]', '.');
		m_content = XKit.tools.replace_all(m_content, '\\\[', '');
		m_content = XKit.tools.replace_all(m_content, '\\\]', '');
		m_content = XKit.tools.replace_all(m_content, '[/]', '/');
		m_content = XKit.tools.replace_all(m_content, ' / ', '/');
		//m_content = XKit.tools.replace_all(m_content, '(.)','.');
		m_content = XKit.tools.replace_all(m_content, '(dot)', '.');
		m_content = XKit.tools.replace_all(m_content, ' dot ', '.');
		m_content = XKit.tools.replace_all(m_content, ' com', '.com');
		m_content = XKit.tools.replace_all(m_content, ' org', '.org');
		m_content = XKit.tools.replace_all(m_content, ' net', '.net');

		m_content = XKit.tools.replace_all(m_content, 'www ', 'www.');

		m_content = m_content.replace(/\b((?:[a-z][\w-]+:(?:\/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.-]+[.][a-z]{2,4}\/)(?:(?:[^\s()<>.]+[.]?)+|((?:[^\s()<>]+|(?:([^\s()<>]+)))))+(?:((?:[^\s()<>]+|(?:([^\s()<>]+))))|[^\s`!()[]{};:'".,<>?]))/gi, "<a target=_blank href=http://$1>$1</a>");

		$(parent).find(".post_body").html(m_content + m_html);

	},

	do: function() {

		var posts = XKit.interface.get_posts("convert-links-done");

		$(posts).each(function() {

			$(this).addClass("convert-links-done");

			var m_post = XKit.interface.post($(this));
			if (m_post.type !== "note") { return; }

			var this_id = m_post.id;
			XKit.interface.add_control_button(this, "xkit-convert-links-button", "data-ask-id=\"" + this_id + "\"");

		});

	},

	destroy: function() {
		this.running = false;
	}

});
