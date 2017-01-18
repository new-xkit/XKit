//* TITLE View On Dash **//
//* VERSION 1.0.0 **//
//* DESCRIPTION View blogs on your dash **//
//* DEVELOPER new-xkit **//
//* DETAILS This is a preview version of an extension, missing most features due to legal/technical reasons for now. It lets you view the last 20 posts a person has made on their blogs right on your dashboard. If you have User Menus+ installed, you can also access it from their user menu under their avatar. **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.view_on_dash = new Object({

	running: false,
	apiKey: XKit.api_key,

	preferences: {
		"show_sidebar_button": {
			text: "Show View on Dash button on the sidebar",
			default: true,
			value: true
		},
		"shortcut": {
			text: "Enable the shortcut (alt + V) to open View on Dash",
			default: true,
			value: true
		},
	},

	key_down: function(e) {

		if (e.altKey === true) {
			if (e.which === 86) {
				XKit.extensions.view_on_dash.show_open();
			}
		}

	},

	run: function() {
		this.running = true;
		XKit.tools.init_css("view_on_dash");

		if (XKit.interface.where().queue === true) { return; }

		if (this.preferences.shortcut.value === true) {

			$(document).on('keydown', XKit.extensions.view_on_dash.key_down);

		}

		if (this.preferences.show_sidebar_button.value === true) {

			var xf_html = '<ul class="controls_section" id="view_on_dash_ul">' +
				'<li class="section_header selected">VIEW BLOGS</li>' +
				'<li class="no_push"><a href="#" id="view_on_dash_button">' +
					'<div class="hide_overflow">View on Dash<span class="sub_control link_arrow arrow_right"></span></div>' +
				'</a></li></ul>';
			$("ul.controls_section:eq(1)").before(xf_html);

			$("#view_on_dash_ul").click(function() {

				XKit.extensions.view_on_dash.show_open();

				return false;
			});

		}

	},

	show_open: function() {

		XKit.window.show("View on Dash", "Enter the username of the blog you would like to view <input type=\"text\" maxlength=\"50\" placeholder=\"Enter a URL (example: new-xkit-extension)\" class=\"xkit-textbox\" id=\"xkit-view-on-dash-input-url\" onkeydown=\"if (event.keyCode == 13) document.getElementById('xkit-view-on-dash-ok').click()\">", "question", "<div class=\"xkit-button default\" id=\"xkit-view-on-dash-ok\">Go!</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

		$("#xkit-view-on-dash-ok").click(function() {

			var to_add = $("#xkit-view-on-dash-input-url").val().toLowerCase();

			if ($.trim(to_add) === "") {
				XKit.window.close();
				return;
			}

			if (/^[a-zA-Z0-9\-]+$/.test(to_add) === false) {
				alert("Invalid username");
				return;
			}

			XKit.window.close();
			XKit.tools.add_function(XKit.extensions.view_on_dash.open_peepr, true, to_add);
		});

	},

	open_peepr: function() {
		Tumblr.Events.trigger("peepr-open-request", {
			tumblelog_name: add_tag
		});
	},

	destroy: function() {
		this.running = false;
		$(document).off('keydown', XKit.extensions.view_on_dash.key_down);
		$("#view_on_dash_ul").remove();
		try {
			XKit.extensions.show_more.remove_custom_menu("view_on_dash");
		} catch (e) {
			XKit.console.add("Can't remove custom menu, " + e.message);
		}
	}

});
