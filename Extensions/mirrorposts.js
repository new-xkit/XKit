//* TITLE Mirror Button **//
//* VERSION 1.0.1 **//
//* DESCRIPTION	A button to easily backup posts **//
//* DETAILS This extension provides a button that will create a mirror of a post on either archive.org or archive.is **//
//* DEVELOPER Legoben **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.mirrorposts = new Object({

	running: false,

	preferences: {
		"archiveis": {
			text: "Use archive.is instead of The WayBack Machine",
			default: false,
			value: false
		},
		"menu": {
			text: "Create a mirror button below each post instead of having it in the share menu",
			default: false,
			value: false
		}
	},


	run: function() {
		this.running = true;
		XKit.tools.init_css("mirrorposts");
		XKit.post_listener.add("archivebutton_addButton", XKit.extensions.mirrorposts.addButton);
		XKit.extensions.mirrorposts.addButton();

	},

	destroy: function() {
		XKit.post_listener.remove("archivebutton_addButton");
		XKit.tools.remove_css("mirrorposts");
		$(".archivebutton-button").remove();
		
		$(".archivebutton_applied .share_social_button").unbind();
		$(".archivebutton_applied").removeClass("archivebutton_applied");
		
		
		this.running = false;

	},

	addButton: function() {
		$(".post").not(".archivebutton_applied").each(function() {
			$(this).addClass("archivebutton_applied");


			var posturl = $(".post_permalink", this).attr("href");

			var archiveurl;
			if (XKit.extensions.mirrorposts.preferences.archiveis.value) {
				archiveurl = "https://archive.is/?run=1&url=" + encodeURIComponent(posturl);
			} else {
				archiveurl = "https://web.archive.org/save/" + posturl;
			}


			if (XKit.extensions.mirrorposts.preferences.menu.value) {

				var button = $("<div></div>");
				$(button).addClass("post_control archivebutton-button");
				$(button).attr("archiveurl", archiveurl);
				$(button).attr("title", "Mirror Button");
				$(button).click(function() {
					window.open(archiveurl, '_blank');
				});
				$(".post_controls_inner", this).prepend(button);
				
			} else {
				$(".share_social_button", this).click(function() {
					var menuitem = $('<li class="popover_menu_item"><a class="popover_menu_item_anchor">Archive this post</a></li>');
					$("a", menuitem).attr("href", archiveurl);
					$("a", menuitem).attr("target", "_blank");

					setTimeout(function() { //Make sure the pop-up has popped up
						$(".share_reddit", "#dashboard_index > div.popover--post-share-popover").after(menuitem);
					}, 10);
				});
			}

		});
	}

});
