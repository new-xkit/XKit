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
		XKit.post_listener.add('pokes', XKit.extensions.pokes.checkEligibility);
		XKit.extensions.pokes.checkEligibility();
	},

	checkEligibility: function() {
		$(".post_avatar").not(".poked").each(function() {
			if (XKit.extensions.pokes.chanceGen()) {
				$(this).addClass("poked");
			}
		});

		$(".poked").each(function() {
			pokeNr = pokeGen();
			poke_nid = fetchPokeNID(pokeNr);
			poke_name = fetchPokeName(pokeNr);
			poke_sprite = fetchPokeSpriteURL(pokeNr);

			poke_html = '<div class="poke" data-pokenr="'+poke_nid+'" data-pokename="'+poke_name+'">'+
			'"<img src="'+poke_sprite+'" alt="'+poke_name+'"/>'+
			'</div>';

			$(this).append(poke_html);
		});
	},

	fetchPokeNID: function(db_nr) {
		poke_nid = "";
		GM_xmlhttpRequest({
			method: "GET",
			url: "http://pokeapi.co/api/v1/pokemon/" + db_nr,
			json: true,
			onerror: function(response) {
				console.log("Poke data could not be retrieved. Skipping instance.");
			},
			onload: function(response) {
				var mdata = {};
				try {
					mdata = JSON.parse(response.responseText);
					poke_nid = mdata.objects[0].national_id;
				} catch(e) {
					console.log("Poke data received was not valid JSON. Skipping instance.");
				}
			}
		});
		return poke_nid;
	},

	fetchPokeName: function(db_nr) {
		poke_name = "";
		GM_xmlhttpRequest({
			method: "GET",
			url: "http://pokeapi.co/api/v1/pokemon/" + pokeGen(),
			json: true,
			onerror: function(response) {
				console.log("Poke data could not be retrieved. Skipping instance.");
			},
			onload: function(response) {
				var mdata = {};
				try {
					mdata = JSON.parse(response.responseText);
					poke_name = mdata.objects[0].name;
				} catch(e) {
					console.log("Poke data received was not valid JSON. Skipping instance.");
				}
			}
		});
		return poke_name;
	},

	fetchPokeSpriteURL: function(db_nr) {
		poke_sprite = "";
		GM_xmlhttpRequest({
			method: "GET",
			url: "http://pokeapi.co/api/v1/pokemon/" + pokeGen(),
			json: true,
			onerror: function(response) {
				console.log("Poke data could not be retrieved. Skipping instance.");
			},
			onload: function(response) {
				var mdata = {};
				try {
					mdata = JSON.parse(response.responseText);
					poke_sprite = getPokeImg(mdata.objects[0].sprites[0].resource_uri);
				} catch(e) {
					console.log("Poke data received was not valid JSON. Skipping instance.");
				}
			}
		});
		return poke_sprite;
	},

	getPokeImg: function(resource_uri) {
		imgURL = "";
		GM_xmlhttpRequest({
			method: "GET",
			url: "http://pokeapi.co" + resource_uri,
			json: true,
			onerror: function(reponse) {
				console.log("Poke sprite could not be retrieved. Skipping instance.");
			},
			onload: function(reponse) {
				mdata = {};
				try {
					mdata = JSON.parse(response.responseText);
					imgURL = "http://pokeapi.co" + mdata.image;
				} catch(e) {
					console.log("Poke sprite data received was not valid JSON. Skipping instance.");
				}
			}
		});
		return imgURL;
	},

	chanceGen: function() {
		int = Math.floor(Math.random() * 101);
		if (int >= 0 && int <= 8) {
			return true;
		}
		else {
			return false;
		}
	},

	pokeGen: function() {
		return Math.floor(Math.random() * 778);
	},

	destroy: function() {
		this.running = false;
	}
};
