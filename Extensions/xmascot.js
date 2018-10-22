//* TITLE XMascot **//
//* VERSION 1.0.0 **//
//* DESCRIPTION A companion for your dashboard **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* DETAILS Have a companion with you as you scroll through the world of tumblr. **//
//* BETA false **//
//* SLOW false **//

XKit.extensions.xmascot = new Object({

	running: false,
	slow: false,

	mascots: [
		{
			name: "vriska",
			source: "https://www.homestuck.com/",
			imageUrl: "https://i.imgur.com/wfXrgKZ.png",
			height: "175px", // the height of the mascot
			width: "auto", // the width of the mascot
			downscaleOnly: false, // If width is auto it'll scale down to the sidebar size
			vOffset: "25px", // offset from the bottom
			hOffset: "25px", // offset from the left border
			zIndex: "-1",
			flipImage: true, // flip the image left to right
			flipSide: true, // put it on the right side instead of the left
			active: false,
			sourceLocked: true
		},
		{
			name: "ARTward",
			source: "Spongebob Squarepants",
			imageUrl: "https://68.media.tumblr.com/e6cacc306152470636c406361b0f6506/tumblr_mpmwiasLDr1rh8ms6o1_1280.png",
			height: "auto",
			width: "auto",
			downscaleOnly: true,
			vOffset: "5px",
			hOffset: "5px",
			zIndex: "-1",
			flipImage: true,
			flipSide: false,
			active: false,
			sourceLocked: true
		}
	],
	mascot: null,

	get_mascots: function() {
		var mascotStorage = XKit.storage.get("xmascot", "mascots", JSON.stringify(XKit.extensions.xmascot.mascots));

		var mascots = null;
		try {
			mascots = JSON.parse(mascotStorage);
		} catch (error) {
			console.log(error);
			mascots = [];
		}

		return mascots;
	},
	set_mascots: function(mascotArray) {
		if (!Array.isArray(mascotArray)) mascotArray = XKit.extensions.xmascot.mascots;
		XKit.storage.set("xmascot", "mascots", JSON.stringify(mascotArray));
	},

	set_mascot: function() {
		var mascots = XKit.extensions.xmascot.get_mascots();
		if (mascots.length < 1) {
			XKit.notifications.add("No Mascots set! Add some in the extension's settings", "warning");
			return;
		}

		var activeMascots = mascots.filter(function(item) {
			return item.active;
		});
		if (activeMascots.length < 1) {
			XKit.notifications.add("No Mascots active! Activate some in the extension's settings", "warning");
			return;
		}

		XKit.extensions.xmascot.mascot = activeMascots[Math.floor(Math.random() * activeMascots.length)];
		return XKit.extensions.xmascot.mascot;
	},

	set_mascot_div: function(mascot) {
		var mascotDiv = $("#xmascot");
		if (!mascotDiv.length) {
			mascotDiv = $("<div />").attr("id", "xmascot").append(
				$("<img />")
			);

			$("body").append(mascotDiv);
		}
		mascotDiv.find("img").attr("src", mascot.imageUrl);

		XKit.tools.add_css("#xmascot img { height: " + mascot.height + "; width: " + mascot.width + "; margin-bottom: " + mascot.hOffset + "; margin-" + (mascot.flipSide ? "right" : "left") + ": " + mascot.vOffset + "; z-index: " + mascot.zIndex + "; }", "xmascot");
		if (mascot.flipImage) XKit.tools.add_css("#xmascot img { -moz-transform: scaleX(-1); -o-transform: scaleX(-1); -webkit-transform: scaleX(-1); transform: scaleX(-1); filter: FlipH; -ms-filter: 'FlipH'; }", "xmascot");
		if (mascot.flipSide) XKit.tools.add_css("#xmascot img { right: 0 }", "xmascot");
		if (mascot.downscaleOnly && mascot.width.toLowerCase() === "auto") XKit.tools.add_css("#xmascot img { max-width: 450px; }", "xmascot");
	},

	run: function() {
		this.running = true;

		XKit.tools.init_css("xmascot");

		if (!Array.isArray) {
			Array.isArray = function(arg) {
				return Object.prototype.toString.call(arg) === '[object Array]';
			};
		}

		var mascot = XKit.extensions.xmascot.set_mascot();
		XKit.extensions.xmascot.set_mascot_div(mascot);
	},

	draw_mascot_div: function(m_div, mascots) {
		m_div.html("");

		if (!mascots) mascots = XKit.extensions.xmascot.get_mascots();

		var m_html =
			"<div class='xmascot'>" +
				"<div class='preview'><img></div>" +
				"<div class='name' />" +
			"</div>"
		;

		mascots.forEach(function(item, index) {
			var mascot_div = $(m_html);
			mascot_div.attr("data-index", index);

			mascot_div.find(".preview img").attr("src", item.imageUrl);
			mascot_div.find(".name").text(item.name);
			if (item.active) mascot_div.addClass("active");

			mascot_div.click(function() {
				var i = $(this).attr("data-index");
				mascots[i].active = !mascots[i].active;
				XKit.extensions.xmascot.set_mascots(mascots);
				$(this).toggleClass("active");
			});

			m_div.append(mascot_div);
		});
	},

	cpanel: function(m_div) {
		var mascots_div = $("<div />");
		mascots_div.attr("id", "xmascot-mascots");
		m_div.append(mascots_div);

		XKit.extensions.xmascot.draw_mascot_div(mascots_div);

		$("#xkit-extensions-panel-right").nanoScroller();
		$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("xmascot");
		$("#xmascot").remove();
	}

});
