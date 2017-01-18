//* TITLE Color Quotes **//
//* VERSION 1.1.1 **//
//* DESCRIPTION Color Quotes has moved to Reblog Display Options **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//
//* HIDDEN true **//

XKit.extensions.colorquotes = new Object({

	running: false,

	preferences: {
		"sep-0": {
			text: "Color Quotes has been moved to Better Reblog Options",
			type: "separator"
		},
	},

	run: function() {
		this.running = true;

		XKit.window.show("Color Quotes has moved to Reblog Display Options",
            "<p>Because blockquotes are no longer native to the dashboard, " +
            "the functionality provided by Color Quotes is now in Reblog Display Options</p>" +
            "<br>Would you like to install Reblog Display Options?",
            "info",
            '<div id="xkit-install-br" class="xkit-button default">Install Reblog Display Options</div>' +
            '<div id="xkit-close-message" class="xkit-button">Don\'t install</div>');
		$("#xkit-install-br").click(function() {
			XKit.install("better_reblogs", function(mdata) {
				// defined in xkit.js
				/* globals show_error_installation */
				if (mdata.errors) {
					if (mdata.storage_error === true) {
						show_error_installation("[Code: 631] Can't store data on browser");
						return;
					}
					if (mdata.server_down === true) {
						show_error_installation("[Code: 101] Can't reach XKit servers");
					} else {
						if (mdata.file === "not_found") {
							show_error_installation("Can't download better_reblogs: Not found");
						} else {
							show_error_installation("Can't download better_reblogs");
						}
					}
					return;
				}

				XKit.installed.remove("colorquotes");
				window.location = window.location;
			});
		});
		$("#xkit-close-message").click(function() {
			XKit.installed.remove("colorquotes");
			window.location = window.location;
		});
	},

	destroy: function() {
		this.running = false;
	}

});
