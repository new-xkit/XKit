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
