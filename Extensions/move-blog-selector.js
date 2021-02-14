//* TITLE Blog Selector to bottom **//
//* VERSION 1.0.0 **//
//* DESCRIPTION Moves the blog selector from top of form to bottom of form	**//
//* DEVELOPER manavortex **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.moveblogselector = new Object({
	
	running: false,
	
	run: function() {
		this.running = true;
		this.waitForAndPrepend(".post-form--header", ".post-form--bottom");
	},
	
	destroy: function() {
		this.running = false;
	}, 
	
	/**		
	* Async function: call with checkElement('#myElement').then((el) { ... }) .
	*
	* @param {string} selector - document query selector.
	*/
	checkElement: async function(selector) {
		while ( this.running && document.querySelector(selector) === null) {
			await new Promise( resolve =>  requestAnimationFrame(resolve) );
		}
		return document.querySelector(selector); 
	},
	
	/**
	* Async function: Will wait for first element, then wait for second element.
	* Will then move first before second in DOM.
	*
	* @param {string} elementSelector - first element to wait for.
	* @param {string} siblingSelector - adjacent sibling to insert after.
	*/
	waitForAndPrepend: async function(elementSelector, siblingSelector) {
		this.checkElement(elementSelector).then((elementNode) => 
			this.checkElement(siblingSelector).then((referenceNode) => {
				if (elementNode && referenceNode) {
					referenceNode.parentNode.insertBefore(elementNode, referenceNode);
				}
			})
		);
	}
});


