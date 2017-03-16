`XKit.post_listener`: listens for new posts to manipulate.  Use it to modify new posts when they appear on the user's dashboard.

## Methods

<a name="add" href="XKit.post_listener.md#add">#</a> XKit.post_listener.**add**(_extension_id_, _func_)

Adds `func` to the callback list.

Example usage:

```javascript
XKit.post_listener.add("my_extension", XKit.extensions.my_extension.to_be_called);
```

<a name="remove" href="XKit.post_listener.md#remove">#</a> XKit.post_listener.**remove**(_extension_id_)

Removes the previously added callback.

Example usage:

```javascript
XKit.post_listener.remove("my_extension");
```

## Usage

```javascript
run: function() {
    XKit.post_listener.add("my_extension", XKit.extensions.my_extension.paint_red);
    XKit.extensions.my_extension.paint_red();
},

paint_red: function() {
    $(".post").not(".already-red").each(function() {
        // Add class so we wouldn't hit this post again.
        $(this).addClass("already-red");
        // Paint it red!
        $(this).("background","red");
    });
},

destroy: function() {
    // Always remove the listener on destroy!
    XKit.post_listener.remove("my_extension");
}
```

## Tips

* Always remove the listener when `destroy()` is called.
* You can have several listeners at once:
  * `XKit.post_listener.add("my_extension_red", XKit.extensions.my_extension.paint_red);`
  * `XKit.post_listener.add("my_extension_blue", XKit.extensions.my_extension.paint_blue);`
