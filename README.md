# XKit

[![Join the chat at https://gitter.im/new-xkit/XKit](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/new-xkit/XKit?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

XKit is a small extension framework that powers tweaks for Tumblr.

## Get a release build
If you want an official XKit release, those are provided by the [official
download page](http://www.xkit.info/download). For this unofficial fork of
XKit, look [here](https://github.com/new-xkit/XKit/releases).

## Contribute
XKit needs all the help it can get! If you want to help out, the first step is
finding something going wrong. There's a long list of known issues
[on our issues page](https://github.com/new-xkit/XKit/issues) and
[on the original issues page](https://github.com/atesh/XKit/issues). The next step is to
[fix the bug](https://github.com/new-xkit/XKit/wiki/Fixing-a-bug).

## Writing a New Extension
Check out [the wiki page](https://github.com/new-xkit/XKit/wiki/Writing-a-New-Extension)!

## Develop XKit
Download [Node.js](https://nodejs.org/). In your clone of this repository run
the following:
```
npm install --dev-dependencies
```
At this point, if you want to build the extensions run `./build.sh all`. They
will appear in the `build` directory. If you want to run our automated tests,
run `npm test`. To automatically run those tests whenever you edit files, run
`grunt watch`.
