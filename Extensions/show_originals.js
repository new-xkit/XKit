//* TITLE Show Originals **//
//* VERSION 1.2.3 **//
//* DESCRIPTION Only shows non-reblogged posts **//
//* DETAILS This is a really experimental extension allows you see original (non-reblogged) posts made by users on your dashboard. Please keep in mind that if you don't have enough people creating new posts on your dashboard, it might slow down your computer. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.show_originals = new Object({

	running: false,
	slow: true,

	status: "false",
	lbl_on: "on",
	lbl_off: "off",
	dont_show_mine: false,

	preferences: {
		only_on_dashboard: {
			text: "Only run when I'm on the dashboard",
			default: false,
			value: false
		}
	},

	run: function() {
		this.running = true;

		if (this.preferences.only_on_dashboard.value && !XKit.interface.where().dashboard) { return; }
		if (!XKit.interface.where().dashboard && !XKit.interface.where().channel) { return; }

		try {
			if (XKit.installed.is_running("tweaks")) {
				if (XKit.extensions.tweaks.preferences.dont_show_mine_on_dashboard.value) {
					XKit.extensions.show_originals.dont_show_mine = true;
				}
			}
		} catch(e) {
			console.log("show_originals -> can't read tweaks property: " + e.message);
			XKit.extensions.show_originals.dont_show_mine = false;
		}

		if (!$("body").hasClass("with_auto_paginate")) {
			if (XKit.storage.get("show_originals","shown_warning_about_scrolling","") !== "yass") {
				XKit.notifications.add("Show Originals only works when Endless Scrolling is turned on. Click here to learn more and disable this warning.", "warning", false, function() {
					XKit.window.show("Endless Scrolling required.","Show Originals require Endless Scrolling to be enabled on your dashboard. Click on the Tumblr Settings button (gear icon) on top-right of the page and then Dashboard > Enable endless scrolling.", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
					XKit.storage.set("show_originals","shown_warning_about_scrolling","yass");
				});
			}
			return;
		}

		XKit.extensions.show_originals.status = XKit.storage.get("show_originals","status","false");

		xf_html = '<ul class="controls_section" id="xshow_originals_ul">' +
			'<li class="section_header selected">SHOW ORIGINALS</li>' +
			'<li class="no_push" style="height:36px;"><a href="#" id="xshoworiginals_button">' +
			'<div class="hide_overflow" style="color: rgba(255, 255, 255, 0.5) !important; font-weight: bold; padding-left: 10px; padding-top: 8px;">Originals Only</div>' +
			'<div class="count" id="xshoworiginalsstatus" style="padding-top: 8px;">' + XKit.extensions.show_originals.lbl_off + '</div>' +
			'<div id="xshoworiginalsindicator">&nbsp;</div>' +
			'</a></li></ul>';
		$("ul.controls_section:first").before(xf_html);

		XKit.extensions.show_originals.update_button();

		$("#xshoworiginals_button").click(function() {
			XKit.extensions.show_originals.toggle();

			return false;
		});

		XKit.tools.init_css("show_originals");
		XKit.post_listener.add("show_originals", XKit.extensions.show_originals.do);
		XKit.extensions.show_originals.do();
	},

	update_button: function() {

		if (XKit.extensions.show_originals.status == "true") {
			$("#xshoworiginalsindicator").addClass("on");
			$("#xshoworiginalsstatus").html(XKit.extensions.show_originals.lbl_on);
		} else {
			$("#xshoworiginalsindicator").removeClass("on");
			$("#xshoworiginalsstatus").html(XKit.extensions.show_originals.lbl_off);
		}

	},

	toggle: function() {

		if (XKit.extensions.show_originals.status == "true") {
			XKit.extensions.show_originals.status = "false";
			XKit.extensions.show_originals.do(true);
		} else {
			XKit.extensions.show_originals.status = "true";
			XKit.extensions.show_originals.do(false);
		}

		XKit.extensions.show_originals.update_button();
		XKit.storage.set("show_originals", "status", XKit.extensions.show_originals.status);

	},

	added_css: false,

	do: function(force_shutdown) {

		if (XKit.extensions.show_originals.status == "false" || force_shutdown) {
			XKit.tools.remove_css("show_originals_on");
			XKit.extensions.show_originals.added_css = false;
			return;
		}

		XKit.extensions.show_originals.added_css = true;
		XKit.tools.add_css(" .post.is_reblog { display: none; }", "show_originals_on");

		XKit.extensions.show_originals.call_tumblr_resize();

	},

	call_tumblr_resize: function() {

		XKit.tools.add_function(function() {
			Tumblr.Events.trigger("DOMEventor:updateRect");
		}, true, "");

	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("show_originals");
		XKit.tools.remove_css("show_originals_on");
		$("#xshow_originals_ul").remove();
	}

});
