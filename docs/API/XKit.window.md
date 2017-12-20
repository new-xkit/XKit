`XKit.window`: Display message dialogs to the user.

## Methods

<a name="show" href="XKit.window.md#show">#</a> XKit.window.**show**(_title_, _msg_, _icon_, _buttons_)

Show a dialog to the user.

<a name="close" href="XKit.window.md#close">#</a> XKit.window.**close**()

Close the last window.

## Icons

The following strings can be passed to the `icon` parameter:
* warning
* info
* error
* question

## Buttons

* Buttons are standard DIVs, using class `.xkit-button`
* The "default action" should have the class `.default`
* `#xkit-close-message` is used internally to close the window

## Usage

```javascript
// If you run this, you'll notice that the last button, the one
// that has the id "xkit-close-message" will close the window automatically.

var buttons = "<div id=\"my-window-yes\" class=\"xkit-button default\">Yes, please.</div>" +
                "<div id=\"my-window-no\"  class=\"xkit-button\">Nope!</div>" +
                "<div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>";

// Show the window!
XKit.window.show("Hello world","You want to continue?","question",m_buttons);

$("#my-window-yes").click(function() {
    // To-Do: Proceed.
    XKit.window.close();
});

$("#my-window-no").click(function() {
    // To-Do: Don't Proceed.
    XKit.window.close();
});
```

## Tips

* XKit can only display one dialog at a time.
* Always pass a title and message.
* If `buttons` parameter is blank, the window will have no controls and the "darker-gray" area on the bottom.
