`XKit.notifications`: show little notifications on the bottom-left corner of the screen.

## Methods

<a name="add" href="XKit.notifications.md#add">#</a> XKit.notifications.**add**(_message_, _type_, _sticky_, _callback_)

Show a notification. Set `sticky` to `true` if you want it to stay on the screen until the user clicks on it.
The `type` parameter can be `ok`, `warning`, or `error`.
Each notification, unless sticky, is shown for 5 seconds.

## Usage

```javascript
XKit.notifications.add("Click me for something new!", "ok", false, function() {
    XKit.notifications.add("Hehe, just kidding","ok");
});
```

## Tips

* Try to limit the notifications you send.
