//* TITLE Themes+ (preview) **//
//* VERSION 0.2.6 **//
//* DESCRIPTION Customize More **//
//* DETAILS Themes+ lets you customize your dashboard to your liking by letting you choose the colors, the images and options yourself. You can also export and import the themes you and others made. Please note that this is the preview edition, so it's lacking some functionality. **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* BETA false **//

jQuery.fn.selectText = function() {
	var doc = document;
	var element = this[0];
	var range, selection;

	if (doc.body.createTextRange) {
		range = document.body.createTextRange();
		range.moveToElementText(element);
		range.select();
	} else if (window.getSelection) {
		selection = window.getSelection();
		range = document.createRange();
		range.selectNodeContents(element);
		selection.removeAllRanges();
		selection.addRange(range);
	}
};

/**
 *
 * Color picker
 * Author: Stefan Petre www.eyecon.ro
 *
 * Dual licensed under the MIT and GPL licenses
 *
 */
/* eslint-disable id-length, no-unused-vars */
(function($) {
	var ColorPicker = function() {
		var
			ids = {},
			inAction,
			charMin = 65,
			visible,
			tpl = '<div class="colorpicker"><div class="colorpicker_color"><div><div></div></div></div><div class="colorpicker_hue"><div></div></div><div class="colorpicker_new_color"></div><div class="colorpicker_current_color"></div><div class="colorpicker_hex"><input type="text" maxlength="6" size="6" /></div><div class="colorpicker_rgb_r colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_g colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_rgb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_h colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_s colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_hsb_b colorpicker_field"><input type="text" maxlength="3" size="3" /><span></span></div><div class="colorpicker_submit"></div></div>',
			defaults = {
				eventName: 'click',
				onShow: function() {},
				onBeforeShow: function() {},
				onHide: function() {},
				onChange: function() {},
				onSubmit: function() {},
				color: 'ff0000',
				livePreview: true,
				flat: false
			},
			fillRGBFields = function(hsb, cal) {
				var rgb = HSBToRGB(hsb);
				$(cal).data('colorpicker').fields
					.eq(1).val(rgb.r).end()
					.eq(2).val(rgb.g).end()
					.eq(3).val(rgb.b).end();
			},
			fillHSBFields = function(hsb, cal) {
				$(cal).data('colorpicker').fields
					.eq(4).val(hsb.h).end()
					.eq(5).val(hsb.s).end()
					.eq(6).val(hsb.b).end();
			},
			fillHexFields = function(hsb, cal) {
				$(cal).data('colorpicker').fields
					.eq(0).val(HSBToHex(hsb)).end();
			},
			setSelector = function(hsb, cal) {
				$(cal).data('colorpicker').selector.css('backgroundColor', '#' + HSBToHex({h: hsb.h, s: 100, b: 100}));
				$(cal).data('colorpicker').selectorIndic.css({
					left: parseInt(150 * hsb.s / 100, 10),
					top: parseInt(150 * (100 - hsb.b) / 100, 10)
				});
			},
			setHue = function(hsb, cal) {
				$(cal).data('colorpicker').hue.css('top', parseInt(150 - 150 * hsb.h / 360, 10));
			},
			setCurrentColor = function(hsb, cal) {
				$(cal).data('colorpicker').currentColor.css('backgroundColor', '#' + HSBToHex(hsb));
			},
			setNewColor = function(hsb, cal) {
				$(cal).data('colorpicker').newColor.css('backgroundColor', '#' + HSBToHex(hsb));
			},
			keyDown = function(ev) {
				var pressedKey = ev.charCode || ev.keyCode || -1;
				if ((pressedKey > charMin && pressedKey <= 90) || pressedKey == 32) {
					return false;
				}
				var cal = $(this).parent().parent();
				if (cal.data('colorpicker').livePreview === true) {
					change.apply(this);
				}
			},
			change = function(ev) {
				var cal = $(this).parent().parent(), col;
				if (this.parentNode.className.indexOf('_hex') > 0) {
					cal.data('colorpicker').color = col = HexToHSB(fixHex(this.value));
				} else if (this.parentNode.className.indexOf('_hsb') > 0) {
					cal.data('colorpicker').color = col = fixHSB({
						h: parseInt(cal.data('colorpicker').fields.eq(4).val(), 10),
						s: parseInt(cal.data('colorpicker').fields.eq(5).val(), 10),
						b: parseInt(cal.data('colorpicker').fields.eq(6).val(), 10)
					});
				} else {
					cal.data('colorpicker').color = col = RGBToHSB(fixRGB({
						r: parseInt(cal.data('colorpicker').fields.eq(1).val(), 10),
						g: parseInt(cal.data('colorpicker').fields.eq(2).val(), 10),
						b: parseInt(cal.data('colorpicker').fields.eq(3).val(), 10)
					}));
				}
				if (ev) {
					fillRGBFields(col, cal.get(0));
					fillHexFields(col, cal.get(0));
					fillHSBFields(col, cal.get(0));
				}
				setSelector(col, cal.get(0));
				setHue(col, cal.get(0));
				setNewColor(col, cal.get(0));
				cal.data('colorpicker').onChange.apply(cal, [col, HSBToHex(col), HSBToRGB(col)]);
			},
			blur = function(ev) {
				var cal = $(this).parent().parent();
				cal.data('colorpicker').fields.parent().removeClass('colorpicker_focus');
			},
			focus = function() {
				charMin = this.parentNode.className.indexOf('_hex') > 0 ? 70 : 65;
				$(this).parent().parent().data('colorpicker').fields.parent().removeClass('colorpicker_focus');
				$(this).parent().addClass('colorpicker_focus');
			},
			downIncrement = function(ev) {
				var field = $(this).parent().find('input').focus();
				var current = {
					el: $(this).parent().addClass('colorpicker_slider'),
					max: this.parentNode.className.indexOf('_hsb_h') > 0 ? 360 : (this.parentNode.className.indexOf('_hsb') > 0 ? 100 : 255),
					y: ev.pageY,
					field: field,
					val: parseInt(field.val(), 10),
					preview: $(this).parent().parent().data('colorpicker').livePreview
				};
				$(document).bind('mouseup', current, upIncrement);
				$(document).bind('mousemove', current, moveIncrement);
			},
			moveIncrement = function(ev) {
				ev.data.field.val(Math.max(0, Math.min(ev.data.max, parseInt(ev.data.val + ev.pageY - ev.data.y, 10))));
				if (ev.data.preview) {
					change.apply(ev.data.field.get(0), [true]);
				}
				return false;
			},
			upIncrement = function(ev) {
				change.apply(ev.data.field.get(0), [true]);
				ev.data.el.removeClass('colorpicker_slider').find('input').focus();
				$(document).unbind('mouseup', upIncrement);
				$(document).unbind('mousemove', moveIncrement);
				return false;
			},
			downHue = function(ev) {
				var current = {
					cal: $(this).parent(),
					y: $(this).offset().top
				};
				current.preview = current.cal.data('colorpicker').livePreview;
				$(document).bind('mouseup', current, upHue);
				$(document).bind('mousemove', current, moveHue);
			},
			moveHue = function(ev) {
				change.apply(
					ev.data.cal.data('colorpicker')
						.fields
						.eq(4)
						.val(parseInt(360 * (150 - Math.max(0, Math.min(150, (ev.pageY - ev.data.y)))) / 150, 10))
						.get(0),
					[ev.data.preview]
				);
				return false;
			},
			upHue = function(ev) {
				fillRGBFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				fillHexFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				$(document).unbind('mouseup', upHue);
				$(document).unbind('mousemove', moveHue);
				return false;
			},
			downSelector = function(ev) {
				var current = {
					cal: $(this).parent(),
					pos: $(this).offset()
				};
				current.preview = current.cal.data('colorpicker').livePreview;
				$(document).bind('mouseup', current, upSelector);
				$(document).bind('mousemove', current, moveSelector);
			},
			moveSelector = function(ev) {
				change.apply(
					ev.data.cal.data('colorpicker')
						.fields
						.eq(6)
						.val(parseInt(100 * (150 - Math.max(0, Math.min(150, (ev.pageY - ev.data.pos.top)))) / 150, 10))
						.end()
						.eq(5)
						.val(parseInt(100 * (Math.max(0, Math.min(150, (ev.pageX - ev.data.pos.left)))) / 150, 10))
						.get(0),
					[ev.data.preview]
				);
				return false;
			},
			upSelector = function(ev) {
				fillRGBFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				fillHexFields(ev.data.cal.data('colorpicker').color, ev.data.cal.get(0));
				$(document).unbind('mouseup', upSelector);
				$(document).unbind('mousemove', moveSelector);
				return false;
			},
			enterSubmit = function(ev) {
				$(this).addClass('colorpicker_focus');
			},
			leaveSubmit = function(ev) {
				$(this).removeClass('colorpicker_focus');
			},
			clickSubmit = function(ev) {
				var cal = $(this).parent();
				var col = cal.data('colorpicker').color;
				cal.data('colorpicker').origColor = col;
				setCurrentColor(col, cal.get(0));
				cal.data('colorpicker').onSubmit(col, HSBToHex(col), HSBToRGB(col), cal.data('colorpicker').el);
			},
			show = function(ev) {
				var cal = $('#' + $(this).data('colorpickerId'));
				cal.data('colorpicker').onBeforeShow.apply(this, [cal.get(0)]);
				var pos = $(this).offset();
				var viewPort = getViewport();
				var top = pos.top + this.offsetHeight;
				var left = pos.left;
				if (top + 176 > viewPort.t + viewPort.h) {
					top -= this.offsetHeight + 176;
				}
				if (left + 356 > viewPort.l + viewPort.w) {
					left -= 356;
				}
				cal.css({left: left + 'px', top: top + 'px'});
				if (cal.data('colorpicker').onShow.apply(this, [cal.get(0)])) {
					cal.show();
				}
				$(document).bind('mousedown', {cal: cal}, hide);
				return false;
			},
			hide = function(ev) {
				if (!isChildOf(ev.data.cal.get(0), ev.target, ev.data.cal.get(0))) {
					if (ev.data.cal.data('colorpicker').onHide.apply(this, [ev.data.cal.get(0)])) {
						ev.data.cal.hide();
					}
					$(document).unbind('mousedown', hide);
				}
			},
			isChildOf = function(parentEl, el, container) {
				if (parentEl == el) {
					return true;
				}
				if (parentEl.contains) {
					return parentEl.contains(el);
				}
				if ( parentEl.compareDocumentPosition ) {
					return !!(parentEl.compareDocumentPosition(el) & 16);
				}
				var prEl = el.parentNode;
				while (prEl && prEl != container) {
					if (prEl == parentEl)
						return true;
					prEl = prEl.parentNode;
				}
				return false;
			},
			getViewport = function() {
				var m = document.compatMode == 'CSS1Compat';
				return {
					l : window.pageXOffset || (m ? document.documentElement.scrollLeft : document.body.scrollLeft),
					t : window.pageYOffset || (m ? document.documentElement.scrollTop : document.body.scrollTop),
					w : window.innerWidth || (m ? document.documentElement.clientWidth : document.body.clientWidth),
					h : window.innerHeight || (m ? document.documentElement.clientHeight : document.body.clientHeight)
				};
			},
			fixHSB = function(hsb) {
				return {
					h: Math.min(360, Math.max(0, hsb.h)),
					s: Math.min(100, Math.max(0, hsb.s)),
					b: Math.min(100, Math.max(0, hsb.b))
				};
			},
			fixRGB = function(rgb) {
				return {
					r: Math.min(255, Math.max(0, rgb.r)),
					g: Math.min(255, Math.max(0, rgb.g)),
					b: Math.min(255, Math.max(0, rgb.b))
				};
			},
			fixHex = function(hex) {
				var len = 6 - hex.length;
				if (len > 0) {
					var o = [];
					for (var i = 0; i < len; i++) {
						o.push('0');
					}
					o.push(hex);
					hex = o.join('');
				}
				return hex;
			},
			HexToRGB = function(hex) {
				hex = parseInt(((hex.indexOf('#') > -1) ? hex.substring(1) : hex), 16);
				return {r: hex >> 16, g: (hex & 0x00FF00) >> 8, b: (hex & 0x0000FF)};
			},
			HexToHSB = function(hex) {
				return RGBToHSB(HexToRGB(hex));
			},
			RGBToHSB = function(rgb) {
				var hsb = {
					h: 0,
					s: 0,
					b: 0
				};
				var min = Math.min(rgb.r, rgb.g, rgb.b);
				var max = Math.max(rgb.r, rgb.g, rgb.b);
				var delta = max - min;
				hsb.b = max;
				hsb.s = max !== 0 ? 255 * delta / max : 0;
				if (hsb.s !== 0) {
					if (rgb.r == max) {
						hsb.h = (rgb.g - rgb.b) / delta;
					} else if (rgb.g == max) {
						hsb.h = 2 + (rgb.b - rgb.r) / delta;
					} else {
						hsb.h = 4 + (rgb.r - rgb.g) / delta;
					}
				} else {
					hsb.h = -1;
				}
				hsb.h *= 60;
				if (hsb.h < 0) {
					hsb.h += 360;
				}
				hsb.s *= 100 / 255;
				hsb.b *= 100 / 255;
				return hsb;
			},
			HSBToRGB = function(hsb) {
				var rgb = {};
				var h = Math.round(hsb.h);
				var s = Math.round(hsb.s * 255 / 100);
				var v = Math.round(hsb.b * 255 / 100);
				if (s === 0) {
					rgb.r = rgb.g = rgb.b = v;
				} else {
					var t1 = v;
					var t2 = (255 - s) * v / 255;
					var t3 = (t1 - t2) * (h % 60) / 60;
					if (h == 360) h = 0;
					if (h < 60) {
						rgb.r = t1; rgb.b = t2; rgb.g = t2 + t3;
					} else if (h < 120) {
						rgb.g = t1; rgb.b = t2; rgb.r = t1 - t3;
					} else if (h < 180) {
						rgb.g = t1; rgb.r = t2; rgb.b = t2 + t3;
					} else if (h < 240) {
						rgb.b = t1; rgb.r = t2; rgb.g = t1 - t3;
					} else if (h < 300) {
						rgb.b = t1; rgb.g = t2; rgb.r = t2 + t3;
					} else if (h < 360) {
						rgb.r = t1; rgb.g = t2; rgb.b = t1 - t3;
					} else {
						rgb.r = 0; rgb.g = 0; rgb.b = 0;
					}
				}
				return {r: Math.round(rgb.r), g: Math.round(rgb.g), b: Math.round(rgb.b)};
			},
			RGBToHex = function(rgb) {
				var hex = [
					rgb.r.toString(16),
					rgb.g.toString(16),
					rgb.b.toString(16)
				];
				$.each(hex, function(nr, val) {
					if (val.length == 1) {
						hex[nr] = '0' + val;
					}
				});
				return hex.join('');
			},
			HSBToHex = function(hsb) {
				return RGBToHex(HSBToRGB(hsb));
			},
			restoreOriginal = function() {
				var cal = $(this).parent();
				var col = cal.data('colorpicker').origColor;
				cal.data('colorpicker').color = col;
				fillRGBFields(col, cal.get(0));
				fillHexFields(col, cal.get(0));
				fillHSBFields(col, cal.get(0));
				setSelector(col, cal.get(0));
				setHue(col, cal.get(0));
				setNewColor(col, cal.get(0));
			};
		return {
			init: function(opt) {
				opt = $.extend({}, defaults, opt || {});
				if (typeof opt.color == 'string') {
					opt.color = HexToHSB(opt.color);
				} else if (typeof(opt.color.r) === "number" &&
						   typeof(opt.color.g) === "number" &&
						   typeof(opt.color.b) === "number") {
					opt.color = RGBToHSB(opt.color);
				} else if (typeof(opt.color.h) === "number" &&
						   typeof(opt.color.s) === "number" &&
						   typeof(opt.color.b) === "number") {
					opt.color = fixHSB(opt.color);
				} else {
					return this;
				}
				return this.each(function() {
					if (!$(this).data('colorpickerId')) {
						var options = $.extend({}, opt);
						options.origColor = opt.color;
						var id = 'collorpicker_' + parseInt(Math.random() * 1000);
						$(this).data('colorpickerId', id);
						var cal = $(tpl).attr('id', id);
						if (options.flat) {
							cal.appendTo(this).show();
						} else {
							cal.appendTo(document.body);
						}
						options.fields = cal
											.find('input')
												.bind('keyup', keyDown)
												.bind('change', change)
												.bind('blur', blur)
												.bind('focus', focus);
						cal
							.find('span').bind('mousedown', downIncrement).end()
							.find('>div.colorpicker_current_color').bind('click', restoreOriginal);
						options.selector = cal.find('div.colorpicker_color').bind('mousedown', downSelector);
						options.selectorIndic = options.selector.find('div div');
						options.el = this;
						options.hue = cal.find('div.colorpicker_hue div');
						cal.find('div.colorpicker_hue').bind('mousedown', downHue);
						options.newColor = cal.find('div.colorpicker_new_color');
						options.currentColor = cal.find('div.colorpicker_current_color');
						cal.data('colorpicker', options);
						cal.find('div.colorpicker_submit')
							.bind('mouseenter', enterSubmit)
							.bind('mouseleave', leaveSubmit)
							.bind('click', clickSubmit);
						fillRGBFields(options.color, cal.get(0));
						fillHSBFields(options.color, cal.get(0));
						fillHexFields(options.color, cal.get(0));
						setHue(options.color, cal.get(0));
						setSelector(options.color, cal.get(0));
						setCurrentColor(options.color, cal.get(0));
						setNewColor(options.color, cal.get(0));
						if (options.flat) {
							cal.css({
								position: 'relative',
								display: 'block'
							});
						} else {
							$(this).bind(options.eventName, show);
						}
					}
				});
			},
			showPicker: function() {
				return this.each( function() {
					if ($(this).data('colorpickerId')) {
						show.apply(this);
					}
				});
			},
			hidePicker: function() {
				return this.each( function() {
					if ($(this).data('colorpickerId')) {
						$('#' + $(this).data('colorpickerId')).hide();
					}
				});
			},
			setColor: function(col) {
				if (typeof col == 'string') {
					col = HexToHSB(col);
				} else if (typeof(col.r) === "number" &&
						   typeof(col.g) === "number" &&
						   typeof(col.b) === "number") {
					col = RGBToHSB(col);
				} else if (typeof(col.h) === "number" &&
						   typeof(col.s) === "number" &&
						   typeof(col.b) === "number") {
					col = fixHSB(col);
				} else {
					return this;
				}
				return this.each(function() {
					if ($(this).data('colorpickerId')) {
						var cal = $('#' + $(this).data('colorpickerId'));
						cal.data('colorpicker').color = col;
						cal.data('colorpicker').origColor = col;
						fillRGBFields(col, cal.get(0));
						fillHSBFields(col, cal.get(0));
						fillHexFields(col, cal.get(0));
						setHue(col, cal.get(0));
						setSelector(col, cal.get(0));
						setCurrentColor(col, cal.get(0));
						setNewColor(col, cal.get(0));
					}
				});
			}
		};
	}();
	$.fn.extend({
		ColorPicker: ColorPicker.init,
		ColorPickerHide: ColorPicker.hidePicker,
		ColorPickerShow: ColorPicker.showPicker,
		ColorPickerSetColor: ColorPicker.setColor
	});
	/* eslint-enable id-length, no-unused-vars */
})(jQuery);

