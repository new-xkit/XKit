//* TITLE FixMyPosts **//
//* VERSION 999.999.999 **//
//* DESCRIPTION Fixes the reblog format of posts to reflect the blockquote-style **//
//* DEVELOPER THETIMEISNEVERIGHT **//
//* FRAME false **//
//* BETA false **//

XKit.extensions.FixMyPosts = new Object({

    running: false,

    preferences: {
        "sep-0": {
            text: "Please use Reblog Display Options instead of FixMyPosts",
            type: "separator"
        },
    },

    run: function() {
        this.running = true;

        XKit.window.show("Migration from FixMyPosts to Reblog Display Options",
            "<p>FixMyPosts is a third party extension, thus not supported by the "+
            "New XKit Team. To be able to give you an optimal experience using "+
			"this New XKit, you are being advised to switch to Reblog Display Options, "+
			"New XKit's official extension to modify the reblog style (And bring back the "+
			"old blockquotes).<br><br>FixMyPosts will uninstall itself automatically.</p>"+
            "<br>Would you like to install Reblog Display Options?"+
			"",
            "info",
            '<div id="xkit-install-br" class="xkit-button default">Install Reblog Display Options</div>'+
            '<div id="xkit-close-message" class="xkit-button">Don\'t install</div>');
        $("#xkit-install-br").click(function(){
            XKit.install("better_reblogs", function(mdata) {
                if (mdata.errors) {
                    if (mdata.storage_error === true) {
                        show_error_installation("[Code: 631] Can't store data on browser");
                        return;
                    }
                    if (mdata.server_down === true) {
                        show_error_installation("[Code: 101] Can't reach XKit servers");
                    } else {
                        if (mdata.file === "not_found") {
                            show_error_installation("Can't download Reblog Display Options: Not found");
                        } else {
                            show_error_installation("Can't download Reblog Display Options");
                        }
                    }
                    return;
                }
				XKit.storage.set("better_reblogs", "extension__setting__type", "nested");
                XKit.installed.remove("FixMyPosts");
                Location.reload();
            });
        });
        $("#xkit-close-message").click(function(){
            XKit.installed.remove("FixMyPosts");
            Location.reload();
        });
    },

    destroy: function() {
        this.running = false;
    }

});
