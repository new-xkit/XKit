`XKit.storage`: store and retrieve information.

> :warning: **Note**: the user can erase an extension's storage by clicking on Reset Settings in the XKit Control Panel.

## Methods

<a name="set" href="XKit.storage.md#set">#</a> XKit.storage.**set**(_extension_id_, _key_, _value_)

Sets `key` to `value`. Returns `true` on success.

Example usage:

```javascript
XKit.storage.set("my_extension", "name", "xenixlet");
```

<a name="get" href="XKit.storage.md#get">#</a> XKit.storage.**get**(_extension_id_, _key_, _default_value_)

Retrieves the value of `key` from storage. If nothing is found, returns `default_value`.

Example usage:

```javascript
var my_name = XKit.storage.get("my_extension", "name", "");
if (my_name !== "") {
    alert("Your name is " + my_name);
}
```

<a name="get_all" href="XKit.storage.md#get_all">#</a> XKit.storage.**get_all**(_extension_id_)

Returns everything stored in `extension_id` storage area as an object.

<a name="remove" href="XKit.storage.md#remove">#</a> XKit.storage.**remove**(_extension_id_, _key_)

Removes `key` from storage. Returns `true` on success.

Example usage:

```javascript
XKit.storage.remove("my_extension", "name");
```

<a name="size" href="XKit.storage.md#size">#</a> XKit.storage.**size**(_extension_id_)

Returns the size of data stored by `extension_id`.

<a name="quota" href="XKit.storage.md#quota">#</a> XKit.storage.**quota**(_extension_id_)

Returns the storage space left for `extension_id`.

Example usage:

```javascript
if (XKit.storage.quota("my_extension") >= 300) {
    // Store a 300-character data here!
} else {
    // Clear the storage
    XKit.storage.clear("my_extension");
}
```

<a name="clear" href="XKit.storage.md#clear">#</a> XKit.storage.**clear**(_extension_id_)

Clear storage area for `extension_id`.

## Tips

* Each extension can store only up to 150kb data.
* If your extension exceeds the storage limit, XKit will warn the user and let them erase your storage, annoying you and the user.
* Never, _ever_ piggyback on another extension's storage area. Always use your unique `extension_id`.