XKit.extensions.themes_plus = new Object({

	running: false,

	current_theme: "",
	theme_compatibility: "1",

	options: {

		"sep-begin": {

			"text": "Basics",
			"type": "separator"


		},

		"title": {

			"text": "Title",
			"type": "text",
			"default": "My Theme"

		},

		"description": {

			"text": "Description",
			"type": "text",
			"default": ""

		},

		"owner": {

			"text": "Created By",
			"type": "text",
			"default": ""

		},

		"sep-background": {

			"text": "Background",
			"type": "separator"

		},

		"background_color": {

			"text": "Page Background Color",
			"type": "color",
			"of": ["body", ".identity-legacy", ".identity"],
			"attr": ["background-color", "background", "background"],
			"default": ""

		},

		"container_color": {

			"text": "Content Background Color<br/><small>(also changes permalink ear on posts)</small>",
			"type": "color",
			"of": [".l-container.l-container--two-column .right_column, .l-container.l-container--two-column-dashboard .right_column, .l-container.l-container--two-column-dashboard .left_column", ".l-container.l-container--two-column .l-content, .l-container.l-container--two-column-dashboard .l-content", ".search_form_row", ".l-header .selection_nipple", ".post_full .post_permalink:before"],
			"attr": ["background", "background-color", "background", "border-bottom-color", "border-right-color"],
			"default": ""

		},

		"container_transparent": {

			"text": "Half-Transparent Container<br/><small>(to use with Background Images)</small>",
			"type": "checkbox",
			"default": false,
			"on_true": ".l-container.l-container--two-column .right_column, .l-container.l-container--two-column-dashboard .right_column, .l-container.l-container--two-column-dashboard .left_column { background: transparent !important; } .l-content, .search_form_row { background: rgba(0,0,0,0) !important; } .l-header .selection_nipple { border-bottom-color: rgba(0,0,0,0.43) !important; } .right_column:after { display: none; } .l-header-container--refresh { background: rgba(0,0,0,0.7); }"

		},

		"background_image": {

			"text": "Background Image",
			"type": "image",
			"of": ["body"],
			"attr": "background-image",
			"default": ""

		},

		"cover_background": {

			"text": "Background Cover Mode (no repeat)",
			"type": "checkbox",
			"default": false,
			"on_true": "body { background-size:cover !important; background-attachment:fixed !important; background-repeat: no-repeat !important; }",

		},

		"sep-posts": {

			"text": "Posts on Dashboard",
			"type": "separator"

		},

		"post_shadows": {

			"text": "Shadows on Posts",
			"type": "checkbox",
			"default": false,
			"on_true": "#posts .post.post_full { box-shadow: 0px 2px 3px rgba(0,0,0,0.42); }",

		},

		"avatar_shadows": {

			"text": "Shadows on Avatars",
			"type": "checkbox",
			"default": false,
			"on_true": "#posts .post.post_full .post_avatar { box-shadow: 0px 2px 3px rgba(0,0,0,0.42); }",

		},

		"no_avatar_nipple": {

			"text": "No Avatar Pointer",
			"type": "checkbox",
			"default": false,
			"on_true": ".post_avatar:after { display: none !important; }",

		},

		"no_rounded_corners": {

			"text": "No Rounded Corners on Posts",
			"type": "checkbox",
			"default": false,
			"on_true": ".post.post_full { border-radius: 0 !important; }",

		},

		"no_rounded_corners_on_avatars": {

			"text": "No Rounded Corners on Avatars",
			"type": "checkbox",
			"default": false,
			"on_true": ".post_avatar .post_avatar_link { border-radius: 0 !important; }",

		},

		"sep-other": {

			"text": "Others",
			"type": "separator"


		},

		"invert_logo": {

			"text": "Invert Header (Chrome/Safari only)",
			"type": "checkbox",
			"default": false,
			"on_true": " #logo, .tab.iconic { -webkit-filter: invert(100%); } .l-header .tab_notice, #search_form { -webkit-filter: invert(100%); }  .l-header .tab.iconic.selected .selection_nipple { -webkit-filter: invert(100%) !important; } .xoldeheader-item-container .selection_nipple { -webkit-filter: invert(0%) !important; } ",

		},

	},

	run: function() {
		this.running = true;

		if (!XKit.interface.is_tumblr_page()) {
			return;
		}

		var m_shown_warning = XKit.storage.get("themes_plus", "shown_warning", "");

		if (m_shown_warning !== "yasss") {

			XKit.window.show("Welcome to Themes+!", "Please disable Themes and Theme Editor extensions and Stylish themes before using Themes+.<br/><br/>To get started, click on the XKit Control Panel > Themes+ > Open Themes+ Control panel.", "info", "<div id=\"xkit-themes-plus-warning-ok\" class=\"xkit-button default\">OK</div>");

			$("#xkit-themes-plus-warning-ok").click(function() {

				XKit.storage.set("themes_plus", "shown_warning", "yasss");
				XKit.window.close();

			});

		}

		XKit.extensions.themes_plus.load_theme();

	},

	load_theme: function() {

		var m_storage = XKit.storage.get("themes_plus", "current_theme", "");

		if (m_storage !== "") {
			try {
				m_storage = m_storage.substring(11, m_storage.length);
				XKit.extensions.themes_plus.current_theme = JSON.parse(decodeURIComponent(escape(window.atob(m_storage))));

			} catch (e) {
				XKit.extensions.themes_plus.current_theme = XKit.extensions.themes_plus.blank_theme_obj();
			}
		} else {
			XKit.extensions.themes_plus.current_theme = XKit.extensions.themes_plus.blank_theme_obj();
		}

		XKit.extensions.themes_plus.render();

	},

	blank_theme_obj: function() {

		var m_return = {};

		m_return.title = "";
		m_return.description = "";
		m_return.owner = "";
		m_return.id = "";

		return m_return;

	},

	render: function(skip_id) {
		XKit.tools.remove_css("themes_plus_current_theme");

		if (!skip_id) {
			if (XKit.extensions.themes_plus.current_theme.id === "") {
				// Default theme!
				return;
			}
		}

		console.log("[Themes+] Rendering user defined theme.");

		var m_css = "";
		// Default m_css to make tumblr bits not appear
		m_css += ".post_avatar { background: none; } ";
		m_css += ".identity .controls_section.user_list li .follow_list_item_blog::before { display: none; } ";

		for (var obj in XKit.extensions.themes_plus.current_theme) {

			m_css = m_css + " " + XKit.extensions.themes_plus.render_property(obj, XKit.extensions.themes_plus.current_theme[obj]);

		}

		XKit.tools.add_css(m_css, "themes_plus_current_theme");

	},

	should_render_container_background: function() {

		if ($("body").hasClass("help_page") || $("body").hasClass("corp_page")) {
			return false;
		}

		if (document.location.href.indexOf('://www.tumblr.com/following') !== -1) {
			return false;
		}

		if (document.location.href.indexOf('://www.tumblr.com/lookup') !== -1) {
			return false;
		}

		if (document.location.href.indexOf('://www.tumblr.com/spotlight') !== -1) {
			return false;
		}

		if (document.location.href.indexOf('://www.tumblr.com/themes') !== -1) {
			return false;
		}

		if (document.location.href.indexOf('://www.tumblr.com/help') !== -1) {
			return false;
		}

		return true;

	},

	render_property: function(obj_name, obj) {

		var to_return = "";

		var render_container = XKit.extensions.themes_plus.should_render_container_background();

		if (XKit.extensions.themes_plus.options[obj_name] !== undefined) {

			var opt = XKit.extensions.themes_plus.options[obj_name];

			if (opt.type === "checkbox") {
				var to_return_css = opt.on_true;
				if (opt.on_true.indexOf("#content") !== -1) {
					if (render_container !== true) {
						to_return_css = to_return_css.replace("#content", "#__content__");
					}
				}
				if (obj === true) {
					to_return = to_return_css;
				}
			}

			if (opt.type === "color") {

				var color_css = "";

				for (var i = 0; i < opt.of.length; i++) {
					var x_class = opt.attr[i];
					if (opt.of[i] === "#content") {
						if (render_container !== true) {
							continue;
						}
					}
					if (x_class === "background-color") { x_class = "background"; }
					color_css = color_css + " " + opt.of[i] + " { " + x_class + ": " + obj + "; } ";
				}

				to_return = color_css;

			}

			if (opt.type === "image") {

				var image_css = opt.of + " { background-image: url('" + obj + "') !important; background-repeat: repeat; }";
				to_return = image_css;

			}

		} else {
			console.log("[Themes+] --- property " + obj_name + " is unsupported or invalid.");
		}

		return to_return;

	},

	cp: function(refresh_mode) {

		// Close the outer control panel.
		$("#xkit-control-panel-shadow").trigger('click');

		// Remove now unnecessary control panel stuff.
		XKit.tools.remove_css("themes_plus_cp");

		if (!refresh_mode) {
			XKit.tools.init_css("themes_plus");
		}

		var m_sidebar = "";

		var m_theme = XKit.extensions.themes_plus.current_theme;

		if (XKit.extensions.themes_plus.current_theme.id === "") {

			// Default tumblr theme!
			m_theme.title = "Default";
			m_theme.owner = "Tumblr, Inc.";
			m_theme.description = "The Default Look.";

		}

		m_sidebar = m_sidebar + "<div id=\"xkit-themes-plus-current\" style=\"display: none;\">" +
						"<div id=\"xkit-themes-plus-current-title\">" + m_theme.title + "</div>" +
						"<div id=\"xkit-themes-plus-current-description\">" + m_theme.description + "</div>" +
						"<div id=\"xkit-themes-plus-current-owner\">" + m_theme.owner + "</div>" +
					"</div>";

		var first_separator = true;

		for (var obj in XKit.extensions.themes_plus.options) {

			var m_obj = XKit.extensions.themes_plus.options[obj];

			if (m_obj.type === "separator") {

				if (!first_separator) {
					m_sidebar = m_sidebar + "</div>";
				}

				m_sidebar = m_sidebar + "<div class=\"xkit-themes-plus-separator\">" + m_obj.text + "</div><div class=\"xkit-themes-plus-group\">";

				first_separator = false;

			}

			if (m_obj.type === "text") {

				var m_value = m_obj.default;

				if (typeof m_theme[obj] !== "undefined") {
					if (typeof m_theme[obj] !== "undefined" && m_theme[obj] !== "") {
						m_value = m_theme[obj];
					}
				}

				m_value = XKit.extensions.themes_plus.strip_html(m_value);

				var m_html = "<input class=\"xkit-themes-plus-option-panel-text\" type=\"text\" placeholder=\"" + m_obj.default + "\" value=\"" + m_value + "\">";

				m_sidebar = m_sidebar + "<div class=\"xkit-themes-plus-option\" data-type=\"theme-text\" data-option=\"" + obj + "\">" +
								"<div class=\"xkit-themes-plus-option-title\">" + m_obj.text + "</div>" +
								"<div class=\"xkit-themes-plus-option-panel\">" + m_html + "</div>" +
							"</div>";

			}

			if (m_obj.type === "checkbox") {
				var checkbox_value = m_obj.default;

				if (typeof m_theme[obj] !== "undefined") {
					if (typeof m_theme[obj] !== "undefined" && m_theme[obj] !== "") {
						checkbox_value = m_theme[obj];
					}
				}

				if (checkbox_value === "true" || checkbox_value === true) {
					checkbox_value = "selected";
				} else {
					checkbox_value = "";
				}

				var checkbox_html = "<div class=\"xkit-themes-plus-option-checkbox xkit-checkbox " + checkbox_value + "\"><b>&nbsp;</b></div>";

				m_sidebar = m_sidebar + "<div class=\"xkit-themes-plus-option\" data-type=\"checkbox\" data-option=\"" + obj + "\">" +
								"<div class=\"xkit-themes-plus-option-title\" style=\"margin-bottom: 0;\">" + m_obj.text + "</div>" +
								"<div class=\"xkit-themes-plus-option-panel xkit-themes-plus-option-panel-flush-left\">" + checkbox_html + "</div>" +
							"</div>";

			}

			if (m_obj.type === "color") {

				var color_value = m_obj.default;

				if (typeof m_theme[obj] !== "undefined") {
					if (typeof m_theme[obj] !== "undefined" && m_theme[obj] !== "") {
						color_value = m_theme[obj];
					}
				}

				if (color_value === "") {

					color_value = $(m_obj.of[0]).css("background-color");

				}

				var color_html = "<div class=\"xkit-themes-plus-option-color\" style=\"background-color: " + color_value + "\" data-value = \"" + color_value + "\"><b>&nbsp;</b></div>";

				m_sidebar = m_sidebar + "<div class=\"xkit-themes-plus-option\" data-type=\"color\" data-option=\"" + obj + "\">" +
								"<div class=\"xkit-themes-plus-option-title\" style=\"margin-bottom: 0;\">" + m_obj.text + "</div>" +
								"<div class=\"xkit-themes-plus-option-panel xkit-themes-plus-option-panel-flush-left\">" + color_html + "</div>" +
							"</div>";

			}

			if (m_obj.type === "image") {

				var image_value = m_obj.default;

				if (typeof m_theme[obj] !== "undefined") {
					if (typeof m_theme[obj] !== "undefined" && m_theme[obj] !== "") {
						image_value = m_theme[obj];
					}
				}

				if (image_value.substring(0, 7) !== "http://") {
					image_value = "http://" + image_value;
				}

				image_value = XKit.extensions.themes_plus.strip_html(image_value);

				var image_html = "<input class=\"xkit-themes-plus-option-panel-text-url xkit-themes-plus-option-panel-text\" type=\"theme-image\" placeholder=\"" + m_obj.default + "\" value=\"" + image_value + "\">";

				m_sidebar = m_sidebar + "<div class=\"xkit-themes-plus-option\" data-type=\"color\" data-option=\"" + obj + "\">" +
								"<div class=\"xkit-themes-plus-option-title\">" + m_obj.text + "</div>" +
								"<div class=\"xkit-themes-plus-option-panel\">" + image_html + "</div>" +
							"</div>";

			}

		}

		m_sidebar = m_sidebar + "</div>";

		m_sidebar = m_sidebar + "<div class=\"xkit-themes-plus-big-ass-button\" id=\"xkit-themes-plus-delete-theme\">Delete Theme</div>";

		if (!refresh_mode) {
			$("body").animate({ paddingLeft: "250px" }, 600);
		}

		var container_html = "<div id=\"xkit-themes-plus-container\">" +
					"<div id=\"xkit-themes-plus-titlebar\">" +
						"<div id=\"xkit-themes-plus-import-export\" class=\"xkit-themes-plus-titlebar-button\">Import/Export</div>" +
						"<div id=\"xkit-themes-plus-cancel\" class=\"xkit-themes-plus-titlebar-button xkit-themes-plus-titlebar-button-right\">Cancel</div>" +
						"<div id=\"xkit-themes-plus-save\" class=\"xkit-themes-plus-titlebar-button xkit-themes-plus-titlebar-button-right\">Save & Close</div>" +
					"</div>" +
					"<div id=\"xkit-themes-plus-sidebar\" class=\"nano\">" +
						"<div id=\"xkit-themes-plus-sidebar-content\" class=\"content\">" +
							"<div id=\"xkit-themes-plus-sidebar-content-inner\">" +
								m_sidebar +
							"</div>" +
						"</div>" +
					"</div>" +
				"</div>";

		if (!refresh_mode) {
			$("body").append(container_html);
		} else {
			$("#xkit-themes-plus-container").remove();
			$("body").append(container_html);
		}

		$("#xkit-themes-plus-sidebar").nanoScroller();
		$("#xkit-themes-plus-sidebar").nanoScroller({ scroll: 'top' });

		if (!refresh_mode) {
			$("#xkit-themes-plus-container").animate({ left: "0" }, 600);
		} else {
			$("#xkit-themes-plus-container").css("left", "0px");
		}

		$(".xkit-themes-plus-option-panel-text-url").change(function(event) {

			var m_option_id = $(this).parentsUntil(".xkit-themes-plus-option").parent().attr('data-option');
			// var m_of = XKit.extensions.themes_plus.options[m_option_id].of;
			// var m_attr = XKit.extensions.themes_plus.options[m_option_id].attr;

			/*XKit.tools.remove_css("xkit-themes-plus-preview-" + m_option_id);

			var m_css = m_of + " { background-image: url('" + $(this).val() + "') !important; background-repeat: repeat; }";

			XKit.tools.add_css(m_css, "xkit-themes-plus-preview-" + m_option_id);*/

			XKit.extensions.themes_plus.current_theme[m_option_id] = $(this).val();
			XKit.extensions.themes_plus.render(true);

		});

		$(".xkit-themes-plus-option-checkbox").click(function() {

			$(this).toggleClass("selected");

			var m_option_id = $(this).parentsUntil(".xkit-themes-plus-option").parent().attr('data-option');

			/*XKit.tools.remove_css("xkit-themes-plus-preview-" + m_option_id);

			if ($(this).hasClass("selected")) {
				var m_css = XKit.extensions.themes_plus.options[m_option_id].on_true;
				XKit.tools.add_css(m_css, "xkit-themes-plus-preview-" + m_option_id);
			}*/

			XKit.extensions.themes_plus.current_theme[m_option_id] = $(this).hasClass("selected");
			XKit.extensions.themes_plus.render(true);

		});

		$(".xkit-themes-plus-option-color").each(function() {

			var m_option_id = $(this).parentsUntil(".xkit-themes-plus-option").parent().attr('data-option');
			var value = $(this).attr('data-value');

			var m_of = XKit.extensions.themes_plus.options[m_option_id].of;
			// var m_attr = XKit.extensions.themes_plus.options[m_option_id].attr;

			if (!value) {
				value = $(m_of[0]).css("background-color");
			}

			var this_picker = this;

			var m_color = value;

			if (m_color.substring(0, 1) !== "#") { m_color = XKit.extensions.themes_plus.rgb_to_hex(m_color.replace('rgba', 'rgb')); }

			$(this).ColorPicker({
				color: m_color,
				onShow: function(colpkr) {
					$(colpkr).fadeIn(50);
					return false;
				},
				onHide: function(colpkr) {
					$(colpkr).fadeOut(50);
					return false;
				},
				onChange: function(hsb, hex, rgb) {
					$(this_picker).css('backgroundColor', '#' + hex);
					/*XKit.tools.remove_css("xkit-themes-plus-preview-" + m_option_id);
					var m_css = "";
					for (var i=0;i<m_of.length;i++) {
						if (m_attr[i] === "background-color") { m_attr[i] = "background"; }
						m_css = m_css + " " + m_of[i] + " { " + m_attr[i] + ": #" + hex + "; } ";
					}
					XKit.tools.add_css(m_css, "xkit-themes-plus-preview-" + m_option_id);*/
					XKit.extensions.themes_plus.current_theme[m_option_id] = "#" + hex;
					XKit.extensions.themes_plus.render(true);
				}
			});

		});

		$("#xkit-themes-plus-import-export").click(function() {

			XKit.window.show("Import/Export Theme", "<b>What would you like to do?</b><br/>To use a theme made by someone else, click \"Import Theme\". To share your theme, click \"Export Theme\": you will be presented with a code that you can share with other Themes+ users.", "question", "<div id=\"xkit-themes-plus-export-confirm\" class=\"xkit-button default\">Export Theme</div><div id=\"xkit-themes-plus-import-confirm\" class=\"xkit-button\">Import Theme</div><div id=\"xkit-close-message\" class=\"xkit-button\">Cancel</div>");

			$("#xkit-themes-plus-export-confirm").click(function() {

				var m_data = "[XKIT_THEME|" + XKit.extensions.themes_plus.theme_compatibility + "|" + window.btoa(unescape(encodeURIComponent(JSON.stringify(XKit.extensions.themes_plus.create_theme_obj_from_settings())))) + "]";

				var share_code_html = "<div id=\"xkit-themes-plus-share-code\" class=\"nano\">" +
							"<div class=\"content\">" +
								"<div id=\"xkit-themes-plus-share-code-inner\">" +
									m_data +
								"</div>" +
							"</div>" +
						"</div>";

				XKit.window.show("Export Theme", "Share the code below to let others use your theme!" + share_code_html, "info", "<div class=\"xkit-button default\" id=\"xkit-close-message\">OK</div>");

				$("#xkit-themes-plus-share-code").nanoScroller();
				$("#xkit-themes-plus-share-code").nanoScroller({ scroll: 'top' });

				$("#xkit-themes-plus-share-code").click(function() { $(this).selectText();});

			});

			$("#xkit-themes-plus-import-confirm").click(function() {

				var import_html = "<div style=\"\"><input type=\"text\" placeholder=\"Paste the XKit Themes+ theme code you have here.\"  id=\"xkit-themes-plus-input-code-code-code-code\" class=\"xkit-textbox\"></div>";

				XKit.window.show("Import Theme", "<b>Theme Code:</b><br/>Only Themes+ Codes are accepted." + import_html, "info", "<div class=\"xkit-button default\" id=\"xkit-themes-plus-confirm-input-code\">OK</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

				$("#xkit-themes-plus-confirm-input-code").click(function() {

					var data = $.trim($("#xkit-themes-plus-input-code-code-code-code").val());

					if (data === "") { XKit.window.close(); return; }

					if (data.substring(0, 12) !== "[XKIT_THEME|" || data.length <= 15) {
						alert("Invalid or incompatible theme code.");
						return;
					}

					var compatibility_index = data.substring(12, 13);

					if (parseInt(compatibility_index) > XKit.extensions.themes_plus.theme_compatibility) {
						alert("This theme is not supported by this version of Themes+.");
						return;
					}

					data = data.substring(14, data.length - 1);

					var data_obj = null;
					try {
						data_obj = JSON.parse(decodeURIComponent(escape(window.atob(data))));
					} catch (e) {
						alert("Theme file corrupt or not compatible.");
						return;
					}

					var mx_html = "<div id=\"xkit-themes-plus-install-info\">" +
								"<div id=\"xkit-themes-plus-install-info-title\">" + XKit.extensions.themes_plus.strip_html(data_obj.title) + "</div>" +
								"<div id=\"xkit-themes-plus-install-info-description\">" + XKit.extensions.themes_plus.strip_html(data_obj.description) + "</div>" +
								"<div id=\"xkit-themes-plus-install-info-owner\">" + XKit.extensions.themes_plus.strip_html(data_obj.owner) + "</div>" +
							"</div>";

					XKit.window.show("Install Theme?", "Install and replace the current theme with this one?" + mx_html, "question", "<div class=\"xkit-button default\" id=\"xkit-themes-plus-confirm-input-code-install\">Install</div><div class=\"xkit-button\" id=\"xkit-close-message\">Cancel</div>");

					$("#xkit-themes-plus-confirm-input-code-install").click(function() {

						XKit.extensions.themes_plus.current_theme = data_obj;

						XKit.extensions.themes_plus.save_theme();

						XKit.tools.remove_css("themes_plus_current_theme");

						XKit.extensions.themes_plus.cp(true);

						XKit.extensions.themes_plus.render(true);

						XKit.window.close();

					});

				});

			});

		});

		$("#xkit-themes-plus-delete-theme").click(function() {

			XKit.window.show("Delete Theme", "<b>You sure you want to delete this theme?</b><br/>You can not undo this with the Cancel button on the control panel, by the way.", "warning", "<div id=\"xkit-themes-plus-delete-theme-confirm\" class=\"xkit-button default\">Delete theme</div><div id=\"xkit-close-message\" class=\"xkit-button\">Cancel</div>");

			$("#xkit-themes-plus-delete-theme-confirm").click(function() {

				XKit.storage.set("themes_plus", "current_theme", " ");

				XKit.tools.remove_css("themes_plus_current_theme");

				XKit.extensions.themes_plus.current_theme = XKit.extensions.themes_plus.blank_theme_obj();

				XKit.extensions.themes_plus.cp(true);

				XKit.extensions.themes_plus.render();

				XKit.window.close();

			});

		});

		$("#xkit-themes-plus-cancel").click(function() {

			XKit.extensions.themes_plus.load_theme();

			$("body").animate({ paddingLeft: "0px" }, 600);
			$("#xkit-themes-plus-container").animate({ left: "-350px" }, 600, function() {
				$("#xkit-themes-plus-container").remove();
				XKit.tools.remove_css("themes_plus");
			});

		});

		$("#xkit-themes-plus-save").click(function() {

			XKit.extensions.themes_plus.current_theme = XKit.extensions.themes_plus.create_theme_obj_from_settings();

			XKit.extensions.themes_plus.save_theme();

			$("body").animate({ paddingLeft: "0px" }, 600);
			$("#xkit-themes-plus-container").animate({ left: "-350px" }, 600, function() {
				$("#xkit-themes-plus-container").remove();
				XKit.tools.remove_css("themes_plus");
			});

		});

	},

	save_theme: function() {

		var save_str = "XKIT-BTOA!!" + window.btoa(unescape(encodeURIComponent(JSON.stringify(XKit.extensions.themes_plus.current_theme))));
		XKit.storage.set("themes_plus", "current_theme", save_str);

	},

	strip_html: function(txt) {

		return txt.replace(/(<([^>]+)>)/ig, "");

	},

	create_theme_obj_from_settings: function() {

		var m_theme_obj = {};

		$(".xkit-themes-plus-option-checkbox").each(function() {

			var m_option_id = $(this).parentsUntil(".xkit-themes-plus-option").parent().attr('data-option');
			m_theme_obj[m_option_id] = $(this).hasClass("selected");

		});

		$(".xkit-themes-plus-option-color").each(function() {

			var m_option_id = $(this).parentsUntil(".xkit-themes-plus-option").parent().attr('data-option');
			m_theme_obj[m_option_id] = XKit.extensions.themes_plus.rgb_to_hex($(this).css("background-color").replace('rgba', 'rgb'));

		});

		$(".xkit-themes-plus-option-panel-text").each(function() {

			var m_option_id = $(this).parentsUntil(".xkit-themes-plus-option").parent().attr('data-option');

			var m_val = $(this).val();

			if (m_val === "http://") { m_val = ""; }

			m_theme_obj[m_option_id] = m_val;

		});

		m_theme_obj.creator = "theme_plus";
		m_theme_obj.creator_version = XKit.installed.version("themes_plus");
		m_theme_obj.id = XKit.tools.random_string() + new Date().getTime();

		return m_theme_obj;

	},

	rgb_to_hex: function(rgb) {

		// From: http://stackoverflow.com/questions/1740700/how-to-get-hex-color-value-rather-than-rgb-value

		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		function hex(x) {
			return ("0" + parseInt(x).toString(16)).slice(-2);
		}
		return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);

	},

	cpanel: function(div) {

		XKit.tools.add_css("#xkit-themes-plus-cp { padding-top: 71px; text-align: center; color: rgb(140,140,140); }", "themes_plus_cp");

		if (XKit.installed.check("themes") === true) {
			if (XKit.installed.enabled("themes") === true) {
				$(div).html("<div style=\"text-align: center; padding-top:15px;\">Please remove Themes extension first.</div>");
			}
		}

		var m_html = "<div id=\"xkit-themes-plus-cp\">" +
					"Please click the button below to edit and view themes.<br/><div class=\"xkit-button\" id=\"xkit-themes-plus-cp-open\">Open Themes+ Control Panel</div>" +
				"</div>";

		// Hackily append out of scope of preferences because that css is really
		// messed up
		$(div).after(m_html);

		$("#xkit-themes-plus-cp").click(function() {

			XKit.extensions.themes_plus.cp();

		});

	},

	destroy: function() {
		this.running = false;
		XKit.tools.remove_css("themes_plus_cp");
		XKit.tools.remove_css("themes_plus");
		XKit.tools.remove_css("themes_plus_current_theme");
		$("#xkit-themes-plus-container").remove();
		$("body").animate({ paddingLeft: "0px" }, 600);
	}

});
