//* TITLE Old Blue **//
//* VERSION 0.0.2 **//
//* DESCRIPTION No more dark blue background! **//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.old_blue = new Object({

	running: false,

	run: function() {
		this.running = true;
		$("body").removeClass("flag--accessibility-design-update");
	},

	destroy: function() {
		this.running = false;
		$("body").addClass("flag--accessibility-design-update");
	}

});