import fs from "node:fs";
import path from "node:path";

const extensionFiles = fs.readdirSync("Extensions");
const extensionIds = extensionFiles
	.filter(fileName => fileName.endsWith(".js"))
	.map(fileName => path.parse(fileName).name);

const extensionList = {};
extensionIds.forEach(id => {
	extensionList[id] = {
		icon: extensionFiles.includes(`${id}.icon.txt`),
		css: extensionFiles.includes(`${id}.css`),
	};
});

fs.writeFileSync(
	"Extensions/_index.json",
	JSON.stringify(extensionList, null, 2),
	{ encoding: "utf8", flag: "w+", }
);

const themeList = fs.readdirSync("Themes")
  .filter(name => name.startsWith("_") === false);

fs.writeFileSync(
	"Themes/_index.json",
	JSON.stringify(themeList, null, 2),
	{ encoding: "utf8", flag: "w+", }
);
