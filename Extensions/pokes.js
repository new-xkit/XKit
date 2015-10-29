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
			pokeNr = XKit.extensions.pokes.pokeGen();
			poke_html = XKit.extensions.pokes.fetchPoke(pokeNr, $(this));
			$(this).addClass("poke_spawned");
		});
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
					poke_name = mdata[db_nr].name;
					poke_sprite = mdata[db_nr].sprite;
					m_f_ratio = parseInt(mdata[db_nr].gender_rate);
					rarity = parseInt(mdata[db_nr].rarity);

					var rarityPicker = Math.floor(Math.random() * 255);
					if (rarityPicker >= 0 && rarityPicker <= rarity) {
						poke_html = '<div class="poke" data-pokenr="'+poke_nid+'" data-pokename="'+poke_name+'">'+
									'<img src="'+poke_sprite+'" alt="'+poke_name+'"/>'+
									'</div>';
						pokedThing.after(poke_html);
					} else {
						fetchPoke(XKit.extensions.pokes.pokeGen(), pokedThing);
					}
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
		lowID = 0;
		highID = 888;
		return Math.floor(Math.random() * (highID - lowID + 1)) + lowID;
	},

	destroy: function() {
		this.running = false;
	}
};
