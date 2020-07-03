//* TITLE Old Blue **//
//* VERSION 2.1.0 **//
//* DESCRIPTION No more dark blue background! **//
//* DETAILS Reverts the colour scheme and font to that of 2018 Tumblr. Overrides any Tumblr-provided color palettes. **//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.old_blue = new Object({

	running: false,

	run: function() {
		this.running = true;
		if (XKit.interface.is_tumblr_page()) {
			if (!XKit.page.react) {
				XKit.tools.init_css("old_blue");
			} else {
				XKit.tools.add_css(`
					.xkit--react {
						--rgb-white: 255, 255, 255;
						--rgb-white-on-dark: 191, 191, 191;
						--rgb-black: 68, 68, 68;

						--navy: #36465d;
						--red: #d95e40;
						--orange: #f2992e;
						--yellow: #e8d738;
						--green: #56bc8a;
						--blue: #529ecc;
						--purple: #a77dc2;
						--pink: #748089;

						--accent: #529ecc;
						--secondary-accent: #e5e7ea;
						--follow: #f3f8fb;

						--white: rgb(var(--rgb-white));
						--white-on-dark: rgb(var(--rgb-white-on-dark));
						--black: rgb(var(--rgb-black));

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

						--font-family: "Helvetica Neue", "HelveticaNeue", Helvetica, Arial, sans-serif
					}

					:root {
						--base-font-size: 14px !important;
					}
				`, "old_blue");
			}
		}
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("old_blue");
	}

});
