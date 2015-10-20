//* TITLE Reblog Display Options **//
//* VERSION 1.0.0 **//
//* DESCRIPTION Adds different styles to the new reblog layout, including the "classic" nested look. **//
//* DEVELOPER new-xkit **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.better_reblogs = new Object({

    running: false,

    preferences: {
        'sep0': {
            text: 'Reblog Style',
            type: 'separator'
        },
        "type": {
            text: "Which reblog style to use?",
            type: "combo",
            values: ["flat", "flat",
                     "nested", "nested"],
            value: "flat",
            default: "flat",
        },
        'sep1': {
            text: 'Style Options',
            type: 'separator'
        },
        "remove_icon": {
            text: 'Remove the green "reblogged" icon from avatars',
            default: true,
            value: true,
            style: "flat"
        },
        "margin": {
            text: "Move reblog content to the right (under the username, not avatar)",
            default: true,
            value: true,
            style: "flat",
        },
        "add_border": {
            text: "Add border to the left",
            default: false,
            value: false,
            style: "flat",
        },
        "remove_last_user": {
            text: "Remove the username/avatar from the last post if its new (not reblogged)",
            default: true,
            value: true,
            style: "flat"
        },
        "reorder_reblog_title": {
            text: "Put post titles above posts",
            default: false,
            value: false,
            style: "flat",
        },
        "remove_user_names": {
            text: "Hide usernames and put posts next to avatars. (mouse over avatars for blog info)",
            default: false,
            value: false,
            style: "flat",
        },
        "slim_new_reblog": {
            text: "Slim the new reblog spacing",
            default: false,
            value: false,
            style: "flat",
        },
        "remove_avatars": {
            text: "Remove avatars",
            default: false,
            value: false,
            style: "flat",
        }
    },

    run: function() {
        this.running = true;

        if (this.preferences.type.value === "nested"){
            this.run_nested();
        } else {
            this.run_flat();
        }

    },

    frame_run: function() {
        if (XKit.page.peepr) {
            XKit.extensions.better_reblogs.run();
        }
    },

    run_flat: function() {

        var list_sel = "";
        if (this.preferences.remove_last_user.value){
            XKit.tools.add_css(".reblog-list-item.contributed-content .reblog-header {display: none;}", "better_reblogs");
            list_sel = ".reblog-list ";
        }

        if (this.preferences.margin.value) {
            XKit.tools.add_css(list_sel+".reblog-list-item .reblog-content {margin-left:35px;}" +
                               list_sel+".reblog-list-item .reblog-title {margin-left:35px;}", "better_reblogs");
        }

        if (this.preferences.remove_icon.value) {
            XKit.tools.add_css(".reblog-header .sub-icon-reblog:before {display: none!important;}" +
                               ".reblog-header .sub-icon-reblog:after {display:none!important;}", "better_reblogs");

        }

        if (this.preferences.add_border.value) {
            XKit.tools.add_css(list_sel+".reblog-list-item .reblog-content {border-left: 2px solid #E7E7E7; padding-left: 10px;}" +
                               ".post.post_full "+list_sel+".reblog-list-item .tmblr-full > img {padding: 0 20px}", "better_reblogs");

            if (!(this.preferences.margin.value || this.preferences.remove_user_names.value)) {
                XKit.tools.add_css(".reblog-list-item .reblog-content {margin-left: 3px;}", "better_reblogs");
            }
        }

        if (this.preferences.remove_user_names.value) {
            XKit.tools.add_css(".reblog-tumblelog-name {display:none;} .reblog-list-item .reblog-header {margin-bottom: 0;} "+
                               list_sel+".reblog-content {margin-left:35px;} .reblog-title {margin-left:35px; margin-top:-10px;}", "better_reblogs");
        }

        if (this.preferences.remove_avatars.value) {
            XKit.tools.add_css(".reblog-avatar {display:none !important;} .reblog-header {padding-left: 0px !important;}",
                "better_reblogs");
        }

        if (this.preferences.slim_new_reblog.value) {
            XKit.tools.add_css(".reblog-list-item {padding: 10px 20px 5px !important; min-height: 41px;}",
                "better_reblogs");
        }

        if (this.preferences.reorder_reblog_title.value) {
            XKit.tools.add_css(".reblog-list-item .reblog-title {margin-left:0!important;}", "better_reblogs");
        }

        XKit.extensions.better_reblogs.do_flat();
        XKit.post_listener.add("better_reblogs", XKit.extensions.better_reblogs.do_flat);

    },

    run_nested: function() {
        var match_only_main_dash =  !XKit.page.peepr ? "ol" : "";
        XKit.tools.add_css(match_only_main_dash+'.posts .reblog-list {display: none!important} '+
                           match_only_main_dash+'.posts .reblog-list-item.contributed-content {display: none!important;} '+
                           match_only_main_dash+'.posts .post_full.post .post_content_inner .post_media ~ .old_reblogs {margin-top: 13px;}',
                        'better_reblogs');
        XKit.extensions.better_reblogs.do_nested();
        XKit.post_listener.add("better_reblogs", XKit.extensions.better_reblogs.do_nested);
    },

    do_flat: function() {
        var posts = XKit.interface.get_posts("better-reblogs-done");

        $(posts).each(function() {
            var $this = $(this);
            $this.addClass("xkit-better-reblogs-done");

            // trick tumblr into displaying the little blog info popovers for the reblog avatars
            $this.find(".reblog-avatar").addClass("post_sub_avatar");

            if (XKit.extensions.better_reblogs.preferences.reorder_reblog_title.value){
                var title = $this.find(".reblog-title");
                if (!title.length) {
                    return;
                }
                var parent = title.parent();
                if (!parent.find(".reblog-content").length) {
                    return;
                }
                title.remove();
                parent.prepend(title);
            }
        });
    },

    do_nested: function() {
        var posts = XKit.interface.get_posts("xkit-better-reblogs-done");

        $(posts).each(function() {
            var $this = $(this);
            $this.addClass("xkit-better-reblogs-done");

            var reblog_tree = $this.find(".reblog-list");
            var title = reblog_tree.find('.reblog-title');

            if (!reblog_tree.length){
                return;
            }

            var cc = $this.find('.contributed-content');
            if (cc.length) {
                cc.after('<div class="old_reblogs post_body"></div>');
                cc.after(title);
            } else {
                reblog_tree.after('<div class="old_reblogs post_body"></div>');
                reblog_tree.after(title);
            }
            title.removeClass("reblog-title");
            title.addClass("post_title");

            var all_quotes = [];
            reblog_tree.find(".reblog-list-item").each(function() {
                var $this = $(this);
                var content = $this.find('.reblog-content');
                var author = $this.find('.reblog-tumblelog-name');
                var reblog_data = {
                    reblog_content: content.html() || '',
                    reblog_author: author.contents()[0].data || '',
                    reblog_url: author.attr('href') || ''
                };
                all_quotes.push(reblog_data);
            });

            var all_quotes_text = "";
            all_quotes.forEach(function(data, index, all) {
                var reblog_content = data.reblog_content;
                //don't wrap if the previous user didn't add a comment
                if (reblog_content.indexOf("</blockquote>", reblog_content.length - 13) !== -1 || reblog_content.length === 0) {
                    all_quotes_text = reblog_content;
                } else {
                    all_quotes_text = "<p><a class='tumblr_blog' href='" + data.reblog_url + "'>" + data.reblog_author + "</a>:</p><blockquote>" + all_quotes_text + reblog_content + "</blockquote>";
                }
            });

            $this.find(".old_reblogs").append(all_quotes_text);
            var post_c = $this.find(".reblog-list-item.contributed-content .reblog-content").html();
            $this.find(".old_reblogs").append(post_c);
        });
    },

    cpanel: function(cp) {
        var update = function(type) {
            for (var i in XKit.extensions.better_reblogs.preferences){
                var j = XKit.extensions.better_reblogs.preferences[i];
                if(j.style){
                    if (j.style === type){
                        cp.find('[data-setting-id="'+i+'"]').show();
                    } else {
                        cp.find('[data-setting-id="'+i+'"]').hide();
                    }
                }
            }
        };
        cp.find("select[data-setting-id=type]").change(function(){
            update($(this).val());
        });
        update(cp.find("select[data-setting-id=type]").val());
    },

    destroy: function() {
        this.running = false;
        XKit.tools.remove_css("better_reblogs");
        XKit.post_listener.remove("better_reblogs");
        $(".xkit-better-reblogs-done").removeClass("xkit-better-reblogs-done");
    }

});
