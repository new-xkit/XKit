//* TITLE       Retags **//
//* DEVELOPER   alexhong **//
//* VERSION     0.6.9 **//
//* DESCRIPTION Adds tags to reblog notes **//
//* FRAME       false **//
//* SLOW        false **//
//* BETA        false **//

XKit.extensions.retags = {
	api_key: XKit.api_key,
	selectors: '.reblog,.is_reblog,.notification_reblog',
	blog_name: "",
	observer: new MutationObserver(function(ms){
		ms.forEach(function(m){
			retags.tag($(m.addedNodes).filter(retags.selectors));
		});
	}),
	run: function(){
		retags.css.appendTo('head');
		try {
			retags.blog_name = $('body').data('new-root').split('/').pop();
		} catch(e) {

		}
		retags.add_toggle();
		retags.observer.observe($('body')[0],{childList:true,subtree:true});
		retags.tag(retags.selectors);
		/*$('body').on('mouseover.retags','.post_tags_inner',function(){
			$(this).attr('class','DISABLED_post_tags_inner');
		});*/
	},
	destroy: function(){
		retags.css.detach();
		retags.css_toggle.detach();
		retags.html_toggle.detach();
		retags.observer.disconnect();
		$('.retags').remove();
		$('body').off('.retags');
		// $('.DISABLED_post_tags_inner').attr('class','post_tags_inner');
	},
	add_toggle: function(){
		var toggle = 'retags_toggle_'+retags.blog_name;
		retags.html_toggle.appendTo('.ui_notes_switcher .part-toggle');
		$('#retags-toggle').change(function(){
			if ($(this).prop('checked')) {
				localStorage.setItem(toggle,'true');
				retags.css_toggle.appendTo('head');
			} else {
				localStorage.setItem(toggle,'false');
				retags.css_toggle.detach();
			}
		});
		if (localStorage.getItem(toggle) === 'true') {
			$('#retags-toggle').click();
		}
	},
	tag: function(el){
		$(el).each(function(){
			var $t = $(this), cls, $c, url;
			if ($t.find('div.retags').length) {
				return false;
			}
			// popover
			if ($t.hasClass('note')) {
				cls = 'with_commentary';
				$c = $t;
				url = $c.find('.action').data('post-url');
			// Activity
			} else if ($t.hasClass('ui_note')) {
				if ($t.find('.part_response').length) {
					$t.addClass('is_response');
				}
				cls = 'is_retags';
				$c = $t.find('.stage');
				url = $c.find('.part_glass').attr('href');
			// dashboard
			} else if ($t.hasClass('notification')) {
				$c = $t.find('.notification_sentence');
				url = $c.find('.notification_target').attr('href');
			}
			if (url) {
				url = url.split('/');
				var host = url[2], id = url[4], cache = 'retags_'+id;
				if (localStorage.getItem(cache) !== null) {
					retags.append($t,cls,$c,JSON.parse(localStorage.getItem(cache)));
				} else {
					retags.request($t,cls,$c,cache,'https://api.tumblr.com/v2/blog/'+host+'/posts/info?id='+id+'&api_key='+retags.api_key);
				}
			}
		});
	},
	request:
		(typeof GM_xmlhttpRequest !== 'undefined')
		// if userscript or XKit
		? function($t,cls,$c,cache,url) {
			GM_xmlhttpRequest({
				method: 'GET',
				url: url,
				onload: function(data){
					var tags = JSON.parse(data.responseText).response.posts[0].tags;
					localStorage.setItem(cache,JSON.stringify(tags));
					retags.append($t,cls,$c,tags);
				},
				onerror: function(data){
					retags.append($t,cls,$c,'ERROR: '+data.status);
				}
			});
		}
		// if Chrome extension
		: function($t,cls,$c,cache,url) {
			$.getJSON(url,function(data){
				var tags = data.response.posts[0].tags;
				localStorage.setItem(cache,JSON.stringify(tags));
				retags.append($t,cls,$c,tags);
			}).fail(function(jqXHR,status,error){
				retags.append($t,cls,$c,status.toUpperCase()+': '+(error||jqXHR.status));
			});
		}
	,
	append: function($t,cls,$c,tags){
		if (tags.length) {
			var $retags = $('<div class="retags">');
			if (typeof tags === 'string') {
				$retags.append(tags).addClass('error');
			} else {
				tags.forEach(function(tag){
					$retags.append('<a href="//tumblr.com/tagged/'+tag.replace(/ /g,'-')+'">#'+tag+'</a>');
				});
			}
			$t.addClass(cls);
			$c.append($retags);
		}
	},
	css:
	$('<style class="retags">\
		.ui_notes .date_header .part_full_date.stuck { width: 165px; margin-left:400px; }\
		label.retags { top: -1px; margin-left: 15px; }\
		label.retags .binary_switch_label { position: absolute; top: 0; left: 24px; padding: 0 8px; line-height: 14px; white-space: nowrap; }\
		div.retags { white-space: normal; margin-top: 10px; }\
		div.retags.error { color: #c00000; }\
		div.retags + div.retags:before { color: #c00000; content: "Warning: You are running multiple copies of Retags."; }\
		div.retags + div.retags a { display: none; }\
		div.retags a { color: #a7a7a7 !important; position: relative; margin-right: 11px; text-decoration: none; }\
		div.retags a:hover { color: #969696 !important; }\
		.note div.retags { font-size: 12px; line-height: 1.3; }\
		.note div.retags a { margin-right: 9px; }\
		.post_notes .notes_outer_container.popover .note.with_commentary span.action { min-height: 0; }\
		.notification div.retags a { color: rgba(255,255,255,0.3) !important; }\
		.notification div.retags a:hover { color: rgba(255,255,255,0.4) !important; }\
		.ui_note div.retags { margin-top: 0; padding: 40px 50px 13px; }\
		.ui_note div.retags + div.retags { margin-top: -5px; padding-top: 0; }\
		.ui_note .part_response + div.retags { margin-top: -7px; padding-top: 0; }\
		div.retags a:after { content: "\\00a0  "; font-size: 0; line-height: 0; }\
	</style>')
	,
	css_toggle:
	$('<style class="retags">\
		.ui_note { display: none; }\
		.ui_note.is_retags, .ui_note.is_response, .ui_note.is_user_mention { display: block; }\
	</style>')
	,
	html_toggle:
	$('<label class="retags binary_switch">\
		<input id="retags-toggle" type="checkbox">\
		<span class="binary_switch_track"></span>\
		<span class="binary_switch_button"></span>\
		<span class="binary_switch_label">Show only retags / responses</span>\
	</label>')
};

XKit.extensions.retags = {
 	running: false,
	run: function(){
		this.running = true;
		retags.run();
	},
	destroy: function(){
		this.running = false;
		retags.destroy();
	}
};
