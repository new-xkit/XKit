# Legacy Headers

Called "Legacy" only because they've been use since XKit 0.4.x days, Legacy Headers are parsed by XKit servers and XKit itself to give the user information about the extension. They are required for all extensions.

## Headers

#### TITLE (required)

User-readable, fancy name for the extension.

#### VERSION (required)

The versioning scheme follows [Semantic Versioning](http://semver.org/) in the form of `<MAJOR>.<MINOR>.<PATCH>`, e.g. `2.1.7`.

#### DESCRIPTION (required)

A really short description of your extension.

#### DEVELOPER (required)

Your GitHub username.  Be sure to use your _actual_ username, as XKit automatically uses this value for linking.

#### FRAME (required)

Either `true` or `false`. If set to `true`, your extension will only run on the Tumblr IFRAME on people's blogs.

#### SLOW (required)

Either `true` or `false`. Set to `true` if your extension manipulates DOM extensively.

#### DETAILS (optional)

A long description for your extension. Do not use slashes here.  Simple HTML formatting is allowed.

Example:

`//* DETAILS This is my extension<br>Enjoy it. **//`

#### BETA (optional)

Set to `true` if the extension is early in development or is being offered as a preview.

## Complete Headers Example

```
//* TITLE Tweaks **//
//* VERSION 2.0.1 **//
//* DESCRIPTION Various little tweaks for your dashboard. **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS These are small little tweaks .... your computer. **//
//* FRAME false **//
//* SLOW true **//
//* BETA false **//
```
