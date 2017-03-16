## A short pull request checklist

Before you submit a pull request, please look over the following:

- The version of an extension has been incremented following the [Semantic Versioning pattern](http://semver.org/)
- If a pull request is associated with an issue, it should reference that issue.  See [Writing on GitHub#References](https://help.github.com/articles/writing-on-github/#references) on how to do this.
- Commented out code has been removed
- `XKit.extensions.blah.preferences.whatever.value === true` should be `XKit.extensions.blah.preferences.whatever.value`
- The code is clear enough for others to understand only from the pull request diff

## The stages of a pull request

Once you have a series of changes to XKit, the next step is to make a pull request, or PR. Github gives you a fancy button to click to begin the process. A PR will go through several stages in its life.

First Travis-CI testing immediately begins running once the PR is born. This runs `npm test`, which in turn runs ESLint on all of the JavaScript files in XKit. If you want to run this locally, follow the steps in the [README](../../README.md). This helps highlight errors before they are committed, but is not foolproof. If this does reveal errors, they should be fixed before the next step begins. If you want help fix errors, the [chat room](https://gitter.im/new-xkit/XKit) is a good place to ask for help.

The next step is for one of the project admins to review the code. If necessary, the reviewer will ask you to make changes to your code.

Finally, the reviewer will comment "@homu r+", triggering the merge of your code. Thank you for contributing to XKit!

## Useful resources

* [Writing on GitHub](https://help.github.com/articles/writing-on-github/)
* [GitHub Flavoured Markdown](https://help.github.com/articles/github-flavored-markdown/)
* [Closing Issues via Commit Messages](https://help.github.com/articles/closing-issues-via-commit-messages/)
