import js from "@eslint/js";
import { globalIgnores } from "eslint/config";
import globals from "globals";
import { jsdoc } from "eslint-plugin-jsdoc";

export default [
	globalIgnores(["**/vendor/", "**/*.icon.js"]),
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.jquery,

				BigInt: "readonly",
				_: "readonly",
				XKit: "writable",
				XBridge: "writable",
				centerIt: "writable",
				Tumblr: "writable",
				add_tag: "writable",

				storage_max: "writable",
				storage_used: "writable",
				framework_version: "writable",
				getBridgeError: "writable",

				GM_flushStorage: "writable",
				GM_deleteAllValues: "writable",
				GM_getValue: "writable",
				GM_deleteValue: "writable",
				GM_setValue: "writable",
				GM_log: "writable",
				GM_openInTab: "writable",
				GM_listValues: "writable",
				GM_xmlhttpRequest: "writable",
			},

			ecmaVersion: 2018,
			sourceType: "script",
		},
	},

	js.configs.recommended,
	jsdoc({
		config: "flat/recommended",
		rules: {
			"jsdoc/require-jsdoc": "off",
			"jsdoc/require-param-description": "off",
			"jsdoc/require-returns-description": "off",
			"jsdoc/reject-function-type": "off",
			"jsdoc/tag-lines": "off",
			"jsdoc/no-undefined-types": ["warn", { "definedTypes": ["JQuery", "EventListener"] }],
		},
	}),

	{
		rules: {
			"dot-notation": [
				"error",
				{
					allowPattern: "^[A-Z]",
				},
			],

			"id-length": [
				"error",
				{
					exceptions: ["i", "j", "e", "x", "y", "_"],
				},
			],

			"no-caller": "error",
			"no-console": "off",
			"no-empty": "off",
			"no-implied-eval": "error",
			"no-mixed-spaces-and-tabs": ["error", "smart-tabs"],

			"no-unused-vars": [
				"error",
				{
					vars: "local",
					args: "none",
					caughtErrors: "none",
				},
			],

			"no-shadow": "error",
			"no-unsafe-negation": "error",
			"no-with": "error",

			"indent": [
				"error",
				"tab",
				{
					SwitchCase: 1,
					MemberExpression: "off",

					CallExpression: {
						arguments: "off",
					},
				},
			],

			"semi": "error",

			"brace-style": [
				"error",
				"1tbs",
				{
					allowSingleLine: true,
				},
			],

			"linebreak-style": ["error", "unix"],
			"semi-spacing": "error",
			"comma-spacing": "error",
			"space-infix-ops": "error",
			"template-curly-spacing": "error",

			"space-before-function-paren": [
				"error",
				{
					anonymous: "never",
					named: "never",
					asyncArrow: "always",
				},
			],

			"space-before-blocks": "error",

			"keyword-spacing": [
				"error",
				{
					before: true,
					after: true,
				},
			],

			"no-useless-escape": "off",
			"no-prototype-builtins": "off",
		},
	},
	{
		files: ["**/*.mjs"],

		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
		},
	},
];
