`XKit.console`: useful for debugging.

## Methods

<a name="show" href="XKit.console.md#show">#</a> XKit.console.**show**()

Show the XKit console.

<a name="hide" href="XKit.console.md#hide">#</a> XKit.console.**hide**()

Hide the XKit console.

<a name="add" href="XKit.console.md#add">#</a> XKit.console.**add**(_string_)

Print to the XKit Console.

Example usage:

```javascript
var text = "xenixlet is cool";
XKit.console.add("I got: " + text);
```

## Tips

* Even if the XKit Console is off, this will also print to the browser's console.
* Do not over-use Console and do remove your debugging code before releasing your extension.
