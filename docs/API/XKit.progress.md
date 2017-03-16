`XKit.progress`: manipulate progress bars.

## Methods

<a name="add" href="XKit.progress.md#add">#</a> XKit.progress.**add**(_id_)

Set `id` to something random and it will return a string containing the HTML code you should be using.

<a name="value" href="XKit.progress.ms#value">#</a> XKit.progress.**value**(_id_, _value_)

Set the progress of the bar. `value` is an integer between 0 and 100.

## Usage

```javascript
var progress = XKit.progress.add("my-extension-progress-bar");
XKit.window.show("Wait, please!","Installing something. " + progress, "info");
XKit.progress.value("my-extension-progress-bar", 50);
```

## Tips

* Add an extension prefix to all your `id`s.
