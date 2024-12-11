//* TITLE Old Blue **//
//* VERSION 2.1.6 **//
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

						--deprecated-accent: 82, 158, 204;
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

						--chrome: rgba(54, 70, 93, 1);
						--chrome-panel: rgba(64.05, 79.25, 101.1);
						--chrome-panel-border: rgba(255, 255, 255, 0.05);
						--chrome-tint: rgba(255, 255, 255, 0.05);
						--chrome-tint-strong: rgba(255, 255, 255, 0.1);
						--chrome-tint-heavy: rgba(255, 255, 255, 0.15);
						--chrome-mobile: rgba(54, 70, 93, 1);
						--chrome-fg: rgba(255, 255, 255, 1);
						--chrome-fg-secondary: rgba(174.6, 181, 190.2);
						--chrome-fg-tertiary: rgba(134.4, 144, 157.8);
						--accent: rgba(82, 158, 204, 1);
						--accent-fg: rgba(68, 68, 68, 1);
						--accent-fg-light: rgba(255, 255, 255, 1);
						--accent-hover: rgba(116.6, 177.4, 214.2);
						--accent-pressed: rgba(151.2, 196.8, 224.4);
						--accent-tint: rgba(82, 158, 204, 0.1);
						--accent-tint-strong: rgba(82, 158, 204, 0.2);
						--accent-tint-heavy: rgba(82, 158, 204, 0.3);
						--content-panel: rgba(255, 255, 255, 1);
						--content-panel-border: rgba(255, 255, 255, 0);
						--content-tint: rgba(54, 70, 93, 0.05);
						--content-tint-strong: rgba(54, 70, 93, 0.1);
						--content-tint-heavy: rgba(54, 70, 93, 0.15);
						--content-mobile-container: rgba(249, 249.5, 250.1);
						--content-fg: rgba(68, 68, 68, 1);
						--content-fg-secondary: rgba(134.4, 144, 157.8);
						--content-fg-tertiary: rgba(174.6, 181, 190.2);
						--color-panel-border: rgba(255, 255, 255, 0);
						--color-tint: rgba(68, 68, 68, 0.1);
						--color-tint-strong: rgba(68, 68, 68, 0.15);
						--color-tint-heavy: rgba(68, 68, 68, 0.2);
						--color-fg: rgba(68, 68, 68, 1);
						--color-fg-secondary: rgba(68, 68, 68, 0.8);
						--color-fg-tertiary: rgba(68, 68, 68, 0.6);
						--color-fg-light: rgba(255, 255, 255, 1);
						--color-fg-light-secondary: rgba(255, 255, 255, 0.8);
						--color-fg-light-tertiary: rgba(255, 255, 255, 0.6);
						--image-bg: rgba(68, 68, 68, 1);
						--image-panel-border: rgba(255, 255, 255, 0);
						--image-tint: rgba(68, 68, 68, 0.4);
						--image-tint-strong: rgba(68, 68, 68, 0.5);
						--image-tint-heavy: rgba(68, 68, 68, 0.6);
						--image-fg: rgba(255, 255, 255, 1);
						--image-fg-secondary: rgba(255, 255, 255, 0.8);
						--image-fg-tertiary: rgba(255, 255, 255, 0.6);
						--side-menu: rgba(54, 70, 93, 1);
						--side-menu-shadow: rgba(255, 255, 255, 0.1);
						--top-menu: rgba(54, 70, 93, 1);
						--top-menu-shadow: rgba(255, 255, 255, 0.1);
						--modal: rgba(255, 255, 255, 1);
						--modal-border: rgba(54, 70, 93, 0.1);
						--tool-tip: rgba(68, 68, 68, 1);
						--tool-tip-text: rgba(255, 255, 255, 1);
						--overlay-tint: rgba(54, 70, 93, 0.2);
						--overlay-tint-strong: rgba(54, 70, 93, 0.6);
						--overlay-tint-heavy: rgba(54, 70, 93, 0.8);
						--unread-tint: rgba(82, 158, 204, 0.05);
						--unread-tint-hover: rgba(82, 158, 204, 0.1);
						--badge-icon: rgba(255, 255, 255, 1);
						--badge-text: rgba(68, 68, 68, 1);
						--chrome-ui: rgba(82, 158, 204, 1);
						--chrome-ui-hover: rgba(116.6, 177.4, 214.2);
						--chrome-ui-pressed: rgba(151.2, 196.8, 224.4);
						--chrome-ui-focus: rgba(82, 158, 204, 1);
						--chrome-ui-fg: rgba(68, 68, 68, 1);
						--chrome-ui-fg-secondary: rgba(68, 68, 68, 0.8);
						--chrome-ui-fg-tertiary: rgba(68, 68, 68, 0.6);
						--chrome-ui-toggle: rgba(255, 255, 255, 1);
						--chrome-danger: rgba(232.2, 158.4, 140.4);
						--chrome-success: rgba(153.6, 214.8, 184.8);
						--chrome-education: rgba(202.2, 177, 218.4);
						--chrome-blue: rgba(151.2, 196.8, 224.4);
						--chrome-purple: rgba(202.2, 177, 218.4);
						--chrome-pink: rgba(171.6, 178.8, 184.2);
						--chrome-red: rgba(232.2, 158.4, 140.4);
						--chrome-orange: rgba(247.2, 193.8, 129.6);
						--chrome-yellow: rgba(241.2, 231, 135.6);
						--chrome-green: rgba(153.6, 214.8, 184.8);
						--content-ui: rgba(54, 70, 93, 1);
						--content-ui-hover: rgba(74.1, 88.5, 109.2);
						--content-ui-pressed: rgba(94.2, 107, 125.4);
						--content-ui-focus: rgba(82, 158, 204, 1);
						--content-ui-fg: rgba(255, 255, 255, 1);
						--content-ui-fg-secondary: rgba(174.6, 181, 190.2);
						--content-ui-fg-tertiary: rgba(134.4, 144, 157.8);
						--content-ui-toggle: rgba(255, 255, 255, 1);
						--content-danger: rgba(130.2, 56.4, 38.4);
						--content-success: rgba(51.6, 112.8, 82.8);
						--content-education: rgba(100.2, 75, 116.4);
						--content-blue: rgba(49.2, 94.8, 122.4);
						--content-purple: rgba(100.2, 75, 116.4);
						--content-pink: rgba(69.6, 76.8, 82.2);
						--content-red: rgba(130.2, 56.4, 38.4);
						--content-orange: rgba(145.2, 91.8, 27.6);
						--content-yellow: rgba(139.2, 129, 33.6);
						--content-green: rgba(51.6, 112.8, 82.8);
						--color-ui: rgba(68, 68, 68, 1);
						--color-ui-hover: rgba(68, 68, 68, 0.9);
						--color-ui-pressed: rgba(68, 68, 68, 0.8);
						--color-ui-focus: rgba(68, 68, 68, 1);
						--color-ui-fg: rgba(255, 255, 255, 1);
						--color-ui-fg-secondary: rgba(153.4, 153.4, 153.4);
						--color-ui-fg-tertiary: rgba(102.4, 102.4, 102.4);
						--color-ui-toggle: rgba(255, 255, 255, 1);
						--image-ui: rgba(255, 255, 255, 1);
						--image-ui-hover: rgba(255, 255, 255, 0.9);
						--image-ui-pressed: rgba(255, 255, 255, 0.8);
						--image-ui-accent: rgba(255, 255, 255, 1);
						--image-ui-fg: rgba(68, 68, 68, 1);
						--image-ui-fg-secondary: rgba(134.4, 144, 157.8);
						--image-ui-fg-tertiary: rgba(174.6, 181, 190.2);
						--image-ui-toggle: rgba(255, 255, 255, 1);
						--danger: rgba(217, 94, 64, 1);
						--danger-hover: rgba(173.6, 75.2, 51.2);
						--danger-pressed: rgba(130.2, 56.4, 38.4);
						--danger-tint: rgba(217, 94, 64, 0.1);
						--danger-tint-strong: rgba(217, 94, 64, 0.2);
						--danger-tint-heavy: rgba(217, 94, 64, 0.3);
						--success: rgba(86, 188, 138, 1);
						--success-hover: rgba(119.8, 201.4, 161.4);
						--success-pressed: rgba(153.6, 214.8, 184.8);
						--success-tint: rgba(86, 188, 138, 0.1);
						--success-tint-strong: rgba(86, 188, 138, 0.2);
						--success-tint-heavy: rgba(86, 188, 138, 0.3);
						--education: rgba(167, 125, 194, 1);
						--education-hover: rgba(184.6, 151, 206.2);
						--education-pressed: rgba(202.2, 177, 218.4);
						--education-tint: rgba(167, 125, 194, 0.1);
						--education-tint-strong: rgba(167, 125, 194, 0.2);
						--education-tint-heavy: rgba(167, 125, 194, 0.3);
						--brand-blue: rgba(82, 158, 204, 1);
						--brand-blue-hover: rgba(116.6, 177.4, 214.2);
						--brand-blue-pressed: rgba(151.2, 196.8, 224.4);
						--brand-blue-tint: rgba(82, 158, 204, 0.1);
						--brand-blue-tint-strong: rgba(82, 158, 204, 0.2);
						--brand-blue-tint-heavy: rgba(82, 158, 204, 0.3);
						--brand-purple: rgba(167, 125, 194, 1);
						--brand-purple-hover: rgba(184.6, 151, 206.2);
						--brand-purple-pressed: rgba(202.2, 177, 218.4);
						--brand-purple-tint: rgba(167, 125, 194, 0.1);
						--brand-purple-tint-strong: rgba(167, 125, 194, 0.2);
						--brand-purple-tint-heavy: rgba(167, 125, 194, 0.3);
						--brand-pink: rgba(116, 128, 137, 1);
						--brand-pink-hover: rgba(143.8, 153.4, 160.6);
						--brand-pink-pressed: rgba(171.6, 178.8, 184.2);
						--brand-pink-tint: rgba(116, 128, 137, 0.1);
						--brand-pink-tint-strong: rgba(116, 128, 137, 0.2);
						--brand-pink-tint-heavy: rgba(116, 128, 137, 0.3);
						--brand-red: rgba(217, 94, 64, 1);
						--brand-red-hover: rgba(224.6, 126.2, 102.2);
						--brand-red-pressed: rgba(232.2, 158.4, 140.4);
						--brand-red-tint: rgba(217, 94, 64, 0.1);
						--brand-red-tint-strong: rgba(217, 94, 64, 0.2);
						--brand-red-tint-heavy: rgba(217, 94, 64, 0.3);
						--brand-orange: rgba(242, 153, 46, 1);
						--brand-orange-hover: rgba(244.6, 173.4, 87.8);
						--brand-orange-pressed: rgba(247.2, 193.8, 129.6);
						--brand-orange-tint: rgba(242, 153, 46, 0.1);
						--brand-orange-tint-strong: rgba(242, 153, 46, 0.2);
						--brand-orange-tint-heavy: rgba(242, 153, 46, 0.3);
						--brand-yellow: rgba(232, 215, 56, 1);
						--brand-yellow-hover: rgba(236.6, 223, 95.8);
						--brand-yellow-pressed: rgba(241.2, 231, 135.6);
						--brand-yellow-tint: rgba(232, 215, 56, 0.1);
						--brand-yellow-tint-strong: rgba(232, 215, 56, 0.2);
						--brand-yellow-tint-heavy: rgba(232, 215, 56, 0.3);
						--brand-green: rgba(86, 188, 138, 1);
						--brand-green-hover: rgba(119.8, 201.4, 161.4);
						--brand-green-pressed: rgba(153.6, 214.8, 184.8);
						--brand-green-tint: rgba(86, 188, 138, 0.1);
						--brand-green-tint-strong: rgba(86, 188, 138, 0.2);
						--brand-green-tint-heavy: rgba(86, 188, 138, 0.3);
					}

					${old_font_size_rule}
				`, "old_blue");

				if (this.preferences.old_font.value) {
					XKit.tools.add_css(`
						.xkit--react {
							--font-family: "Helvetica Neue", "HelveticaNeue", Helvetica, Arial, sans-serif;
							--font-family-modern: "Helvetica Neue", "HelveticaNeue", Helvetica, Arial, sans-serif;
						}
						/* selectors which set font-weight: 350 (breaks Helvetica Neue on some systems) */
						.Vt7qF .wL4YA.jk3gM .UEULa, .vgRpB, .pdHCI, .Xz965, .pEHwj .yY2Oe .v_iz_, .pEHwj .yY2Oe .aQXxD,
						.vgL3J, .q9P6T, .gAJ73, .gpV8Q, .h7IR_, .ctBr6, .fBQsy, .h6QpP, .o5TqQ, .gty8w, .sG03a, .SuDWJ,
						.nhqrO.ldaI8, .I3pYl, .NjLa2, .YVaw6 .uJ0hL, .F0gXR, .ZRkRa, .FaPcn, .uPyPt, .mhABv,
						.YtLa6 .aPaHS, .YtLa6 .G6FrY, .NM1DN .pfmRm, .FzBTa .GpO9n, .c1xDI, .Rl1K_, .SCBLa, .yjhh2,
						.vSa8M, .xPEP2, .rB7hU, .RPMuM, .f8LOG, .uaMQw, .Jo8I3, .pYQdH .uHcx_, .Nq9JP, .Z7ew7, .amytk,
						.dJl65, .YmlZc, .KaTRm, .KPqE4 p.zDaqs, .YMD5o, .cYyad, .TZgeO, .Gt2Q9, .n63mn, .OmZD7,.RSZnt,
						.j8Eiw, .Hzn1C, .YmIEY, .wjhBM, .tSUo6, .NSF9b .vGsK0 .fhLhp, .zGDfg, .c6rjd .Oxjr8, .gDeru p,
						.Ks9nn .ZR5vI, .Rf1RJ, .gnxzg, .Q53Gq, .ueVRR, .IMMt_, .j2j0M, .afgMB, .HqY8o, .v38by .gSgTK,
						.cs2zK, .AKAFO .bOGfF, .AiALR .enHco .fgOG_, .mAUoH .Re2fk .nmfdY, .mAUoH .Re2fk .RRf6I,
						.HfAqf .YGy_k .vpmnx {
							font-weight: 400;
						}
					`, "old_blue");
				}
			}
		}
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("old_blue");
	}

});
