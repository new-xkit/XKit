# Preferences

XKit Control Panel renders your extensions' settings depending on the "preferences" object of your extension. Your extension panel can have separators, text input and checkboxes. If you need more, you can write your own custom control panel by adding a `cpanel` function.

## Add preferences using standard controls (recommended)

### Example

```javascript
XKit.extensions.my_extension = new Object({
    running: false,
    slow: true,
    preferences: {
        "sep0": {
            text: "A cool separator",
            type: "separator"
        },
        "blink": {
            text: "Blink on everything",
            default: false,
            value: false
        },
        "show_message": {
            text: "Show an alert message every time I refresh the page",
            default: false,
            value: false
        },
        "show_message_text": {
            text: "Message to be shown",
            default: false,
            value: false,
            type: "text"
        },
        "sep1": {
            text: "Another separator",
            type: "separator"
        },
        "show_tags": {
            text: "This should be checked by default",
            default: true,
            value: true
        }
    }
});
```

### Experimental and Slow settings

Some of the settings your extension have might be experimental, or might slow down the user's computer. In that case, let the user know by using `slow` and `experimental` tags on your preferences.

```javascript
"take_over": {
    text: "Enable taking over the world",
    default: false,
    value: false,
    experimental: true
}
```

You should always set slow and experimental preferences off by default.

## Add preferences using your own controls (not recommended)

If you can't settle for checkbox/text combo, you can draw custom controls and attach events. To do this, write a function called `cpanel` that takes a jQuery DIV object as a parameter.

```javascript
cpanel: function(m_div) {
    if ($("#my-extension-control-panel").length > 0) {
        $("#my-extension-control-panel").remove();
    }

    $(m_div).html("<div id=\"my-extension-control-panel\">Hello world!</div>");
    $("#my-extension-control-panel").append("<div class=\"xkit-button\" id=\"my-button\">Say hi!</div>");

    $("#my-button").click(function() {
        alert("Hello there!");
    });
}
```

You can combine standard controls and cpanel function. In that case, instead of replacing the contents of the DIV passed to you, append to that object.

```javascript
cpanel: function(m_div) {
    if ($("#my-extension-control-panel").length > 0) {
        $("#my-extension-control-panel").remove();
    }

    $(m_div).append("<div id=\"my-extension-control-panel\">I come after standard controls!</div>");
}
```

When writing a custom control panel, try to use default XKit classes such as `xkit-button` and `xkit-checkbox`.
