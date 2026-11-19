import fs from "node:fs/promises";
import path from "node:path";

const loadFile = filePath => fs.readFile(`.${filePath}`, "utf8");

async function build() {
	const galleryData = await getGalleryData();
	await fs.writeFile("Extensions/dist/page/gallery.json", JSON.stringify(galleryData), {
		encoding: "utf8",
		flag: "w+",
	});

	const listData = await getListData();
	await fs.writeFile("Extensions/dist/page/list.json", JSON.stringify(listData), {encoding: "utf8", flag: "w+"});

	const themeGalleryData = await getThemeGalleryData();
	await fs.writeFile("Extensions/dist/page/themes.json", JSON.stringify(themeGalleryData), {
		encoding: "utf8",
		flag: "w+",
	});

	const extensionList = await getExtensionList();
	for (const id of extensionList) {
		await fs.writeFile(`Extensions/dist/${id}.json`, JSON.stringify(await getExtensionData(id)), {
			encoding: "utf8",
			flag: "w+",
		});
	}
}

build();

/** Each extension has the following fields:
 * {string}  script      - Contents of the extension file
 * {string}  id          - File name without extension
 * {string}  icon        - Contents of the `id`.icon.js file
 * {string}  css         - Contents of the `id`.css file
 * {string}  title       - Value of the TITLE field in `script`
 * {string}  version     - Value of the VERSION field in `script`
 * {string}  description - Value of the DESCRIPTION field in `script`
 * {string}  details     - Value of the DETAILS field in `script`
 * {string}  developer   - Value of the DEVELOPER field in `script`
 * {boolean} frame       - Value of the FRAME field in `script`
 * {boolean} [beta]      - Value of the optional BETA field in `script`
 * {boolean} [slow]      - Value of the optional SLOW field in `script`
 */
const extensionAttributes = [
	{name: "title", default: null, required: true},
	{name: "description", default: null, required: true},
	{name: "developer", default: null, required: true},
	{name: "version", default: null, required: true},
	{name: "details", default: null, required: false},
	{name: "frame", default: "false", required: false},
	{name: "beta", default: "false", required: false},
	{name: "slow", default: "false", required: false},
];

async function getExtensionData(id) {
	const contents = await loadFile(`/Extensions/${id}.js`);

	const extension = {
		id,
		script: contents,
		file: "found",
		server: "up",
		errors: false,
	};

	try {
		const icon = await loadFile(`/Extensions/${id}.icon.js`);
		extension.icon = icon;
	} catch (e) {}
	try {
		const css = await loadFile(`/Extensions/${id}.css`);
		extension.css = css;
	} catch (e) {}

	extensionAttributes.forEach(({name: key, default: defaultValue}) => {
		const match = contents.match(new RegExp("/\\*\\s*" + key.toUpperCase() + "\\s*(.+?)\\s*\\*\\*?/"));
		if (match) {
			extension[key] = match[1];
		} else if (defaultValue) {
			extension[key] = defaultValue;
		}
	});

	return extension;
}

async function getGalleryData() {
	const extensionList = await getExtensionList();
	const extensionData = await Promise.all(extensionList.map(getExtensionData));

	// eslint-disable-next-line id-length
	extensionData.sort((a, b) => a.title.localeCompare(b.title));

	return {
		server: "up",
		extensions: extensionData.map(({id, title, version, description, icon, details}) => ({
			name: id,
			title,
			version,
			description,
			icon,
			details,
		})),
	};
}

async function getExtensionList() {
	return (await fs.readdir("Extensions"))
		.filter(fileName => fileName.endsWith(".js") && !fileName.endsWith(".icon.js"))
		.map(fileName => path.parse(fileName).name);
}

async function getListData() {
	const extensionList = await getExtensionList();
	const extensionData = await Promise.all(extensionList.map(getExtensionData));

	return {
		server: "up",
		extensions: extensionData.map(({id, version}) => ({name: id, version})),
	};
}

/** Each theme has the following fields:
 * {string} file        - Contents of the theme file
 * {string} name        - Value of the NAME field in `file`
 * {string} version     - Value of the VERSION field in `file`
 * {string} description - Value of the DESCRIPTION field in `file`
 * {string} developer   - Value of the DEVELOPER field in `file`
 */
const themeAttributes = [
	{name: "name", default: null, required: true},
	{name: "description", default: null, required: true},
	{name: "developer", default: null, required: true},
	{name: "version", default: null, required: true},
];
async function getThemeData(id) {
	const contents = await loadFile(`/Themes/${id}/${id}.css`);

	const theme = {
		file: `${id}.css`,
		contents,
	};

	themeAttributes.forEach(({name: key, default: defaultValue}) => {
		const match = contents.match(new RegExp("/\\*\\s*" + key.toUpperCase() + "\\s*(.+?)\\s*\\*\\*?/"));
		if (match) {
			theme[key] = match[1];
		} else if (defaultValue) {
			theme[key] = defaultValue;
		}
	});

	return theme;
}

async function getThemeGalleryData() {
	const themeList = await fs.readdir("Themes");
	const themeData = await Promise.all(themeList.map(getThemeData));

	return {
		server: "up",
		themes: themeData.map(({file, name, version, description, developer, contents}) => ({
			file,
			name,
			version,
			description,
			developer,
			contents,
		})),
	};
}
