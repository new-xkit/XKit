# Writing a New Extension

## Things you need:
1. XKit 7.6.2 or higher, with all the internal extensions up to date.
2. Javascript and jQuery knowledge.
3. Patience and enough hair to pull when Tumblr changes something and breaks your extension.

## Getting Started
1. Open the XKit Control Panel > Other > XKit Editor or go to [tumblr.com/xkit_editor](https://tumblr.com/xkit_editor)
2. Click on **New Extension**
3. Give a name to your extension (eg: my_extension)
4. Update the **"[Legacy Headers](./Legacy-Headers.md)"**:
	* If "FRAME" is set to true, it will only work on Tumblr blog iframe
	* Add "SLOW" if your extension manipulates the page extensively.
	* Change "DEVELOPER" to your github username (eg: `atesh`).
	* Add "DETAILS" to write a long description about your extension
5. Start writing!
