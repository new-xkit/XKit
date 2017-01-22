//* TITLE Limit People **//
//* VERSION 0.2.3 **//
//* DESCRIPTION Limit the appearance of blogs on dash **//
//* DETAILS Some people on your dashboard posting a lot? Limit people limits how many consecutive posts by the same person appear on your dashboard at once. If a user makes more than 2 consecutive posts, the rest will be hidden until you click on a button to show them. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.limit_people = new Object({

	running: false,

	preferences: {
		limit: {
			text: "Hide consecutive posts after the ",
			default: "2",
			value: "2",
			type: "combo",
			values: [
				"3rd Post (default)", "after2",
				"4th Post", "after3",
				"5th Post", "after4",
				"6th Post", "after5",
			],
		},
		dont_limit_me: {
			text: "Don't limit my own posts",
			default: false,
			value: false,
			type: "checkbox"
		},
	},

	run: function() {
		this.running = true;

		if (XKit.interface.where().dashboard !== true) { return; }

		if ($("#posts").length > 0) {
			XKit.tools.init_css("limit_people");
			XKit.post_listener.add("limit_people", XKit.extensions.limit_people.do);
			XKit.extensions.limit_people.do();

			$(document).on("click", ".xkit-limit-people-opener", XKit.extensions.limit_people.open);

		}

	},

	open: function(e) {

		var m_obj = $(e.target);

		$($(m_obj).attr('data-to-get')).removeClass("xkit-limit-people-grouped-hidden");

		$($(m_obj).attr('data-to-get') + " .xkit-limit-people-grouped-hidden").each(function() {

			$(this).attr('class', $(this).attr('data-old-classes') + " xkit-limit-people-grouped-hidden");
			$(this).removeAttr('data-old-classes');

		});

		$($(m_obj).attr('data-to-get') + " .post.xkit-limit-people-grouped-hidden").css("opacity", "0").removeClass("xkit-limit-people-grouped-hidden");

		$($(m_obj).attr('data-to-get') + " .post").animate({ opacity: 1}, 400);

		$($(m_obj)).parent().slideUp('slow');

		setTimeout(function() { XKit.post_listener.check(true); }, 300);

	},

	last_url: "",
	last_count: 0,
	last_group_id: XKit.tools.random_string(),
	last_grouped: false,

	do: function() {
		if (XKit.page.peepr) { return; }

		var size_changed = false;

		var posts = XKit.interface.get_posts("xkit-limit-people-checked");

		var after_v = parseInt(XKit.extensions.limit_people.preferences.limit.value.replace("after", ""));

		var no_endless = $("body").hasClass("without_auto_paginate");

		var total = $(posts).length;

		$(posts).each(function(index) {
			
			if ($(this).parents('.peepr-drawer').length > 0) { return; }
			
			var m_post = XKit.interface.post($(this));
			$(this).addClass("xkit-limit-people-checked");

			if (XKit.extensions.limit_people.preferences.dont_limit_me.value === true) {

				if (m_post.is_mine === true) { return; }

			}

			if ($(this).hasClass("xkit_view_on_dash_post")) { return; }
			if ($(this).is(':hidden')) { return; }

			// // console.log("owner = " + m_post.owner + "\n last = " + XKit.extensions.limit_people.last_url);

			var force_group_this = false;

			if (index === total - 1 && no_endless) {

				if (((XKit.extensions.limit_people.last_count - after_v) + 1) >= 1) {

					m_post.owner = "";
					force_group_this = true;

					$(this).parent().addClass("xkit-limit-people-group-" + XKit.extensions.limit_people.last_url + "-" + XKit.extensions.limit_people.last_group_id).addClass("xkit-limit-people-group-" + XKit.extensions.limit_people.last_url + "-" + XKit.extensions.limit_people.last_group_id + "-container");

				}

			}

			if (m_post.owner !== XKit.extensions.limit_people.last_url) {
				if ((XKit.extensions.limit_people.last_grouped && !$(this).hasClass("xkit-limit-people-grouped-hidden") && (XKit.extensions.limit_people.last_count - 1) > after_v - 1) || force_group_this) {
					// console.log("** LIMIT PEOPLE: Closing the previous group.... [" + XKit.extensions.limit_people.last_url+ "]");
					$(".xkit-limit-people-group-" + XKit.extensions.limit_people.last_url + "-" + XKit.extensions.limit_people.last_group_id + "-container").not(".xkit-limit-people-grouped-hidden").last().after("<li class=\"post_container\"><div data-to-get=\"" +  (".xkit-limit-people-group-" + XKit.extensions.limit_people.last_url + "-" + XKit.extensions.limit_people.last_group_id)  + "\" data-group-id=\"" + XKit.extensions.limit_people.last_group_id + "\" class=\"xkit-limit-people-grouped-warning xkit-limit-people-opener\">Show " + ((XKit.extensions.limit_people.last_count - after_v) + 1) + " more by " + XKit.extensions.limit_people.last_url + "</div></div>");
				}
				// console.log("** LIMIT PEOPLE: Generating new group.... [" + m_post.owner + "]");
				XKit.extensions.limit_people.last_url = m_post.owner;
				XKit.extensions.limit_people.last_count = 0;
				XKit.extensions.limit_people.last_group_id = XKit.tools.random_string();
				XKit.extensions.limit_people.last_grouped = false;
			} else {
				// console.log("** LIMIT PEOPLE: Continuing from the last group. [" + XKit.extensions.limit_people.last_url + "]");
				XKit.extensions.limit_people.last_count++;
				XKit.extensions.limit_people.last_grouped = true;
			}

			$(this).parent().addClass("xkit-limit-people-group-" + XKit.extensions.limit_people.last_url + "-" + XKit.extensions.limit_people.last_group_id).addClass("xkit-limit-people-group-" + XKit.extensions.limit_people.last_url + "-" + XKit.extensions.limit_people.last_group_id + "-container");

			if (XKit.extensions.limit_people.last_count >= after_v) {
				$(this).attr('data-old-classes', $(this).attr('class'));
				$(this).attr('class', "xkit-limit-people-grouped-hidden");
				$(this).parent().addClass("xkit-limit-people-grouped-hidden");
			}

		});

		if (size_changed) {

			XKit.extensions.limit_people.call_tumblr_resize();

		}


	},

	call_tumblr_resize: function() {

		XKit.tools.add_function(function() {
			Tumblr.Events.trigger("DOMEventor:updateRect");
		}, true, "");

	},

	destroy: function() {
		this.running = false;
		XKit.post_listener.remove("limit_people");
	}

});
