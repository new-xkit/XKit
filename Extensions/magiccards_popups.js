//* TITLE magiccards.info Popups **//
//* VERSION 0.1.5 **//
//* DESCRIPTION    Creates visual popups for links to cards on https://magiccards.info/. **//
//* DEVELOPER thebombzen **//
//* FRAME false **//
//* BETA true **//

XKit.extensions.magiccards_popups = {

	running: false,

	run: function() {
		this.running = true;
		if (XKit.interface.is_tumblr_page() === true) {
			XKit.extensions.magiccards_popups.addPopupsIfNecessary();
			XKit.tools.init_css("magiccards_popups");
			XKit.extensions.magiccards_popups.getObserver().observe(document.body, {
				attributes: false,
				childList: true,
				characterData: false
			});
		}
	},

	destroy: function() {
		this.running = false;
		XKit.extensions.magiccards_popups.removePopups();
		XKit.tools.remove_css("magiccards_popups");
		XKit.extensions.magiccards_popups.getObserver().disconnect();
	},

	magiccards_regex: new RegExp("^https?://magiccards.info/([^/]+)/([^/]+)/([^.]+).html"),

	addPopupsIfNecessary: function() {
		$("a").each(function() {
			var $atag = $(this);
			if ($atag.hasClass("magiccards_popups-tooltip-scanned") || $atag.hasClass("magiccards_popups-tooltip")) {
				return;
			}
			var href = XKit.extensions.magiccards_popups.replace_tumblr_redirects($atag.prop("href"));
			var match = XKit.extensions.magiccards_popups.magiccards_regex.exec(href);
			if (match) {
				var image_source = "https://magiccards.info/scans/" + match[2] + "/" + match[1] + "/" + match[3] + ".jpg";
				XKit.extensions.magiccards_popups.addPopup($atag, image_source);
			} else {
				$atag.addClass("magiccards_popups-tooltip-scanned");
			}
		});
	},

	observer: undefined,

	getObserver: function() {
		if (XKit.extensions.magiccards_popups.observer === undefined) {
			XKit.extensions.magiccards_popups.observer = new MutationObserver(XKit.extensions.magiccards_popups.addPopupsIfNecessary);
		}
		return XKit.extensions.magiccards_popups.observer;
	},


	tumblr_redirect_regexp: new RegExp("^https?://t.umblr.com/redirect\\?z=([^&]+)"),

	replace_tumblr_redirects: function(href) {
		var match = XKit.extensions.magiccards_popups.tumblr_redirect_regexp.exec(href);
		if (match) {
			return decodeURIComponent(match[1]);
		} else {
			return href;
		}
	},

	addPopup: function($atag, image_source) {
		var $img = $("<img>");
		$img.prop("src", image_source);
		$atag.addClass("magiccards_popups-tooltip");
		$atag.append($img);
		$atag.on("mousemove.magiccards_popups", XKit.extensions.magiccards_popups.moveToMouse($img));
	},

	moveToMouse: function($img) {
		return function(event) {
			var x = event.clientX, y = event.clientY;
			if (y > window.innerHeight / 2) {
				y -= 485;
			}
			$img.css({
				"top": (y + 20) + 'px',
				"left": (x + 20) + 'px'
			});
		};
	},

	removePopups: function() {
		$(".magiccards_popups-tooltip").each(function() {
			XKit.extensions.magiccards_popups.removePopup($(this));
		});
		$(".magiccards_popups-tooltip-scanned").each(function() {
			$(this).removeClass("magiccards_popups-tooltip-scanned");
		});
	},

	removePopup: function($atag) {
		$atag.children("img").last().remove();
		$atag.off("mousemove.magiccards_popups");
		$atag.removeClass("magiccards_popups-tooltip");
	}
};
