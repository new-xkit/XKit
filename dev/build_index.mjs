import fs from "node:fs/promises";
import path from "node:path";

(async () => {
	const extensionFiles = await fs.readdir("Extensions");
	const extensionIds = extensionFiles
		.filter(fileName => fileName.endsWith(".js") && !fileName.endsWith(".icon.js"))
		.map(fileName => path.parse(fileName).name);

	const extensionList = {};
	extensionIds.forEach(id => {
		extensionList[id] = {
			icon: extensionFiles.includes(`${id}.icon.js`),
			css: extensionFiles.includes(`${id}.css`),
		};
	});

	await fs.writeFile("Extensions/_index.json", JSON.stringify(extensionList, null, 2), {
		encoding: "utf8",
		flag: "w+",
	});

	const themeList = (await fs.readdir("Themes")).filter(name => name.startsWith("_") === false);
	await fs.writeFile("Themes/_index.json", JSON.stringify(themeList, null, 2), {
		encoding: "utf8",
		flag: "w+",
	});
})();
