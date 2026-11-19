//* TITLE PostBlock **//
//* VERSION 1.0.3 **//
//* DESCRIPTION Block the posts you don't like **//
//* DETAILS This extension lets you blocks posts you don't like on your dashboard. When you block a post, it will be hidden completely, including reblogs of it.<br><br>Tip: hold down ALT to skip the blocking confirmation! **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* SLOW true **//
//* BETA false **//

XKit.extensions.postblock = new Object({

	running: false,
	slow: true,
	blacklisted: [],
	button_icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAQAAADYWf5HAAAApUlEQVQoz2NgQAHVR6t3MOADtZbVFkBl/6v/41VW87X6E0xZzerqBTiUQRTAyX/EKftPtLKahuoCvMrwAHTTIBAuXeVe09LAB5Gq0sFUVj0fEhAfgdwFaFKobJDC6rMg71db4FEGUlhTCmLUnMGlDAoaRKq/IYTRlSEpr5lGlLIKlZrfRCgDmjeBKGVlvNV3iVAGTG26Nc+JUAb0sUTNamCaw6EMAJiVMfrH3EFYAAAAAElFTkSuQmCC',

	processing: false,

	run: function() {
		this.running = true;
		XKit.tools.init_css("postblock");

		this.blacklisted = XKit.storage.get("postblock", "posts", "").split(",");

		XKit.interface.react.create_control_button("xpostblockbutton", this.button_icon, "PostBlock", XKit.extensions.postblock.block).then(() => {
			XKit.post_listener.add("postblock", XKit.extensions.postblock.process_posts);
			XKit.extensions.postblock.process_posts();
		});
	},

	save: function() {
		XKit.storage.set("postblock", "posts", this.blacklisted.join(","));
	},

	remove: function(rootID) {
		const hide = (id) => XKit.interface.hide(`[data-id='${id}']`, "postblock");

		hide(rootID);

		XKit.interface.react.get_posts().then($posts => {
			$posts.each(async function() {
				var post_obj = await XKit.interface.react.post($(this));
				if (post_obj.root_id == rootID) {
					hide(post_obj.id);
				}
			});
		});
	},

	block: async function(event) {
		const self = XKit.extensions.postblock;

		const $button = $(this);
		const altKey = event.altKey;
		const $post = $button.parents("[data-id]");
		const post = await XKit.interface.react.post($post);
		const postID = post.root_id;

		const blockPost = () => {
			self.remove(postID);
			self.blacklisted.push(postID);
			self.save();
		};

		if (altKey) {
			blockPost();
		} else {
			XKit.window.show(
				"Block this post?",
				"This post (including reblogs) will be blocked from your dashboard forever, " +
				"without any indication that it was blocked.",

				"question",

				'<div class="xkit-button default" id="xkit-post-block-ok">Block Post</div>' +
				'<div class="xkit-button" id="xkit-close-message">Cancel</div>'
			);

			$("#xkit-post-block-ok").click(() => {
				XKit.window.close();
				blockPost();
			});
		}
	},

	process_posts: async function() {
		if (XKit.extensions.postblock.processing === true) {
			return;
		}
		XKit.extensions.postblock.processing = true;

		let blacklist = XKit.extensions.postblock.blacklisted;

		const $posts = await XKit.interface.react.get_posts("xpostblock-done");
		$posts
			.addClass("xpostblock-done")
			.each(async function() {
				const $post = $(this);
				const post = await XKit.interface.react.post($post);

				if (blacklist.includes(post.root_id)) {
					XKit.extensions.postblock.remove(post.root_id);
				} else {
					await XKit.interface.react.add_control_button($post, "xpostblockbutton");
				}
			});
		XKit.extensions.postblock.processing = false;
	},

	cpanel: function(m_div) {

		$(m_div).html("<div class=\"postblock-cp\">You have <b id=\"xkit-postblock-cp-count\">" + (XKit.extensions.postblock.blacklisted.length - 1) + "</b> blocked posts.<div style=\"padding-top: 5px; padding-bottom: 5px;\">" +
					"<div class=\"xkit-button\" id=\"postblock-undo-last\">Unblock last blocked post</div></div><small>You need to refresh the page in order for previously blocked posts to appear again.</small></div>");

		if ((XKit.extensions.postblock.blacklisted.length - 1) === 0) {
			$("#postblock-undo-last").addClass("disabled");
		}

		$("#postblock-undo-last").click(function() {

			if ($(this).hasClass("disabled")) { return; }

			XKit.extensions.postblock.blacklisted.pop();
			XKit.storage.set("postblock", "posts", XKit.extensions.postblock.blacklisted.join(","));

			$("#xkit-postblock-cp-count").html((XKit.extensions.postblock.blacklisted.length - 1));

			if ((XKit.extensions.postblock.blacklisted.length - 1) === 0) {
				$("#postblock-undo-last").addClass("disabled");
			}

		});

		XKit.extensions.postblock.migrationCpanel(m_div);
	},

	migrationCpanel: function(m_div) {

		$('.xkit-postblock-cp-migration').remove();
		$(m_div).prepend(`
			<div class="xkit-postblock-cp-migration">
				<p>
					The <a href="https://github.com/AprilSylph/XKit-Rewritten#readme" target="_blank">XKit Rewritten</a> extension includes a version of this script.
					To migrate easily, <a href="https://github.com/AprilSylph/XKit-Rewritten#installation" target="_blank">install XKit Rewritten</a> and enable its PostBlock feature in your browser toolbar, then refresh this page and press this button to copy your blocked posts:
				</p>
				<button class="xkit-button" id="xkit-postblock-cp-export">Copy blocked posts to XKit Rewritten</button>
			</div>
		`);

		const toCopy = XKit.extensions.postblock.blacklisted.filter(Boolean);

		$('#xkit-postblock-cp-export').on('click', async function() {
			if (!toCopy.length) {
				XKit.window.show(
					'Nothing to Copy',
					"You don't have any blocked posts to copy!",
					'error',
					'<div id="xkit-close-message" class="xkit-button default">OK</div>',
				);
				return;
			}

			this.setAttribute('disabled', '');
			this.classList.add('disabled');

			let succeeded = false;

			window.addEventListener('xkit-postblock-migration-success', () => { succeeded = true; }, { once: true });
			window.dispatchEvent(new CustomEvent('xkit-postblock-migration', { detail: JSON.stringify(toCopy) }));

			setTimeout(() => {
				this.removeAttribute('disabled');
				this.classList.remove('disabled');

				if (succeeded) {
					XKit.extensions.xkit_preferences.close();
				} else {
					XKit.window.show(
						'Failure',
						'Make sure you have installed XKit Rewritten [VERSION NUMBER GOES HERE] or later, have refreshed the page, and have enabled PostBlock.',
						'error',
						'<div id="xkit-close-message" class="xkit-button default">OK</div>',
					);
				}
			}, 500);
		});
	},

	destroy: function() {
		this.running = false;
		XKit.post_listener.remove("postblock");
		XKit.tools.remove_css("postblock");
		$(".xpostblock-done").removeClass("xpostblock-done");
		$(".xpostblockbutton").remove();
	}

});
