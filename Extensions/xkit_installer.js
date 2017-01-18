//* TITLE XKit Installer **//
//* VERSION 6.9.4 **//
//* DESCRIPTION Lets you install XKit on your computer. **//
//* DEVELOPER STUDIOXENIX **//
XKit.extensions.xkit_installer = new Object({

	running: false,
	min_version: 6.9,
	installed: 0,
	to_install: [
		'xkit_main',
		'xkit_patches',
		'xkit_preferences',
		'xkit_updates',
		'xinbox',
		'one_click_postage',
		'one_click_reply',
		'tweaks',
		'go_to_dash'
	],

	run: function() {

		this.running = true;

		if (this.min_version > XKit.version) {
			// XKit.window.show("Framework version mismatch","<b>To be able to install XKit, you need XKit Framework version " + parseFloat(this.min_version) + ", but you have version " + XKit.version + ".</b><br/><br/>Please upgrade your XKit by going to the XKit website and try again or click on the Troubleshooting Help button below for more information.", "error","<div id=\"xkit-close-message\" class=\"xkit-button default\">OK</div><a href=\"http://www.xkit.info/troubleshooting\" class=\"xkit-button\">Troubleshooting Help</a>");
			// return;
		}

		XKit.window.show("Installing XKit", "<div id=\"xkit-install-process\" style=\"font-weight: bold;\">Starting installation..</div>Please do not navigate away from this page." + XKit.progress.add("installation"), "info");

		XKit.extensions.xkit_installer.next();

	},

	next: function() {

		if (XKit.extensions.xkit_installer.installed >= XKit.extensions.xkit_installer.to_install.length) {
			// Installation is complete I think!
			XKit.progress.value("installation", 100);
			XKit.installed.remove("xkit_installer");
			XKit.window.show("Thanks for installing me!", "<b>Installation of XKit is complete.</b><br/>After refreshing the page, the X icon will show up on the header next to the Inbox button. From there, you can customize XKit to your liking and get new extensions.", "info", "<a href=\"http://www.tumblr.com/dashboard\" id=\"xkit-restart-and-use\" class=\"xkit-button default\">Refresh page and start using XKit</a><a href=\"http://xkit-extension.tumblr.com/post/52742121604/chrome-system-restores-corrupt-profile-settings-and\" class=\"xkit-button\">XKit keeps re-installing itself?</a>");
			XKit.tools.set_setting("xkit_installation_complete", "true");
			$("#xkit-restart-and-use").click(function() {
				$(this).addClass("disabled");
				$(this).html("Please wait..");
			});
			return;
		}

		var percentage = Math.round((100 * XKit.extensions.xkit_installer.installed) / (XKit.extensions.xkit_installer.to_install.length));
		XKit.progress.value("installation", percentage);

		var to_install = XKit.extensions.xkit_installer.to_install[XKit.extensions.xkit_installer.installed];
		XKit.console.add("Will be installing " + to_install);
		$("#xkit-install-process").html("Installing package " + to_install + "...");

		XKit.install(to_install, function(mdata) {
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
						show_error_installation("Can't download " + to_install + ": Not found");
					} else {
						show_error_installation("Can't download " + to_install);
					}
				}
				return;
			}

			try {
				// Try evaling the script.
				// If it's working, then move to the next one.
				eval(mdata.script + "\n//# sourceURL=xkit/" + mdata.id + ".js");
				XKit.extensions.xkit_installer.installed++;
				XKit.extensions.xkit_installer.next();
			} catch (e) {
				show_error_installation("[Code: 102] Can't run " + to_install + ":<br/>" + e.message);
			}

		});

	},

	destroy: function() {
		this.running = false;
	}

});
