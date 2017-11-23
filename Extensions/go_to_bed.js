//* TITLE Go to Bed **//
//* VERSION 1.0.0 **//
//* DESCRIPTION Changes Tumblr's blue background to a more sleep-friendly color at night. **//
//* DEVELOPER New-XKit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.go_to_bed = new Object( {

	running: false,

	preferences: {

		"sep0": {
			text: "Set when your dash transitions from day to night and back again.",
			type: "separator",
		},

		"sunset_start": {
			text: "Sunset start",
			type: "text",
			default: "1800",
			value: "1800",
		},

		"sunset_end": {
			text: "Sunset end",
			type: "text",
			default: "2200",
			value: "2200",
		},

		"sunrise_start": {
			text: "Sunrise start",
			type: "text",
			default: "0400",
			value: "0400",
		},

		"sunrise_end": {
			text: "Sunrise end",
			type: "text",
			default: "0800",
			value: "0800",
		},

		"sep1": {
			text: "Set colors for day/night.",
			type: "separator",
		},

		"day_color": {
			text: "Day color",
			type: "text",
			default: "",
			value: "",
		},

		"night_color": {
			text: "Night color",
			type: "text",
			default: "",
			value: "",
		},

		"real_sunset": {
			text: "Do you love the color of the sky?",
			default: false,
			value: false,
		},
	},

	time_fuckery: function(time) {
		time = time.toString();
		if (time.length <= 1) {
			time = "0" + time;
		}

		if (time.length <= 2) {
			time = "0" + time;
		}

		if (time.length <= 3) {
			time = "0" + time;
		}

		return parseInt(time.slice(0, 2)) * 60 * 60 + parseInt(time.slice(2, 4)) * 60;
	},

	run: function() {
		this.running = true;
		this.get_daynight();
	},

	get_daynight: function() {
		var sunset_start = this.time_fuckery(this.preferences.sunset_start.value);
		var sunset_end = this.time_fuckery(this.preferences.sunset_end.value);
		var sunrise_start = this.time_fuckery(this.preferences.sunrise_start.value);
		var sunrise_end = this.time_fuckery(this.preferences.sunrise_end.value);
		var dt = new Date();
		var time = parseInt(dt.getHours() * 60 * 60 + dt.getMinutes() * 60 + dt.getSeconds());

		if (((sunset_end > sunrise_start) && (time > sunset_end || time < sunrise_start)) || ((sunset_end < sunrise_start) && (time > sunset_end && time < sunrise_start))) {
			// Night
			this.set_time(0);
			if (time < sunrise_start) {
				setTimeout(function() {
					if (sunrise_start < sunrise_end) {
						XKit.extensions.go_to_bed.do_sunmove(sunrise_end - sunrise_start, sunrise_start - time, 1);
					} else if (sunrise_start > sunrise_end) {
						XKit.extensions.go_to_bed.do_sunmove((time - sunrise_end) + sunrise_start, sunrise_start - time, 1);
					}
				}, (sunrise_start - time) * 1000);
			} else {
				setTimeout(function() {
					if (sunrise_start < sunrise_end) {
						XKit.extensions.go_to_bed.do_sunmove(sunrise_end - sunrise_start, sunrise_start - time, 1);
					} else if (sunrise_start > sunrise_end) {
						XKit.extensions.go_to_bed.do_sunmove((time - sunrise_end) + sunrise_start, sunrise_start - time, 1);
					}
				}, ((24 * 60 * 60) - time + sunrise_start) * 1000);
			}
		} else if (((sunrise_end > sunset_start) && (time > sunrise_end || time < sunset_start)) || ((sunrise_end < sunset_start) && (time > sunrise_end && time < sunset_start))) {
			// Day
			this.set_time(1);
			if (time < sunset_start) {
				setTimeout(function() {
					if (sunset_start < sunset_end) {
						XKit.extensions.go_to_bed.do_sunmove(sunset_end - sunset_start, sunset_start - time, 0);
					} else if (sunset_start > sunset_end) {
						XKit.extensions.go_to_bed.do_sunmove((time - sunset_end) + sunset_start, sunset_start - time, 0);
					}
				}, (sunset_start - time) * 1000);
			} else {
				setTimeout(function() {
					if (sunset_start < sunset_end) {
						XKit.extensions.go_to_bed.do_sunmove(sunset_end - sunset_start, sunset_start - time, 0);
					} else if (sunset_start > sunset_end) {
						XKit.extensions.go_to_bed.do_sunmove((time - sunset_end) + sunset_start, sunset_start - time, 0);
					}
				}, ((24 * 60 * 60) - time + sunset_start) * 1000);
			}
		} else if (((sunset_start > sunset_end) && (time < sunset_end || time > sunset_start)) || ((sunset_start < sunset_end) && (time > sunset_start && time < sunset_end))) {
			//Sunset
			if (sunset_start < sunset_end) {
				XKit.extensions.go_to_bed.do_sunmove(sunset_end - sunset_start, sunset_start - time, 0);
			} else if (sunset_start > sunset_end) {
				XKit.extensions.go_to_bed.do_sunmove((time - sunset_end) + sunset_start, sunset_start - time, 0);
			}
		} else if (((sunrise_start > sunrise_end) && (time < sunrise_end || time > sunrise_start)) || ((sunrise_start < sunrise_end) && (time > sunrise_start && time < sunrise_end))) {
			//Sunrise
			if (sunrise_start < sunrise_end) {
				XKit.extensions.go_to_bed.do_sunmove(sunrise_end - sunrise_start, sunrise_start - time, 1);
			} else if (sunrise_start > sunrise_end) {
				XKit.extensions.go_to_bed.do_sunmove((time - sunrise_end) + sunrise_start, sunrise_start - time, 1);
			}
		}
	},


	do_sunmove: function(fade_time, delay_time, is_rise) {

		var start_color = "";
		var target_color = "";
		if (is_rise) {
			start_color = this.preferences.night_color.value;
			target_color = this.preferences.day_color.value;
			if (start_color == "") {
				start_color = "#111";
			}
			if (target_color == "") {
				target_color = "#36465d";
			}
		} else {
			start_color = this.preferences.day_color.value;
			target_color = this.preferences.night_color.value;
			if (start_color == "") {
				start_color = "#36465d";
			}
			if (target_color == "") {
				target_color = "#111";
			}
		}

		XKit.tools.remove_css("gotobed_time");

		XKit.tools.add_css(" \
			.identity, .left_column, .right_column, .l-content, .l-header-container { \
				animation: " + fade_time + "s linear " + delay_time + "s 1 alternate sunmove_bg; \
				animation-fill-mode: forwards; \
			} \
		", "gotobed_sunmove");
		XKit.tools.add_css(" \
			.plus-follow-button { \
				animation: " + fade_time + "s linear " + delay_time + "s 1 alternate sunmove_fg; \
				animation-fill-mode: forwards; \
			} \
		", "gotobed_sunmove");
		XKit.tools.add_css(" \
			.follow_list_item_blog::before { \
				animation: " + fade_time + "s linear " + delay_time + "s 1 alternate sunmove_border1; \
				animation-fill-mode: forwards; \
			} \
		", "gotobed_sunmove");
		XKit.tools.add_css(" \
			.tab-notice--outlined { \
				animation: " + fade_time + "s linear " + delay_time + "s 1 alternate sunmove_border2; \
				animation-fill-mode: forwards; \
			} \
		", "gotobed_sunmove");
		XKit.tools.add_css(" \
			.compose-button { \
				animation: " + fade_time + "s linear " + delay_time + "s 1 alternate sunmove_comp; \
				animation-fill-mode: forwards; \
			} \
		", "gotobed_sunmove");

		if (this.preferences.real_sunset.value) {
			XKit.tools.add_css(" \
				@keyframes sunmove_bg { \
					0%   { background-color: " + start_color + ";} \
					8%   { background-color: #3C4666;} \
					23%  { background-color: #A5A56A;} \
					30%  { background-color: #A88C3E;} \
					48%  { background-color: #9B5A3C;} \
					55%  { background-color: #8E404D;} \
					63%  { background-color: #7A375D;} \
					79%  { background-color: #3F2B56;} \
					91%  { background-color: #2C1E42;} \
					100% { background-color: " + target_color + "; } \
				} \
			", "gotobed_sunmove");
			XKit.tools.add_css(" \
				@keyframes sunmove_fg { \
					0%   { color: " + start_color + ";} \
					8%   { color: #3C4666;} \
					23%  { color: #A5A56A;} \
					30%  { color: #A88C3E;} \
					48%  { color: #9B5A3C;} \
					55%  { color: #8E404D;} \
					63%  { color: #7A375D;} \
					79%  { color: #3F2B56;} \
					91%  { color: #2C1E42;} \
					100% { color: " + target_color + "; } \
				} \
			", "gotobed_sunmove");
			XKit.tools.add_css(" \
				@keyframes sunmove_border1 { \
					0%   { border-right: 5px solid " + start_color + ";} \
					8%   { border-right: 5px solid #3C4666;} \
					23%  { border-right: 5px solid #A5A56A;} \
					30%  { border-right: 5px solid #A88C3E;} \
					48%  { border-right: 5px solid #9B5A3C;} \
					55%  { border-right: 5px solid #8E404D;} \
					63%  { border-right: 5px solid #7A375D;} \
					79%  { border-right: 5px solid #3F2B56;} \
					91%  { border-right: 5px solid #2C1E42;} \
					100% { border-right: 5px solid " + target_color + "; } \
				} \
			", "gotobed_sunmove");
			XKit.tools.add_css(" \
				@keyframes sunmove_border2 { \
					0%   { border: 2px solid " + start_color + ";} \
					8%   { border: 2px solid #3C4666;} \
					23%  { border: 2px solid #A5A56A;} \
					30%  { border: 2px solid #A88C3E;} \
					48%  { border: 2px solid #9B5A3C;} \
					55%  { border: 2px solid #8E404D;} \
					63%  { border: 2px solid #7A375D;} \
					79%  { border: 2px solid #3F2B56;} \
					91%  { border: 2px solid #2C1E42;} \
					100% { border: 2px solid " + target_color + "; } \
				} \
			", "gotobed_sunmove");
			XKit.tools.add_css("@keyframes sunmove_comp { 0% {fill: #529ecc;} 23% {fill: #aaa;} 100% {fill: #aaa;}}", "gotobed_sunmove");
			if (is_rise) {
				XKit.tools.add_css(" \
					.identity, .left_column, .right_column, .l-content, .l-header-container, .plus_follow_button, .follow_list_item_blog::before, .tab-notice--outlined, .compose-button { \
						animation-direction: reverse; \
					} \
				", "gotobed_sunmove");
			} else {
			}
		} else {
			XKit.tools.add_css(" \
				@keyframes sunmove_bg { \
					from { background-color: " + start_color + ";} \
					to { background-color: " + target_color + "; } \
				} \
			", "gotobed_sunmove");
			XKit.tools.add_css(" \
				@keyframes sunmove_fg { \
					from { color: " + start_color + ";} \
					to { color: " + target_color + "; } \
				} \
			", "gotobed_sunmove");
			XKit.tools.add_css(" \
				@keyframes sunmove_border1 { \
					from { border-right: 5px solid " + start_color + ";} \
					to { border-right: 5px solid " + target_color + "; } \
				} \
			", "gotobed_sunmove");
			XKit.tools.add_css(" \
				@keyframes sunmove_border2 { \
					from { border: 2px solid " + start_color + ";} \
					to { border: 2px solid " + target_color + "; } \
				} \
			", "gotobed_sunmove");
			if (is_rise) {
				XKit.tools.add_css("@keyframes sunmove_comp { from {fill: #aaa;} to {fill: #529ecc;}}", "gotobed_sunmove");
			} else {
				XKit.tools.add_css("@keyframes sunmove_comp { from {fill: #529ecc;} to {fill: #aaa;}}", "gotobed_sunmove");
			}
		}

		// The following animations don't appear to be supported yet, so making these gradients transparent for now.
		// Leaving these lines commented in case other browsers support them and/or Firefox support improves.
		//XKit.tools.add_css(".follow_list_item_blog::before {animation: " + fade_time + "s linear " + delay_time + "s 1 alternate sunmove_grad1; animation-fill-mode: forwards;}", "gotobed_sunmove");
		//XKit.tools.add_css("@keyframes sunmove_grad1 { from { background-image: linear-gradient(90deg, rgba(54, 70, 93, 0), " + "rgba(54, 70, 93, 0)" + ");} to { background-image: linear-gradient(90deg, rgba(54, 70, 93, 0), " + "rgba(54, 70, 93, 0)" + "); }}", "gotobed_sunmove");
		//XKit.tools.add_css(".right_column::after {animation: " + fade_time + "s linear 0s 1 alternate sunmove_grad2; animation-delay: " + delay_time + "s; animation-fill-mode: forwards;}", "gotobed_sunmove");
		//XKit.tools.add_css("@keyframes sunmove_grad { from { background: linear-gradient(180deg, " + "rgba(54, 70, 93, 0)" + ", rgba(54, 70, 93, 0));} to { background: linear-gradient(180deg, " + "rgba(54, 70, 93, 0)" + ", rgba(54, 70, 93, 0)); }}", "gotobed_sunmove");

		XKit.tools.add_css(".follow_list_item_blog::before {background: unset !important;}", "gotobed_sunmove");
		XKit.tools.add_css(".right_column::after {background-image: unset !important;}", "gotobed_sunmove");
		XKit.tools.add_css(".post_avatar {background-color: transparent;} .post_avatar .post_avatar_link {background: transparent;}", "gotobed_sunmove");

	},


	set_time: function(is_day) {

		var compose_color = "";
		var target_color = "";
		if (is_day) {
			compose_color = "#529ecc";
			target_color = this.preferences.day_color.value;
			if (target_color == "") {
				target_color = "#36465d";
			}
		} else {
			compose_color = "#aaa";
			target_color = this.preferences.night_color.value;
			if (target_color == "") {
				target_color = "#111";
			}
		}

		XKit.tools.add_css(" \
			.plus-follow-button { \
				color: " + target_color + "; \
			} \
		", "gotobed_time");
		XKit.tools.add_css(" \
			.identity, .post_avatar, .left_column, .right_column, .l-content, .l-header-container { \
				background-color: " + target_color + " !important; \
			} \
		", "gotobed_time");
		XKit.tools.add_css(" \
			.follow_list_item_blog::before { \
				background-image: linear-gradient(90deg, rgba(54, 70, 93, 0), " + target_color + ") !important; \
				border-right: 5px solid " + target_color + " !important; \
			} \
		", "gotobed_time");
		XKit.tools.add_css(" \
			.right_column::after { \
				background: linear-gradient(180deg, " + target_color + ", rgba(54, 70, 93, 0)) !important; \
			} \
		", "gotobed_time");
		XKit.tools.add_css(" \
			.tab-notice--outlined { \
				border: 2px solid " + target_color + "; \
			} \
		", "gotobed_time");
		XKit.tools.add_css(".compose-button {fill: " + compose_color + ";}", "gotobed_time"); // Because the blue was weird at night
	},


	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("gotobed_sunmove");
		XKit.tools.remove_css("gotobed_time");
	}

});
