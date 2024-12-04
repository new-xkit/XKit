//* TITLE De-Notifier **//
//* VERSION 1.0.0 **//
//* DESCRIPTION Removes non-essential unread notification badges. **//
//* DEVELOPER circlejourney **//
//* FRAME false **//
//* BETA false **//
XKit.extensions.denotifier = new Object({

	running: false,

	run: async function() {
		this.running = true;
		await XKit.css_map.getCssMap();
		const { navItem, notificationBadgeIn } = XKit.css_map.cssMap;
		XKit.tools.add_css(`.${navItem}[title='Home'] .${notificationBadgeIn} { display: none !important; }`, "denotifier");
	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("denotifier");
	}
});
