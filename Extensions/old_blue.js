//* TITLE Old Blue **//
//* VERSION 2.1.3 **//
//* DESCRIPTION No more dark blue background! **//
//* DETAILS Reverts the colour scheme and font to that of 2018 Tumblr. Overrides any Tumblr-provided color palettes. **//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.old_blue = new Object({

	running: false,

	preferences: {
		old_font: {
			text: "Use the old font family",
			default: true,
			value: true
		},
		old_font_size: {
			text: "Set the base font size back to 14px",
			default: false,
			value: false
		}
	},

	run: function() {
		this.running = true;
		if (XKit.interface.is_tumblr_page()) {
			if (!XKit.page.react) {
				XKit.tools.init_css("old_blue");
			} else {
				const old_font_family_rule = this.preferences.old_font.value ? '--font-family: "Helvetica Neue", "HelveticaNeue", Helvetica, Arial, sans-serif' : '';
				const old_font_size_rule = this.preferences.old_font_size.value ? ':root { --base-font-size: 14px !important; }' : '';

				XKit.tools.add_css(`
					.xkit--react {
						--rgb-white: 255, 255, 255;
						--rgb-white-on-dark: 191, 191, 191;
						--rgb-black: 68, 68, 68;

						--navy: 54, 70, 93;
						--red: 217, 94, 64;
						--orange: 242, 153, 46;
						--yellow: 232, 215, 56;
						--green: 86, 188, 138;
						--blue: 82, 158, 204;
						--purple: 167, 125, 194;
						--pink: 116, 128, 137;

						--accent: 82, 158, 204;
						--secondary-accent: 229, 231, 234;
						--follow: 243, 248, 251;

						--white: var(--rgb-white);
						--white-on-dark: var(--rgb-white-on-dark);
						--black: var(--rgb-black);

						--transparent-white-65: rgba(var(--rgb-white-on-dark), 0.65);
						--transparent-white-40: rgba(var(--rgb-white-on-dark), 0.4);
						--transparent-white-25: rgba(var(--rgb-white-on-dark), 0.25);
						--transparent-white-13: rgba(var(--rgb-white-on-dark), 0.13);
						--transparent-white-7: rgba(var(--rgb-white-on-dark), 0.07);

						--gray-65: rgba(var(--rgb-black), 0.65);
						--gray-40: rgba(var(--rgb-black), 0.4);
						--gray-25: rgba(var(--rgb-black), 0.25);
						--gray-13: rgba(var(--rgb-black), 0.13);
						--gray-7: rgba(var(--rgb-black), 0.07);

						${old_font_family_rule}
					}

					${old_font_size_rule}
				`, "old_blue");
			}
		}
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("old_blue");
	}

});
