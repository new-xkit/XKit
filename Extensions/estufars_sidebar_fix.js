//* TITLE Old Sidebar **//
//* VERSION 1.2.4 **//
//* DESCRIPTION Get the sidebar back **//
//* DEVELOPER estufar **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.estufars_sidebar_fix = new Object({

	running: false,

	done: false,

	preferences: {
		"dashonly": {
			text: "Only run on the dashboard",
			default: false,
			value: false
		}
	},

	run: function() {
		this.running = true;

		var version = XKit.tools.parse_version(XKit.version);
		if (XKit.browser().firefox && version.major === 7 && version.minor < 8) {
			console.warn("Refusing to run Old Sidebar on pre-58 Firefox due to pinned-target bug");
			return;
		}

		if (XKit.page.react) {
			this.run_react();
			return;
		}

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

		XKit.tools.init_css("estufars_sidebar_fix");

		function movesidebar() {
			var popover = $(".popover--account-popover")[0];
			var sidebar = document.getElementById("right_column");
			popover.childNodes[0].classList.add("estufars_sidebar_fix");
			sidebar.insertBefore(popover.childNodes[0], sidebar.firstChild);
			var account = document.getElementById("account_button");
			account.style.display = "none";
			// wait and then let tumblr know the menu is no longer active
			window.setTimeout(function() {
				document.querySelector(".tab_nav_account.active").click();
			}, 250);
		}

		if (!$(".popover--account-popover").length) {
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					var popover = $(".popover--account-popover")[0];
					if (mutation.addedNodes[0] == popover) {
						observer.disconnect();
						movesidebar();
					}
				});
			});
			observer.observe(document.body, {childList: true});
			var account = document.getElementById("account_button");
			account.click();
		} else {
			movesidebar();
		}

		this.done = true;
	},

	run_react: async function() {

		//test other pages later
		if (!XKit.interface.where().dashboard) { return; }

		if ($("#old_sidebar").length) { return; }

		await XKit.css_map.getCssMap();
		const homeMenu_sel = XKit.css_map.keyToCss('homeMenu');
		const menuContainer_sel = XKit.css_map.keyToCss('menuContainer');
		//const heading_sel = XKit.css_map.keyToCss('heading');
		//const navItem_sel = XKit.css_map.keyToCss('navItem');
		const accountBlogItem_sel = XKit.css_map.keyToCss('accountBlogItem');
		//const navLink_sel = XKit.css_map.keyToCss('navLink');

		// "keyboard shortcuts" and "change palatte" are broken right now, idk why!
		const menuitemlabel = await XKit.interface.translate('Menuitem');

		const react_css = `
			#old_sidebar {
				margin-left: 10px;
    			margin-right: 10px;
				border-radius: 3px;
				background: var(--white);
				overflow-y: auto;
				color: var(--black);
			}
			#old_sidebar li[role="${menuitemlabel}"] {
				display: none;
			}
			#old_sidebar_blogs_container {
				max-height: 265px;
    			overflow-y: scroll;
			}
		`;

		XKit.tools.add_css(react_css, "estufars_sidebar_fix");


		const account_aria_label = await XKit.interface.translate('Account');
		const $account_button = $(`button[aria-label="${account_aria_label}"]`);
		const $account_button_outer = $account_button.closest(menuContainer_sel);

		function movesidebar() {
			const $homeMenu = $(homeMenu_sel);
			const $sidebar = $(`<div id="old_sidebar" class="controls_section"></div>`)
				.prependTo($("#xkit_react_sidebar"));

			$sidebar.prepend($homeMenu);

			$account_button.css("opacity", "0.4");

			const $blogs_container = $(accountBlogItem_sel).first().parent();
			$blogs_container.attr("id", "old_sidebar_blogs_container");

			//fun with math just to make our initial sidebar height fit nicely on the screen
			const blogs_container_height = Math.max(265, $(window).height() - $blogs_container.offset().top - 50);
			$blogs_container.css("max-height", `${blogs_container_height}px`);

			// var account = document.getElementById("account_button");
			// account.style.display = "none";
			// // wait and then let tumblr know the menu is no longer active
			// window.setTimeout(function() {
			// 	document.querySelector(".tab_nav_account.active").click();
			// }, 250);
			setTimeout(function() {
				$account_button.click();
			}, 0);
		}

		if (!$(homeMenu_sel).length) {
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					var popover = $(homeMenu_sel)[0];
					if (mutation.addedNodes[0] == popover) {
						observer.disconnect();
						movesidebar();
					}
				});
			});
			observer.observe($account_button_outer[0], {childList: true, subtree: true});
			$account_button.click();
		} else {
			movesidebar();
		}

		this.done = true;
	},

	destroy: function() {
		XKit.tools.remove_css("estufars_sidebar_fix");
		this.running = false;

		if (XKit.page.react) {
			this.done = false;
			$("#old_sidebar").remove();
			//might need some more stuff in here
			return;
		}

		if (!this.done) { return; }
		this.done = false;
		var account = document.getElementById("account_button");
		var sidebar = document.getElementsByClassName("estufars_sidebar_fix")[0];
		account.style.display = "inline-block";
		var popover = $(".popover--account-popover")[0];
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
