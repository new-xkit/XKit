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
		XKit.tools.init_css("draft_saver");
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
				"5 minutes", 300,
				"15 minutes", 900,
				"30 minutes", 1800
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
		"sep1": {
			text: "Saved Drafts",
			type: "separator"
		}
	},

	save_current_content: function() {
		var self = XKit.extensions.draft_saver;
		var is_post_window_open = self.check_is_post_window_open();
		if (!is_post_window_open) {
			return;
		}
		try {
			var current_content = XKit.interface.post_window.get_content_html();
			if (current_content == "<p><br></p>") {
				return;
			}
			XKit.storage.set('draft_saver', Date.now(), current_content);
			self.clear_old_drafts();
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
	clear_old_drafts: function() {
		// There's no API call to delete specific keys from the storage, so we'll
		// clear all of them and then restore the ones we want to keep.
		var cache = XKit.storage.get_all('draft_saver');
		XKit.storage.clear('draft_saver');
		var keys = [];
		for (var key in cache) {
			if (cache.hasOwnProperty(key)) {
				keys.push(key);
			}
		}
		keys.sort(function(a, b){return b - a});
		if (keys.length > XKit.extensions.draft_saver.preferences.number_of_saves.value) {
			keys.length = XKit.extensions.draft_saver.preferences.number_of_saves.value;
		}
		keys.forEach(function(key) {
			XKit.storage.set('draft_saver', key, cache[key].value);
		});
	},
	check_is_post_window_open: function() {
		if ($(".post-form").length > 0) {
			return true;
		}
		return false;
	},

	cpanel: function(div) {
		var drafts = XKit.storage.get_all('draft_saver');
		console.log(drafts);
		var html = '';
		for (var key in drafts) {
		    if (drafts.hasOwnProperty(key)) {
		    	var date = XKit.extensions.draft_saver.build_time_from_key(key);
		    	var shortContent = $(drafts[key].value).text();
		    	if (shortContent.length > 100) {
		    		shortContent = shortContent.substr(0, 100) + '...';
		    	}
		    	html +=	"<div class=\"xkit-draft-saver-cp\">" +
					"<div class=\"xkit-draft-title\">" + date + " <a class='xkit-draft-expand'>Expand</a></div>" +
					"<div class='xkit-draft-content'>" + shortContent + "</div>" +
					"</div>";
		        console.log(key);
		        console.log(drafts[key]);
		        console.log(XKit.extensions.draft_saver.build_time_from_key(key));
		    }
		}
		div.append(html);
		$(".xkit-draft-saver-cp").click(function(e) {
			console.log(e)
			//XKit.extensions.draft_saver.add_bundle_ui();
		});
	},

	build_time_from_key: function(key) {
		var a = new Date(parseInt(key));
		var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
		var year = a.getFullYear();
		var month = months[a.getMonth()];
		var date = a.getDate();
		var hour = a.getHours();
		var min = a.getMinutes();
		var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min ;
		return time;
	},

	destroy: function(){
		this.running = false;
		$(".xkit-draft-saver-cp").unbind("click");
		clearInterval(this.interval);
	},
	add_bundle_ui: function(e) {

		XKit.window.show("Create new bundle","<b>Bundle Title</b><input type=\"text\" maxlength=\"40\" placeholder=\"eg: Doctor Who\" class=\"xkit-textbox\" id=\"xkit-quick-tags-add-title\"><b>Bundled Tags, comma separated</b><input type=\"text\" maxlength=\"250\" placeholder=\"eg: Doctor Who, Dr. Who, Non-Medical Tv Show Doctor\" class=\"xkit-textbox\" id=\"xkit-quick-tags-add-tags\">You have <b>" + remaining + "</b> bundle slots left.","question","<div class=\"xkit-button default\" id=\"xkit-quick-tags-create-bundle\">Create Bundle</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

		$("#xkit-quick-tags-create-bundle").click(function() {

			var title = $("#xkit-quick-tags-add-title").val();
			var tags = $("#xkit-quick-tags-add-tags").val();

			if ($.trim(title) === "") {
				alert("Please enter a title for your bundle.");
				return;
			}

			if ($.trim(tags) === "") {
				alert("Please enter the tags for your bundle.");
				return;
			}

			var m_object = {};
			m_object.title = title;
			m_object.tags = tags;
			XKit.extensions.quick_tags.tag_array.push(m_object);

			XKit.storage.set("quick_tags","user_tags", JSON.stringify(XKit.extensions.quick_tags.tag_array));

			XKit.window.close();
			XKit.extensions.quick_tags.cpanel(m_div);
			XKit.extensions.xkit_preferences.restart_extension("quick_tags");

		});

	}
});
