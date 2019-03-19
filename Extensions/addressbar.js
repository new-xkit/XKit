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
	initialScroll: null,
	
	preferences: {
		"focus_only": {
			text: "Only run the extension when the page has focus",
			default: true,
			value: true
		},
	},

	run: function() {
		this.running = true; //there's some confusion over whether this gets set to true on immediate return
		
		let XInterface = XKit.interface.where();
		if (XInterface.dashboard !== true || XInterface.endless !== true) {
			return; //only useful on endless dashboard
		} 

		XKit.extensions.addressbar.interval = setInterval(
			XKit.extensions.addressbar.update_address, 500);

		XKit.extensions.addressbar.initialScroll = history.scrollRestoration;
		history.scrollRestoration = "manual";
	},
	
	find_top: function() {
		var offset = 200; //place slightly below navbar to ignore reblog controls
		var scrollPos = $(window).scrollTop() + offset;
		var minDist = Number.MAX_SAFE_INTEGER;
		var id = null; //check later and do nothing to history if no post qualifies
	
		$("[data-pageable] .post").each(function() {
			var dist = scrollPos - $(this).offset().top;
			//if it equals exactly 200 that's a bogus value
			if (dist > 0 && dist !== offset && dist < minDist) {
				minDist = dist;
				id = $(this).attr('data-post-id');
			}
		});
		return id;
	},
	
	replace_address: function(postid) {
		postid = Number(postid);
		window.history.replaceState(
			{ id: postid }, 
			'Tumblr - ' + postid, //title param is ignored currently
			'/dashboard/2/' + (postid + 1) //has to be the id immediately after
		);
	},

	update_address: function() {
		if (!XKit.extensions.addressbar.focus_only || document.hasFocus()) { 
		//do nothing if you're not in focus
			var id = XKit.extensions.addressbar.find_top();
			if (id !== null && id > 1) {
				XKit.extensions.addressbar.replace_address(id);
			}
			return id;
		}
	},

	destroy: function() {
		this.running = false;
		clearInterval(XKit.extensions.addressbar.interval);
		history.scrollRestoration = XKit.extensions.addressbar.initialScroll;
	}
});
