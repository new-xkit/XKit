//* TITLE Classic Search **//
//* VERSION 1.0.5 **//
//* DESCRIPTION Get the old search back **//
//* DETAILS This is a very simple extension that simply redirects your search requests to the old Tumblr tag search pages. Note that features of the new search page, such as multiple tag search will not work when this extension is enabled. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.disable_search = {

	running: false,

	preferences: {
		"sep0": {
			text: "Search Results",
			type: "separator",
		},
		"open_in_new_tab": {
			text: "Open search results in a new tab",
			default: true,
			value: true
		}
	},


	run: function() {

		this.running = true;
		if (!XKit.interface.is_tumblr_page()) {
			return;
		}
		$('#search_form').on('submit', XKit.extensions.disable_search.do);
		var search_result_click_handler = function(e) {
			e.preventDefault();
			e.stopPropagation();
			if (XKit.extensions.disable_search.preferences.open_in_new_tab.value) {
				window.open(e.currentTarget.href);
			} else {
				document.location = e.currentTarget.href;
			}
		};
		var mo = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.target.className === 'scrollable_container'
					&& mutation.addedNodes.length > 0) {
					for (var i = 0; i < mutation.addedNodes.length; i++) {
						var links_to_change = $(mutation.addedNodes[i]).find('.search_typeahead');
						for (var j = 0; j < links_to_change.length; j++) {
							$(links_to_change[j]).off('click');
							$(links_to_change[j]).on('click', search_result_click_handler);
							$(links_to_change[j]).attr('href', $(links_to_change[j]).attr('href')
								.replace('/search/', '/tagged/'));
							if (XKit.extensions.disable_search.preferences.open_in_new_tab.value) {
								$(links_to_change[j]).attr('target', '_blank');
							}
						}
					}
				}
			});
		});
		mo.observe($('#search_results_container')[0], {childList: true, subtree: true});

	},

	do: function(e) {

		e.preventDefault();  //prevent form from submitting
		var query = $("#search_query").val();
		query = encodeURIComponent(query).replace(/%20/g, '+').replace(/_/g, '-');

		var url = "http://www.tumblr.com/tagged/" + query;

		if (XKit.extensions.disable_search.preferences.open_in_new_tab.value) {
			window.open(url);
		} else {
			document.location = url;
		}

	},

	destroy: function() {
		this.running = false;
		$('#search_form').off('submit', XKit.extensions.disable_search.do);
	}

};
