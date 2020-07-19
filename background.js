/* globals chrome, browser, msBrowser */

if (typeof(browser) === 'undefined') {
	if (typeof(chrome) !== 'undefined') {
		browser = chrome; // eslint-disable-line no-global-assign
	} else if (typeof(msBrowser) !== 'undefined') {
		browser = msBrowser; // eslint-disable-line no-global-assign
	}
}

function openEditor(message) {
	if(message.action === 'createeditor') {
		let createData = {
			type: "popup",
			url: "editor.html",
			width: 800,
			height: 600
		};
		browser.windows.create(createData);
	}
}

browser.runtime.onMessage.addListener(openEditor);
