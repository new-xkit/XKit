import fs from "node:fs";
import process from "node:process";

const newVersion = process.argv[2] || JSON.parse(fs.readFileSync("manifest.json", "utf8")).version;

const data = [
	"Extensions/dist/page/FirefoxUpdate.json",
	"Extensions/dist/page/FirefoxUpdate.rdf",
	"Extensions/dist/page/framework_version.json",
].map(filePath => ({ filePath, contents: fs.readFileSync(filePath, "utf8") }));

const oldVersion = /7\.\d{1,2}.\d{1,2}/.exec(data[0].contents)[0];

console.log(`replacing ${oldVersion} with ${newVersion}`);

data.forEach(({ filePath, contents }) => {
	fs.writeFileSync(filePath, contents.replaceAll(oldVersion, newVersion), { flag: "w+" });
});
