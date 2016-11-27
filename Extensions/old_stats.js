//* TITLE Old Stats **//
//* VERSION 0.3.0 **//
//* DESCRIPTION  **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.old_stats = new Object({

	running: false,

	preferences: {
		"sep-0": {
			text: "Old Stats is now Old Sidebar",
			type: "separator"
		},
	},

	run: function() {
		this.running = true;
		if (!XKit.installed.check("estufars_sidebar_fix")) {
			XKit.install("estufars_sidebar_fix", function(mdata) {
				if (mdata.errors) {
					if (mdata.storage_error === true) {
						show_error_installation("[Code: 631] Can't store data on browser");
						return;
					}
					if (mdata.server_down === true) {
						show_error_installation("[Code: 101] Can't reach XKit servers");
					} else {
						if (mdata.file === "not_found") {
							show_error_installation("Can't download " + to_install + ": Not found");
						} else {
							show_error_installation("Can't download " + to_install);
						}
					}
					return;
				}
			});
		}
		XKit.installed.remove("old_stats");
		window.location = window.location;
	},

	destroy: function() {
		this.running = false;
	}

});
