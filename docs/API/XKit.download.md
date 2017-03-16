`XKit.download`: download extension data from the XKit servers.

## Methods

<a name="extension" href="XKit.download.md#extension">#</a> XKit.download.**extension**(_extension_id_, _callback_)

Download `extension_id` and return the results to callback.

<a name="page" href="XKit.download.md#page">#</a> XKit.download.**page**(_url_, _callback_)

Download `url` (which is appended to the server URL) from XKit servers and call the callback.

Example usage:

```javascript
XKit.download.page("some_page.php", function(obj) {
	// Check if the server was down?
	if (obj.server_down === true) {
		alert("Can't reach!");
		return;
	}

	alert(obj.some_data);
});
```

## Tips

* Everything is a JSON object.
* Always check for `errors` and `server_down`.
