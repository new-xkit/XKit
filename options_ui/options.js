/* globals browser, chrome */
if (typeof browser === "undefined") {
	// eslint-disable-next-line no-global-assign
	browser = chrome;
}

const permissionsRequestElement = document.getElementById('permissions-request');
const permissionsButton = document.getElementById('grant-user-script-permission');
const updatePermissionsVisibility = hasPermission => {
	permissionsRequestElement.hidden = hasPermission;
};
permissionsButton.addEventListener('click', () => {
	browser.permissions
		.request({ permissions: ['userScripts'] })
		.then(updatePermissionsVisibility);
});
browser.permissions
	.contains({ permissions: ['userScripts'] })
	.then(updatePermissionsVisibility);

