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
		poke_nid = ""; poke_name = ""; poke_sprite = "";
		poke_html = "";
		GM_xmlhttpRequest({
			method: "GET",
			url: "https://pokeapi.hosted-secure.com/?query=" + db_nr,
			json: true,
			onerror: function(response) {
				console.log("Poke data could not be retrieved. Skipping instance.");
			},
			onload: function(response) {
				var mdata = {};
				try {
					mdata = JSON.parse(response.responseText);
					poke_nid = mdata.national_id;
					poke_name = mdata.name;
					poke_sprite = "http://pokeapi.co/media/img/" + poke_nid + ".png";
					
					male_ratio = parseFloat(mdata.male_female_ratio);
					var rnd_nr = Math.floor(Math.random() * 100);
					var poke_gender = "";
					if (rnd_nr <= male_ratio) {
						poke_gender = "male";
					} else {
						poke_gender = "female";
					}
					
					poke_html = '<div class="poke" data-pokenr="'+poke_nid+'" data-pokename="'+poke_name+'" data-pokegender="'+poke_gender+'">'+
								'<img src="'+poke_sprite+'" alt="'+poke_name+'"/>'+
								'</div>';
					pokedThing.after(poke_html);
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
		lowID = 1;
		highID = 718;
		return Math.floor(Math.random() * (highID - lowID + 1)) + lowID;
	},

	destroy: function() {
		this.running = false;
	}
};
