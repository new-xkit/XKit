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
		"made_by": {
			text: "Created by Macleod Sawyer (mxcleod on tumblr)",
			type: "separator"
		},
	},

	run: function() {
		this.running = true;
		
		if (XKit.extensions.better_reblog_layout.preferences.normal.value === true) {
	       XKit.tools.add_css(" .reblog-content {margin-left:35px;border-left: 1px solid #E7E7E7;padding-left: 10px;", "better_reblog_layout_normal");
	    }
	    
	    if (XKit.extensions.better_reblog_layout.preferences.add_border.value === true) {
	       XKit.tools.add_css(" .reblog-list-item .reblog-content {border-left: 1px solid #E7E7E7;padding-left: 10px;}", "better_reblog_layout_add_border");
	    }
	    
		
	},
	

	destroy: function() {
		this.running = false;		
		
		XKit.tools.remove_css("better_reblog_layout_normal");
		XKit.tools.remove_css("better_reblog_layout_add_border");
	}

});
