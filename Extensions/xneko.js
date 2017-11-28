//* TITLE XNeko **//
//* VERSION 1.2.2 **//
//* DESCRIPTION A cat for your dashboard! **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* DETAILS A free spirited Japanese cat for your dashboard.<br>It is based on the Neko application by Kenji Gotoh. **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.xneko = new Object({

	running: false,
	neko: {},
	mouse_x: 0,
	mouse_y: 0,
	slow: true,

	preferences: {
		"appearance": {
			text: "Appearance",
			default: "default",
			value: "default",
			type: "combo",
			values: [
				"Default Neko", "default",
				"Pink Neko", "pink",
				"Santa Neko", "santa",
				"Xenixlet Neko", "xenixlet",
			],
		},
		"cat_name": {
			text: "Your cat's name",
			type: "text",
			default: "Maneki-neko",
			value: "Maneki-neko"
		},
		"viewport": {
			text: "Stay in the window regardless of scrolling",
			default: true,
			value: true
		},
		"stay_away": {
			text: "Stay at least 10 pixels away from the cursor",
			default: true,
			value: true
		}
	},

	run: function() {
		this.running = true;

		XKit.tools.init_css("xneko");

		XKit.extensions.xneko.neko = {};
		XKit.extensions.xneko.neko.x = 0;
		XKit.extensions.xneko.neko.y = 0;
		XKit.extensions.xneko.neko.stopped = true;
		XKit.extensions.xneko.neko.energy = 100;
		XKit.extensions.xneko.neko.stand_count = 0;
		XKit.extensions.xneko.neko.sleeping = false;
		XKit.extensions.xneko.neko.direction_x = 0; // -1 left | 0 middle | 1 right
		XKit.extensions.xneko.neko.direction_y = 0; // -1 top  | 0 middle | 1 bottom
		XKit.extensions.xneko.neko.alt_sprite = false;

		XKit.extensions.xneko.neko.born = function() {
			$("body").append('<div id="xneko" class="">&nbsp;</div>');
			this.int = setTimeout(function() {
				// Do neko stuff here.
				XKit.extensions.xneko.think(XKit.extensions.xneko.neko);
			}, 200);
			$("#xneko").click(function() {
				XKit.notifications.add("Meow!", "ok");
				XKit.extensions.xneko.mouse_x = XKit.extensions.xneko.mouse_x + 60;
				XKit.extensions.xneko.think(XKit.extensions.xneko.neko, true);
			});
		};

		XKit.extensions.xneko.neko.die = function() {
			clearInterval(this.int);
			$("#xneko").remove();
		};

		XKit.extensions.xneko.neko.place = function(x, y) {
			this.x = x;
			this.y = y;
			$("#xneko").css("top", Math.round(y) + "px");
			$("#xneko").css("left", Math.round(x) + "px");
		};

		// Make the cat born.
		XKit.extensions.xneko.neko.born();

		// Center the cat.
		XKit.extensions.xneko.neko.place($(window).width() / 2 - 16, $(window).height() / 2 - 16);

		$(document).mousemove(function(e) {
			if (XKit.extensions.xneko.preferences.viewport.value) {
				XKit.extensions.xneko.mouse_x = e.clientX;
				XKit.extensions.xneko.mouse_y = e.clientY;
			} else {
				XKit.extensions.xneko.mouse_x = e.pageX;
				XKit.extensions.xneko.mouse_y = e.pageY;
			}

			if (XKit.extensions.xneko.preferences.stay_away.value) {
				XKit.extensions.xneko.mouse_x -= 15;
				XKit.extensions.xneko.mouse_y -= 15;
			}
		});

		$("#xneko").addClass(XKit.extensions.xneko.preferences.appearance.value);
		if (XKit.extensions.xneko.preferences.viewport.value) {
			XKit.tools.add_css("#xneko { position: fixed; }", "xneko_sticky");
		}
	},

	think: function(cat, force_mode) {

		var m_cat_stopped = false;
		var mc_diff = XKit.extensions.xneko.mouse_x - cat.x;
		if (mc_diff < 0) { mc_diff = -1 * mc_diff; }

		// Force update on Webkit.. No idea what is going on.
		$('#xneko').find("p").remove();
		$('#xneko').append("<p>&nbsp;</p>");

		if (force_mode) {
			clearInterval(cat.int);
			cat.energy = cat.energy + 60;
		}

		// Check X

		if (XKit.extensions.xneko.mouse_x >= cat.x) {
			// cat should go right.
			cat.direction_x = 1;
		} else {
			// cat should go left.
			cat.direction_x = -1;
		}

		if (XKit.extensions.xneko.preferences.stay_away.value === true) {
			if (mc_diff < 40) {
				cat.direction_x = 0;
			}
		} else {
			if (mc_diff < 15) {
				cat.direction_x = 0;
			}
		}

		// Check Y

		if (XKit.extensions.xneko.mouse_y >= cat.y) {
			// cat should go down.
			cat.direction_y = 1;
		} else {
			// cat should go up.
			cat.direction_y = -1;
		}

		mc_diff = XKit.extensions.xneko.mouse_y - cat.y;
		if (mc_diff < 0) { mc_diff = -1 * mc_diff; }
		if (mc_diff < 15) {
			cat.direction_y = 0;
		}

		// Update the sprite.
		cat.stopped = false;

		if (cat.direction_x === 1) {
			if (cat.direction_y === 1) {
				if (cat.alt_sprite === false) {
					$("#xneko").css("background-position", "0px -" + (12 * 32) + "px");
				} else {
					$("#xneko").css("background-position", "32px -" + (12 * 32) + "px");
				}
			}
			if (cat.direction_y === 0) {
				if (cat.alt_sprite === false) {
					$("#xneko").css("background-position", "0px -" + (13 * 32) + "px");
				} else {
					$("#xneko").css("background-position", "32px -" + (13 * 32) + "px");
				}
			}
			if (cat.direction_y === -1) {
				if (cat.alt_sprite === false) {
					$("#xneko").css("background-position", "0px -" + (14 * 32) + "px");
				} else {
					$("#xneko").css("background-position", "32px -" + (14 * 32) + "px");
				}
			}
		}

		if (cat.direction_x === 0) {
			if (cat.direction_y === 1) {
				if (cat.alt_sprite === false) {
					$("#xneko").css("background-position", "0px -" + (11 * 32) + "px");
				} else {
					$("#xneko").css("background-position", "32px -" + (11 * 32) + "px");
				}
			}
			if (cat.direction_y === 0) {
				if (cat.alt_sprite === false) {
					$("#xneko").css("background-position", "0px -" + (3 * 32) + "px");
				} else {
					$("#xneko").css("background-position", "0px -" + (3 * 32) + "px");
				}
				m_cat_stopped = true;
			}
			if (cat.direction_y === -1) {
				if (cat.alt_sprite === false) {
					$("#xneko").css("background-position", "0px -" + (15 * 32) + "px");
				} else {
					$("#xneko").css("background-position", "32px -" + (15 * 32) + "px");
				}
			}
		}

		if (cat.direction_x === -1) {
			if (cat.direction_y === 1) {
				if (cat.alt_sprite === false) {
					$("#xneko").css("background-position", "0px -" + (10 * 32) + "px");
				} else {
					$("#xneko").css("background-position", "32px -" + (10 * 32) + "px");
				}
			}
			if (cat.direction_y === 0) {
				if (cat.alt_sprite === false) {
					$("#xneko").css("background-position", "0px -" + (9 * 32) + "px");
				} else {
					$("#xneko").css("background-position", "32px -" + (9 * 32) + "px");
				}
			}
			if (cat.direction_y === -1) {
				if (cat.alt_sprite === false) {
					$("#xneko").css("background-position", "0px -" + (8 * 32) + "px");
				} else {
					$("#xneko").css("background-position", "32px -" + (8 * 32) + "px");
				}
			}
		}

		// Alternate between sprites.
		cat.alt_sprite = !cat.alt_sprite;

		// Check energy.
		var tmp_cat_health = cat.energy;
		if (cat.sleeping === true) {
			tmp_cat_health = 0;
		}

		if (tmp_cat_health === 0) {

			// cat needs sleep!
			cat.sleeping = true;
			cat.energy = cat.energy + 30;

			if (cat.energy >= 100) {
				if (cat.stopped === false) {
					cat.sleeping = false;
				}
				cat.energy = 100;
			}

			cat.stand_count = 0;

			if (cat.alt_sprite === true) {
				$("#xneko").css("background-position", "0px -" + (1 * 32) + "px");
			} else {
				$("#xneko").css("background-position", "32px -" + (1 * 32) + "px");
			}

			cat.int = setTimeout(function() { XKit.extensions.xneko.think(XKit.extensions.xneko.neko); }, 520);

		} else {

			if (m_cat_stopped === false) {

				if (cat.stopped === true) {
					cat.stopped = false;
					// alert!
					$("#xneko").css("background-position", "32px 0px");
					cat.energy = cat.energy - 1;
					cat.int = setTimeout(function() { XKit.extensions.xneko.think(XKit.extensions.xneko.neko); }, 320);
					return;
				}

				cat.place(cat.x + (8 * cat.direction_x), cat.y + (8 * cat.direction_y));
				cat.energy = cat.energy - 1;
				cat.stand_count = 0;
				cat.int = setTimeout(function() { XKit.extensions.xneko.think(XKit.extensions.xneko.neko); }, 100);

			} else {

				if (cat.stopped === true) {
					$("#xneko").css("background-position", "32px -" + (3 * 32) + "px");
					cat.sleeping = true;
				}

				cat.stopped = true;
				cat.energy = cat.energy - 1;
				cat.stand_count = cat.stand_count + 1;

				if (cat.stand_count === 5 || cat.stand_count === 7) {
					$("#xneko").css("background-position", "32px -" + (2 * 32) + "px");
				}

				if (cat.stand_count === 4 || cat.stand_count === 6) {
					$("#xneko").css("background-position", "0px -" + (2 * 32) + "px");
				}

				if (cat.stand_count === 12 || cat.stand_count === 14) {
					$("#xneko").css("background-position", "32px -" + (6 * 32) + "px");
				}

				if (cat.stand_count === 13 || cat.stand_count === 15) {
					$("#xneko").css("background-position", "0px -" + (6 * 32) + "px");
				}

				if (cat.stand_count === 15 || cat.stand_count === 30) {
					$("#xneko").css("background-position", "32px -" + (3 * 32) + "px");
				}

				cat.int = setTimeout(function() { XKit.extensions.xneko.think(XKit.extensions.xneko.neko); }, 520);

			}

		}

	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("xneko");
		XKit.tools.remove_css("xneko_sticky");
		if (typeof XKit.extensions.xneko.neko !== "undefined") {
			if (typeof XKit.extensions.xneko.neko.die === "function") {
				XKit.extensions.xneko.neko.die();
			}
		}

	}

});
