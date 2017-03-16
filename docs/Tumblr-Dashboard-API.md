# Tumblr Dashboard API

These are the functions used by Tumblr on their pages.

> **Help Needed**: If you know more events, functions and triggers Tumblr uses, please add them to this page.

### updateRect

Added around/before June 19, Tumblr now checks for the vertical length of the page before triggering the post loader on dashboard, so if you remove/adjust the height of posts, call this.

Example usage:

```javascript
Tumblr.Events.trigger("DOMEventor:updateRect");
```

### posts:load

Lets Tumblr render new posts.

Example usage:

```javascript
Tumblr.Events.trigger("posts:load");
```
