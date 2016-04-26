//* TITLE Old Sidebar **//
//* VERSION 1.1.6 **//
//* DESCRIPTION Get the sidebar back **//
//* DEVELOPER estufar **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.estufars_sidebar_fix = new Object({
	
	running: false,
	
	preferences: {
		"dashonly": {
			text: "Only run on the dashboard",
			default: false,
			value: false
		}
	},
	
	run: function() {
		XKit.tools.init_css("estufars_sidebar_fix");
		this.running = true;
		
		if (XKit.extensions.estufars_sidebar_fix.preferences.dashonly.value) {
			if (document.location.href.indexOf('://www.tumblr.com/dashboard') === -1) {
				return;
			}
		} else {
			var disallowedurls = [
				"://www.tumblr.com/explore",
				"://www.tumblr.com/search",
				"://www.tumblr.com/following",
				"/reblog",
				"://www.tumblr.com/help",
				"://www.tumblr.com/support",
				"://www.tumblr.com/docs",
				"://www.tumblr.com/developers",
				"://www.tumblr.com/about",
				"://www.tumblr.com/themes",
				"://www.tumblr.com/policy",
				"://www.tumblr.com/jobs",
				"://www.tumblr.com/apps",
				"://www.tumblr.com/logo",
				"://www.tumblr.com/business",
				"://www.tumblr.com/buttons",
				"://www.tumblr.com/press",
				"://www.tumblr.com/security"
			];
			for (var i = 0; i < disallowedurls.length; i++) {
				if (document.location.href.indexOf(disallowedurls[i]) !== -1) {
					return;
				}
			}
		}
		
		var account = document.getElementById("account_button");
		account.click();
		var popover = document.getElementsByClassName("popover--account-popover")[0];
		var sidebar = document.getElementById("right_column");
		popover.childNodes[0].classList.add("estufars_sidebar_fix");
		sidebar.insertBefore(popover.childNodes[0], sidebar.firstChild);
		account.style.display = "none";
		// this needs to be delayed a second for some reason
		window.setTimeout(function() {
			document.querySelector(".tab_nav_account.active").click();
		}, 1000);
	},
	
	destroy: function() {
		XKit.tools.remove_css("estufars_sidebar_fix");
		this.running = false;
		
		var account = document.getElementById("account_button");
		var sidebar = document.getElementsByClassName("estufars_sidebar_fix")[0];
		account.style.display = "inline-block";
		var popover = document.getElementsByClassName("popover--account-popover")[0];
		popover.insertBefore(sidebar, popover.firstChild);
		account.click();
		popover.style.opacity = "0";
		popover.style.display = "block";
		account.click();
		window.setTimeout(function() {
			popover.style.opacity = "1";
		}, 500);
	}
	
});
