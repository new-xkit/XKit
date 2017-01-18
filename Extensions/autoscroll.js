//* TITLE Auto Scroll **//
//* VERSION 1.2.0 **//
//* DESCRIPTION Scrolls the page at a variable pace. **//
//* DETAILS Automatically scrolls the dashboard. **//
//* DEVELOPER Fr33dan **//
//* BETA true **//

XKit.extensions.autoscroll = new Object({

	running: false,
	preferences: {
		"ClickAnywhereToStop": {
			text: "Click anywhere to stop scrolling",
			default: true,
			value: true
		},
		"StepsOnControl": {
			text: "Number of steps to have on the control:",
			type: "text",
			default: "6",
			value: "6"
		},
		"PixelsPerSecond": {
			text: "Maximum number of pixels per second:",
			type: "text",
			default: "300",
			value: "300"
		},
		"sep0": {
			text: "Advanced (Changing these settings could slow down your browser)",
			type: "separator"
		},
		"RefreshRate": {
			text: "Number of times to scroll the page per second:",
			type: "text",
			default: "50",
			value: "50",
		}
	},
	imageCode: '<img alt="" class = "auto_scroll_control_label" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAA8CAYAAABvnTosAAAABmJLR0QALABGAGGz0NnGAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH3QYNBS4cBpMfpAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAABR0lEQVRIx+2XP0sEMRDFf7sWouUJcpBOCHLFQcDG1i8hVnf4p9TuPoqlFoqF+jksbA6CoCcG7LKNYKkoeGcT9Fh3kyyKXJHX7WzeI29mGDIQgDa26/ufB8gt4EYb26s7k3nIc0ABLLvQkpLiOeoG2liAsykywJU2Nou10Ae2SrEO0Ata0MZ2gNsae2OgraR4qryBNnYRGHpykwPXPgtDYCFQ2RVt7P4PC9rYI2CXeAglRZE58iZwQTM8AKuZNrYN3AHvpQNvFaT50vfA10iTckxJkTVq5RgkgSSQBGZFIGEWkKZyEkgCSeBrHvzJM+83D83cTZpL4LihwIaS4jsHSoo94D6SfKCkKKqSuAa8BsiPSorDyiooKV6cyKSGPAbWvWVUUoyA7RqBneltxdcHJ8B5KTYCTv9n7XNWPtymBtCvIkchtPp+Ahg0ZGEfAWuKAAAAAElFTkSuQmCC" />',

	run: function() {
		this.running = true;
		this.initControl();

		// We cannot make references to the "this" that has the preferences
		// inside a nested functions. Load the values from it ahead of time.
		var totalStepCount = Number(this.preferences.StepsOnControl.value);
		var maxSpeed = Number(this.preferences.PixelsPerSecond.value);
		var smoothingFactor = 1 / Number(this.preferences.RefreshRate.value);
		var clickAnywhereToStop = this.preferences.ClickAnywhereToStop.value;

		var controlSteps = $(".auto_scroll_control_step");
		var currentStep = null;
		var isScrolling = false;
		var middleNumber = Math.round(totalStepCount / 2);
		var scrollFunction = function() {
			var stepNumber = 0;
			var numberOfSteps = 0;
			var directionFactor = 1;
			if (Number(currentStep) < middleNumber) {
				numberOfSteps = middleNumber;
				directionFactor = -1;
				stepNumber = middleNumber - Number(currentStep);
			} else {
				numberOfSteps = totalStepCount - middleNumber;
				stepNumber = Number(currentStep) - middleNumber + 1;
				directionFactor = 1;
			}
			window.scrollBy(0, maxSpeed * smoothingFactor * directionFactor);
			if (isScrolling) {
				var timerRatio = stepNumber / numberOfSteps;
				setTimeout(scrollFunction, 1000 * smoothingFactor / timerRatio);
			}
		};
		$(document).on("click", ".auto_scroll_control_step", function(event) {
			if (!$(event.target).is("[selected]")) {
				// Mark and store the selected speed.
				controlSteps.removeAttr("selected");
				$(event.target).attr("selected", "true");
				currentStep = $(event.target).attr("number");

				// Start scrolling
				var wasScrolling = isScrolling;
				isScrolling = true;
				// Function must be started after isScrolling is set
				// to prevent possible race condition.
				if (wasScrolling === false) {
					setTimeout(scrollFunction, 50);
				}
			} else {
				isScrolling = false;
				controlSteps.removeAttr("selected");
			}

			// Prevent click event from being processed further.
			event.stopPropagation();
		});

		$(document).on("click", null, function(event) {
			if (clickAnywhereToStop && isScrolling === true) {
				isScrolling = false;
				controlSteps.removeAttr("selected");
			}
		});
	},

	initControl: function() {
		XKit.tools.init_css("autoscroll");
		// HTML for control
		var m_html = '<div class="auto_scroll_control_container"><table style="table-layout: fixed"><td class="auto_scroll_table_cell">';
		for (var j = 0; j < this.preferences.StepsOnControl.value; j++) {
			m_html += '<div class="auto_scroll_control_step" number = ' + j + '/>';

			if (j + 1 == Math.round(this.preferences.StepsOnControl.value / 2)) {
				m_html += '<div class = "auto_scroll_control_center"/>';
			}
		}
		m_html += '</td><td class="auto_scroll_table_cell">' + this.imageCode + '</td></div>';
		// Place it at the bottom of the document because it is fixed position
		// anyway
		$(document.body).append(m_html);
	},

	destroy: function() {
		this.running = false;
		$(".auto_scroll_control_container").remove();
	}

});
