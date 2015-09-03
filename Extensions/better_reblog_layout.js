//* TITLE Better Reblog Layout **//
//* VERSION 1.1 **//
//* DESCRIPTION	Adds much needed spacing to reblogs on your dashboard. **//
//* DEVELOPER macleodsawyer **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.better_reblog_layout = new Object({

	running: false,
	
	preferences: {
		'sep0': {
            text: 'Options',
            type: 'separator'
        },
        "normal": {
			text: "Move reblog content to the right (under the username, not avatar)",
			default: true,
			value: true
		},
		"add_border": {
			text: "Add border to the left",
			default: false,
			value: false
		},
		"remove_user_names": {
			text: "Remove usernames",
			default: false,
			value: false
		},
		"remove_avatars": {
			text: "Remove avatars",
			default: false,
			value: false
		},
	},

	run: function() {
		this.running = true;
		
		if (XKit.extensions.better_reblog_layout.preferences.normal.value === true) {
	       XKit.tools.add_css(" .reblog-content {margin-left:35px;}", "better_reblog_layout_normal");
	    }
	    
	    if (XKit.extensions.better_reblog_layout.preferences.add_border.value === true) {
	       XKit.tools.add_css(" .reblog-list-item .reblog-content {border-left: 1px solid #E7E7E7;padding-left: 10px;} .post.is_regular .tmblr-full > img, .post.is_text .tmblr-full > img, .post.is_note .tmblr-full > img, .post.is_photo .tmblr-full > img, .post.is_photoset .tmblr-full > img, .post.is_link .tmblr-full > img, .post.is_audio .tmblr-full > img, .post.is_video .tmblr-full > img, .post.is_quote .tmblr-full > img, .post.is_answer .tmblr-full > img {padding: 0 20px}", "better_reblog_layout_add_border");
	    }
	    
	    if (XKit.extensions.better_reblog_layout.preferences.remove_user_names.value === true) {
	       XKit.tools.add_css(" .reblog-tumblelog-name {display:none;} .reblog-list-item .reblog-header {margin-bottom: 0;} .reblog-content {margin-left:35px;} .reblog-title {margin-top:25px;}", "better_reblog_layout_remove_user_names");
	    }
	    
	    if (XKit.extensions.better_reblog_layout.preferences.remove_avatars.value === true) {
	       XKit.tools.add_css(" .reblog-avatar {display:none !important;} .reblog-header {padding-left: 0px !important;}", "better_reblog_layout_remove_avatars");
	    }
		
	},
	

	destroy: function() {
		this.running = false;		
		
		XKit.tools.remove_css("better_reblog_layout_normal");
		XKit.tools.remove_css("better_reblog_layout_add_border");
		XKit.tools.remove_css("better_reblog_layout_remove_user_names");
		XKit.tools.remove_css("better_reblog_layout_remove_avatars");
	}

});
