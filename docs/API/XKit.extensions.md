`XKit.extensions`: semi-god object for all installed extensions.

Used to reach exposed values on your extension, or sometimes other extensions.

## Usage

```javascript
// Check if Themes is running, and shut it down.
if (typeof XKit.extensions.themes !== "undefined") {
    if (XKit.extensions.themes.running) {
        XKit.extensions.themes.destroy();
    }
}
```

## Tips

* Never assume an extension is installed (unless it's your own extension running right now).
* Do not shut down other extensions.
