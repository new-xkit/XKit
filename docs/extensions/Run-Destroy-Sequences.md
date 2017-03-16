# Run / Destroy Sequences

All XKit extensions have two vital functions in them: `run()` and `destroy()`.  These take no parameters, and are required for all extensions.

#### `run()`

Called by `xkit_main` to load your extension.

Example usage:

```javascript
run: function() {
    XKit.init_css("my_extension_name");
    $("body").append("<div id=\"my-fancy-div\">Hello! I am alive!</div>");
}
```

#### `destroy()`

Called by `xkit_updates` and `xkit_preferences`.

When this is called, the function you write must remove all the modifications it made to the page, and remove all bound events.

```javascript
destroy: function() {
    XKit.remove_css("my_extension_name");
    $("#my-fancy-div").remove();
}
```

The `destroy()` function is vital to your extension. If you don't remove the stuff you've added, a user will end up with two of each object when they change a setting or update your extension.
