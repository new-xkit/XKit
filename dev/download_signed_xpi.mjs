import "dotenv/config";
import jwt from "jsonwebtoken";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

async function downloadXpi(addonId) {
	const addonInfo = await fetch(`https://addons.mozilla.org/api/v5/addons/addon/${addonId}`, { headers: createAMOAuthHeaders() })
		.then(response => response.json());

	const {
		latest_unlisted_version: {
			file: { url },
		},
	} = addonInfo;

	const file = await fetch(url, { headers: createAMOAuthHeaders() })
		.then(response => response.arrayBuffer());

	fs.mkdirSync("web-ext-artifacts", { recursive: true });
	fs.writeFileSync(`web-ext-artifacts/${path.basename(url)}`, new Uint8Array(file), { flag: "w+" });
}

downloadXpi('@new-xkit');

// see https://mozilla.github.io/addons-server/topics/api/auth.html
function createAMOAuthHeaders() {
	const { WEB_EXT_API_KEY, WEB_EXT_API_SECRET } = process.env;
	assert(WEB_EXT_API_KEY && WEB_EXT_API_SECRET, "Missing addons.mozilla.org credentials in .env file!");

	const payload = {
		iss: WEB_EXT_API_KEY,
		jti: Math.random().toString(),
	};
	const token = jwt.sign(payload, WEB_EXT_API_SECRET, { algorithm: "HS256", expiresIn: 60 });
	return { Authorization: `JWT ${token}` };
}
