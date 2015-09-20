//* TITLE Edible Reblogs **//
//* VERSION 1.0.1 **//
//* DESCRIPTION We are serious developers... **//
//* DETAILS ...with our priorities in order. Puts bread in the background of each post. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.edible_reblogs = new Object({

	running: false,

	run: function() {
		this.running = true;
		XKit.tools.init_css("edible_reblogs");
	},

	destroy: function() {
		XKit.tools.remove_css("edible_reblogs");
		this.running = false;
	}

});
