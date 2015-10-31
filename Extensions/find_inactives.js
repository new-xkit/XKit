//* TITLE Find Inactives **//
//* VERSION 0.3.1 **//
//* DESCRIPTION Find the inactive blogs you follow **//
//* DEVELOPER STUDIOXENIX **//
//* DETAILS This extension lets you find the blog that haven't been updated for over 30 days. Just go to list of blogs you follow, then click on &quot;Find Inactive Blogs&quot; button below your Crushes to get started. **//
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
				"2 weeks", "14",
				"A month", "30",
				"Two months", "60",
				"4 months", "120",
				"A year", "365"
			]
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
	people_per_page: 25,
	concurrent_requests: 8, //Arbitrary number.  This just seemed to go fast.  ~7.50 for 1000 Tumblrs

	start: function() {

		XKit.extensions.find_inactives.retired_people_list = [];
		XKit.extensions.find_inactives.people_list = [];
		XKit.extensions.find_inactives.page = 0;
		XKit.extensions.find_inactives.people_index = -1;

		XKit.window.show("Please wait..","I'm trying to find the inactive blogs, this might take a while." + XKit.progress.add("find-inactives") + "<div id=\"xkit-find-inactives-status\">Crunching the numbers...</div>","info");

		XKit.extensions.find_inactives.get_count();

	},

	get_count: function() {
		var count_text = $("#tabs").html().match(/Following.*Tumblr/gm)[0];
		count_text = count_text.replace(/[^0-9\.]/g, '');
		var people_count = parseInt(count_text);
		XKit.extensions.find_inactives.people_count = people_count;

		XKit.extensions.find_inactives.page_tracker.reset();
		XKit.extensions.find_inactives.page_tracker.set_page_count(people_count / this.people_per_page);

		//Start our concurrent requests.
		for(var i = 0; i < XKit.extensions.find_inactives.concurrent_requests; i++) {
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
		if(next_page < 0){
			if(this.page_tracker.has_completed()){
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

					var total = XKit.extensions.find_inactives.people_count;
					var perc = self.page_tracker.get_progress();

					console.log(perc + " | " + total);

					XKit.progress.value("find-inactives", perc);

					$(".follower", response.responseText).each(function() {

						var username = $(this).find(".name").find("a").html();
						var last_updated = $(this).find(".last_updated").html();
						var last_updated_days = XKit.extensions.find_inactives.days_since_updated(last_updated);


						if (XKit.extensions.find_inactives.people_list.indexOf(username) === -1) {
							XKit.extensions.find_inactives.people_list.push(username);
						}

						console.log(username + " => " + last_updated_days);

						if (last_updated_days >= parseInt(XKit.extensions.find_inactives.preferences.time.value)) {
							var m_user = {};
							m_user.username = username;
							m_user.days = last_updated;
							m_user.controls = $(this).find(".controls").html();
							XKit.extensions.find_inactives.retired_people_list.push(m_user);
						}

					});

					self.page_tracker.finished_processing_page(next_page);
					setTimeout(function() { XKit.extensions.find_inactives.next_page(); }, XKit.extensions.find_inactives.timeout_time);

				} catch(e) {
					XKit.extensions.find_inactives.show_error("<b>Unable to get the blog information.</b><br/>Please try again later.<br/><br/>Error Code: FIA-230<br/>" + e.message);
				}

			}
		});

	},


	days_since_updated: function(updated_time){
		if(! updated_time){
			return -1;
		}

		var time_value = updated_time.replace(/[^0-9\.]/g, '');
		time_value = parseInt(time_value, 10);

		if(updated_time.indexOf("day") > -1){
			return time_value;
		}
		if(updated_time.indexOf("week") > -1){
			return time_value * 7;
		}
		if(updated_time.indexOf("month") > -1){
			return time_value * 30;
		}
		if(updated_time.indexOf("year") > -1){
			return time_value * 365;
		}

		return 0;
	},

	//Keeps track of what pages are currently being processed, finished processing, and need to process.
	page_tracker: {

		page_count: 0,
		current_page: 0,
		page_processed: {}, //page_processed will either be undefined, false, or true.  Undefined: page not started.  false: page started to process.  true: page finished processing.

		//Resets this object to its base state.  Always set it before starting to find inactive followers.
		reset: function(){
			this.page_count = 0;
			this.current_page = 0;
			this.page_processed = {};
		},

		set_page_count: function(count){
			this.page_count = count;
		},

		//Returns the next page that needs to be processed, -1 of there are no pages to be processed.
		get_next_page: function(){
			for(var i = 0; i < this.page_count; i++){
				if(this.page_processed[i] === undefined){
					console.log("Processing page " + i + " | " + this.page_count);
					return i;
				}
			}
			return -1;
		},

		start_processing_page: function(page){
			this.page_processed[page] = false;
			if(this.current_page < page){
				this.current_page = page;
			}
		},

		finished_processing_page: function(page){
			this.page_processed[page] = true;
		},

		has_completed: function(){
			for(var i = 0; i < this.page_count; i++){
				if(! this.page_processed[i]){
					return false;
				}
			}
			return true;
		},

		//returns the progress of finding inactives.  Value are between 0 and 100.
		get_progress: function(){
			var progress_points = 0; // Weighted progress points.
			for(var i = 0; i < this.page_count; i++){

				if(this.page_processed[i] === false){
					progress_points += 1;
				}
				if(this.page_processed[i] === true){
					progress_points += 2;
				}
			}

			var total_points = this.page_count * 2;
			return (progress_points / total_points) * 100;
		}
	},

	list_people: function() {

		if (XKit.extensions.find_inactives.retired_people_list.length === 0) {

			XKit.window.show("All up to date!", "I couldn't find anyone who has been gone for more than " + XKit.extensions.find_inactives.preferences.time.value + " days.", "info","<div class=\"xkit-button default\" id=\"xkit-close-message\">Whee!</div>");
			return;

		}

		var m_html = '<div class="nano" id="find-inactives-window-outer"><div class="content" id="find-inactives-window">';

		for (var i=0;i<XKit.extensions.find_inactives.retired_people_list.length;i++) {

			m_html = m_html + '<div class="find-inactives-blog">' +
				'<div class="find-inactives-blog-link" data-url="http://' + XKit.extensions.find_inactives.retired_people_list[i].username + '.tumblr.com/">' +
			"<div class=\"name\">" + XKit.extensions.find_inactives.retired_people_list[i].username + "</div>" +
			"<div class=\"days\">" + XKit.extensions.find_inactives.retired_people_list[i].days + "</div>" +
			"<img src=\"http://api.tumblr.com/v2/blog/" + XKit.extensions.find_inactives.retired_people_list[i].username + ".tumblr.com/avatar/512\" class=\"avatar\">" +
				'</div>'+
			'<div style="float:right; margin-top: 10px; margin-right: 6px;">' + XKit.extensions.find_inactives.retired_people_list[i].controls +'</div>' +
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

		$(".unfollow_button").bind("click", function() {
			console.log(this);
			var unfollowButton = $(this);
			var name = $(this).attr("data-name");
			var key = $(this).attr("data-formkey");
			$.ajax({
				type: "POST",
				url: "/svc/unfollow",
				data: "form_key=" + key + "&data[tumblelog]=" + name + "&data[source]=UNFOLLOW_SOURCE_FOLLOWING_PAGE",
				dataType: "text"
			}).done(function() {
				unfollowButton.hide();
			});
		});



		if ($(".find-inactives-blog").length > 4) {

			$(".find-inactives-blog:last-child").css("border-bottom", "0");

		}

		$(".find-inactives-blog-link").click(function() {

			window.open($(this).attr('data-url'));

		});

	},


	destroy: function() {
		this.running = false;
		$("#xkit-find-inactives-button").remove();
	}

});
