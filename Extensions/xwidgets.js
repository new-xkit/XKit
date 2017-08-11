//* TITLE XWidgets **//
//* VERSION 0.3.2 **//
//* DESCRIPTION Widgets for your dashboard **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.xwidgets = new Object({

	running: false,

	preferences: {
		"sep_0": {
			text: "Shortcuts",
			type: "separator",
		},
		"enable_keyboard_shortcuts": {
			text: "Use ALT + W to open/close the widget drawer",
			default: true,
			value: true
		},
		"sep_1": {
			text: "Appearance",
			type: "separator",
		},
		"no_opener": {
			text: "Do not show the widget drawer opener",
			default: false,
			value: false
		}
	},

	run: function() {
		this.running = true;

		if ($("#posts").length > 0) {
			XKit.extensions.xwidgets.init();
		}

	},

	widgets_loaded: false,
	user_widgets: [],

	widget_data: [],

	widgets: {

		blank: {

			title: "Blank Widget",
			icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MUYxMkREMkMxMUI0MTFFMzgwNUJGM0E4Q0FBOUE5QkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MUYxMkREMkQxMUI0MTFFMzgwNUJGM0E4Q0FBOUE5QkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxRjEyREQyQTExQjQxMUUzODA1QkYzQThDQUE5QTlCQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxRjEyREQyQjExQjQxMUUzODA1QkYzQThDQUE5QTlCQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pr0AdbEAAAHZSURBVHjabFJLq0FhFL3nQUIU5RlKXolkZmAiJmSgjPwiZSg/wFyJDJWRMhTlncLAwCthgBzuunefTqfb3YPv7O98e629196bqVQqXzL7fD6SQ/Z+v+kk4/8N/QOQGy+nZ1nW4/G43W69Xi8IwuFwmEwm6/WaQoVf4yVWrVabTCYdDoeEt1gsoVCo3++32+3X60UYngpQKpWZTMZkMt3v9+FwCFZk83q94XA4Go0yDNNoNCgDhzhg8DcQCNxut3q9Pp1OwXe5XMbj8X6/9/l8NpsNFPABYEmZ3+9Hnl6vt9vtkLpQKKTTaTij0WgwGOApEolQBhGg0+nAOp/PrVZrNptVq9VmszmXy0EYAVAtokEhAjiOw+X5fKpUKujGFY7L5YLzeDwAgAwSzVLLUD102+322WxWLpcRtN1uS6USKkSjATidThQpApbLJf7G43Ge51Fbq9XqdDpwjEZjLBbDE1pHJXGpVAofzCgYDBoMBqfTeT6fF4vF9XrFEPL5POStVqtms0kAplgs0vxRMakEH0rCHBQKBfzNZlOtVsEoZkgkErReqBKNR5xGo4FihCKo2+3WajXMRFpBXtoq3I/HI1JLV/nOUTPB8iORPHqQtlUOk/YX57cAAwAjJcTsc1qu6QAAAABJRU5ErkJggg==",
			css: " .xkit-widgets-blank { background: rgba(255,255,255,0.22) !important; color: white; line-height: 120px; text-align: center; }",

			init: function(obj) {

				$(obj).addClass("xkit-widgets-blank");
				$(obj).html("<div class=\"xkit-widgets-add\">&nbsp;</div>");

				$(obj).find(".xkit-widgets-add").click(function() {

					var m_parent = $(this).parent();
					XKit.extensions.xwidgets.show_add(m_parent.attr('data-id'));

				});

			}

		},

		getting_started: {

			title: "Getting Started Widget",
			icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MDk3N0U3MjgxMUI3MTFFMzgwNUJGM0E4Q0FBOUE5QkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MDk3N0U3MjkxMUI3MTFFMzgwNUJGM0E4Q0FBOUE5QkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDowOTc3RTcyNjExQjcxMUUzODA1QkYzQThDQUE5QTlCQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDowOTc3RTcyNzExQjcxMUUzODA1QkYzQThDQUE5QTlCQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pv3D1lwAAAIvSURBVHjaVNG7dtNAEAbg1e5qdVlJMfINxzlgF1wKDiUFJS9AxXvwALwODTU1NQUlcEKROE4CiZNYN0uWVtqVGFmGA1up+Gb0z4z24+2nal1ouoZNCh/GhJfXGfF0JDW5KdiYi/MN7VsqEU2pSG+H9vouNw6dVjv/a9+UYY5kQ3pGsYgoNrCmk7Z3pz2GJAI9f/cSYW314Xj7ff1XsxHf6eBPEnevh68fOc8HzrM+qptGQBIjPwlB52EGkXZJrjLqMXJgeC8m/IkPGnWvRthjbe8x34ZpKQRt9c+M9lgtFbP18ZvH6J+HORXniT7iRZi1+pBT0MSjoNWmahp0/f4Yhiau7r96AAXw5zZJkHY6WtxQ0I1CMi7ZxNl8uRaXsQwFfzroCnTfir+tQOtTHpyuqG/jnRagi0XM7lugYSeaTbtIIsmlqPSpEy9uQVeqxK0e2cVppA9g36KpanLAqlW2n7lSZGrHixvsm6qWeZhiNrSKZaIP4ZZle0vYyVkMSboCOjSzs4D6llQyCxJ75uN8EesDS0aiBu0a8Cs2diBJV5D+irBvqLougtSdD5LlHYYlyKiAJNSF3hGburATVcquAC5TKZkHGz7vx6BN2h4ONU3bexmTQ14EWTvlyN7PUNeg7dm9CLRBoB52Cr2NdLk2jw7KcFuJEnZy+fHr1ecTJRXcy5n3o+UtMeEALL5YY8RJehGAht6wb+PIhSnZgHfamvWSM+hNWc8G7T3s/xZgAPtMcRnEFTOJAAAAAElFTkSuQmCC",
			css: " .xkit-widgets-blank { background: rgba(255,255,255,0.22) !important; color: white; line-height: 120px; text-align: center; }",

			init: function(obj) {

				$(obj).addClass("xkit-widgets-getting-started");

				var m_html = "<div data-id=\"1\" class=\"slide opened slide-1\">" +
							"<b>Welcome to XWidgets!</b> Please read me first." +
							"<div class=\"widget-slide-controls\">" +
								"<div data-id=\"2\" class=\"slide-next-arrow\">&rarr;</div>" +
							"</div>" +
						"</div>" +
						"<div data-id=\"2\" class=\"slide slide-2\">" +
							"Click on an plus to add a widget. To remove, ALT+Click them." +
							"<div class=\"widget-slide-controls\">" +
								"<div data-id=\"1\" class=\"slide-previous-arrow\">&larr;</div>" +
								"<div data-id=\"3\" class=\"slide-next-arrow\">&rarr;</div>" +
							"</div>" +
						"</div>" +
						"<div data-id=\"3\" class=\"slide slide-3\">" +
							"Some widgets have settings. Remove & re-add them to change them." +
							"<div class=\"widget-slide-controls\">" +
								"<div data-id=\"2\" class=\"slide-previous-arrow\">&larr;</div>" +
								"<div data-id=\"4\" class=\"slide-next-arrow\">&rarr;</div>" +
							"</div>" +
						"</div>" +
						"<div data-id=\"4\" class=\"slide slide-4\">" +
							"That's All!<br/>Alt + Click me to remove me and get started!" +
							"<div class=\"widget-slide-controls\">" +
								"<div data-id=\"3\" class=\"slide-previous-arrow\">&larr;</div>" +
							"</div>" +
						"</div>";

				$(obj).html(m_html);

				$(".slide-next-arrow").click(function() {

					var to_get = parseInt($(this).attr('data-id'));

					var current = $(".slide-" + (to_get - 1));
					var next = $(".slide-" + (to_get));

					$(next).animate({left: 0}, 500);
					$(current).animate({left: "-138px"}, 500);

				});

				$(".slide-previous-arrow").click(function() {

					var to_get = parseInt($(this).attr('data-id'));

					var current = $(".slide-" + (to_get + 1));
					var next = $(".slide-" + (to_get));

					$(next).animate({left: 0}, 500);
					$(current).animate({left: "138px"}, 500);

				});

				$(obj).find(".xkit-widgets-add").click(function() {

					var m_parent = $(this).parent();
					XKit.extensions.xwidgets.show_add(m_parent.attr('data-id'));

				});

			}

		},

		world_clock: {

			title: "World Clock",
			icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0RCRjJCODcxMUI2MTFFMzgwNUJGM0E4Q0FBOUE5QkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0RCRjJCODgxMUI2MTFFMzgwNUJGM0E4Q0FBOUE5QkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxRjEyREQzMjExQjQxMUUzODA1QkYzQThDQUE5QTlCQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3REJGMkI4NjExQjYxMUUzODA1QkYzQThDQUE5QTlCQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pr5zfHEAAAInSURBVHjabJJNSFRRFMdnpjc5OaNZOjOhI/gRY2UmlJAS2MIJ2kQUIS7ErRG0MVobtOkL2oaL2kVQi9opGlFZLayFkPY1jpHQC0dwGmemyXfvuf7PPSYuejzuO/fd3zn3f/73+i+OTfu2PcaYzcDnI+KJJoMvYgTaGOe/qO8fjUETaUvbeFuCPD3JWHdbvDZSUVnh/Fgpvp53X336JbSnjNpKQPldO52RMx2NtWFMS+sKGx2o3433VGfi2uMPuaLHaVo5W0qE/vLz96M3me/ZNShJ7I0M9u4/lKgZvXD08v13pDxDXkBEdydjQt98Ngv6waVe1Mks51H749Jqc6yqr30faFIqIG70JOPIfDi9YPsjxFAgusemPmN6PBkFTdpzxA2UL/1VqA2FSrNIpUkRu7Tg5gplrzVeDRruBsQ77tJuJYYgfnIl9fRqSmttiJfCoSBotOEIkc2XDzbUoMtMNo9Nzt2egoM4AKN1U104EgrOLi7DI7wBSEXhl3MuygyebNWaxG9Lsy3DpzuwNDGTZpcMIcGgvxfz7mK20J7YM9p/rLEuDL9RuzkauTF0orMpmnZXx2e+sp9E/v67z40981Bwx/WBrpZYFRaKZQ99QAli0CP3JgqlP1LFf/7OJGzcvGSkU4fr+440tMSri+X1tJt7O7c0/v4bOKZZpPKfvTUpKF8PdEMKHxA8cpc8inr+SdrxFK6Nsfq4hgi1o6UlTQDD/zcEGACMeNv7QLOLXgAAAABJRU5ErkJggg==",
			css: " .xkit-widgets-blank { background: rgba(255,255,255,0.22) !important; color: white; line-height: 120px; text-align: center; }",

			init: function(obj, data) {

				// DST code from: http://javascript.about.com/library/bldst.htm

				Date.prototype.stdTimezoneOffset = function() {
					var jan = new Date(this.getFullYear(), 0, 1);
					var jul = new Date(this.getFullYear(), 6, 1);
					return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
				};

				Date.prototype.dst = function() {
					return this.getTimezoneOffset() < this.stdTimezoneOffset();
				};

				$(obj).addClass("world_clock");

				var box_id = $(obj).attr('data-id');

				var m_storage = XKit.storage.get("xwidgets", "widget-storage-" + box_id, "");

				var list_html = '<div style="padding: 5px; padding-top: 29px; text-align: center;"><select id="xtime_timezone-for-' + box_id + '" style="width: 100%;">' +
					'<option value="-12">(GMT -12:00) International Date Line West</option>' +
					'<option value="-11">(GMT -11:00) Midway Island, Samoa</option>' +
					'<option value="-10">(GMT -10:00) Hawaii</option>' +
					'<option value="-9">(GMT -9:00) Alaska</option>' +
					'<option value="-8">(GMT -8:00) Pacific Time (US &amp; Canada); Tijuana</option>' +
					'<option value="-7">(GMT -7:00) Mountain Time (US &amp; Canada)</option>' +
					'<option value="-7">(GMT -7:00) Arizona</option>' +
					'<option value="-7">(GMT -7:00) Chihuahua, La Paz, Mazatlan</option>' +
					'<option value="-6">(GMT -6:00) Central Time (US &amp; Canada)</option>' +
					'<option value="-6">(GMT -6:00) Central America</option>' +
					'<option value="-6">(GMT -6:00) Guadalajara, Mexico City, Monterrey</option>' +
					'<option value="-6">(GMT -6:00) Saskatchewan</option>' +
					'<option value="-5">(GMT -5:00) Eastern Time (US &amp; Canada)</option>' +
					'<option value="-5">(GMT -5:00) Bogota, Lima, Quito</option>' +
					'<option value="-5">(GMT -5:00) Indiana (East)</option>' +
					'<option value="-4">(GMT -4:00) Atlantic Time (Canada)</option>' +
					'<option value="-4">(GMT -4:00) Caracas, La Paz</option>' +
					'<option value="-4">(GMT -4:00) Santiago</option>' +
					'<option value="-3">(GMT -3:30) Newfoundland</option>' +
					'<option value="-3">(GMT -3:00) Brasilia, Greenland</option>' +
					'<option value="-2">(GMT -2:00) Buenos Aires, Georgetown</option>' +
					'<option value="-1">(GMT -1:00) Cape Verde Is.</option>' +
					'<option value="-1">(GMT -1:00) Azores</option>' +
					'<option value="+0">(GMT) Casablanca, Monrovia</option>' +
					'<option value="+0" selected="selected">(GMT) Greenwich Mean Time : Dublin, Edinburgh, London</option>' +
					'<option value="+1">(GMT +1:00) Amsterdam, Berlin, Rome, Stockholm, Vienna</option>' +
					'<option value="+1">(GMT +1:00) Belgrade, Bratislava, Budapest, Prague</option>' +
					'<option value="+1">(GMT +1:00) Brussels, Copenhagen, Madrid, Paris</option>' +
					'<option value="+1">(GMT +1:00) Sarajevo, Skopje, Warsaw, Zagreb</option>' +
					'<option value="+1">(GMT +1:00) West Central Africa</option>' +
					'<option value="+2">(GMT +2:00) Athens, Beirut, Bucharest, Cairo, Istanbul</option>' +
					'<option value="+2">(GMT +2:00) Harare, Jerusalem, Pretoria</option>' +
					'<option value="+2">(GMT +2:00) Helsinki, Kiev, Riga, Sofia, Tallinn, Vilnius</option>' +
					'<option value="+3">(GMT +3:00) Kuwait, Nairobi, Riyadh</option>' +
					'<option value="+3">(GMT +3:00) Baghdad, Moscow, St. Petersburg, Volgograd</option>' +
					'<option value="+3">(GMT +3:30) Tehran</option>' +
					'<option value="+4">(GMT +4:00) Abu Dhabi, Muscat</option>' +
					'<option value="+4">(GMT +4:00) Baku, Tbilsi, Yerevan</option>' +
					'<option value="+4">(GMT +4:30) Kabul</option>' +
					'<option value="+5">(GMT +5:00) Yekaterinburg</option>' +
					'<option value="+5">(GMT +5:00) Islamabad, Karachi, Tashkent</option>' +
					'<option value="+6">(GMT +6:00) Almaty, Novosibirsk</option>' +
					'<option value="+6">(GMT +6:00) Astana, Dhaka, Sri Jayawardenepura</option>' +
					'<option value="+7">(GMT +7:00) Bangkok, Hanoi, Jakarta</option>' +
					'<option value="+7">(GMT +7:00) Krasnoyarsk</option>' +
					'<option value="+8">(GMT +8:00) Beijing, Chongqing, Hong Kong, Urumqi</option>' +
					'<option value="+8">(GMT +8:00) Irkutsk, Ulaan Bataar</option>' +
					'<option value="+8">(GMT +8:00) Kuala Lumpar, Perth, Singapore, Taipei</option>' +
					'<option value="+9">(GMT +9:00) Osaka, Sapporo, Tokyo</option>' +
					'<option value="+9">(GMT +9:00) Seoul</option>' +
					'<option value="+9">(GMT +9:00) Yakutsk</option>' +
					'<option value="+10">(GMT +10:00) Brisbane, Guam, Port Moresby</option>' +
					'<option value="+10">(GMT +10:00) Canberra, Hobart, Melbourne, Sydney, Vladivostok</option>' +
					'<option value="+11">(GMT +11:00) Magadan, Soloman Is., New Caledonia</option>' +
					'<option value="+12">(GMT +12:00) Auckland, Wellington</option>' +
					'<option value="+12">(GMT +12:00) Fiji, Kamchatka, Marshall Is.</option>' +
					'</select>';

				if (m_storage === "") {

					$(obj).html(list_html + "<div class=\"xkit-button\" id=\"time-selector-confirm-for-" + box_id + "\">OK</div>");

					$("#time-selector-confirm-for-" + box_id).click(function() {

						XKit.storage.set("xwidgets", "widget-storage-" + box_id, $("#xtime_timezone-for-" + box_id).val());
						XKit.extensions.xwidgets.clear_box($("#xwidgets-box-" + box_id));
						XKit.extensions.xwidgets.widgets.world_clock.init($("#xwidgets-box-" + box_id), data);

					});

					return;

				}

				$(obj).html("<div class=\"time\">&nbsp;</div><div class=\"timezone\">&nbsp;</div>");

				// Check for DST.
				var is_dst = (new Date()).dst();

				var m_caption = "";

				switch (m_storage) {
				case 4:
					m_caption = "Baku";
					break;
				case 3:
					m_caption = "Kuwait";
					break;
				case 2:
					m_caption = "Istanbul";
					break;
				case 1:
					m_caption = "Vienna";
					break;
				case 0:
					m_caption = "London";
					break;
				case -2:
					m_caption = "Buenos Aires";
					break;
				case -5:
					m_caption = "Eastern Time";
					break;
				case -6:
					m_caption = "Central Time";
					break;
				case -8:
					m_caption = "Pacific Time";
					break;
				default:
					m_caption = "GMT " + m_storage;
				}

				$(obj).find(".timezone").html(m_caption);

				if (typeof data.interval !== "undefined") {
					clearInterval(data.interval);
				}

				data.interval = setInterval(function() { XKit.extensions.xwidgets.widgets.world_clock.tick(obj, m_storage, is_dst, data); }, 1000);
				//alert(data.interval);
				XKit.extensions.xwidgets.widgets.world_clock.tick(obj, m_storage, is_dst);

			},

			tick: function(obj, timezone, is_dst, data) {

				if (is_dst) {
					timezone = timezone + 1;
				}

				console.log("tick on 12");

				var now = new Date();
				var isitlocal = false;
				var ofst = now.getTimezoneOffset() / 60;
				var secs = now.getSeconds();
				//var sec = -1.57 + Math.PI * secs / 30;
				var mins = now.getMinutes();
				//var min = -1.57 + Math.PI * mins / 30;
				var hr = (isitlocal) ? now.getHours() : (now.getHours() + parseInt(ofst)) + parseInt(timezone);
				//var hrs = -1.575 + Math.PI * hr / 6 + Math.PI * parseInt(now.getMinutes()) / 360;
				if (hr < 0) hr += 24;
				if (hr > 23) hr -= 24;
				var ampm = (hr > 11) ? "PM" : "AM";
				var statusampm = ampm;

				var hr2 = hr;
				if (hr2 === 0) {
					hr2 = 12;
				}
				if (hr2 > 12) {
					hr2 %= 12;
				}
				if (hr2 < 10) {
					hr2 = "0" + hr2;
				}

				var finaltime = hr2 + ':' + ((mins < 10) ? "0" + mins : mins) + ':' + ((secs < 10) ? "0" + secs : secs) + ' ' + statusampm;

				$(obj).find(".time").html(finaltime);


			},

			destroy: function(obj, data) {
				//alert(data.interval);
				clearInterval(data.interval);
			}

		},

		world_clock_24: {

			title: "World Clock (24 Hours)",
			icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0RCRjJCODcxMUI2MTFFMzgwNUJGM0E4Q0FBOUE5QkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0RCRjJCODgxMUI2MTFFMzgwNUJGM0E4Q0FBOUE5QkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxRjEyREQzMjExQjQxMUUzODA1QkYzQThDQUE5QTlCQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3REJGMkI4NjExQjYxMUUzODA1QkYzQThDQUE5QTlCQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pr5zfHEAAAInSURBVHjabJJNSFRRFMdnpjc5OaNZOjOhI/gRY2UmlJAS2MIJ2kQUIS7ErRG0MVobtOkL2oaL2kVQi9opGlFZLayFkPY1jpHQC0dwGmemyXfvuf7PPSYuejzuO/fd3zn3f/73+i+OTfu2PcaYzcDnI+KJJoMvYgTaGOe/qO8fjUETaUvbeFuCPD3JWHdbvDZSUVnh/Fgpvp53X336JbSnjNpKQPldO52RMx2NtWFMS+sKGx2o3433VGfi2uMPuaLHaVo5W0qE/vLz96M3me/ZNShJ7I0M9u4/lKgZvXD08v13pDxDXkBEdydjQt98Ngv6waVe1Mks51H749Jqc6yqr30faFIqIG70JOPIfDi9YPsjxFAgusemPmN6PBkFTdpzxA2UL/1VqA2FSrNIpUkRu7Tg5gplrzVeDRruBsQ77tJuJYYgfnIl9fRqSmttiJfCoSBotOEIkc2XDzbUoMtMNo9Nzt2egoM4AKN1U104EgrOLi7DI7wBSEXhl3MuygyebNWaxG9Lsy3DpzuwNDGTZpcMIcGgvxfz7mK20J7YM9p/rLEuDL9RuzkauTF0orMpmnZXx2e+sp9E/v67z40981Bwx/WBrpZYFRaKZQ99QAli0CP3JgqlP1LFf/7OJGzcvGSkU4fr+440tMSri+X1tJt7O7c0/v4bOKZZpPKfvTUpKF8PdEMKHxA8cpc8inr+SdrxFK6Nsfq4hgi1o6UlTQDD/zcEGACMeNv7QLOLXgAAAABJRU5ErkJggg==",
			css: " .xkit-widgets-blank { background: rgba(255,255,255,0.22) !important; color: white; line-height: 120px; text-align: center; }",

			init: function(obj, data) {

				// DST code from: http://javascript.about.com/library/bldst.htm

				Date.prototype.stdTimezoneOffset = function() {
					var jan = new Date(this.getFullYear(), 0, 1);
					var jul = new Date(this.getFullYear(), 6, 1);
					return Math.max(jan.getTimezoneOffset(), jul.getTimezoneOffset());
				};

				Date.prototype.dst = function() {
					return this.getTimezoneOffset() < this.stdTimezoneOffset();
				};

				$(obj).addClass("world_clock");

				var box_id = $(obj).attr('data-id');

				var m_storage = XKit.storage.get("xwidgets", "widget-storage-" + box_id, "");

				var list_html = '<div style="padding: 5px; padding-top: 29px; text-align: center;"><select id="xtime_timezone-for-' + box_id + '" style="width: 100%;">' +
					'<option value="-12">(GMT -12:00) International Date Line West</option>' +
					'<option value="-11">(GMT -11:00) Midway Island, Samoa</option>' +
					'<option value="-10">(GMT -10:00) Hawaii</option>' +
					'<option value="-9">(GMT -9:00) Alaska</option>' +
					'<option value="-8">(GMT -8:00) Pacific Time (US &amp; Canada); Tijuana</option>' +
					'<option value="-7">(GMT -7:00) Mountain Time (US &amp; Canada)</option>' +
					'<option value="-7">(GMT -7:00) Arizona</option>' +
					'<option value="-7">(GMT -7:00) Chihuahua, La Paz, Mazatlan</option>' +
					'<option value="-6">(GMT -6:00) Central Time (US &amp; Canada)</option>' +
					'<option value="-6">(GMT -6:00) Central America</option>' +
					'<option value="-6">(GMT -6:00) Guadalajara, Mexico City, Monterrey</option>' +
					'<option value="-6">(GMT -6:00) Saskatchewan</option>' +
					'<option value="-5">(GMT -5:00) Eastern Time (US &amp; Canada)</option>' +
					'<option value="-5">(GMT -5:00) Bogota, Lima, Quito</option>' +
					'<option value="-5">(GMT -5:00) Indiana (East)</option>' +
					'<option value="-4">(GMT -4:00) Atlantic Time (Canada)</option>' +
					'<option value="-4">(GMT -4:00) Caracas, La Paz</option>' +
					'<option value="-4">(GMT -4:00) Santiago</option>' +
					'<option value="-3">(GMT -3:30) Newfoundland</option>' +
					'<option value="-3">(GMT -3:00) Brasilia, Greenland</option>' +
					'<option value="-2">(GMT -2:00) Buenos Aires, Georgetown</option>' +
					'<option value="-1">(GMT -1:00) Cape Verde Is.</option>' +
					'<option value="-1">(GMT -1:00) Azores</option>' +
					'<option value="+0">(GMT) Casablanca, Monrovia</option>' +
					'<option value="+0" selected="selected">(GMT) Greenwich Mean Time : Dublin, Edinburgh, London</option>' +
					'<option value="+1">(GMT +1:00) Amsterdam, Berlin, Rome, Stockholm, Vienna</option>' +
					'<option value="+1">(GMT +1:00) Belgrade, Bratislava, Budapest, Prague</option>' +
					'<option value="+1">(GMT +1:00) Brussels, Copenhagen, Madrid, Paris</option>' +
					'<option value="+1">(GMT +1:00) Sarajevo, Skopje, Warsaw, Zagreb</option>' +
					'<option value="+1">(GMT +1:00) West Central Africa</option>' +
					'<option value="+2">(GMT +2:00) Athens, Beirut, Bucharest, Cairo, Istanbul</option>' +
					'<option value="+2">(GMT +2:00) Harare, Jerusalem, Pretoria</option>' +
					'<option value="+2">(GMT +2:00) Helsinki, Kiev, Riga, Sofia, Tallinn, Vilnius</option>' +
					'<option value="+3">(GMT +3:00) Kuwait, Nairobi, Riyadh</option>' +
					'<option value="+3">(GMT +3:00) Baghdad, Moscow, St. Petersburg, Volgograd</option>' +
					'<option value="+3">(GMT +3:30) Tehran</option>' +
					'<option value="+4">(GMT +4:00) Abu Dhabi, Muscat</option>' +
					'<option value="+4">(GMT +4:00) Baku, Tbilsi, Yerevan</option>' +
					'<option value="+4">(GMT +4:30) Kabul</option>' +
					'<option value="+5">(GMT +5:00) Yekaterinburg</option>' +
					'<option value="+5">(GMT +5:00) Islamabad, Karachi, Tashkent</option>' +
					'<option value="+6">(GMT +6:00) Almaty, Novosibirsk</option>' +
					'<option value="+6">(GMT +6:00) Astana, Dhaka, Sri Jayawardenepura</option>' +
					'<option value="+7">(GMT +7:00) Bangkok, Hanoi, Jakarta</option>' +
					'<option value="+7">(GMT +7:00) Krasnoyarsk</option>' +
					'<option value="+8">(GMT +8:00) Beijing, Chongqing, Hong Kong, Urumqi</option>' +
					'<option value="+8">(GMT +8:00) Irkutsk, Ulaan Bataar</option>' +
					'<option value="+8">(GMT +8:00) Kuala Lumpar, Perth, Singapore, Taipei</option>' +
					'<option value="+9">(GMT +9:00) Osaka, Sapporo, Tokyo</option>' +
					'<option value="+9">(GMT +9:00) Seoul</option>' +
					'<option value="+9">(GMT +9:00) Yakutsk</option>' +
					'<option value="+10">(GMT +10:00) Brisbane, Guam, Port Moresby</option>' +
					'<option value="+10">(GMT +10:00) Canberra, Hobart, Melbourne, Sydney, Vladivostok</option>' +
					'<option value="+11">(GMT +11:00) Magadan, Soloman Is., New Caledonia</option>' +
					'<option value="+12">(GMT +12:00) Auckland, Wellington</option>' +
					'<option value="+12">(GMT +12:00) Fiji, Kamchatka, Marshall Is.</option>' +
					'</select>';

				if (m_storage === "") {

					$(obj).html(list_html + "<div class=\"xkit-button\" id=\"time-selector-confirm-for-" + box_id + "\">OK</div>");

					$("#time-selector-confirm-for-" + box_id).click(function() {

						XKit.storage.set("xwidgets", "widget-storage-" + box_id, $("#xtime_timezone-for-" + box_id).val());
						XKit.extensions.xwidgets.clear_box($("#xwidgets-box-" + box_id));
						XKit.extensions.xwidgets.widgets.world_clock_24.init($("#xwidgets-box-" + box_id), data);

					});

					return;

				}

				$(obj).html("<div class=\"time\">&nbsp;</div><div class=\"timezone\">&nbsp;</div>");

				// Check for DST.
				var is_dst = (new Date()).dst();

				var m_caption = "";

				switch (m_storage) {
				case 4:
					m_caption = "Baku";
					break;
				case 3:
					m_caption = "Kuwait";
					break;
				case 2:
					m_caption = "Istanbul";
					break;
				case 1:
					m_caption = "Vienna";
					break;
				case 0:
					m_caption = "London";
					break;
				case -2:
					m_caption = "Buenos Aires";
					break;
				case -5:
					m_caption = "Eastern Time";
					break;
				case -6:
					m_caption = "Central Time";
					break;
				case -8:
					m_caption = "Pacific Time";
					break;
				default:
					m_caption = "GMT " + m_storage;
				}

				$(obj).find(".timezone").html(m_caption);

				if (typeof data.interval !== "undefined") {
					clearInterval(data.interval);
				}
				// data = {};

				data.interval = setInterval(function() { XKit.extensions.xwidgets.widgets.world_clock_24.tick(obj, m_storage, is_dst, data); }, 1000);
				XKit.extensions.xwidgets.widgets.world_clock_24.tick(obj, m_storage, is_dst);

			},

			tick: function(obj, timezone, is_dst, data) {

				if (is_dst) {
					timezone = timezone + 1;
				}

				console.log("tick on 24");

				var now = new Date();
				var isitlocal = false;
				var ofst = now.getTimezoneOffset() / 60;
				var secs = now.getSeconds();
				// var sec = -1.57 + Math.PI * secs / 30;
				var mins = now.getMinutes();
				// var min = -1.57 + Math.PI * mins / 30;
				var hr = (isitlocal) ? now.getHours() : (now.getHours() + parseInt(ofst)) + parseInt(timezone);
				// var hrs = -1.575 + Math.PI * hr / 6 + Math.PI * parseInt(now.getMinutes()) / 360;
				if (hr < 0) hr += 24;
				if (hr > 23) hr -= 24;
				/* ampm = (hr > 11)?"PM":"AM";
				statusampm = ampm;*/

				if (hr > 11) {
				//	hr = hr + 12;
				}

				var hr2 = hr;
				if (hr2 === 0) {
					hr2 = 24;
				}
				//(hr2 < 13)?hr2:hr2 %= 12;
				if (hr2 < 10) {
					hr2 = "0" + hr2;
				}



				var finaltime = hr2 + ':' + ((mins < 10) ? "0" + mins : mins) + ':' + ((secs < 10) ? "0" + secs : secs);

				$(obj).find(".time").html(finaltime);


			},

			destroy: function(obj, data) {
				clearInterval(data.interval);
			}

		},

		blog_information: {

			title: "Blog Information",
			icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0RCRjJCOEYxMUI2MTFFMzgwNUJGM0E4Q0FBOUE5QkIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0RCRjJCOTAxMUI2MTFFMzgwNUJGM0E4Q0FBOUE5QkIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3REJGMkI4RDExQjYxMUUzODA1QkYzQThDQUE5QTlCQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3REJGMkI4RTExQjYxMUUzODA1QkYzQThDQUE5QTlCQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PueR6WoAAAG/SURBVHjabFJLK4VBGB5fH3IOjiKXQ47rzkriIIWcEzsLxU7JVjbKb5CVP6CsUC4LysllYcFaSSSXKLcSB8fC+Wbe1zPf6OtzmKbpnXmfed9nnmeyJvbHhW8w808giPSGFUtiHSJQ7Nj/QrEaNLFSpEhDyV2lLX6P08TFaeL84/HjK+UUNxQ1xmsb4jUGLcmRXgeU+/p01ic3ny9evMsPR0+Yx6tnsdkOkUeamySL3YF0Btobr5fJ7akDlFdpRWmyDGnQ8KPHdkcwvW3y6u1m554lK8m2UQPU/VXn+5Yy+twdPldES8kh26jhLz+6MwQdwWGxf8M7fL9OAQ3VLKNdbn62l1uIrUidlP4O6U8JHI4t1w4VLAv401pEdvwnoUgQzrESFnwBqfp4xMsNbw0ADbsG17u9w3AnHsDwwzYu1sbCJ2uh5OUbcssDWxkvLqjOD0dLUJ5JWLqY62LPTGuorvCvD0C3TTdpa7Wcwpa6kxbKCnDvXMvt3sPN7mPyOpUTsAsiwbLm4nA7akM1XMBPFKDkeq6w03pVdZVXgq7uTi4HNm8VP/9B2I5MCzdipRE6ILN10foCGShKCGF9CzAATOx1RUWMeL4AAAAASUVORK5CYII=",
			css: " .xkit-widgets-blank { background: rgba(255,255,255,0.22) !important; color: white; line-height: 120px; text-align: center; }",

			init: function(obj, data) {

				$(obj).addClass("xkit-widgets-blog-information");
				$(obj).html("blog info");

				var box_id = $(obj).attr('data-id');

				var m_storage = XKit.storage.get("xwidgets", "widget-storage-" + box_id, "");

				if (m_storage !== "") {
					if (m_storage.substring(0, 2) === "[[" && m_storage.substring(m_storage.length - 2, m_storage.length) === "]]") {
						m_storage = m_storage.substring(2, m_storage.length - 2);
					}
				}

				var blog_url = "";

				if (m_storage === "") {
					blog_url = "";
				} else {
					blog_url = m_storage;
				}

				if (blog_url === "") {

					$(obj).addClass("no_blog_selected");

					var m_blogs = XKit.tools.get_blogs();
					var m_selector = "";

					for (var i = 0; i < m_blogs.length; i++) {

						if (m_blogs[i] !== "") {

							m_selector = m_selector + "<option value=\"" + m_blogs[i] + "\">" + m_blogs[i] + "</option>";
						}

					}

					$(obj).html("<b>Select a blog</b><br/><select id=\"blog-selector-for-" + box_id + "\">" + m_selector + "</select><div class=\"xkit-button\" id=\"blog-selector-confirm-for-" + box_id + "\">OK</div>");

					$("#blog-selector-confirm-for-" + box_id).click(function() {

						XKit.storage.set("xwidgets", "widget-storage-" + box_id, "[[" + $("#blog-selector-for-" + box_id).val() + "]]");
						XKit.extensions.xwidgets.clear_box($("#xwidgets-box-" + box_id));
						XKit.extensions.xwidgets.widgets.blog_information.init($("#xwidgets-box-" + box_id), data);

					});

				} else {

					var m_html = "<div class=\"loaded\">" +
								"<div class=\"line title\">" + blog_url + "</div>" +
								"<div class=\"line followers loading\">" +
									"Followers" +
									"<div class=\"count\">loading</div>" +
								"</div>" +
								"<div class=\"line drafts loading\">" +
									"Drafts" +
									"<div class=\"count\">loading</div>" +
								"</div>" +
								"<div class=\"line queue loading last\">" +
									"Queue" +
									"<div class=\"count\">loading</div>" +
								"</div>" +
							"</div>";
					$(obj).html(m_html);
					$(obj).addClass("loaded");

					$(obj).find(".loaded").click(function() {

						window.open("http://www.tumblr.com/blog/" + blog_url);

					});

					GM_xmlhttpRequest({
						method: "GET",
						url: "http://www.tumblr.com/blog/" + blog_url,
						json: false,
						onerror: function(response) {
							$(obj).addClass("error-box");
							$(obj).html("Can't fetch blog information. If you changed your URL, please edit this widget.");
							$(obj).removeClass("loaded");
							return;
						},
						onload: function(response) {

							var blog_page = $(response.responseText);
							var follower_count = $(".followers .count", blog_page).html();
							var queue_count = $(".queue .count", blog_page).html();
							var drafts_count = $(".drafts .count", blog_page).html();

							if ($(".followers .count", blog_page).length === 0) {
								follower_count = "0";
							}

							if ($(".queue .count", blog_page).length === 0) {
								queue_count = "0";
							}

							if ($(".drafts .count", blog_page).length === 0) {
								drafts_count = "0";
							}

							$(obj).find(".followers .count").html(follower_count);
							$(obj).find(".queue .count").html(queue_count);
							$(obj).find(".drafts .count").html(drafts_count);

							$(obj).find(".followers, .drafts, .queue").removeClass("loading");

						}
					});

				}

			}

		},

		notepad: {

			title: "Nano Notepad",
			icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0IxNUI1NkYxM0RDMTFFMzlFMUI4QkQzOUFDODkyNkUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0IxNUI1NzAxM0RDMTFFMzlFMUI4QkQzOUFDODkyNkUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3QjE1QjU2RDEzREMxMUUzOUUxQjhCRDM5QUM4OTI2RSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3QjE1QjU2RTEzREMxMUUzOUUxQjhCRDM5QUM4OTI2RSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PpkKLgYAAAHBSURBVHjalFHNihQxEK5KKr2KeFgQUQR9FC/6jD6ICKIn2RUWL4MPIIiIKyrswZn+SSpVfpUW7wZmqE7X99t8/ekF/c8Rd26aYhJL7Bi6kRlL9mXNOXsR005FqCmlxHKzPJpPc85pXVYsA5BwzXT39naaS5lyqxtobp35utn5+R2++XWlrRF5zqzasE3WcTBLTmcAqLo7HkuhUjL39SP4mL21CgemKlOp6wYKJuVhMot03VIyIFmXA0hBiQ1JCTARcesgzSVju21YZTPQMR7ZtgMUrj+/hHF3SxDpHRQDE/QpJ9yD7t7DpxGvnj4UEYoraq2VSQglacW7YV1BzKzxg1sR9npAyu9fXuHKzShMO4Gb47hDjcM60f3Hz5CQ2/EKOELAugjaJkdBvJ/wohAEwMwiW3y13+9h5ue31yNDmAZ3+LHOkcR2KQAePHmutQLwDlC0hE4p7I/uwt3GO3LQY8B/FkDnS+z9+PoG5PGFR3PI0PF6UIzGCTNaApb76SL8FWmQYwwwg2xaSunRbxqCodXasUwT+3IButG07RlAhlXe1cZBUVDXNketenz7z30wYbu1v+kHOD6FhNQu+EeAAQBPlUks3wVu1QAAAABJRU5ErkJggg==",
			css: " .xkit-widgets-blank { background: rgba(255,255,255,0.22) !important; color: white; line-height: 120px; text-align: center; }",

			init: function(obj) {

				var box_id = $(obj).attr('data-id');

				var m_storage = XKit.storage.get("xwidgets", "widget-storage-" + box_id, "");

				var m_text = "";

				if (m_storage !== "") {
					m_text = m_storage;
					if (m_text.substring(0, 2) === "[[" && m_text.substring(m_text.length - 2, m_text.length) === "]]") {
						m_text = m_text.substring(2, m_text.length - 2);
					}
				}

				$(obj).addClass("nano-notepad");
				$(obj).html("<textarea maxlength=\"100\" class=\"nano-notepad-area\" data-id=\"" + box_id + "\">" + m_text + "</textarea>");

				$(obj).find(".nano-notepad-area").bind("input propertychange", function() {

					box_id = $(this).attr('data-id');
					XKit.storage.set("xwidgets", "widget-storage-" + box_id, "[[" + $(this).val() + "]]");

				});

				$(obj).find(".nano-notepad-area").bind("keydown", function(event) {

					event.stopPropagation();
					event.stopImmediatePropagation();
					box_id = $(this).attr('data-id');
					XKit.storage.set("xwidgets", "widget-storage-" + box_id, "[[" + $(this).val() + "]]");

				});

			}

		},

		xcloud: {

			title: "XCloud Sync Shortcut",
			icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6OTJDRjA5NjAxM0UxMTFFMzlFMUI4QkQzOUFDODkyNkUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6OTJDRjA5NjExM0UxMTFFMzlFMUI4QkQzOUFDODkyNkUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3QjE1QjU3NTEzREMxMUUzOUUxQjhCRDM5QUM4OTI2RSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3QjE1QjU3NjEzREMxMUUzOUUxQjhCRDM5QUM4OTI2RSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pu/Sd+gAAAHxSURBVHjadFJNa1NBFD0zb8wjbdIqtrE2xfrRUIILW100G1GKCAUXunLj/xNB14pYENLWTQyCW20FQUuoNMaXl/c1M947k2dXDvcNw7nnfrx7rlg7KmAB/xlYDRhrLQOWHowI56AHcyS807FBJmwJuNtCQE+9YK6Cdzk2ZXFeTJ0etwL/DgX4UGYb1waEkNyYdS0J6o+KsmtaWTHV98AI1Tfrr17+GUULlxa+3nswqlS5hPBN81FMK/u7kExu9w4ePdkugvBXlLzefXN09+Fi/8OPlatRbd7OXQQH6PL/pLy2321dX569vPRzDDmDm5sb1V63tb7W73+eTOLDznZ6flExlUoKbA2OTwYnaN84niDKkRnUl1bvNJZlvdZutgdfvum9d4c7TynArmSJfP4im689e7zzO5g9TZEUSDQyFaY6HJ0i1hhX5mRFuZbipPn+7eb9rXqjOZRhlNpkHKUGZLmxsTa5Rg4Zf9od3uroihKrvUlr8N1097Isx3/OuZnqcKMzaDRpQuLKx0RIabWbPE1de0G8im4PjBNH0XgKpwMhhYFhs9qYooAunJoUoSAMyQcbyLCCQBKu/EqROJxPCBEEVoYS5f65KkyQwsul/EbQaNnokhzKoDAeYNwhnql8PCe05cqdrevZzpZ58VeAAQACLkV6R14RIwAAAABJRU5ErkJggg==",
			css: " .xkit-widgets-blank { background: rgba(255,255,255,0.22) !important; color: white; line-height: 120px; text-align: center; }",

			init: function(obj) {

				var show_error = false;
				$(obj).addClass("xcloud-widget");

				if (XKit.installed.check("xcloud") === false) {
					show_error = true;
				} else {
					if (XKit.extensions.xcloud.running === false) {
						show_error = true;
					} else {
						if (XKit.storage.get("xcloud", "username", "") === "") {
							show_error = true;
						}
					}
				}

				if (show_error) {

					$(obj).addClass("error");
					$(obj).html("XCloud is not installed, is disabled or you are not signed in.");
					return;

				}

				$(obj).addClass("loaded");
				var m_html = "<div class=\"title\">" +
							"Signed as" +
							"<div class=\"username\">" +
								XKit.storage.get("xcloud", "username", "") +
							"</div>" +
						"</div>" +
						"<div class=\"button\">" +
							"Sync now" +
						"</div>";

				$(obj).html(m_html);

				$(obj).find(".button").click(function() {

					XKit.extensions.xcloud.start_upload();

				});

			}

		},

		cnn_rss: {

			title: "CNN Top Stories",
			icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTA1NzUzQkYxM0YzMTFFMzlFMUI4QkQzOUFDODkyNkUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTA1NzUzQzAxM0YzMTFFMzlFMUI4QkQzOUFDODkyNkUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFMDU3NTNCRDEzRjMxMUUzOUUxQjhCRDM5QUM4OTI2RSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFMDU3NTNCRTEzRjMxMUUzOUUxQjhCRDM5QUM4OTI2RSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PiwECb8AAAGqSURBVHjaYjxnJ8/AwPDj0UMOOaIYTAwkAsZjCih8Eb8YYc8gLm1DIPvb1fNvt697s2kJiga4k7g19VQmLmfi4Pp6+dzPF08+Hd4l5BkiFpbw9er5u6UJf79+hDiJBa4VqJpLVetqiPWv109VJqxk+PNHwNYVKM6tbQiUupniheIkoEtUJy7++/HDWWvBv18Z2MVFgYLMfCLqc7dxyIJU3M6PhbiNCWgLEAHdDeR8vnQaqBrIZWTnAnJ11p2AqAYC0ZA4IIkIJYgvmXn4EL4PzUDmcqloQRgsQK/ARXkNzYGOEfaLEwtL+vvpPXLg/PvzGxI2UCcBQxAiobX6FIugyMvF07jBdsLBjwe3IU6ChhIwvIU8AkFCsgpSSXl/v3x61Fv3dtMiZm5+TlU9YHh8PLwbPeL0tpxDNhUeLOrT17HLKlzyMYKIM2frybPwC/z5+PHL+eO8ZvaswqIQCW4do//ff6j0LWLm4QVGHDMXB1AN0EnM6fICQGkgByj0dtPSLxfOAlUwsXH8//ePVVT83fZ1d0rigVIQNUCj0dMSQQANJUgIEMMACDAArFqywzYe1SwAAAAASUVORK5CYII=",
			css: " .xkit-widgets-blank { background: rgba(255,255,255,0.22) !important; color: white; line-height: 120px; text-align: center; }",

			init: function(obj) {

				$(obj).addClass("cnn_rss");

				GM_xmlhttpRequest({
					method: "GET",
					url: "http://rss.cnn.com/rss/edition.rss",
					json: false,
					onerror: function(response) {
						$(obj).addClass("error-box");
						$(obj).html("Can't fetch RSS feed. Please try again later.");
						$(obj).removeClass("loaded");
						return;
					},
					onload: function(response) {

						var xml_doc = $.parseXML(response.responseText);

						var m_count = 0;
						var m_html = "";

						$(xml_doc).find("item").each(function() {

							if (m_count >= 6) {return false; }

							var title = $(this).find("title").text();
							var url = $(this).find("guid").text();

							m_html = m_html + "<a target=\"_BLANK\" href=\"" + url + "\">" + title + "</a>";
							m_count++;

						});

						$(obj).html(m_html);

					}
				});

			}

		},

		cnn_rss_us: {

			title: "CNN US Edition",
			icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RTA1NzUzQzMxM0YzMTFFMzlFMUI4QkQzOUFDODkyNkUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RTA1NzUzQzQxM0YzMTFFMzlFMUI4QkQzOUFDODkyNkUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpFMDU3NTNDMTEzRjMxMUUzOUUxQjhCRDM5QUM4OTI2RSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpFMDU3NTNDMjEzRjMxMUUzOUUxQjhCRDM5QUM4OTI2RSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PjDPoFIAAAK4SURBVHjaTJJNTBNBFMdnZndnS7eFFihQi+wuqRVKgCIYP4jGiIQEgx/Ek17UGC9GwsmjetIYDcZEEw8e1BA0UWOMHIyIHESjiZCAhiKWj25bCBYKFCvsbrf11UbCHCaT9/7vvd/8Z/DwfhEhtK4ETWViGjO/lSkqepOYiSvjvLQjibhYaMYke5OIjYZmBdnDov8rhVkDMUmMCIad07CZQZxOWA3zLGJ1wsOBEg5/kjJqAyMDIVAXHT3vaDmSW1UDwUW/P9jX73/dqxOqYpNOoAvPXKgRia1QXVnK8e6q635fsO/gWvRX7NvoeE+PuUz0dVwsazo0OxbAVvvKyrpVdpMNEu/tx5ZtnqFLHaO3bth89Y7djc69jTDHUbm95fpVHXEqw+sMZVeVSeMfCaj1eHzxx1gioQ50dgLG6Ks3rXe7cl3OgnKx2Fc9HfkYURYIFauo6ANuaAYkoM6RK1O8Rce0vfsBqLOW1Bxu0ghvk0TWwGAFl70lY7FqxMRmzKGe9lYqCBseFskuFYwiPLscmkgiPo0wRAtra3mXJLW1VR5rW1tNoE0raaRUYgqGl4lJquGl6pjfn020PXpI7fnDz3qLK9ybC+bDixqhBXIpqyOaJNz0u4Gtzc2QsLqcdSdPqIk//fefDvV9xkKuwy2dvnx25GsAkHTMkZiiLChheJ2of2KjHy+Yo3OxcGgxMDFXfaAh+HP2+ZNBQJqK/GZO7dzD2Iri8bXI2GRpvc9sz8vWbKmQ1g1y5so53pxz7+ZLVrAsrBrFkpM57vaCJ1CABdvI28HQ+AxrFhjKpdJpa77ty4fvXddeMEIuaKKrRo4tD9/xNsAsLWMZ1TAFW+FFNcRrDAXozBnzaiZOVQZklBXKPRTTudB8nixDDrjtYhnUK+GlAqkUPulkOF4ilkCvwGzCJTr+CjAADX8U/pM8nUcAAAAASUVORK5CYII=",
			css: " .xkit-widgets-blank { background: rgba(255,255,255,0.22) !important; color: white; line-height: 120px; text-align: center; }",

			init: function(obj) {

				$(obj).addClass("cnn_rss");
				$(obj).addClass("us_edition");

				GM_xmlhttpRequest({
					method: "GET",
					url: "http://rss.cnn.com/rss/edition_us.rss",
					json: false,
					onerror: function(response) {
						$(obj).addClass("error-box");
						$(obj).html("Can't fetch RSS feed. Please try again later.");
						$(obj).removeClass("loaded");
						return;
					},
					onload: function(response) {

						var xml_doc = $.parseXML(response.responseText);

						var m_count = 0;
						var m_html = "";

						$(xml_doc).find("item").each(function() {

							if (m_count >= 6) {return false; }

							var title = $(this).find("title").text();
							var url = $(this).find("guid").text();

							m_html = m_html + "<a target=\"_BLANK\" href=\"" + url + "\">" + title + "</a>";
							m_count++;

						});

						$(obj).html(m_html);

					}
				});

			}

		},

		audio_controls: {

			title: "Audio+ Controls",
			icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6RjlBRUVDQzgyMTNGMTFFM0IyMThFNEQ0NkQ3REQ0QzMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6RjlBRUVDQzkyMTNGMTFFM0IyMThFNEQ0NkQ3REQ0QzMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpGOUFFRUNDNjIxM0YxMUUzQjIxOEU0RDQ2RDdERDRDMyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpGOUFFRUNDNzIxM0YxMUUzQjIxOEU0RDQ2RDdERDRDMyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmgAT+UAAAHXSURBVHjaVFI7L0RBFD67rrXrrot4s5t47Sq8QiQ6WhoUKlEQiWh02pWsRMcPkK1FRdRKhUchRBRCISESjQIrG8mcGeexFrNz5+7MfOd833fODeVmM+CcRUeLDnmjNRaNQcs/OaAX0t6jPRAGGAaE5gvHkxbK5OThrQOgCZ7gGE1X1qADJcLyaEX7YHeS5lBPczq5MbLAl0AMxnAsJSYs2I7RvsRAV2Iw1djdBn+HM7KyJIU61TGVXYL/4/M97wdxYzkrIT2DyOKQbbDsn3FzdnV+dHx9evF0e3/wcEJi9F5Mk1lkPg3IzK3enF9WebEg4sfD0f7aTk5AEJHOkhipZbBcB3P3OlKXQikQSr3pEJmAtXhIAVJEMcK5KsMRFgtsToop7KAmgAIM47RvEiENsOwSbHMqGYn7JUl05TmD2iCpmrJrl3AmuzI8Pa41sL+ShD09NjyxNl/T2iAMRhWU0Pm3D/4YtNNOKKazy7Eqv5jMgfb9MLfX2ZvKv+V3t3Z8zkCsahrg5fG5ozdNf3bWt612xsH+Zq6AhTCEmqI1UBYhE6SVAhyEYG1ysYBfhEvE6uorAvbnoCVaDRAUaY021bIkcKGeoEWrSjiWCMVvs+RY0HzyLcAADVWXkwI9WIEAAAAASUVORK5CYII=",
			css: " .xkit-widgets-blank { background: rgba(255,255,255,0.22) !important; color: white; line-height: 120px; text-align: center; }",

			init: function(obj, data) {

				$(obj).addClass("audio_plus_controller");

				var this_widget = XKit.extensions.xwidgets.widgets.audio_controls;

				if (typeof XKit.extensions.audio_plus === "undefined") {
					this_widget.show_error(obj);
					return;
				} else {
					if (XKit.extensions.audio_plus.running !== true) {
						this_widget.show_error(obj);
						return;
					}
				}

				if (typeof data.interval !== "undefined") {
					clearInterval(data.interval);
				}

				data.interval = setInterval(function() { this_widget.tick(obj, data); }, 1000);
				this_widget.tick(obj, data);

				$(document).off("click", ".xkit-audio-plus-button", this_widget.button_pressed);
				$(document).on("click", ".xkit-audio-plus-button", this_widget.button_pressed);



			},

			button_pressed: function(e) {

				var m_parent = $(e.target).parent();

				if ($(m_parent).hasClass("song-actually-playing")) {
					XKit.extensions.audio_plus.stop_current_instance();
				} else {
					XKit.extensions.audio_plus.play_current_instance();
				}

				$(m_parent).toggleClass("song-actually-playing");

				XKit.extensions.audio_plus.check_current();

			},

			tick: function(obj, data) {

				var m_player = XKit.extensions.audio_plus.return_current_instance();

				if (m_player === -1) {
					$(obj).addClass("xkit-no-song-playing");
					$(obj).html("Not playing");
					return;
				}

				$(obj).removeClass("xkit-no-song-playing");
				$(obj).addClass("xkit-song-playing");

				data.last_artist = m_player.artist;
				data.last_title = m_player.title;

				if ($(obj).find(".xkit-audio-plus-artist").length > 0) {

					if (m_player.playing === true) {
						$(obj).addClass("song-actually-playing");
					} else {
						$(obj).removeClass("song-actually-playing");
					}

					if ($(obj).find(".xkit-audio-plus-title").html() === m_player.title) {
						return;
					}

					$(obj).find(".xkit-audio-plus-title").html(m_player.title);
					$(obj).find(".xkit-audio-plus-artist").html(m_player.artist);

				} else {

					var m_html = "<div class=\"xkit-audio-plus-artist\">" + m_player.artist + "</div>"  +
							"<div class=\"xkit-audio-plus-title\">" + m_player.title + "</div>" +
							"<div class=\"xkit-audio-plus-button\">&nbsp;</div>";

					$(obj).html(m_html);

				}

				if (m_player.playing === true) {
					$(obj).addClass("song-actually-playing");
				} else {
					$(obj).removeClass("song-actually-playing");
				}

			},

			show_error: function(obj) {

				$(obj).addClass("no-audio-plus");
				$(obj).html("This widget requires Audio+ 0.2 installed and enabled.");

			},

			destroy: function(obj, data) {
				clearInterval(data.interval);
			}

		},

		lights_out: {

			title: "Lights Out",
			icon: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMC1jMDYwIDYxLjEzNDc3NywgMjAxMC8wMi8xMi0xNzozMjowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNSBNYWNpbnRvc2giIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QUM3NjEzNkUxNDExMTFFMzlFMUI4QkQzOUFDODkyNkUiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QUM3NjEzNkYxNDExMTFFMzlFMUI4QkQzOUFDODkyNkUiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBQzc2MTM2QzE0MTExMUUzOUUxQjhCRDM5QUM4OTI2RSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBQzc2MTM2RDE0MTExMUUzOUUxQjhCRDM5QUM4OTI2RSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PvVmJSIAAAFASURBVHjajJJdSsUwEEabNk1LxaV0Nb2FvqjPoojgWtRn8SKCy2kfSl+6jP63nnZAAkbwg5v7JTOZnkyiiqLYtm2eZ62153kYYwxmHMcoipRSwzCw4vt+3/dhGGp+QRB0XfcTjuN4XVeqECIPLzkYdmr+qLcewizLgmH0XKKinqaJMgAwssQUL3uoSgaQ8h1CTH1zCB7Guq7btsUnj5+XT1+cqizLpmm0JR9WCssosr2DKs9z6QCFmXPoJEmWQ392iQmgGHN/vqCzL9fxw8fegNeb4PbNHIacPRskFBySQyO8E0ZQ1el0kvuigHRJjBNpP7WgUxVfVRU+TdPw7n3f/HxFl2RFQHYk+1K8f0hlWWYj2WxuJAkT+G3IY+SsskEelZbm+IckT9icV4nRvFMyAABGkOTlQUJJGwnDF74FGAAdz94A4QSWuwAAAABJRU5ErkJggg==",
			css: " .xkit-widgets-blank { background: rgba(255,255,255,0.22) !important; color: white; line-height: 120px; text-align: center; }",

			init: function(obj, data) {

				$(obj).addClass("lights_out");

				var m_boxes = "";

				// Random generated puzzles mostly fail.
				// Had to do this. ugh. based on a lights out game generator I found.

				var puzzles = [
					"# # ## # ##   ### #    ##",
					"####  #   # # ###  ## #  ",
					" ###  ### #    ## ## #   ",
					"##    ########     #  # #",
					" #    #######  #        #",
					" #  # ###  ### ####  ## #",
					"# # # ##       #### ###  ",
					"  #  ############ ###   #",
					"#  ##   ###    # # ####  ",
					"  ####  #  ###  ###   ###",
					"## ##     #  # ###  # ## ",
					"   #  ### # ## # # ## #  ",
					"#  #    ### ##   # ### ##",
					"## ### # ## # # ## ##  # ",
					"#   # ###    #  ###  ####",
					"#  # # # ### ##  ## #  # ",
					"#   ## #  #  #### ## #   ",
					"#   # ##       #  ### # #",
					"####  ### #   ## #   # ##",
					"   # #       ###   #    #",
				];

				var m_puzzle = Math.floor(Math.random() * puzzles.length);
				var m_count = 0;
				for (var y = 0; y < 5; y++) {
					m_boxes = m_boxes + "<div class=\"line\">";
					for (var x = 0; x < 5; x++) {
						var __class = "";
						if (puzzles[m_puzzle].substring(m_count, m_count + 1) === "#") {
							__class = "on";
						}
						m_boxes = m_boxes + "<div data-x=\"" + x + "\" data-y=\"" + y + "\" class=\"" + __class + " box box-" + x + "-" + y + "\">&nbsp;</div>";
						m_count++;
					}
					m_boxes = m_boxes + "</div>";
				}

				var m_html = "<div class=\"lights-out-grid\">" +
							m_boxes +
						"</div>";

				$(obj).html(m_html);

				data.moves = 0;

				$(obj).find(".box").click(function() {

					$(this).toggleClass("on");

					var current_x = parseInt($(this).attr('data-x'));
					var current_y = parseInt($(this).attr('data-y'));

					$(this).parent().find(".box-" + (current_x + 1) + "-" + (current_y)).toggleClass("on");
					$(this).parent().find(".box-" + (current_x - 1) + "-" + (current_y)).toggleClass("on");
					$(this).parent().parent().find(".box-" + (current_x) + "-" + (current_y + 1)).toggleClass("on");
					$(this).parent().parent().find(".box-" + (current_x) + "-" + (current_y - 1)).toggleClass("on");

					data.moves++;

					var box_id = $(obj).attr('data-id');

					if ($(this).parent().parent().find(".box.on").length === 0) {
						XKit.window.show("A WINNER IS YOU<i>!!</i>", "Congratulations! You've finished the puzzle in " + data.moves + " moves.", "info", "<div id=\"xkit-puzzle-restart-for-" + box_id + "\" class=\"xkit-button default\">Restart</div>");

						$("#xkit-puzzle-restart-for-" + box_id).click(function() {

							XKit.extensions.xwidgets.widgets.lights_out.init(obj, data);
							XKit.window.close();

						});

					}

				});

			}

		}


	},

	show_add: function(box_id) {

		var m_list = "";

		for (var widget in XKit.extensions.xwidgets.widgets) {

			m_list = m_list + "<div class=\"xwidgets-add-list-item\" data-id=\"" + widget + "\"><img src=\"" + XKit.extensions.xwidgets.widgets[widget].icon + "\" class=\"xwidgets-add-list-item-icon\">" + XKit.extensions.xwidgets.widgets[widget].title + "</div>";

		}

		m_list = "<div id=\"xkit-xwidgets-add-list\" class=\"nano\">" +
					"<div id=\"xkit-xwidgets-add-list-content\" class=\"content\">" +
						m_list +
					"</div>" +
				"</div>";

		XKit.window.show("Add Widget to Slot #" + box_id, m_list, "question", "<div id=\"xkit-ok-message-xwidgets\" class=\"xkit-button default\">OK</div><div class=\"xkit-button\" id=\"xkit-close-message-xwidgets\">Cancel</div>");

		$("#xkit-xwidgets-add-list").nanoScroller();
		$("#xkit-xwidgets-add-list").nanoScroller({ scroll: 'top' });

		$("body").css("overflow", "hidden");

		$(".xwidgets-add-list-item").click(function() {

			$(".xwidgets-add-list-item").not(this).removeClass("selected");
			$(this).addClass("selected");

		});

		$("#xkit-close-message-xwidgets").click(function() {

			XKit.window.close();
			$("body").css("overflow", "auto");

		});

		$("#xkit-ok-message-xwidgets").click(function() {

			var widget_id = $(".xwidgets-add-list-item.selected").attr('data-id');

			XKit.storage.set("xwidgets", "widget-storage-" + box_id, "");

			XKit.extensions.xwidgets.clear_box($("#xwidgets-box-" + box_id));
			XKit.extensions.xwidgets.widget_data[box_id] = {};
			XKit.extensions.xwidgets.widgets[widget_id].init($("#xwidgets-box-" + box_id), XKit.extensions.xwidgets.widget_data[box_id]);

			XKit.extensions.xwidgets.user_widgets[box_id] = widget_id;
			XKit.extensions.xwidgets.save_settings();

			XKit.window.close();
			$("body").css("overflow", "auto");

		});

		$(".xwidgets-add-list-item").first().trigger('click');

	},

	clear_box: function(widget_box) {

		$(widget_box).attr("class", "xwidgets-box");
		$(widget_box).html("");

	},

	init: function() {

		XKit.tools.init_css("xwidgets");

		if (this.preferences.no_opener.value === true) {
			XKit.tools.add_css("#xwidgets-opener { display: none; } ", "xwidgets-no-opener");
		}

		if (this.preferences.enable_keyboard_shortcuts.value === true) {
			$(document).on('keydown', XKit.extensions.xwidgets.key_down);
		}

		var m_html = "<div id=\"xwidgets-drawer\">" +
					"<div id=\"xwidgets-drawer-inner\">" +
						"<div class=\"xwidgets-box\" id=\"xwidgets-box-1\" data-id=\"1\">&nbsp;</div>" +
						"<div class=\"xwidgets-box\" id=\"xwidgets-box-2\" data-id=\"2\">&nbsp;</div>" +
						"<div class=\"xwidgets-box\" id=\"xwidgets-box-3\" data-id=\"3\">&nbsp;</div>" +
						"<div class=\"xwidgets-box\" id=\"xwidgets-box-4\" data-id=\"4\">&nbsp;</div>" +
						"<div class=\"xwidgets-box\" id=\"xwidgets-box-5\" data-id=\"5\">&nbsp;</div>" +
						"<div class=\"xwidgets-box\" id=\"xwidgets-box-6\" data-id=\"6\">&nbsp;</div>" +
					"</div>" +
				"</div>" +
				"<div id=\"xwidgets-opener\">&nbsp;</div>";

		$("body").append(m_html);

		$(document).on('click', '.xwidgets-box', XKit.extensions.xwidgets.handle_click);

		XKit.extensions.xwidgets.load_settings();

		$("#xwidgets-opener").click(function() {

			$(this).toggleClass("opened");
			$("#xwidgets-drawer").toggleClass("opened");
			$("body").toggleClass("xkit-widgets-opened");

			if ($("#xwidgets-drawer").hasClass("opened")) {
				XKit.extensions.xwidgets.init_widgets();
			} else {
				XKit.extensions.xwidgets.shutdown_widgets();
			}

		});

	},

	shutdown_widgets: function() {

		setTimeout(function() {

			for (var i = 1; i <= 6; i++) {
				XKit.extensions.xwidgets.clear_box($("#xwidgets-box-" + i));
				if (typeof XKit.extensions.xwidgets.widgets[XKit.extensions.xwidgets.user_widgets[i]].destroy === "function") {
					XKit.extensions.xwidgets.widgets[XKit.extensions.xwidgets.user_widgets[i]].destroy($("#xwidgets-box-" + i), XKit.extensions.xwidgets.widget_data[i]);
				}
				XKit.extensions.xwidgets.widget_data[i] = {};
			}

		}, 200);

	},

	load_settings: function() {

		try {
			var __user_widgets = XKit.storage.get("xwidgets", "user_widgets", "");
			if (__user_widgets === "" || typeof __user_widgets === "undefined") {
				XKit.extensions.xwidgets.user_widgets = [];
			} else {
				XKit.extensions.xwidgets.user_widgets = JSON.parse(__user_widgets);
			}
		} catch (e) {
			XKit.extensions.xwidgets.user_widgets = [];
		}

		console.log(XKit.extensions.xwidgets.user_widgets);

	},

	save_settings: function() {

		XKit.storage.set("xwidgets", "user_widgets", JSON.stringify(XKit.extensions.xwidgets.user_widgets));

	},

	init_widgets: function() {

		XKit.extensions.xwidgets.load_settings();

		if (XKit.extensions.xwidgets.user_widgets.length === 0) {
			// First use?
			XKit.extensions.xwidgets.user_widgets[1] = "getting_started";
		}

		for (var widget in XKit.extensions.xwidgets.widgets) {

			XKit.tools.add_css(XKit.extensions.xwidgets.widgets[widget].css, "xkit-widgets-widget__" + widget + "__css");

		}

		console.log(XKit.extensions.xwidgets.user_widgets);

		for (var i = 1; i <= 6; i++) {

			XKit.extensions.xwidgets.clear_box($("#xwidgets-box-" + i));

			XKit.extensions.xwidgets.widget_data[i] = {};

			if (XKit.extensions.xwidgets.user_widgets[i] !== "" || typeof XKit.extensions.xwidgets.user_widgets[i] !== "undefined") {

				try {
					XKit.console.add("---> " + [XKit.extensions.xwidgets.user_widgets[i]]);
					XKit.extensions.xwidgets.widgets[XKit.extensions.xwidgets.user_widgets[i]].init($("#xwidgets-box-" + i), XKit.extensions.xwidgets.widget_data[i]);
				} catch (e) {
					XKit.console.add("Can't load slot #" + i + ": " + e.message);
					XKit.extensions.xwidgets.widgets.blank.init($("#xwidgets-box-" + i), XKit.extensions.xwidgets.widget_data[i]);
				}

			} else {

				XKit.extensions.xwidgets.widgets.blank.init($("#xwidgets-box-" + i), XKit.extensions.xwidgets.widget_data[i]);

			}

		}

	},

	handle_click: function(event) {

		if (event.altKey) {

			var slot_no = $(this).attr('data-id');

			if ($(this).hasClass("xkit-widgets-blank")) {
				return;
			}

			if (!$(this).hasClass("xwidgets-box")) {
				var m_box;
				if ($(this).parent().hasClass("xwidgets-box")) {
					m_box = $(this).parent();
				} else {
					m_box = $(this).parentsUntil(".xwidgets-box").parent();
				}
				slot_no = $(m_box).attr('data-id');
				if ($(m_box).hasClass("xkit-widgets-blank")) {
					return;
				}
			}

			slot_no = parseInt(slot_no);

			XKit.window.show("Remove Widget on Slot #" + slot_no + "?", "Are you sure you want to remove the widget on this slot?", "question", "<div id=\"xkit-remove-widget\" class=\"xkit-button default\">Remove</div><div id=\"xkit-close-message\" class=\"xkit-button\">Cancel</div>");

			$("#xkit-remove-widget").click(function() {

				XKit.extensions.xwidgets.clear_box($("#xwidgets-box-" + slot_no));
				XKit.extensions.xwidgets.widgets.blank.init($("#xwidgets-box-" + slot_no), XKit.extensions.xwidgets.widget_data[slot_no]);

				XKit.storage.set("xwidgets", "widget-storage-" + slot_no, "");

				if (typeof XKit.extensions.xwidgets.widgets[XKit.extensions.xwidgets.user_widgets[slot_no]].destroy === "function") {
					console.log("Destroying widget at " + slot_no);
					XKit.extensions.xwidgets.widgets[XKit.extensions.xwidgets.user_widgets[slot_no]]
						.destroy($("#xwidgets-box-" + slot_no), XKit.extensions.xwidgets.widget_data[slot_no]);
				}

				XKit.extensions.xwidgets.user_widgets[slot_no] = "blank";

				XKit.extensions.xwidgets.widget_data[slot_no] = {};
				XKit.extensions.xwidgets.save_settings();

				XKit.window.close();

			});

		}

	},

	key_down: function(e) {
		if (e.altKey === true && e.which === 87) {
			$("#xwidgets-opener").trigger("click");
		}

	},

	destroy: function() {
		this.running = false;
		$(document).off('click', '.xwidgets-box', XKit.extensions.xwidgets.handle_click);
		$(document).off('keydown', XKit.extensions.xwidgets.key_down);
		$("#xwidgets-drawer, #xwidgets-opener").remove();
		XKit.tools.remove_css("xwidgets");
		XKit.tools.remove_css("xwidgets-no-opener");
	}

});
