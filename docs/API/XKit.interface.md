## Table of Contents

* [Posts](#posts)
* [Adding buttons](#adding-buttons)
* [Authorization](#authorization)
* [Post Window Listener](#post-window-listener)
* [Post Window](#post-window)
* [User Information](#user-information)
* [Page](#page)
* [Fetching and Submitting](#fetching-and-submitting)
* [Other](#other)

## Introduction

`XKit.interface`: returns information about stuff going on on the dashboard.

In the past, each XKit extension individually used jQuery selectors to get information about Tumblr objects such as a post. When Tumblr changes something, all of the extensions would break. By centralizing these calls, changes can be made to `XKit.interface` and the changes will propagate to all the extensions that make use of the interface.

## Posts

<a name="get_posts" href="XKit.interface.md#get_posts">#</a> XKit.interface.**get_posts**(_without_tag_, _mine_)

If without_tag is empty, all posts are returned. If it's not, posts NOT containing that tag will be returned. Use this to add a tag to the posts you've already processed.

If mine is `true`, user's own posts will be returned.

Returns an array of all posts found.

Example usage:

```javascript
var posts = XKit.interface.get_posts("quick-tags-not-done", true);
$(posts).each(function() {
     // Do something here.
     $(this).css("background","red");
});
```

<a name="post" href="XKit.interface.md#post">#</a> XKit.interface.**post**(_post_)

Takes a post object (ie: `this`).

Returns information about post on the dashboard.

Returns an object with the following properties:

* `id`: Post ID (ie: 56977682463)
* `root_id`: Post Root ID
* `reblog_key`: Post Reblog key
* `owner`: Post owner URL (ie: xenix)
* `type`: Post Type. Can be one of the following:
  * photo
  * photoset
  * quote
  * link
  * conversation
  * audio
  * video
  * note
* `tags`: Tags on the post, separated by commas.
* `liked`: `true` if the user liked this post.
* `permalink`: Permalink of the post (undefined in some cases)
* `is_reblogged`: `true` if this is a reblogged post
* `is_mine`: `true` if the post is user's
* `is_following`: `true` if the user is following the owner of this post.
* `avatar`: URL of the avatar image

Example usage:

```javascript
var posts = XKit.interface.get_posts("quick-tags-not-done", true);
$(posts).each(function() {
    // Do something here.
    var post_object = XKit.interface.post(this);
    if (post_object.type === "regular") {
        $(this).css("background","red");
    }
});
```

This will get all the posts that is owned by the user, and turn the text posts red.

<a name="find_post" href="XKit.interface.md#find_post">#</a> XKit.interface.**find_post**(_post_id_)

Wrapper for `XKit.interface.post()`. Supply the `post_id` , and if the post is in the dashboard, a Post Object will be returned. If not, a new object with the `error` set to `true` will be returned.

Example usage:

```javascript
var post = XKit.interface.find_post("30219394");
if (post.error == false) {
    alert(post.id + " is the post id.");
} else {
    alert("Oops.");
}
```

## Adding buttons

<a name="create_control_button" href="XKit.interface.md#create_control_button">#</a> XKit.interface.**create_control_button**(_class_name_, _icon_, _text_, _func_, _ok_icon_)

Called once to instantiate a button. Pick a `class_name` that is unique, supply a base64-encoded image string for `icon`, a `text` for the button, and the function to be called when the user clicks the button. You must call this first before adding buttons to posts. `ok_icon` should be a green version of the icon, to be used with `completed_control_button()`.

Example usage:

```javascript
XKit.interface.create_control_button("xkit-quick-tags", this.button_icon, "Quick Tags!", function() {
    alert("hello world!");
});
```

<a name="add_control_button" href="XKit.interface.md#add_control_button">#</a> XKit.interface.**add_control_button**(_post_, _class_name_, _additional_)

Called for each post to which to add the button. `post` is the post object, `class_name` is the button's unique ID, and `additional` can be used to add data to the button.

Example usage:

```javascript
var posts = XKit.interface.get_posts("quick-tags-not-done", true);
$(posts).each(function() {
    XKit.interface.add_control_button(this, "xkit-quick-tags", "");
});
```

The added button will have the following attributes to make it easier to quickly access the most-used properties of a post:

* `data-post-id`: Post ID
* `data-post-type`: Type of the post (see above)
* `data-post-permalink`: Permalink to the post

Data passed as `additional` will be added directly to the button. Use it to add any additional data you might need:

```javascript
var posts = XKit.interface.get_posts("quick-tags-not-done", true);
$(posts).each(function() {
    XKit.interface.add_control_button(this, "xkit-quick-tags", "data-my-data=\"hello\" data-another-data=\"yo!\"");
});
```

<a name="disable_control_button" href="XKit.interface.md#disable_control_button">#</a> XKit.interface.**disable_control_button**(_obj_, _disabled_)

Turns the button into a disabled one. The callback won't be called if `disabled` is `true`.

<a name="switch_control_button" href="XKit.interface.md#switch_control_button">#</a> XKit.interface.**switch_control_button**(_obj_, _working_)

Makes the button show the spinning "working" icon. The callback won't be called while working is `true`. Call this when you will be doing stuff like fetching a page and let them know you are working, or when you don't want the user to click on a button twice.

<a name="completed_control_button" href="XKit.interface.md#completed_control_button">#</a> XKit.interface.**completed_control_button**(_obj_, _will_be_green_)

Turns the button into a green one. Callback will still fire if the user clicks on it. Checs for class `xkit-interface-completed` if you don't want the user to use your button again.

## Authorization

<a name="form_key" href="XKit.interface.md#form_key">#</a> XKit.interface.**form_key**()

Returns the form key, used to authorize some transactions by Tumblr.

## Post Window Listener

Just like Post Listener, executes functions when the user opens a new post / manual reblogging window. Each function is executed once on each window open.

<a name="pl_add" href="XKit.interface.md#pl_add">#</a> XKit.interface.post_window_listener.**add**(_id_, _function_)

Add a new function to execute on each window open. You must specify an ID for the function.

Example usage:

```javascript
XKit.interface.post_window_listener.add("quick_tags", XKit.extensions.quick_tags.post_window);
```

<a name="pl_remove" href="XKit.interface.md#pl_remove">#</a> XKit.interface.post_window_listener.**remove**(_id_)

Removes function from the list.

Example usage:

```javascript
XKit.interface.post_window_listener.remove("quick_tags");
```

## Post Window

Lets you manipulate or get information from Manual Reblogging / New Post Window.

<a name="pw_state" href="XKit.interface.md#pw_state">#</a> XKit.interface.post_window.**state**()

Returns an object, with the following booleans:

* `publish`
* `draft`
* `queue`
* `private`

Example usage:

```javascript
var state = XKit.interface.post_window.state();
if (state.queue) {
    alert("So you are gonna queue this eh?");
}
```

<a name="pw_add_tag" href="XKit.interface.md#pw_add_tag">#</a> XKit.interface.post_window.**add_tag**(_tag_)

Tag can be an array or a string. Appends it to the tags list on the window.

Example usage:

```javascript
XKit.interface.post_window.add_tag("Hello!"); // will add #Hello! to the post.
```

<a name="pw_tag_exists" href="XKit.interface.md#pw_tag_exists">#</a> XKit.interface.post_window.**tag_exists**(_tag_)

Returns `true` if the tag exists.

<a name="pw_remove_tag" href="XKit.interface.md#pw_remove_tag">#</a> XKit.interface.post_window.**remove_tag**(_tag_)

Removes specified tag from the post.

<a name="pw_blog" href="XKit.interface.md#pw_blog">#</a> XKit.interface.post_window.**blog**()

Returns the URL of the blog the post is going to get posted to.

Example usage:

```javascript
if (XKit.interface.post_window.blog() === "xenix") {
    alert("Yay, you are posting on my blog.. somehow?");
}
```

<a name="pw_open" href="XKit.interface.md#pw_open">#</a> XKit.interface.post_window.**open**()

Returns `true` if the post window is still open.

<a name="pw_switch_blog" href="XKit.interface.md#pw_switch_blog">#</a> XKit.interface.post_window.**switch_blog**(_url_)

Changes blog to specified username. Returns `true` on success.

Example usage:

```javascript
XKit.interface.post_window.switch_blog("xkit-extension");
```

<a name="pw_type" href="XKit.interface.md#pw_type">#</a> XKit.interface.post_window.**type**()

Returns an object containing post type information, with the following boolean properties:
* text
* photo
* quote
* link
* chat
* video
* audio


Example usage:

```javascript
var post_type = XKit.interface.post_window.type();
if (post_type.audio) {
    alert("Yay for audio!");
}
```

<a name="pw_origin" href="XKit.interface.md#pw_origin">#</a> XKit.interface.post_window.**origin**()

Returns an object that allows you to check if the user is creating a new post or reblogging one.

```javascript
var origin = XKit.interface.post_window.origin();
if (origin.is_reblog) {
    alert("Yay for reblogging!");
}
if (origin.is_original) {
    alert("Yay for creating new stuff!");
}
```

## User Information

<a name="user" href="XKit.interface.md#user">#</a> XKit.interface.**user**()

Returns data about the current blog selected:
* `posts`: Number of posts
* `followers`: Number of followers
* `drafts`: Number of drafts
* `queue`: Number of queued posts

Example usage:

```javascript
var user = XKit.interface.user();
alert("You have " + user.followers + " followers! Congrats!");
```

## Page

<a name="where" href="XKit.interface.md#where">#</a> XKit.interface.**where**()

Returns information about which page the user is on:
* `dashboard`: `true` if user is in dashboard
* `inbox`: `true` if user is in inbox/messages
* `channel`: `true` if user is in tumblr.com/blog/[blog]

Example usage:

```javascript
if (XKit.interface.where().dashboard === true) {
    alert("Hooray you are in dashboard now!");
}
```

## Fetching and Submitting

<a name="fetch" href="XKit.interface.md#fetch">#</a> XKit.interface.**fetch**(_post_, _callback_, _reblog_mode_)

Makes a request to the Tumblr server to return their post object. `post` must be the result you get from `XKit.interface.post()` or `XKit.interface.find_post()`.
When it's done, the callback will be called with the data or status information. `reblog_mode` **must be set to true** for posts not owned by the user.

Example usage:

```javascript
var post = XKit.interface.find_post("498392831");
if (!post.error) {
    XKit.interface.fetch(post, function(data) {
        if (data.error) {
            // Could not fetch anything!
            alert("Error: " + data.message + "\n" + data.status);
        } else {
            alert("Post tags are: " + data.data.post.tags);
        }
    }, false);
}
```

## Other

<a name="revision" href="XKit.interface.md#revision">#</a> XKit.interface.**revision**()

Returns an integer with the Interface version.

Example usage:

```javascript
if (XKit.interface.revision <= 2) {
    alert("I need XKit Interface 3 or above.");
}
```
