//* TITLE Pokes **//
//* VERSION 0.0.1 **//
//* DESCRIPTION Gotta catch them all! **//
//* DETAILS Randomly spawns Pokémon on your dash for you to collect. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA true **//
//* SLOW true **//

XKit.extensions.pokes = {
	running: false,
	run: function() {
		this.running = true;
		XKit.tools.init_css('pokes');
		XKit.post_listener.add('pokes', XKit.extensions.pokes.checkEligibility);
		XKit.extensions.pokes.checkEligibility();
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

		$(".poke").unbind("click");
		$(".poke").click(function(event) {
			if (XKit.storage.get("pokes","pokemon_storage","") === "") {
				XKit.storage.set("pokes","pokemon_storage","[]");
			}

			try {
				var storage_array = JSON.parse(XKit.storage.get("pokes","pokemon_storage", ""));
				if (storage_array !== "") {
					var poke_id = $(this).data("pokeid");
					var poke_gender = $(this).data("pokegender");
					var old_amount = 0;
					for (var i = 0; i < storage_array.length; i++) {
						if (storage_array[i].id === poke_id && storage_array[i].gender === poke_gender) {
							old_amount = storage_array[i].amount;
							storage_array.splice(i, 1);
						}
					}
					storage_array.push({id: poke_id, gender: poke_gender, amount: old_amount + 1});
					XKit.storage.set("pokes","pokemon_storage",JSON.stringify(storage_array));
					$(this).hide();
				} else {
					XKit.window.show("Catching failed!", "Something went wrong trying to catch the Pokémon. Please try again.<br/><br/>Error code: PKMN-001","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
				}
			} catch(e) {
				XKit.window.show("Catching failed!", "Something went wrong trying to catch the Pokémon. Please try again.<br/><br/>Error code: PKMN-002","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
			}
		});
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

		var rarityPicker = Math.floor(Math.random() * 255);
		if (rarityPicker >= 0 && rarityPicker <= rarity) {
			var poke_html = '<div class="poke" data-pokeid="'+db_nr+'" data-pokename="'+poke_name+'" data-pokegender="'+poke_gender+'">'+
				'<img src="'+poke_sprite+'" alt="'+poke_name+'"/>'+
			'</div>';
			pokedThing.after(poke_html);
		} else {
			XKit.extensions.pokes.parse_pokemon(mdata, XKit.extensions.pokes.pokeGen(), pokedThing);
		}
	},

	fetchPoke: function(db_nr, pokedThing) {
		GM_xmlhttpRequest({
			method: "GET",
			url: "https://gist.githubusercontent.com/ThePsionic/54a1f629dba66e53aaa4/raw/b4b472adb3839bd510389bdbcc19484af3b7c8f9/pokedex.json",
			json: true,
			onerror: function(response) {
				console.log("Poke data could not be retrieved. Skipping instance.");
			},
			onload: function(response) {
				var mdata = {};
				try {
					mdata = JSON.parse(response.responseText);
					XKit.extensions.pokes.parse_pokemon(mdata, db_nr, pokedThing);
				} catch(e) {
					console.log("Poke data received was not valid JSON. Skipping instance.");
				}
			}
		});
	},

	chanceGen: function() {
		var rnd_nr = Math.floor(Math.random() * 101);
		if (rnd_nr >= 0 && rnd_nr <= 8) {
			return true;
		}
		else {
			return false;
		}
	},

	pokeGen: function() {
		var lowID = 0;
		var highID = 888;
		return Math.floor(Math.random() * (highID - lowID + 1)) + lowID;
	},

	destroy: function() {
		this.running = false;
	}
};
