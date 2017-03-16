`XKit.installed`: helpers for dealing with installed extensions.

## Methods

<a name="list" href="XKit.installed.md#list">#</a> XKit.installed.**list**()

Returns an array of installed extensions.

<a name="check" href="XKit.installed.md#check">#</a> XKit.installed.**check**(_extension_id_)

Returns `true` if `extension_id` is installed.

<a name="version" href="XKit.installed.md#version">#</a> XKit.installed.**version**(_extension_id_)

Returns the version of `extension_id`.

<a name="title" href="XKit.installed.md#title">#</a> XKit.installed.**title**(_extension_id_)

Returns the human-friendly title of `extension_id`.

<a name="icon" href="XKit.installed.md#icon">#</a> XKit.installed.**icon**(_extension_id_)

Returns the base64-encoded icon of `extension_id`.

<a name="css" href="XKit.installed.md#css">#</a> XKit.installed.**css**(_extension_id_)

Returns the stylesheet of `extension_id`.

<a name="description" href="XKit.installed.md#description">#</a> XKit.installed.**description**(_extension_id_)

Returns the description of `extension_id`.

<a name="developer" href="XKit.installed.md#developer">#</a> XKit.installed.**developer**(_extension_id_)

Returns the developer of `extension_id`.

## Tips

* `XKit.installed` also contains private methods reserved for XKit only that should never be used in an extension.
