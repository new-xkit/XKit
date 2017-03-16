# Example Extension

Here is a really simple example extension that removes the Tumblr logo and changes the title of the window upon start.

For information about XKit API, check the [XKit Object](../API/README.md).

```javascript
//* TITLE Example Extension **//
//* VERSION 1.0.0 **//
//* DESCRIPTION Nothing useful is done here? **//
//* DEVELOPER atesh **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.example = {

    running: false,

    default_title: document.title,

    preferences: {
        "title_text": {
            text: "What to show on the title?",
            default: "What is missing here?",
            value: "What is missing here?",
            type: "text"
        }
    },

    // This gets called by xkit_main.
    run: function() {

        // Time to boot up.
        this.running = true;

        if (!XKit.interface.where().dashboard) {
            // The user is not on the dashboard, lets quit.
            return;
        }

        $(".logo").css("display","none");

        // If the text is not blank, then show it. (non-empty strings are truthy)
        if (XKit.extensions.example.preferences.title_text.value) {
            document.title = XKit.extensions.example.preferences.title_text.value;
        } else {
            document.title = "Your logo is now gone!";
        }

        // Store something?
        XKit.storage.set("example","my_name","atesh");

    },

    destroy: function() {

        // We are shutting down! Better restore everything.
        this.running = false;

        // Especially the logo.
        $(".logo").css("display","block");

        // oh and the title.
        document.title = XKit.extensions.example.default_title;

    }

};
```
