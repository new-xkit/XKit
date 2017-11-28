//* TITLE Pokés **//
//* VERSION 0.11.4 **//
//* DESCRIPTION Gotta catch them all! **//
//* DETAILS Randomly spawns Pokémon on your dash for you to collect. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA true **//
//* SLOW true **//

XKit.extensions.pokes = {
	running: false,
	pokedex_url: "https://new-xkit.github.io/XKit/Extensions/dist/page/pokedex.json",

	preferences: {
		"allow_fullwidth": {
			text: "Allow spawning across the entire width of the page",
			default: "true",
			value: "true"
		},
		"sep0": {
			text: "Backgrounds",
			type: "separator"
		},
		"catch_backgrounds": {
			text: "Give Pokémon a background (for visibility)",
			default: false,
			value: false
		},
		"transp_background": {
			text: "Transparent Backgrounds",
			default: "true",
			value: "true"
		},
		"pokes_menu_header": {
			text: "Menu",
			type: "separator"
		},
	},

	run: function() {
		if (!window.location.href.match(/www.tumblr.com/)) return;
		this.running = true;
		XKit.tools.init_css('pokes');
		XKit.post_listener.add('pokes', XKit.extensions.pokes.checkEligibility);
		XKit.extensions.pokes.checkEligibility();
	},

	fetch_pokedex: function(callback, error) {
		if (!XKit.extensions.pokes.gist_cache) {
			GM_xmlhttpRequest({
				method: "GET",
				url: XKit.extensions.pokes.pokedex_url,
				json: true,
				onerror: function(response) {
					console.log("Poke data could not be retrieved. Skipping instance.");
					if (error) { error(response); }
				},
				onload: function(response) {
					var mdata = {};
					try {
						mdata = JSON.parse(response.responseText);
						XKit.extensions.pokes.gist_cache = mdata;
						callback(mdata);
					} catch (e) {
						console.log("Poke data received was not valid JSON. Skipping instance.");
						if (error) { error(response); }
					}
				}
			});
		} else {
			callback(XKit.extensions.pokes.gist_cache);
		}
	},

	checkEligibility: function() {
		$(".post_avatar:not(.poked):not(.unpokable)").each(function() {
			if (XKit.extensions.pokes.chanceGen()) {
				$(this).addClass("poked");
			} else {
				$(this).addClass("unpokable");
			}
		});

		$(".poked:not(.poke_spawned)").each(function() {
			var pokeNr = XKit.extensions.pokes.pokeGen();
			XKit.extensions.pokes.fetchPoke(pokeNr, $(this));
			$(this).addClass("poke_spawned");
		});
	},

	randomInt: function(min, max) {
		return Math.floor(Math.random() * (max - min + 1) + min);
	},

	parse_pokemon: function(mdata, db_nr, pokedThing) {
		var poke_name = mdata[db_nr].name;
		var poke_sprite = mdata[db_nr].sprite;
		var m_f_ratio = parseInt(mdata[db_nr].gender_rate);
		var rarity = parseInt(mdata[db_nr].rarity);

		var poke_gender = "undefined";
		if (m_f_ratio === -1) {
			poke_gender = "genderless";
		} else {
			var rnd_nr = Math.random();
			var male_ratio = (m_f_ratio / 8);
			if (rnd_nr <= male_ratio) {
				poke_gender = "female";
			} else {
				poke_gender = "male";
			}
		}

		var shiny_rnd = Math.random();
		var shiny_class = "";
		if (shiny_rnd <= (1 / 4096)) {
			shiny_class = " pokes_shiny";
			poke_sprite = mdata[db_nr].sprite_shiny || mdata[db_nr].sprite;
		}

		var rarityPicker = Math.floor(Math.random() * 255);
		if (rarityPicker >= 0 && rarityPicker <= rarity) {
			var poke_html;
			var poke_class;
			var xpos = XKit.extensions.pokes.randomInt(-($(window).width() / 3), ($(window).width() / 2) - 100);
			var ypos = XKit.extensions.pokes.randomInt(0, 600);

			if (XKit.extensions.pokes.preferences.catch_backgrounds.value) {
				if (XKit.extensions.pokes.preferences.transp_background.value) {
					poke_class = "poke_bg_transp";
				} else {
					poke_class = "poke_bg";
				}
			}

			if (XKit.extensions.pokes.preferences.allow_fullwidth.value) {
				poke_html = '<div class="poke ' + poke_class + shiny_class + '" data-pokeid="' + db_nr + '" data-pokename="' + poke_name + '" data-pokegender="' + poke_gender + '" style="left:' + xpos + 'px; margin-top:' + ypos + 'px;">' +
				'<img src="' + poke_sprite + '" alt="' + poke_name + '"/>' + '</div>';
			} else {
				poke_html = '<div class="poke fixed ' + poke_class + shiny_class + '" data-pokeid="' + db_nr + '" data-pokename="' + poke_name + '" data-pokegender="' + poke_gender + '" style="margin-top:' + ypos + 'px;">' +
				'<img src="' + poke_sprite + '" alt="' + poke_name + '"/>' + '</div>';
			}

			pokedThing.after(poke_html);
			pokedThing.parent().find(".poke").click(function(event) {
				if (XKit.storage.get("pokes", "pokemon_storage", "") === "") {
					XKit.storage.set("pokes", "pokemon_storage", "[]");
				}

				try {
					var storage_array = JSON.parse(XKit.storage.get("pokes", "pokemon_storage", ""));
					if (storage_array !== "") {
						var poke_id = $(this).data("pokeid");
						var caught_gender = $(this).data("pokegender");
						var caught_name = $(this).data("pokename");
						var poke_wiki_name = caught_name;

						if (caught_name.indexOf(" ") > -1) {
							var firstWord = caught_name.split(" ")[0];
							if (firstWord == "Mega" || firstWord == "Primal") {
								poke_wiki_name = caught_name.split(" ")[1];
							} else if (firstWord == "Cosplay") {
								poke_wiki_name = "Cosplay Pikachu";
							} else {
								poke_wiki_name = firstWord;
							}
						}

						storage_array.push({ id: poke_id, gender: caught_gender, shiny: $(this).hasClass("pokes_shiny") });
						XKit.storage.set("pokes", "pokemon_storage", JSON.stringify(storage_array));
						XKit.notifications.add("You caught a " + ($(this).hasClass("pokes_shiny") ? "shiny " : "") + caught_gender + " " + caught_name.charAt(0).toUpperCase() + caught_name.substr(1) + "!", "pokes", false, function() {
							window.open("http://bulbapedia.bulbagarden.net/wiki/" + poke_wiki_name);
						});
						$(this).hide();
					} else {
						XKit.window.show("Catching failed!", "Something went wrong trying to catch the Pokémon. Please try again.<br/><br/>Error code: PKMN-001", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
					}
				} catch (e) {
					XKit.window.show("Catching failed!", "Something went wrong trying to catch the Pokémon. Please try again.<br/><br/>Error code: PKMN-002", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
				}
			});
		} else {
			XKit.extensions.pokes.parse_pokemon(mdata, XKit.extensions.pokes.pokeGen(), pokedThing);
		}
	},

	fetchPoke: function(db_nr, pokedThing) {
		XKit.extensions.pokes.fetch_pokedex(function(mdata) {
			XKit.extensions.pokes.parse_pokemon(mdata, db_nr, pokedThing);
		});
	},

	chanceGen: function() {
		var rnd_nr = Math.floor(Math.random() * 101);
		if (rnd_nr >= 0 && rnd_nr <= 8) {
			return true;
		} else {
			return false;
		}
	},

	pokeGen: function() {
		return Math.floor(Math.random() * 889);
	},

	destroy: function() {
		this.running = false;
		XKit.post_listener.remove("pokes");
		$(".poke").remove();
	},

	rename_poke: function(index, nick, cb) {
		if (!cb) { cb = function() {}; }
		try {
			var storage_array = JSON.parse(XKit.storage.get("pokes", "pokemon_storage", ""));
			if (storage_array) {
				storage_array[index].nickname = nick;
				XKit.storage.set("pokes", "pokemon_storage", JSON.stringify(storage_array));
				cb();
			} else {
				XKit.window.show("Renaming failed!", "Something went wrong trying to rename the Pokémon. Please try again.<br/><br/>Error code: PKMN-003", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
			}
		} catch (e) {
			XKit.window.show("Renaming failed!", "Something went wrong trying to rename the Pokémon. Please try again.<br/><br/>Error code: PKMN-004", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
		}
	},

	delete_poke: function(index, cb) {
		if (!cb) { cb = function() {}; }
		try {
			var storage_array = JSON.parse(XKit.storage.get("pokes", "pokemon_storage", ""));
			if (storage_array) {
				storage_array.splice(index, 1);
				XKit.storage.set("pokes", "pokemon_storage", JSON.stringify(storage_array));
				cb();
			} else {
				XKit.window.show("Removing failed!", "Something went wrong trying to remove the Pokémon. Please try again.<br/><br/>Error code: PKMN-005", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
			}
		} catch (e) {
			XKit.window.show("Removing failed!", "Something went wrong trying to remove the Pokémon. Please try again.<br/><br/>Error code: PKMN-006", "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
		}
	},

	render_pokelist: function() {
		var m_html =
			'<div class="xkit-pokes-lightbox" style="opacity: 0">' +
			'<div class="xkit-pokes-pc">' +
					'<div class="xkit-pokes-pc-sorter">' +
              '<input type="radio" name="xkit-pokes-sort" class="xkit-pokes-sorter" id="chronological" title="Order of capture" checked="checked"></input>' +
              '<label for="chronological"></label>' +
              '<input type="radio" name="xkit-pokes-sort" class="xkit-pokes-sorter" id="alphabetical" title="Name"></input>' +
              '<label for="alphabetical"></label>' +
              '<input type="radio" name="xkit-pokes-sort" class="xkit-pokes-sorter" id="pokeid" title="Pokédex # ordering"></input>' +
              '<label for="pokeid"></label>' +
              '<input type="checkbox" class="xkit-pokes-sorter" id="reverse-toggle"></input>' +
              '<label for="reverse-toggle"></label>' +
					'</div>' +
				'<div class="xkit-pokes-pc-info">' +
					'<div class="gender"></div>' +
					'<div class="nickname"></div>' +
					'<input class="xkit-textbox nickname-textbox" maxlength="32" style="display: none" placeholder="Press Enter after editing">' +
					'<div class="species"></div>' +
					'<div class="shiny"></div>' +
					'<div class="xkit-button release_pokemon" style="display: none" title="Release Pokémon"></div>' +
					'<div class="caught_stats"></div>' +
				'</div>' +
				'<div class="xkit-pokes-pc-pokemon">' +
					'<div id="xkit-loading_pokemon">' +
						'Loading Pokémon, please wait...' +
					'</div>' +
				'</div>' +
			'</div>';

		$("body").prepend(m_html);
		$(".xkit-pokes-lightbox").click(function(e) {
			if (e.target !== this) return;
			$(this).animate({
				opacity: 0
			}, {
				complete: function() {
					$(this).remove();
				}
			});
		});

		var sortFunction = function(dataAttr, optData) {
			var up = ($('input.xkit-pokes-sorter#reverse-toggle').is(":checked") ? -1 : 1);
			return function(first, second) {
				return ($(second).data(dataAttr) || $(second).data(optData)) < ($(first).data(dataAttr) || $(first).data(optData)) ? up : -up;
			};
		};

		$('input:radio[name="xkit-pokes-sort"]#pokeid').change(function(e) {
			$("#xkit-loading_pokemon div.caught").sort(sortFunction("pokeid", "pokeid"))
									.prependTo("#xkit-loading_pokemon");
		});
		$('input:radio[name="xkit-pokes-sort"]#alphabetical').change(function(e) {
			$("#xkit-loading_pokemon div.caught").sort(sortFunction("pokenick", "pokespecies"))
									.prependTo("#xkit-loading_pokemon");
		});
		$('input:radio[name="xkit-pokes-sort"]#chronological').change(function(e) {
			$("#xkit-loading_pokemon div.caught").sort(sortFunction('array_index', 'array_index'))
									.prependTo("#xkit-loading_pokemon");
		});
		$('.xkit-pokes-sorter#reverse-toggle').change(function(e) {
				 $("#xkit-loading_pokemon div.caught").sort(function(i) {return 1;}).prependTo("#xkit-loading_pokemon");
		});

		$(".xkit-pokes-lightbox").animate({
			opacity: 1
		});
		$(".xkit-pokes-pc-info .nickname").click(function() {
			$(this).hide();
			$(".xkit-pokes-pc-info .nickname-textbox").show();
			$(".xkit-pokes-pc-info .nickname-textbox").focus();
		});
		$(".xkit-pokes-pc-info .nickname-textbox").change(function() {
			$(this).hide();
			XKit.extensions.pokes.rename_poke($("div.active").attr("data-array_index"), $(this).val(), function() {
				$("div.active").attr("data-pokenick", $(".xkit-pokes-pc-info .nickname-textbox").val());
				$(".xkit-pokes-pc-info .nickname").show();
				if (typeof $("div.active").attr("data-pokenick") !== "undefined" && $("div.active").attr("data-pokenick")) {
					$(".xkit-pokes-pc-info .nickname").html("<div title='Click to nickname!'>" + $("div.active").attr("data-pokenick") + "</div>");
				} else {
					$(".xkit-pokes-pc-info .nickname").html("<div title='Click to nickname!'>" + $("div.active").attr("data-pokespecies") + "</div>");
				}
			});
		});
		$(".xkit-pokes-pc-info .release_pokemon").click(function() {
			var pokename = $("div.active").attr("data-pokespecies");
			if (typeof $("div.active").attr("data-pokenick") !== "undefined" && $("div.active").attr("data-pokenick")) {
				pokename = $("div.active").attr("data-pokenick") + " (" + pokename + ")";
			}
			XKit.window.show("Release Pokémon", "Do you really want to release <b>" + pokename + "</b>?<br/>This Pokémon will be lost. You can not undo this action.", "question", "<div id=\"release-pokemon-yes\" class=\"xkit-button default\">Yes, release Pokémon</div><div id=\"release-pokemon-no\" class=\"xkit-button\">Cancel</div>");
			$("#release-pokemon-no").click(function() {
				XKit.window.close();
			});
			$("#release-pokemon-yes").click(function() {
				$(this).addClass("disabled");
				$("#release-pokemon-no").addClass("disabled");
				XKit.window.close();
				XKit.extensions.pokes.delete_poke($("div.active").attr("data-array_index"), function() {
					var array_index = $("div.active").attr("data-array_index");
					$("div.active").remove();
					$(".caught").filter(function() {
						return $(this).attr("data-array_index") > array_index;
					}).each(function() {
						$(this).attr("data-array_index", $(this).attr("data-array_index") - 1);
					});
					$(".xkit-pokes-pc-info .caught_stats").show();
					$(".xkit-pokes-pc-info .gender").hide();
					$(".xkit-pokes-pc-info .species").hide();
					$(".xkit-pokes-pc-info .shiny").hide();
					$(".xkit-pokes-pc-info .nickname").hide();
					$(".xkit-pokes-pc-info .release_pokemon").hide();
					$(".xkit-pokes-pc-info .nickname-textbox").hide();

				});
			});
		});
		XKit.extensions.pokes.fetch_pokedex(function(mdata) {
			var caught = JSON.parse(XKit.storage.get("pokes", "pokemon_storage", "[]"));
			var header = "<p>You've caught " + caught.length + " total Pokémon!<br/> That's ";
			var checklist = [];
			var caught_html = "";
			$.each(caught, function(index, value) {
				var sprite = mdata[value.id].sprite;
				if (value.shiny) {
					sprite = mdata[value.id].sprite_shiny || mdata[value.id].sprite;
				}
				caught_html = caught_html + "<div class='caught" + (value.shiny ? " pokes_shiny" : "") + "' data-pokeid='" + value.id + "' data-pokegender='" + value.gender + "' data-pokespecies='" + mdata[value.id].name + "' data-pokenick='" + (value.nickname || "") + "' data-array_index=" + index + "><img class='caught poke_sprite' src='" + sprite + "' /></div>";
				if (checklist.indexOf(value.id) === -1) checklist.push(value.id);
			});
			header += checklist.length + " out of " + mdata.length + " different species of Pokémon!</p>";
			$("#xkit-loading_pokemon").html(caught_html);
			$(".caught_stats").html(header);
			$(".xkit-pokes-pc-pokemon .caught").click(function() {
				if ($(this).hasClass("active")) {
					$(this).removeClass("active");
					$(".xkit-pokes-pc-info .caught_stats").show();
					$(".xkit-pokes-pc-info .gender").hide();
					$(".xkit-pokes-pc-info .species").hide();
					$(".xkit-pokes-pc-info .shiny").hide();
					$(".xkit-pokes-pc-info .nickname").hide();
					$(".xkit-pokes-pc-info .release_pokemon").hide();
					$(".xkit-pokes-pc-info .nickname-textbox").hide();
				} else {
					$(".active").removeClass("active");
					$(this).addClass("active");
					$(this).find("img").addClass("active");
					$(".xkit-pokes-pc-info .caught_stats").hide();
					$(".xkit-pokes-pc-info .gender").show();
					$(".xkit-pokes-pc-info .species").show();
					$(".xkit-pokes-pc-info .shiny").show();
					$(".xkit-pokes-pc-info .nickname").show();
					$(".xkit-pokes-pc-info .release_pokemon").show();
					$(".xkit-pokes-pc-info .nickname-textbox").hide();
					$(".xkit-pokes-pc-info .nickname-textbox").val($(this).attr("data-pokenick"));
					$(".xkit-pokes-pc-info .gender").attr(  "data-pokegender", ( $(this).attr("data-pokegender") ) );
					$(".xkit-pokes-pc-info .gender").text( $(this).attr("data-pokegender") );
					$(".xkit-pokes-pc-info .species").text("Species: " + $(this).attr("data-pokespecies"));
					$(".xkit-pokes-pc-info .shiny").text($(this).hasClass("pokes_shiny") ? "Shiny" : "");
					if (typeof $(this).attr("data-pokenick") !== "undefined" && $(this).attr("data-pokenick")) {
						$(".xkit-pokes-pc-info .nickname").html("<div title='Click to nickname!'>" + $(this).attr("data-pokenick") + "</div>");
					} else {
						$(".xkit-pokes-pc-info .nickname").html("<div title='Click to nickname!'>" + $(this).attr("data-pokespecies") + "</div>");
					}
				}
			});
		}, function(response) {
			$("#xkit-loading_pokemon").html("<div id='xkit-pokes-custom-panel'>Failed to load Pokémon Data!<br>Please refresh the page or try again later!</div>");
		});
	},

	cpanel: function(m_div) {
		var m_html = '<div id="xkit-pokes-menu">' +
			'<div class="xkit-pokes-menu_button" id="xkit-pokes-show_poke_list">' +
				'<div class="icon"></div>' +
				'<div class="title">Pokémon</div>' +
				'<div class="description">Check which Pokémon you have caught</div>' +
			'</div>' +
			'<div class="xkit-pokes-menu_button disabled">' +
				'<div class="icon"></div>' +
				'<div class="title"></div>' +
				'<div class="description"></div>' +
			'</div>' +
			'<div class="xkit-pokes-menu_button disabled">' +
				'<div class="icon"></div>' +
				'<div class="title"></div>' +
				'<div class="description"></div>' +
			'</div>' +
		'</div>';
		m_div.append(m_html);

		$("#xkit-pokes-show_poke_list").click(function() {
			XKit.extensions.xkit_preferences.close();
			setTimeout(XKit.extensions.pokes.render_pokelist, 250);
		});

		$("#xkit-extensions-panel-right").nanoScroller();
		$("#xkit-extensions-panel-right").nanoScroller({ scroll: 'top' });
	}
};
