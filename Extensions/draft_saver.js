//* TITLE       Draft Saver **//
//* DEVELOPER   new-xkit **//
//* VERSION     1.0.0 **//
//* DESCRIPTION Saves recent copies of unfinished posts in case your browser crashes **//
//* FRAME       false **//
//* SLOW        false **//
//* BETA        false **//

XKit.extensions.draft_saver = new Object({
	running: false,
	api_key: XKit.api_key,
	interval: null,

	run: function(){
		this.running = true;
		var number_of_saves = XKit.extensions.draft_saver.preferences.number_of_saves.value;
		var time_between_saves = XKit.extensions.draft_saver.preferences.number_of_saves.value;
		this.interval = setInterval(this.save_current_content, time_between_saves * 1000);
	},

	preferences: {
		time_between_saves: {
			text: "Save open drafts every",
			default: 15,
			value: 15,
			type: "combo",
			values: [
				"5 minutes", 5,
				"15 minutes", 15,
				"30 minutes", 30
			]
		},

		number_of_saves: {
			text: "Keep most recent ",
			default: 10,
			value: 10,
			type: "combo",
			values: [
				"5 saves", 5,
				"10 saves", 10,
				"20 saves", 30
			]
		},
	},

	save_current_content: function() {
		console.log('saving');
		var self = XKit.extensions.draft_saver;
		var is_post_window_open = self.check_is_post_window_open();
		if (!is_post_window_open) {
			return;
		}
		try {
			var current_content = XKit.interface.post_window.get_content_html();
		} catch (e) {
			XKit.window.show('Invalid editor type', 'ERROR: Draft Saver cannot currently get content from your editor type. '+
				'To continue using Draft Saver, click <a target="_blank" href="https://www.tumblr.com/settings/dashboard">here</a> '+
				'to edit your dashboard settings to use the rich text editor or HTML editor',
				'error', "<div id=\"xkit-close-message\" class=\"xkit-button\">OK</div>");
			var error = new Error("Editor Type");
			error.hide_popup = true;
			throw error;
		}
	},

	check_is_post_window_open: function() {
		if ($(".post-form").length > 0) {
			return true;
		}
		return false;
	},

	destroy: function(){
		this.running = false;
		clearInterval(this.interval);
	}
});
