//* TITLE mascots **//
//* VERSION 1.0.0 **//
//* DESCRIPTION Mascots for your dashboard! **//
//* DETAILS Have a picture follow you around as you scroll through your dashboard! **//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.mascots = new Object({

	defaultMascots: [{
		name: "Pinkie Pie",
		source: "http://rapidstrike.tumblr.com/post/155013588708/this-is-the-ponk-of-high-spirits-drag-her-around",
		imageUrl: "http://68.media.tumblr.com/76e6a0b218adbe1411ebb03b30def987/tumblr_oiu1eqHYRP1r3zufwo1_1280.png",
		height: "auto",
		width: "auto",
		downscaleOnly: true,
		vOffset: "0px",
		hOffset: "0px",
		zIndex: "-1",
		flipImage: false,
		flipSide: false,
		active: true,
		sourceLocked: true
	},
	{
		name: "ARTward",
		source: "Uhhh",
		imageUrl: "https://68.media.tumblr.com/e6cacc306152470636c406361b0f6506/tumblr_mpmwiasLDr1rh8ms6o1_250.png",
		height: "auto",
		width: "auto",
		downscaleOnly: true,
		vOffset: "0px",
		hOffset: "0px",
		zIndex: "-1",
		flipImage: false,
		flipSide: false,
		active: true,
		sourceLocked: true
	}],
	
	running: false,

	mascot: null,
	
	set_mascot: function() {
		try {
			var currentMascots = JSON.parse(XKit.storage.get("mascots","all_mascots",JSON.stringify(this.defaultMascots)));
			if (!currentMascots.length) {
				console.log("[MASCOTS]No mascot set, create mascots in the settings.");
				return;
			}
			
			var activeMascots = currentMascots.filter(function(elem) {
				return elem.active;
			});
			if (!activeMascots.length) {
				console.log("[MASCOTS]No mascot active, activate mascots in the settings.");
				return;
			}
			
			this.mascot = activeMascots[Math.floor(Math.random() * activeMascots.length)];
		} catch (e) {
			console.log(e);
			XKit.window.show("Loading mascots storage failed!", "Something went wrong while trying to retrieve mascots from storage. The error has been printed to your browser console.<br/><br/>Error code: MST-001<br><br>If you choose to report this bug, add the error code and the error from your browser console to your issue description, please.","error","<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");
			return;
		}
	},
	
	run: function() {
		this.running = true;
		this.set_mascot();
		if (!this.mascot) {
			console.log("[MASCOTS]mascot object not set, maybe you don't have any active mascots or an error occurred? Anyways, Mascots bailing out, have a nice day! ~Wolvan");
			return;
		}
		$("body").append("<div id='xkit_mascot_div'><img src='" + this.mascot.imageUrl + "'></img></div>");
		XKit.tools.init_css('mascots');
		XKit.tools.add_css("#xkit_mascot_div img { height: " + this.mascot.height + "; width: " + this.mascot.width + "; margin-bottom: " + this.mascot.hOffset + "; margin-" + (!this.mascot.flipImage ? "right" : "left") + ": " + this.mascot.vOffset + "; z-index: " + this.mascot.zIndex + "; }", "mascots");
		if (this.mascot.flipImage) XKit.tools.add_css("#xkit_mascot_div img { -moz-transform: scaleX(-1); -o-transform: scaleX(-1); -webkit-transform: scaleX(-1); transform: scaleX(-1); filter: FlipH; -ms-filter: 'FlipH'; }", "mascots");
		if (this.mascot.flipSide) XKit.tools.add_css("#xkit_mascot_div img { right: 0 }", "mascots");
		if (this.mascot.downscaleOnly && this.mascot.width.toLowerCase() === "auto") XKit.tools.add_css("#xkit_mascot_div img { max-width: 450px; }", "mascots");
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css('mascots');
		$("#xkit_mascot_div").remove();
	}

});
