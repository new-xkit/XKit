//* TITLE Easy Video Links **//
//* VERSION 1.0.2 **//
//* DESCRIPTION	One click video links on posts to copy video address **//
//* DEVELOPER trey-k **//
//* FRAME false **//
//* BETA false **//
//* SLOW true **//
//* DETAILS Press the new chainlink icon on video posts to easily copy and share video URLs on the web **// 

XKit.extensions.easy_video_links = new Object({

	slow: true,
	running: false,

	button_icon: "data:image/svg+xml,%3Csvg%20width%3D%2223.999999999999996%22%20height%3D%2223.999999999999996%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%0A%0A%20%3Cg%3E%0A%20%20%3Ctitle%3Ebackground%3C/title%3E%0A%20%20%3Crect%20fill%3D%22none%22%20id%3D%22canvas_background%22%20height%3D%2226%22%20width%3D%2226%22%20y%3D%22-1%22%20x%3D%22-1%22/%3E%0A%20%3C/g%3E%0A%20%3Cg%3E%0A%20%20%3Ctitle%3ELayer%201%3C/title%3E%0A%20%20%3Cg%20stroke%3D%22null%22%20id%3D%22svg_1%22%3E%0A%20%20%20%3Cg%20stroke%3D%22null%22%20id%3D%22svg_2%22%3E%0A%20%20%20%20%3Cpath%20stroke%3D%22null%22%20id%3D%22svg_3%22%20fill%3D%22%23585858%22%20d%3D%22m21.447861%2C3.467066c-0.749041%2C-0.75727%20-1.664424%2C-1.135864%20-2.746274%2C-1.135864c-1.081725%2C0%20-2.00563%2C0.3745%20-2.771255%2C1.123499l-3.520254%2C3.545193c-0.582532%2C0.565906%20-0.940405%2C1.252453%20-1.073537%2C2.059727s-0.041606%2C1.560408%200.274619%2C2.259446l-1.223337%2C1.223337c-0.715706%2C-0.316225%20-1.473018%2C-0.403616%20-2.271936%2C-0.262129s-1.489643%2C0.495183%20-2.072175%2C1.061047l-3.520254%2C3.545193c-0.748957%2C0.748999%20-1.123457%2C1.664424%20-1.123457%2C2.746191c0%2C1.08185%200.3745%2C2.001453%201.123499%2C2.758765s1.664424%2C1.135947%202.746274%2C1.135947s2.00563%2C-0.382812%202.771255%2C-1.148437l3.520254%2C-3.520254c0.582532%2C-0.582532%200.940364%2C-1.273257%201.073537%2C-2.072175s0.041606%2C-1.55623%20-0.274619%2C-2.271936l1.223337%2C-1.198399c0.715706%2C0.316225%201.473018%2C0.403616%202.271936%2C0.262129s1.489643%2C-0.503496%202.072175%2C-1.086028l3.520254%2C-3.520254c0.749166%2C-0.748999%201.12354%2C-1.664424%201.12354%2C-2.746274s-0.374541%2C-2.001411%20-1.123582%2C-2.758723zm-11.159919%2C14.118403l-3.520254%2C3.545193c-0.416106%2C0.416106%20-0.911247%2C0.624013%20-1.485508%2C0.624013c-0.57426%2C0%20-1.069402%2C-0.20799%20-1.485508%2C-0.624013c-0.416106%2C-0.416106%20-0.624138%2C-0.911247%20-0.624138%2C-1.485591s0.208032%2C-1.069402%200.624138%2C-1.485508l3.520254%2C-3.545193c0.416148%2C-0.415939%200.915467%2C-0.624013%201.49804%2C-0.624013c0.016626%2C0%200.058274%2C0.008188%200.124819%2C0.024981l-1.647756%2C1.622817c-0.266306%2C0.266306%20-0.399438%2C0.595022%20-0.399438%2C0.986147s0.133174%2C0.724019%200.399438%2C0.998638c0.266264%2C0.274494%200.595022%2C0.411803%200.986147%2C0.411803c0.391125%2C0%200.719841%2C-0.141487%200.986147%2C-0.424419l1.647756%2C-1.622817c0.033335%2C0.61595%20-0.174739%2C1.148563%20-0.624138%2C1.597962zm9.886704%2C-9.886495l-3.520296%2C3.545193c-0.449399%2C0.449399%20-0.990325%2C0.649119%20-1.622817%2C0.599199l1.647756%2C-1.622817c0.266306%2C-0.282932%200.39948%2C-0.620044%200.39948%2C-1.011128c0%2C-0.391125%20-0.133174%2C-0.719841%20-0.39948%2C-0.986147c-0.266223%2C-0.266306%20-0.595022%2C-0.399438%20-0.986147%2C-0.399438s-0.719716%2C0.133174%20-0.986022%2C0.399438l-1.64784%2C1.647756c-0.033377%2C-0.615825%200.17478%2C-1.148437%200.624054%2C-1.597837l3.520296%2C-3.545193c0.416022%2C-0.416148%200.911206%2C-0.62418%201.485424%2C-0.62418c0.574302%2C0%201.069569%2C0.208032%201.485591%2C0.624138c0.416106%2C0.416106%200.624054%2C0.911247%200.624054%2C1.485508s-0.207949%2C1.069402%20-0.624054%2C1.485508z%22/%3E%0A%20%20%20%3C/g%3E%0A%20%20%3C/g%3E%0A%20%20%3Cg%20id%3D%22svg_4%22/%3E%0A%20%20%3Cg%20id%3D%22svg_5%22/%3E%0A%20%20%3Cg%20id%3D%22svg_6%22/%3E%0A%20%20%3Cg%20id%3D%22svg_7%22/%3E%0A%20%20%3Cg%20id%3D%22svg_8%22/%3E%0A%20%20%3Cg%20id%3D%22svg_9%22/%3E%0A%20%20%3Cg%20id%3D%22svg_10%22/%3E%0A%20%20%3Cg%20id%3D%22svg_11%22/%3E%0A%20%20%3Cg%20id%3D%22svg_12%22/%3E%0A%20%20%3Cg%20id%3D%22svg_13%22/%3E%0A%20%20%3Cg%20id%3D%22svg_14%22/%3E%0A%20%20%3Cg%20id%3D%22svg_15%22/%3E%0A%20%20%3Cg%20id%3D%22svg_16%22/%3E%0A%20%20%3Cg%20id%3D%22svg_17%22/%3E%0A%20%20%3Cg%20id%3D%22svg_18%22/%3E%0A%20%3C/g%3E%0A%3C/svg%3E",

	run: function() {		
		this.running = true;
		XKit.tools.init_css("easy_video_links");
		XKit.interface.create_control_button("xkit-easy-video-links-button", this.button_icon, "Copy Video Address", XKit.extensions.easy_video_links.copyLink);
		XKit.post_listener.add("easy_video_links", XKit.extensions.easy_video_links.addLinkToPosts);
		XKit.extensions.easy_video_links.addLinkToPosts();		
	},

	copyLink: function() {
		var video_source = $(this).attr('data-xkit-easy-video-links-url');
		if (video_source.indexOf(".media.tumblr") == -1) {
			video_source = video_source.substring(video_source.indexOf("tumblr_"));
			if (video_source.indexOf("/") !== -1) {
				video_source = video_source.substring(0, video_source.indexOf("/"));
			}
			video_source = "https://ve.media.tumblr.com/" + video_source + ".mp4";
		}
		navigator.clipboard.writeText(video_source).then(function() {
			XKit.notifications.add("Video link copied to clipboard","ok");
		}, function() {
			XKit.notifications.add("Failed to copy link to clipboard","error");
		});
	},

	addLinkToPosts: function() {
		var posts = XKit.interface.get_posts("xkit-easy-video-links-done");
		$(posts).each(function() {
			$(this).addClass("xkit-easy-video-links-done");
			if ($(this).hasClass("is_direct_video")) {
				XKit.interface.add_control_button(this, "xkit-easy-video-links-button", "data-xkit-easy-video-links-url=\"" + $(this).find("source").attr("src") + "\"");
			}
		});

	},

	destroy: function() {		
		this.running = false;
		XKit.post_listener.remove("easy_video_links");
		$(".xkit-easy-video-links-button").remove();		
	}

});
