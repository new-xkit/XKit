## Issue priorities

The New XKit repository uses four priority labels for categorizing bug reports. These are, in order from most to least important:

* `P-Critical` - All or most of a commonly-used extension is broken, or one feature is broken across multiple extensions (such as an often-used patches function).
* `P-High` - One commonly-used function of an extension is broken, or the entirety of a less commonly used extension is broken.
* `P-Medium` - One feature of a less-commonly used extension is broken, or a commonly-used extension has a small bug that impacts user experience.
* `P-Papercut` - Anything that doesn't fall in any of the above categories, but is still nominally a bug (there's a compelling user story where this defect breaks user experience).

Priority labels should only be applied to issues with the `bug` tag - enhancements, unconfirmed bugs and pull requests should not be prioritized in this way.

Adding `P-Critical` or `P-High` should always be accompanied by a comment with a justification for applying the label. Lesser priority labels do not require this, but you should be prepared to explain your reasoning if asked.
