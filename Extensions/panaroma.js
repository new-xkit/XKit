//* TITLE Panorama **//
//* VERSION 2.0.0 **//
//* DESCRIPTION Widescreen dashboard **//
//* DEVELOPER STUDIOXENIX **//
//* FRAME false **//
//* DETAILS This extension extends your dashboard to fit the screen. It this an experimental extension, and no support for it provided yet. **//
//* BETA false **//
//* SLOW true **//

XKit.extensions.panaroma = new Object({

	running: false,
	slow: true,

	preferences: {
		stretch_images: {
			text: "Stretch images",
			default: false,
			value: false
		}
	},

	run: function() {
		this.running = true;
		XKit.tools.init_css("panaroma");

		if (XKit.page.react) {
			const header_max_width = 1580;
			const container_max_width = 990;

			const increase_by = header_max_width - container_max_width;

			XKit.tools.async_add_function(async () => {
				/* globals tumblr */
				return await tumblr.getCssMap();
			})
			.then(({bluespaceLayout, container, main, audioBlock}) => {
				const containerSelector = container.map(x => `.${bluespaceLayout[0]} > .${x}`).join(',');
				const mainSelector = main.map(x => `.${x}`).join(',');

				const $container = $(containerSelector);
				const $main = $container.children(mainSelector);
				const $inner_main = $main.children('main');

				const main_max_width = parseInt($main.css('max-width'));
				const inner_main_max_width = parseInt($inner_main.css('max-width'));

				const new_main_max_width = main_max_width + increase_by;
				const new_inner_main_max_width = inner_main_max_width + increase_by;

				XKit.tools.add_css(`
					.xkit--react ${containerSelector} {
						max-width: ${header_max_width}px;
					}
					.xkit--react ${mainSelector} {
						max-width: ${new_main_max_width}px;
					}
					.xkit--react main,
					.xkit--react main article,
					.xkit--react main article > *,
					.xkit--react .${audioBlock[0]} {
						max-width: ${new_inner_main_max_width}px;
					}
				`, 'panorama');
			});

			return;
		}

		if (XKit.extensions.panaroma.preferences.stretch_images.value === true) {

			XKit.tools.add_css("#posts .post .image_thumbnail.enlarged { width: 100% !important; height: auto !important; } #posts .post .flipcard, #posts .post .flipcard_front, #posts .post_content .image { width: 100% !important; height: auto !important; }", "panaroma_str");

		}

		//removed "www.tumblr.com/ignore" references, no longer exists
		if (document.location.href.indexOf("://www.tumblr.com/lookup") !== -1 ||
			document.location.href.indexOf("://www.tumblr.com/spotlight") !== -1 ||
			document.location.href.indexOf("://www.tumblr.com/following") !== -1) {
			XKit.extensions.panaroma.do_directory_fixes();
		}

		XKit.post_listener.add("panorama_resize", XKit.extensions.panaroma.resized_auto);
		$(window).on('resize', XKit.extensions.panaroma.resized);
		XKit.extensions.panaroma.resized();
	},

	//added fixes for Spotlight a.k.a. "Staff Picks" page and removed obsolete fixes for Ignore page
	do_directory_fixes: function() {

		var m_css = " .l-content { padding-bottom: 30px!important; border-radius: 20px!important; background: white!important; } .content_top, .content_bottom { display: none!important; } #tabs { background: #eaeaea!important; } #tabs.tabs_3 .tab { width: 33%!important; } #tabs.tabs_3 .tab:last-child { width: 32%!important; } ";

		if (document.location.href.indexOf("://www.tumblr.com/spotlight") !== -1) {
			m_css = m_css + " .chrome_nav { width: 24%!important; min-width: 230px!important; } #cards { width: 75%!important; min-width: 650px!important; } #cards .card{ width:30%!important; min-width:190px!important; }#content { padding-top: 30px!important;  } ";
		}

		XKit.tools.add_css(m_css, "panaroma_directory");

	},

	resized_auto: function() {

		XKit.extensions.panaroma.resized(true);

	},

	resized: function(auto_mode) {

		var m_width = $(".post.is_note .post_wrapper").width() - 70;
		console.log(m_width);
		if (m_width <= 400) { m_width = 500; }
		$(".post.is_note .note_item").css("width", m_width + "px");

	},

	destroy: function() {
		XKit.tools.remove_css("panaroma");
		XKit.tools.remove_css("panaroma_str");
		XKit.tools.remove_css("panaroma_two_column");
		XKit.tools.remove_css("panaroma_directory");
		$(window).off('resize', XKit.extensions.panaroma.resized);
		XKit.post_listener.remove("panorama_resize");
		this.running = false;
	}

});
