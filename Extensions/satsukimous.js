//* TITLE Satsukimous **//
//* VERSION 1.0.3 **//
//* DESCRIPTION SATSUKI (This extension was merely meant to be a joke and does not serve a bigger purpose) **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.satsukimous = new Object({

	running: false,

	preferences: {
		"play_scream": {
			text: "matoi RYUKOOOOoO",
			default: true,
			value: true
		}
	},
	
	satsuki: function() {
		$( "img" ).filter(function( index ) {
			return $( this ).attr( "src" ).indexOf( "anonymous_avatar" ) !== -1;
		}).attr( "src", "https://31.media.tumblr.com/avatar_0bc380bccba7_64.png" ).addClass("matoiRYUKOOOOoO");
		$( "div.post_avatar_link" ).filter(function( index ) {
			return $( this ).attr( "style" ).indexOf( "anonymous_avatar" ) !== -1;
		}).attr( "style", "background-image: url('https://31.media.tumblr.com/avatar_0bc380bccba7_64.png');" ).addClass("matoiRYUKOOOOoO");
		if (XKit.extensions.satsukimous.preferences.play_scream.value) {
			$(".matoiRYUKOOOOoO").click(function() {
				document.getElementById("matoi-sound").play();
			});
		}
	},

	run: function() {
		this.running = true;
		XKit.post_listener.add( "SATSUKI", XKit.extensions.satsukimous.satsuki );
		XKit.extensions.satsukimous.satsuki();
		if (XKit.extensions.satsukimous.preferences.play_scream.value) {
			$("head").append('<audio id="matoi-sound" src="http://a.tumblr.com/tumblr_nt2vx0HIy21tgqvb3o1.mp3" type="audio/mp3"></audio>');
		}
	},

	destroy: function() {
		this.running = false;
		XKit.post_listener.remove( "SATSUKI" );
	}

});
