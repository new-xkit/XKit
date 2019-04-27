//* TITLE Old Blue **//
//* VERSION 1.0.2 **//
//* DESCRIPTION No more dark blue background! **//
//* DETAILS Reverses the so-called accessibility update that causes so many headaches. **//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.old_blue = new Object({

	running: false,

	preferences: {
		"note": {
			text: `If you would like to use this as a userstyle in a faster-loading add-on, the CSS this extension uses can be found <a href="https://raw.githubusercontent.com/new-xkit/XKit/master/Extensions/old_blue.css" target="_blank">here</a>.`,
			type: "separator"
		}
	},

	cpanel: () => $(".xkit-extension-setting-separator").css("margin", 0).css("text-transform", "none"),

	run: function() {
		this.running = true;
		if (XKit.interface.is_tumblr_page()) {
			XKit.tools.init_css("old_blue");
		}
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("old_blue");
	}

});
