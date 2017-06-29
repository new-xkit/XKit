# Tumblr Classes

These are the stylesheet classes used by Tumblr on their pages.

> **Help Needed**: If you know more ids and classes Tumblr uses, please add them to this page.

## Posts

* Each post is wrapped around a `post_container` li.
* Each post has the class `.post` and `.post_full`

### Data attributes

* `data-post-id` for post ID of the post
* `data-type` for post type of the post
* `data-following-tumblelog` if following that user
* `data-tumblelog-name` for owner of the post
* `data-root-id` for the post ID of the original post
* `data-json` metadata about the post in json format
* `data-is-animated` whether the original photoset or video has animation

### Post Types

* .is_photo
* .is_photoset
* .is_video
* .is_audio
* .is_conversation
* .is_link
* .is_quote

### Others

* .is_mine if posted by user on main/sideblogs.
* .is_original if it is the original post made, not a reblog.
* .is_regular if it is a regular text post
* .is_note is a publically posted ask
* .is_reblog if it is a reblogged post
