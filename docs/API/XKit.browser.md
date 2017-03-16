`XKit.browser()`: returns data about the browser.

## Returns

* `name` - human-readable browser name
* `version`
  * **Note**: not reliable on Safari or Opera
* Browser booleans:
  * `chrome`
  * `safari`
  * `firefox`
  * `opera`

## Usage

```javascript
var browser = XKit.browser();

if (browser.chrome) {
	alert("You are on Chrome! Yay!");
	alert("You are also on Chrome " + browser.version + "!");
}

if (browser.firefox || browser.safari) {
	alert("You aren't on Chrome.");
}
```

## Tips

* Do not ever write browser-specific extensions or refuse to run if it's not the browser of your liking.
