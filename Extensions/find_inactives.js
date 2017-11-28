//* TITLE Find Inactives **//
//* VERSION 0.4.1 **//
//* DESCRIPTION Find the inactive blogs you follow **//
//* DEVELOPER new-xkit **//
//* DETAILS This extension lets you find blogs that haven't been updated in a certain amount of time. Just go to list of blogs you follow, then click on &quot;Find Inactive Blogs&quot; button below your Crushes to get started. **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.find_inactives = new Object({

	running: false,

	timeout_time: 300,

	preferences: {
		time: {
			text: "Time to mark a blog as inactive",
			default: "30",
			value: "30",
			type: "combo",
			values: [
				"1 week", "7",
				"2 weeks", "14",
				"A month", "30",
				"Two months", "60",
				"4 months", "120",
				"A year", "365"
			]
		}
	},

	language_date_day: ["day", "tag", " jour", " giorn", "\u65e5", "g\u00fcn ", " d\u00eda", "\u0434\u043d\u044f", " dzie\u0144", " dni", "dia", " dag", "\uc77c", "\u5929"],
	language_date_week: ["week", "woche", " semaine", "settiman", "\u9031\u9593", " hafta ", " semana", "\u043d\u0435\u0434\u0435\u043b", " tydzie\u0144", " tygodnie", " semana", " weken", "\uc8fc", "\u5468", "\u9031"],
	language_date_month: ["month", "monat", " mois", " mese", " mesi", "\u6708", " ay ", " mes", "\u043c\u0435\u0441\u044f\u0446", " mies", "m\u00eas", " meses", " maand", "\ub2ec"],
	language_date_year: ["year", "jahr", " an", "anno", " anni", "\u5e74", " y\u0131l ", " a\u00f1o", "\u0433\u043e\u0434", " rok", " lat", " ano", " jaar", "\ub144", "\uc5f0\ub839"],

	language_date_strip: ["Mis \u00e0 jour il y a"],

	run: function() {
		this.running = true;

		if (document.location.href.indexOf("www.tumblr.com/following") === -1) { return; }

		XKit.tools.init_css("find_inactives");

		$(".grey_note").before('<div class="xkit-button xkit-wide-button" id="xkit-find-inactives-button" style="display: block; font-size: 12px; font-weight: bold; text-align: center; margin-bottom: 10px; margin-top: 15px;">Find Inactive Blogs</div>');

		$("#xkit-find-inactives-button").click(function() {

			XKit.extensions.find_inactives.start();

		});

		$(document).on('click', '.find-inactives-blog .unfollow_button', function(e) {
			XKit.extensions.find_inactives.unfollow_inactive_blog(e);
		});
	},

	people_list: [],
	retired_people_list: [],
	page: 0,
	people_count: 0,
	people_index: 0,
	people_per_page: 25,
	concurrent_requests: 8, //Arbitrary number.  This just seemed to go fast.  ~7.50 for 1000 Tumblrs

	start: function() {

		XKit.extensions.find_inactives.retired_people_list = [];
		XKit.extensions.find_inactives.people_list = [];
		XKit.extensions.find_inactives.page = 0;
		XKit.extensions.find_inactives.people_index = -1;

		XKit.window.show("Please wait..", "I'm trying to find the inactive blogs, this might take a while." + XKit.progress.add("find-inactives") + "<div id=\"xkit-find-inactives-status\">Crunching the numbers...</div>", "info");

		XKit.extensions.find_inactives.get_count();

	},

	get_count: function() {
		var count_text = $("#tabs").html();
		count_text = count_text.replace(/[^0-9]/g, '');


		var people_count = parseInt(count_text);
		XKit.extensions.find_inactives.people_count = people_count;

		XKit.extensions.find_inactives.page_tracker.reset();
		XKit.extensions.find_inactives.page_tracker.set_page_count(people_count / this.people_per_page);

		//Start our concurrent requests.
		for (var i = 0; i < XKit.extensions.find_inactives.concurrent_requests; i++) {
			XKit.extensions.find_inactives.next_page();
		}
	},

	show_error: function(message) {

		XKit.window.close();
		XKit.window.show("Find Inactives encountered an error", message, "error", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");

	},

	next_page: function() {
		var self = this;
		var next_page = this.page_tracker.get_next_page();
		if (next_page < 0) {
			if (this.page_tracker.has_completed()) {
				$("#xkit-find-inactives-status").html("Fetching information about the people I've just learned about...");
				XKit.extensions.find_inactives.list_people();
			}
			return;
		}

		this.page_tracker.start_processing_page(next_page);
		GM_xmlhttpRequest({
			method: "GET",
			url: "http://www.tumblr.com/following/" + (next_page * 25),
			json: false,
			onerror: function(response) {
				XKit.extensions.find_inactives.show_error("<b>Unable to get the blog information.</b><br/>Please try again later.<br/><br/>Error Code: FIA-330");
			},
			onload: function(response) {
				try {
					var perc = self.page_tracker.get_progress();

					XKit.progress.value("find-inactives", perc);

					$(".follower", response.responseText).each(function() {

						var username = $(this).find(".name").find("a").html();
						var last_updated = $(this).find(".last_updated").html();
						var last_updated_days = XKit.extensions.find_inactives.days_since_updated(last_updated);


						if (XKit.extensions.find_inactives.people_list.indexOf(username) === -1) {
							XKit.extensions.find_inactives.people_list.push(username);
						}


						if (last_updated_days >= parseInt(XKit.extensions.find_inactives.preferences.time.value)) {
							var m_user = {
								username: username,
								days: last_updated,
								days_value: last_updated_days
							};

							XKit.extensions.find_inactives.retired_people_list.push(m_user);
						}
					});

					// Sort inactive blogs -- Oldest first
					XKit.extensions.find_inactives.retired_people_list.sort(function(blog_a, blog_b) {
						return blog_b.days_value - blog_a.days_value;
					});

					self.page_tracker.finished_processing_page(next_page);
					setTimeout(function() { XKit.extensions.find_inactives.next_page(); }, XKit.extensions.find_inactives.timeout_time);

				} catch (e) {
					XKit.extensions.find_inactives.show_error("<b>Unable to get the blog information.</b><br/>Please try again later.<br/><br/>Error Code: FIA-230<br/>" + e.message);
				}

			}
		});

	},


	days_since_updated: function(updated_time) {
		if (! updated_time) {
			return -1;
		}

		var time_value = updated_time.replace(/[^0-9\.]/g, '');
		time_value = parseInt(time_value, 10);

		for (var i = 0; i < this.language_date_strip.length; i++) {
			updated_time = updated_time.replace(this.language_date_strip[i], '');
		}


		var days = this.calculate_days(updated_time, time_value, this.language_date_day, 1);
		if (days > 0) {
			return days;
		}

		days = this.calculate_days(updated_time, time_value, this.language_date_week, 7);
		if (days > 0) {
			return days;
		}

		days = this.calculate_days(updated_time, time_value, this.language_date_month, 30);
		if (days > 0) {
			return days;
		}

		days = this.calculate_days(updated_time, time_value, this.language_date_year, 365);
		if (days > 0) {
			return days;
		}

		return 0;
	},

	calculate_days: function(updated_time, time_value, time_language_array, multiplier) {
		var i = 0;
		while (i < time_language_array.length) {
			if (updated_time.indexOf(time_language_array[i]) > -1) {
				return multiplier * time_value;
			}
			i++;
		}
		return 0;
	},

	//Keeps track of what pages are currently being processed, finished processing, and need to process.
	page_tracker: {

		page_count: 0,
		current_page: 0,
		page_processed: {}, //page_processed will either be undefined, false, or true.  Undefined: page not started.  false: page started to process.  true: page finished processing.

		//Resets this object to its base state.  Always set it before starting to find inactive followers.
		reset: function() {
			this.page_count = 0;
			this.current_page = 0;
			this.page_processed = {};
		},

		set_page_count: function(count) {
			this.page_count = count;
		},

		//Returns the next page that needs to be processed, -1 of there are no pages to be processed.
		get_next_page: function() {
			for (var i = 0; i < this.page_count; i++) {
				if (this.page_processed[i] === undefined) {
					return i;
				}
			}
			return -1;
		},

		start_processing_page: function(page) {
			this.page_processed[page] = false;
			if (this.current_page < page) {
				this.current_page = page;
			}
		},

		finished_processing_page: function(page) {
			this.page_processed[page] = true;
		},

		has_completed: function() {
			for (var i = 0; i < this.page_count; i++) {
				if (! this.page_processed[i]) {
					return false;
				}
			}
			return true;
		},

		//returns the progress of finding inactives.  Value are between 0 and 100.
		get_progress: function() {
			var progress_points = 0; // Weighted progress points.
			for (var i = 0; i < this.page_count; i++) {

				if (this.page_processed[i] === false) {
					progress_points += 1;
				}
				if (this.page_processed[i] === true) {
					progress_points += 2;
				}
			}

			var total_points = this.page_count * 2;
			return (progress_points / total_points) * 100;
		}
	},

	list_people: function() {

		if (XKit.extensions.find_inactives.retired_people_list.length === 0) {

			XKit.window.show("All up to date!", `I couldn't find anyone who has been gone for more than ${XKit.extensions.find_inactives.preferences.time.value} days.`, "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">Whee!</div>");
			return;

		}

		var m_html = '<div class="nano" id="find-inactives-window-outer"><div class="content" id="find-inactives-window">';

		for (const blog of XKit.extensions.find_inactives.retired_people_list) {
			const username = blog.username;
			m_html += `<div data-url="http://${username}.tumblr.com/" class="find-inactives-blog">` +
			`<a class="name" href="http://${username}.tumblr.com/" target="_blank">${username}</a>` +
			`<div class="days">${blog.days}</div>` +
			`<img src="https://api.tumblr.com/v2/blog/${username}.tumblr.com/avatar/96" class="avatar"/>` +
			`<button class="chrome clear big unfollow_button" data-name="${username}">Unfollow</button>` +
			"</div>";
		}

		m_html += "</div></div>";

		$("body").css("overflow", "hidden");

		XKit.window.show(`Found ${XKit.extensions.find_inactives.retired_people_list.length} inactive blog(s)`, m_html, "info", "<div class=\"xkit-button default\" id=\"xkit-close-message-find-inactives\">OK</div>");

		$("#find-inactives-window-outer").nanoScroller();

		$("#xkit-close-message-find-inactives").click(function() {

			$("body").css("overflow", "auto");
			XKit.window.close();

		});

		if ($(".find-inactives-blog").length > 4) {

			$(".find-inactives-blog:last-child").css("border-bottom", "0");

		}
	},
	unfollow_inactive_blog: function(event) {
		var username = $(event.target).data('name');
		//make sure xkit window doesn't hide confirmation dialogue
		$('#xkit-window-shadow').css('zIndex', 8900);
		$('#xkit-window').css('zIndex', 9000);
		XKit.tools.add_function(XKit.extensions.find_inactives.trigger_unfollow, true, username);
	},
	trigger_unfollow: function() {
		var username = add_tag;
		// We're gonna assume Tumblr won't permit usernames that'd lead to XSS.
		var removalTarget = jQuery(`.find-inactives-blog[data-url="http://${username}.tumblr.com/"]`);
		Tumblr.Dialog.confirm(`Are you sure you want to unfollow <strong>${username}</strong>?`, function() {
			Tumblr.unfollow({
				tumblelog: username,
				source: "UNFOLLOW_SOURCE_FOLLOWING_PAGE"
			}, {
				success: function() {
					removalTarget.hide();
				},
				complete: function() {
					removalTarget.hide();
				},
				error: function() {
					Tumblr.Dialog.alert("Something went wrong.");
				}
			});
		});
	},

	destroy: function() {
		this.running = false;
		$("#xkit-find-inactives-button").remove();
	}

});
