//* TITLE Edible Reblogs **//
//* VERSION 1.0.5 **//
//* DESCRIPTION We are serious developers... **//
//* DETAILS ...with our priorities in order. Puts bread in literally everything. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.edible_reblogs = new Object({

	running: false,

	preferences: {
		bread_hell: {
			text: 'Make everything literally bread.',
			default: false,
			value: false
		}
	},

	run: function() {
		this.running = true;
		XKit.tools.init_css("edible_reblogs");

		// "Dear god :fearful:"
		if (XKit.extensions.edible_reblogs.preferences.bread_hell.value) {
			XKit.post_listener.add("bread_listener", XKit.extensions.edible_reblogs.breadify);
			XKit.extensions.edible_reblogs.breadify();
		}
	},

	breadify: function() {
		$("*:not(.bread)").addClass("bread");
	},

	destroy: function() {
		XKit.tools.remove_css("edible_reblogs");
		XKit.post_listener.remove("bread_listener");
		this.running = false;
		$("*").removeClass("bread");
	}

});
