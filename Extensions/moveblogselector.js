//* TITLE Blog Selector to bottom **//
//* VERSION 1.0.0 **//
//* DESCRIPTION Moves the blog selector from top of form to bottom of form	**//
//* DEVELOPER manavortex **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.moveblogselector = new Object({
	running: false,

	preferences: {
		sep0: {
			text: 'Form footer tweaks',
			type: 'separator',
		},
		relocate_btns: {
			text: 'Merge xkit button controls into header form? (more compact footer)',
			default: true,
			value: true,
		},
	},

	run: function() {
		this.running = true;
		XKit.tools.init_css('moveblogselector');
		XKit.post_listener.add('moveblogselector', () => this.moveElements());
	},

	destroy: function() {
		this.running = false;
		XKit.post_listener.remove('moveblogselector');
	},

	moveElements: async function() {
		/*
		 * move post form header to bottom
		 */
		if (
			this.insertNodeBefore(
				await this.checkElement('.post-form--header'),
				await this.checkElement('.post-form--bottom')
			)
		) {
			// if successful: add a clearfix to parent so it doesn't look shitty
			const firstChild = document.querySelector('.post-container > :first-child');
			if ((firstChild.className || '').indexOf('clearfix') < 0) {
				const postContainer = document.querySelector('.post-container');
				const clearfix = document.createElement('div');
				clearfix.className = 'clearfix';
				clearfix.style.height = '1em';
				postContainer.insertBefore(clearfix, firstChild);
			}
		}

		if (!this.preferences.relocate_btns.value) return;
		/*
		 * move xkit post controls adjacent to settings button
		 */

		const xkitBtn = await this.checkElement('.post-form--controls [id*="xkit"]');
		const settingsBtn = await this.checkElement('.post-form--post-settings-button');
		if (this.insertNodeBefore(xkitBtn, settingsBtn)) {
			xkitBtn.classList.add('inline');
		}
	},

	/**
	 * Async function: call with checkElement('#myElement').then((el) { ... }) .
	 * Or see first block in waitForAndPrepend as per nightpool's suggestion in MR 2037
	 *
	 * @param {string} selector - document query selector.
	 * @param {string} returnAry - run querySelectorAll rather than querySelector?
	 */
	checkElement: async function(selector, returnAry = false) {
		while (this.running && document.querySelectorAll(selector).length === 0) {
			await new Promise((resolve) => setTimeout(resolve, 150));
		}
		return returnAry
			? document.querySelectorAll(selector)
			: document.querySelector(selector);
	},

	/**
	 * Be null-safe. Be vewwy, vewwy null-safe.
	 *
	 * @param {HTMLElement} elementNode - node to insert.
	 * @param {HTMLElement} siblingNode - node to insert before.
	 * @returns {boolean} success check
	 */
	insertNodeBefore(elementNode, siblingNode) {
		return (
			!!elementNode &&
			!!siblingNode &&
			!!siblingNode.parentNode.insertBefore(elementNode, siblingNode)
		);
	},
});