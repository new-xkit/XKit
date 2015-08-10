//* TITLE Find Inactives **//
//* VERSION 0.2.1 **//
//* DESCRIPTION Find the inactive blogs you follow **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS This extension lets you find the blog that haven't been updated for over 30 days. Just go to list of blogs you follow, then click on &quot;Find Inactive Blogs&quot; button below your Crushes to get started. **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.find_inactives = new Object({

	running: false,
	apiKey: XKit.api_key,

	timeout_time: 300,

	preferences: {
		time: {
			text: "Time to mark a blog as inactive",
			default: "30",
			value: "30",
			type: "combo",
			values: [
				"2 weeks", "15",
				"A month", "30",
				"Two months", "60",
				"4 months", "120",
				"A year", "365",
			],
		}
	},

	run: function() {
		this.running = true;

		if (document.location.href.indexOf("www.tumblr.com/following") === -1) { return; }

		XKit.tools.init_css("find_inactives");

		$(".grey_note").before('<div class="xkit-button xkit-wide-button" id="xkit-find-inactives-button" style="display: block; font-size: 12px; font-weight: bold; text-align: center; margin-bottom: 10px; margin-top: 15px;">Find Inactive Blogs</div>');

		$("#xkit-find-inactives-button").click(function() {

			XKit.extensions.find_inactives.start();

		});

	},

	people_list: [],
	retired_people_list: [],
	page: 0,
	people_count: 0,
	people_index: 0,

	start: function() {

		XKit.extensions.find_inactives.retired_people_list = [];
		XKit.extensions.find_inactives.people_list = [];
		XKit.extensions.find_inactives.page = 0;
		XKit.extensions.find_inactives.people_index = -1;

		XKit.window.show("Please wait..","I'm trying to find the inactive blogs, this might take a while." + XKit.progress.add("find-inactives") + "<div id=\"xkit-find-inactives-status\">Initializing...</div>","info");

		XKit.extensions.find_inactives.get_count();

	},

	get_count: function() {
		var done = false;
		$("#tabs").children().each(function() {
			if (done) {
				return;
			}
			var tab = $(this);
			if (tab.attr('href') !== '/following') {
				return;
			}
			done = true;

			// Extract the first number found
			XKit.extensions.find_inactives.people_count = parseInt(tab.text().match(/\d+/));
			XKit.extensions.find_inactives.next_page();
		});
	},

	show_error: function(message) {

		XKit.window.close();
		XKit.window.show("Find Inactives encountered an error", message, "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");

	},

	list_people: function() {

		if (XKit.extensions.find_inactives.retired_people_list.length === 0) {

			XKit.window.show("All up to date!", "I couldn't find anyone who has been gone for more than " + XKit.extensions.find_inactives.preferences.time.value + " days.", "info","<div class=\"xkit-button default\" id=\"xkit-close-message\">Whee!</div>");
			return;

		}

		var m_html = '<div class="nano" id="find-inactives-window-outer"><div class="content" id="find-inactives-window">';

		for (var i=0;i<XKit.extensions.find_inactives.retired_people_list.length;i++) {

			m_html = m_html + 	"<div data-url=\"http://" + XKit.extensions.find_inactives.retired_people_list[i].username + ".tumblr.com/\" class=\"find-inactives-blog\">" +
							"<div class=\"name\">" + XKit.extensions.find_inactives.retired_people_list[i].username + "</div>" +
							"<div class=\"days\">Inactive for " + XKit.extensions.find_inactives.retired_people_list[i].days + " days</div>" +
							"<img src=\"http://api.tumblr.com/v2/blog/" + XKit.extensions.find_inactives.retired_people_list[i].username + ".tumblr.com/avatar/512\" class=\"avatar\">" +
						"</div>";

		}

		m_html = m_html + "</div></div>";

		$("body").css("overflow","hidden");

		XKit.window.show("Found " + XKit.extensions.find_inactives.retired_people_list.length + " inactive blog(s)", m_html, "info","<div class=\"xkit-button default\" id=\"xkit-close-message-find-inactives\">OK</div>");

		$("#find-inactives-window-outer").nanoScroller();

		$("#xkit-close-message-find-inactives").click(function() {

			$("body").css("overflow","auto");
			XKit.window.close();

		});


		if ($(".find-inactives-blog").length > 4) {

			$(".find-inactives-blog:last-child").css("border-bottom", "0");

		}

		$(".find-inactives-blog").click(function() {

			window.open($(this).attr('data-url'));

		});

	},

	next_person: function() {

		XKit.extensions.find_inactives.people_index++;

		if (XKit.extensions.find_inactives.people_index >= XKit.extensions.find_inactives.people_list.length) {

			XKit.extensions.find_inactives.list_people();
			return;

		}

		var api_url = "https://api.tumblr.com/v2/blog/" + XKit.extensions.find_inactives.people_list[XKit.extensions.find_inactives.people_index] + ".tumblr.com/info" + "?api_key=" + XKit.extensions.find_inactives.apiKey;

		GM_xmlhttpRequest({
				method: "GET",
				url: api_url,
				json: true,
			onerror: function(response) {
				// Probably a bug in the list.
				setTimeout(function() { XKit.extensions.find_inactives.next_person(); }, 800);
				console.log("Error -> Can't get API read for person " + XKit.extensions.find_inactives.people_list[XKit.extensions.find_inactives.people_index]);
				return;
			},
			onload: function(response) {

				try {

					var total = XKit.extensions.find_inactives.people_count;
					var perc = (XKit.extensions.find_inactives.people_index) * 100 / total;

					XKit.progress.value("find-inactives", perc);

					var data = JSON.parse(response.responseText).response;
					var post_date = new Date(data.blog.updated * 1000);

					var days = Math.round(Math.abs((post_date.getTime() - new Date().getTime())/(24*60*60*1000)));

					console.log("days for user " + XKit.extensions.find_inactives.people_list[XKit.extensions.find_inactives.people_index] + " -> " + days);

					if (days >= parseInt(XKit.extensions.find_inactives.preferences.time.value)) {

						var m_user = {};
						m_user.username = XKit.extensions.find_inactives.people_list[XKit.extensions.find_inactives.people_index];
						m_user.days = days;

						XKit.extensions.find_inactives.retired_people_list.push(m_user);

					}

					setTimeout(function() { XKit.extensions.find_inactives.next_person(); }, XKit.extensions.find_inactives.timeout_time);

				} catch(e) {
					// Probably a bug in the list or an empty blog.
					console.log("Error on person " + XKit.extensions.find_inactives.people_list[XKit.extensions.find_inactives.people_index] + " -> " + e.message);
					setTimeout(function() { XKit.extensions.find_inactives.next_person(); }, 800);
				}

			}
		});

	},

	next_page: function() {

		GM_xmlhttpRequest({
			method: "GET",
			url: "http://www.tumblr.com/following/" + (XKit.extensions.find_inactives.page * 25),
			json: false,
			onerror: function(response) {
				XKit.extensions.find_inactives.show_error("<b>Unable to get the blog information.</b><br/>Please try again later.<br/><br/>Error Code: FIA-330");
				return;
			},
			onload: function(response) {

				try {

					var total = XKit.extensions.find_inactives.people_count;
					var perc = (XKit.extensions.find_inactives.page * 25) * 100 / total;

					XKit.progress.value("find-inactives", perc);

					$(".follower", response.responseText).each(function() {

						var username = $(this).find(".name").find("a").html();

						if (XKit.extensions.find_inactives.people_list.indexOf(username) === -1) {
							XKit.extensions.find_inactives.people_list.push(username);
						}

					});

					if ($(".next", response.responseText).length > 0) {

						XKit.extensions.find_inactives.page++;
						setTimeout(function() { XKit.extensions.find_inactives.next_page(); }, XKit.extensions.find_inactives.timeout_time);

					} else {

						$("#xkit-find-inactives-status").html("Fetching information about the people I've just learned about...");
						setTimeout(function() { XKit.extensions.find_inactives.next_person(); }, 500);

					}

				} catch(e) {
					XKit.extensions.find_inactives.show_error("<b>Unable to get the blog information.</b><br/>Please try again later.<br/><br/>Error Code: FIA-230<br/>" + e.message);
					return;
				}

			}
		});

	},

	destroy: function() {
		this.running = false;
		$("#xkit-find-inactives-button").remove();
	}

});
