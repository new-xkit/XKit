//* TITLE XKit Installer **//
//* VERSION 6.9.7 **//
//* DESCRIPTION Lets you install XKit on your computer. **//
//* DEVELOPER STUDIOXENIX **//
XKit.extensions.xkit_installer = new Object({

	running: false,
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
		'xcloud'
	],

	run: function() {

		this.running = true;

		XKit.window.show("Installing XKit", "<div id=\"xkit-install-process\" style=\"font-weight: bold;\">Starting installation...</div>Please do not navigate away from this page." + XKit.progress.add("installation"), "info");

		XKit.extensions.xkit_installer.next();

	},

	next: function() {

		if (XKit.extensions.xkit_installer.installed >= XKit.extensions.xkit_installer.to_install.length) {
			// Installation is complete I think!
			XKit.progress.value("installation", 100);
			XKit.installed.remove("xkit_installer");
			XKit.window.show("Thanks for installing me!",
				"<b>Installation of XKit is complete.</b><br/>" +
				"After refreshing the page, the X icon will show up on the header next to the account button. " +
				"From there, you can customize XKit to your liking and get new extensions.",

				"info",

				'<a id="xkit-restart-and-use" class="xkit-button default">Refresh page and start using XKit</a>' +
				'<div id="xkit-corrupt-profile-help" class="xkit-button">XKit keeps re-installing itself?</div>'
			);
			XKit.tools.set_setting("xkit_installation_complete", "true");

			$("#xkit-restart-and-use").click(function() {
				location.reload(true);
				$(this).addClass("disabled");
				$(this).html("Please wait...");
			});

			$("#xkit-corrupt-profile-help").click(function() {
				var browser = XKit.browser();

				XKit.window.show("Corrupt Profile",
					"<b>If you are receiving error codes mentioning corrupt or missing files while installing or running XKit, it's because your " + browser.name + " user profile file is corrupt.</b><br><br>" +
					"There are a few reasons why this might happen, such as performing a system restore, downgrading your browser or hardware failure.<br><br>" +
					"Unfortunately, this is a problem you will have to fix.",

					"info",

					'<div id="xkit-fix-corruption" class="xkit-button default">How do I fix it?</div>' +
					'<div id="xkit-close-message" class="xkit-button">I know what to do</div>'
				);

				$("#xkit-fix-corruption").click(function() {
					var sync, link;
					if (browser.chrome) {
						sync = " Google";
						link = "https://support.google.com/chrome/answer/2364824";
					} else if (browser.firefox) {
						sync = " Firefox Sync";
						link = "https://support.mozilla.org/en-US/kb/profile-manager-create-and-remove-firefox-profiles";
					} else if (browser.safari) {
						sync = "n iCloud";
					} else if (browser.opera) {
						sync = "n Opera";
					}
					XKit.window.show("Corrupt Profile",
						"<b>If XKit never successfully installs</b>, you'll need to create a fresh user profile.<br>" +
						"If your data (i.e. bookmarks, passwords) is not synchronised up to a" + sync + " account, you'll want to export or synchronise it now.<br><br>" +
						"Next, you'll want to " + (link ? '<a href="' + link + '" target="_blank">' : "") + "create a new profile" + (link ? "</a>" : "") + ", and then try installing New XKit again on it.<br>" +
						"If this doesn't work or isn't possible, you may need to reset or reinstall your browser.<br><br>" +
						"<b>If XKit only occasionally resets</b>, it may be down to hardware failure or your browser is handling crashes badly. " +
						"We can't give accurate advice on preventing this - just be sure to synchronise your settings to XCloud often." +
						(browser.firefox ? "<br>If you're using 32-bit Firefox, it's worth trying to upgrade to 64-bit, as it seems less prone to data loss." : ""),

						"info", '<div id="xkit-close-message" class="xkit-button default">OK</div>', true
					);
				});
			});

			return;
		}

		var percentage = Math.round((100 * XKit.extensions.xkit_installer.installed) / (XKit.extensions.xkit_installer.to_install.length));
		XKit.progress.value("installation", percentage);

		var to_install = XKit.extensions.xkit_installer.to_install[XKit.extensions.xkit_installer.installed];
		console.log("Will be installing " + to_install);
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
				new Function(mdata.script + "\n//# sourceURL=xkit/" + mdata.id + ".js")();
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
