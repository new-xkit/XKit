//* TITLE Classic Search **//
//* VERSION 1.0.4 **//
//* DESCRIPTION Get the old search back **//
//* DETAILS This is a very simple extension that simply redirects your search requests to the old Tumblr tag search pages. Note that features of the new search page, such as multiple tag search will not work when this extension is enabled. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.disable_search = new Object({

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
		$('#search_form').on('submit', XKit.extensions.disable_search.do);
		$('#search_query').on('keyup keydown', XKit.extensions.disable_search.do_suggestions);

	},

	do_suggestions: function(e, stop) {

		$(".popover_menu_item .result a").each(function() {

			var new_link = $(this).attr('href').replace('/search/', '/tagged/');
			console.log(new_link);
			$(this).attr('href', new_link);

		});

		$(".search_typeahead").unbind("click");
		$(".search_typeahead").bind("click", function(ev) {

			ev.preventDefault();
			ev.stopPropagation();

			var new_link = $(this).attr('href').replace('/search/', '/tagged/');

			if (XKit.extensions.disable_search.preferences.open_in_new_tab.value === true) {
				window.open(new_link);
			} else {
				document.location = new_link;
			}

		});

		if (stop) { return; }

		// This is so fucking terrible but oh well.
		// Will do something better in the future.
		setTimeout(function() { XKit.extensions.disable_search.do_suggestions(true, true) }, 500);
		setTimeout(function() { XKit.extensions.disable_search.do_suggestions(true, true) }, 1500);

	},

	do: function(e) {

		e.preventDefault();  //prevent form from submitting
		var query = $("#search_query").val();
		query = encodeURIComponent(query).replace(/%20/g, '+').replace(/_/g, '-');

		var url = "http://www.tumblr.com/tagged/" + query;

		if (XKit.extensions.disable_search.preferences.open_in_new_tab.value === true) {
			window.open(url);
		} else {
			document.location = url;
		}

	},

	destroy: function() {
		this.running = false;
		$('#search_form').off('submit', XKit.extensions.disable_search.do);
	}

});