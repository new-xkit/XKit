//* TITLE Iconified Notifications **//
//* VERSION 1.0 REV C **//
//* DESCRIPTION Differentiate Notifications **//
//* DETAILS This extension replaces words like 'reblogged your post' with an icon, making notifications easier to notice and frees up space for the post summary. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.icon_nots = new Object({

	running: false,

	run: function() {
		this.running = true;

		XKit.tools.init_css("icon_nots");

		if (XKit.interface.where().activity) {
			setInterval(XKit.extensions.icon_nots.do_activity, 1000);
			XKit.extensions.icon_nots.do_activity();
		} else {
			setInterval(XKit.extensions.icon_nots.do, 1000);
			XKit.extensions.icon_nots.do();
		}

	},

	do_activity: function() {

		$(".part_main").not(".xkit-iconified").each(function() {

			try {

				var old_html = btoa(unescape(encodeURIComponent($(this)[0].outerHTML)));
				$(this).attr('data-xkit-text-version-html', old_html);

				$(this).addClass("xkit-iconified");
				$(this).parentsUntil("ol").addClass("xkit-iconified");


				if ($(this).parentsUntil("ol").hasClass("notification_follower")) {

					var username_part = $(this).find(".username")[0].outerHTML;
					$(this).html("<div class=\"xkit-notification-icon xkit-no-left-margin\">&nbsp;</div>" + username_part);

				}

				var part1 = $(this).find(".activity").find("a")[0].outerHTML;
				var part2 = $(this).find(".summary")[0].outerHTML;

				$(this).html("<div class=\"activity\">" + part1 + "</div><div class=\"xkit-notification-icon\">&nbsp;</div>" + part2);

			} catch (e) {


			}

		});

	},

	do: function() {

		$(".notification_sentence").not(".xkit-iconified").each(function() {

			var old_html = btoa(unescape(encodeURIComponent($(this)[0].outerHTML)));
			$(this).attr('data-xkit-text-version-html', old_html);

			$(this).addClass("xkit-iconified");
			$(this).parentsUntil("ol").addClass("xkit-iconified");

			if ($(this).parentsUntil("ol").hasClass("notification_follower")) {

				var username = $(this).find(".username")[0].outerHTML;
				$(this).html("<div class=\"xkit-notification-icon xkit-no-left-margin\">&nbsp;</div>" + username);
				return;

			}

			if ($(this).find("em").length === 0 && $(this).find(".notification_target").length === 0) { return; }

			var part1 = $(this).find(".username")[0].outerHTML;
			var part2 = $(this).find("em").html();

			if ($(this).find("em").length === 0) {
				part2 = $(this).find(".notification_target").html();
			}

			if ($(this).find("blockquote").length > 0) {
				part2 = part2 + $(this).find("blockquote")[0].outerHTML;
			}



			//console.log(decodeURIComponent(escape(atob(old_html))));

			$(this).html(part1 + "<div class=\"xkit-notification-icon\">&nbsp;</div>" + part2);

		});

	},

	destroy: function() {
		this.running = false;
	}

});
