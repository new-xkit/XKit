//* TITLE Show transparency **//
//* VERSION 1.0.1 **//
//* DESCRIPTION Makes the backgrounds of images blue when you hover over them so you can see transparency without dragging the image. **//
//* DEVELOPER 9999years **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.transparent_img_hover = new Object({
	running: false,

	run: function() {
		this.running = true;
		XKit.tools.init_css("transparent_img_hover");
	},

	destroy: function() {
		XKit.tools.remove_css("transparent_img_hover");
		this.running = false;
	}
});
