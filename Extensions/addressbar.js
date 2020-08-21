//* TITLE Addressbar Updater **//
//* VERSION 1.0.1 **//
//* DESCRIPTION Keeps the url in its place **//
//* DEVELOPER srsutherland **//
//* DETAILS Sets the url to the current post on your dashboard (to keep your place during tab crashes and refreshes). **//
//* FRAME false **//
//* BETA false **//
//* SLOW false **//

XKit.extensions.addressbar = new Object({

	running: false,
	interval: 0,
	initialScroll: history.scrollRestoration,
	
	preferences: {
		"focus_only": {
			text: "Only run the extension when the page has focus",
			default: true,
			value: true
		},
	},

	run: function() {
		this.running = true; //there's some confusion over whether this gets set to true on immediate return
		
		const Xwhere = XKit.interface.where();
		if (Xwhere.dashboard !== true || Xwhere.endless !== true) {
			return; //only useful on endless dashboard
		} 

		this.interval = setInterval(this.update_address, 500);

		history.scrollRestoration = "manual"; //prevent page from jumping to bottom on refresh 
	},
	
	find_top: function() {
		var offset = 200; //place slightly below navbar to ignore reblog controls
		var scrollPos = $(window).scrollTop() + offset;
		var minDist = Number.MAX_SAFE_INTEGER;
		var id = null; //check later and do nothing to history if no post qualifies
	
		$("[data-id]").each(function() {
			var dist = scrollPos - $(this).offset().top;
			//if it equals exactly 200 that's a bogus value
			if (dist > 0 && dist !== offset && dist < minDist) {
				minDist = dist;
				id = $(this).attr('data-id');
			}
		});
		return id;
	},
	
	replace_address: function(postid) {
		postid = BigInt(postid);
		window.history.replaceState(
			{ id: postid }, 
			'Tumblr - ' + postid, //title param is ignored currently
			'?max_post_id=' + (postid + BigInt(1)) //has to be the id immediately after
		);
	},

	update_address: function() {
		if (!XKit.extensions.addressbar.focus_only || document.hasFocus()) { 
		//do nothing if you're not in focus
			var id = XKit.extensions.addressbar.find_top();
			if (id !== null && id > 1) {
				XKit.extensions.addressbar.replace_address(id);
			}
			return id; //unused/debug
		}
	},

	destroy: function() {
		this.running = false;
		clearInterval(this.interval);
		history.scrollRestoration = this.initialScroll;
	}
});
