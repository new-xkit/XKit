//* TITLE Elevator **//
//* VERSION 0.0.3 **//
//* DESCRIPTION Scroll to top the old-fashioned way **//
//* DETAILS Makes the scroll to top button scroll slowly and play elevator music. **//
//* DEVELOPER hobinjk **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.elevator = {
	running: false,
	preferences: {
		sep0: {
			text: "Options",
			type: "separator"
		},
		play_music: {
			text: "Jazz up the experience with music",
			default: true,
			value: true
		}
	},

	run: function() {
		this.running = true;

		this.element = document.querySelector(".elevator");
		this.elevate = this.elevate.bind(this);

		this.element.addEventListener("click", this.elevate, true);
	},

	elevate: function(event) {
		event.preventDefault();
		event.stopPropagation();
		var options = {};
		if (this.preferences.play_music.value) {
			options = {
				mainAudio: "https://hobinjk.github.io/elevator.js/demo/music/elevator.mp3",
				endAudio: "https://hobinjk.github.io/elevator.js/demo/music/ding.mp3"
			};
		}

		var elevator = new Elevator(options);
		elevator.elevate();
	},

	destroy: function() {
		if (!this.running) {
			return;
		}
		this.running = false;
		if (this.element) {
			this.element.removeEventListener("click", this.elevate, true);
		}
	}
};

/** Elevator.min.js from https://github.com/tholman/elevator.js */
// eslint-disable-next-line
var Elevator=function(n){"use strict";function o(n,o,e,t){return n/=t/2,1>n?e/2*n*n+o:(n--,-e/2*(n*(n-2)-1)+o)}function e(n,o){for(var e in o){var t=void 0===n[e]&&"function"!=typeof e;t&&(n[e]=o[e])}return n}function t(n){w||(w=n);var e=n-w,i=o(e,f,-f,p);window.scrollTo(0,i),p>e?A=requestAnimationFrame(t):r()}function i(){return window.requestAnimationFrame&&window.Audio&&window.addEventListener}function u(){w=null,f=null,E=!1}function r(){u(),c&&(c.pause(),c.currentTime=0),m&&m.play()}function d(){E&&(cancelAnimationFrame(A),u(),c&&(c.pause(),c.currentTime=0),window.scrollTo(0,0))}function l(n){n.addEventListener?n.addEventListener("click",T.elevate,!1):n.attachEvent("onclick",function(){document.documentElement.scrollTop=0,document.body.scrollTop=0,window.scroll(0,0)})}function a(n){s=document.body;var o={duration:void 0,mainAudio:!1,endAudio:!1,preloadAudio:!0,loopAudio:!0};n=e(n,o),n.element&&l(n.element),i()&&(n.duration&&(v=!0,p=n.duration),window.addEventListener("blur",d,!1),n.mainAudio&&(c=new Audio(n.mainAudio),c.setAttribute("preload",n.preloadAudio),c.setAttribute("loop",n.loopAudio)),n.endAudio&&(m=new Audio(n.endAudio),m.setAttribute("preload","true")))}var c,m,s=null,A=null,p=null,v=!1,w=null,f=null,E=!1,T=this;this.elevate=function(){E||(E=!0,f=document.documentElement.scrollTop||s.scrollTop,v||(p=1.5*f),requestAnimationFrame(t),c&&c.play())},a(n)};
