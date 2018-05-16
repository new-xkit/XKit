//* TITLE Bubblr **//
//* VERSION 0.0.1 **//
//* DESCRIPTION Rotund! **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.bubblr = new Object({
	running: false,

	run: function() {
		this.running = true;
		XKit.tools.add_css("* { border-radius: 500px !important; }", "bubblr");
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("bubblr");
	}
});