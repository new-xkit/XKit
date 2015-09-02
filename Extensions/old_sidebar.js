//* TITLE Old Sidebar **//
//* VERSION 1.1.0 **//
//* DESCRIPTION Get the sidebar back **//
//* DEVELOPER estufar **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.old_sidebar = new Object({
	
	running: false,
	
	preferences: {
		"dashonly": {
			text: "Only run on the dashboard",
			default: false,
			value: false
		}
	},
	
	run: function() {
		XKit.tools.init_css("old_sidebar");
		this.running = true;
		
		var movesidebar = true;
		if (XKit.extensions.old_sidebar.preferences.dashonly.value === true) {
			if (document.location.href.indexOf('://www.tumblr.com/dashboard') === -1) {
				movesidebar = false;
			}
		} else {
			var disallowedurls = ["://www.tumblr.com/explore", "://www.tumblr.com/search"];
			disallowedurls.forEach(function(s) {
				if (document.location.href.indexOf(s) !== -1) {
					movesidebar = false;
				}
			});
		}
		
		if (movesidebar) {
			var account = document.getElementById("account_button");
			account.click();
			var popover = document.getElementsByClassName("popover--account-popover")[0];
			var sidebar = document.getElementById("right_column");
			popover.childNodes[0].classList.add("old_sidebar");
			sidebar.insertBefore(popover.childNodes[0], sidebar.firstChild);
			account.style.display = "none";
			// this needs to be delayed a second for some reason
			window.setTimeout(function() {
				document.querySelector(".tab_nav_account.active").click();
			}, 1000);
		}
	},
	
	destroy: function() {
		XKit.tools.remove_css("old_sidebar");
		this.running = false;
		
		var account = document.getElementById("account_button");
		var sidebar = document.getElementsByClassName("old_sidebar")[0];
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
