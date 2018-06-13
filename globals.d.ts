interface XKit {
  version: number;

  page: {
    standard: boolean;
    ask_frame: boolean;
    blog_frame: boolean;
    peepr: boolean;
    xkit: boolean;
  };

  init: () => void;
  init_extension: () => void;
  init_normal: () => void;
  init_frame: () => void;
  init_flags: () => void;

  flags: {
    do_not_limit_extension_storage: boolean;
    disable_notifications: boolean;
    do_not_load_xkit_patches: boolean;
    do_not_show_news: boolean;
    allow_removal_of_internal_extensions: boolean;
  };

  read_flag: (flag_id: string) => boolean;
  set_flag: (flag_id: string, value: boolean | "true" | "false" | "") => void;

  extensions: any;

  download: {
    extension: (extension_id: string, callback: Function) => void;
    page: (page: string, callback: Function) => void;

    // private
    github_fetch: (path: string, callback: Function) => void;
    try_count?: number;
    max_try_count?: number;
  };

  install: (extension_id: string, callback: Function) => void;

  installed: {
    list: () => any;
    check: (extension_id: string) => boolean;
    version: (extension_id: string) => string;
    title: (extension_id: string) => string;
    icon: (extension_id: string) => string;
    css: (extension_id: string) => string;
    description: (extension_id: string) => string;
    developer: (extension_id: string) => string;

    // private
    add: (extension_id: string) => void;
    remove: (extension_id: string) => void;
    get: (extension_id: string) => any;
    update: (extension_id: string, new_object: any) => void;
    enable: (extension_id: string) => void;
    disable: (extension_id: string) => void;
    enabled: (extension_id: string) => boolean;
    script: (extension_id: string) => string;

    // unlisted
    when_running?: (
      extension_id: string,
      onRunning: Function,
      onFailure?: Function
    ) => void;
    is_running?: (extension_id: string) => boolean;
  };

  progress: {
    add: (id: string) => string;
    value: (id: string, value: string | number) => void;
  };

  storage: {
    set: (extension_id: string, key: string, default_value: any) => boolean;
    get: (extension_id: string, key: string, default_value?: any) => any;
    get_all: (extension_id: string) => any;
    remove: (extension_id: string, key: any) => boolean;
    size: (extension_id: string) => number;
    quota: (extension_id: string) => number;
    clear: (extension_id: string) => void;

    max_area_size: number;
    unlimited_storage: boolean;
    show_error: (extension_id: string, size: number) => void;
  };

  browser: () => {
    name: string;
    version: number;
    chrome: boolean;
    safari: boolean;
    firefox: boolean;
    opera: boolean;

    // private
    spoofed: boolean;
    mobile?: boolean;
  };

  console: {
    shown: boolean;
    cache: string;
    show: () => void;
    hide: () => void;
    add: (text: string) => void;
  };

  window: {
    show: (title: string, msg: string, icon: string, buttons?: any) => void;
    close: () => void;
  };

  notifications: {
    add: (
      message: string,
      type?: "ok" | "warning" | "error" | "info" | "mail" | "pokes",
      sticky?: boolean,
      callback?: Function
    ) => void;

    // private
    count: number;
    init: () => void;
    show_error: (id: string, e: Error) => void;
  };

  conflicts: {
    check: () => { count: number; fatal: boolean; html: string };
    show: (m_obj: { count: number; fatal: boolean; html: string }) => void;
  };

  tools: {
    get_blogs: () => Array<any>;
    remove_css: (ext_id: string) => void;
    add_css: (css: string, ext_id: string) => void;
    init_css: (ext_id: string) => void;
    escape_html?: (text: string) => string;
    random_string: () => string;
    add_function: (func: Function, exec: boolean, add_t?: any) => void;
    parse_version?: (
      input: string
    ) => { major: number; minor: number; patch: number };
    getParamaterByName?: (name: string) => string;

    // private
    replace_all: (txt: string, replace: string, with_this: string) => string;
    get_setting: (setting_name: string, default_value: any) => any;
    set_setting: (
      setting_name: string,
      default_value: any
    ) => { errors: boolean; error?: string; storage_error?: boolean };
    get_extension_setting: (
      ext_id: string,
      setting_name: string,
      default_value: any
    ) => any;
    set_extension_setting: (
      ext_id: string,
      setting_name: string,
      new_value: any
    ) => any;
    make_gist?: (text: string) => Promise<string>;
    dump_config?: () => any;

    Nx_XHR?: any;
    get_current_blog?: () => string;
  };

  post_listener: {
    add: (id: string, func: Function) => void;
    remove: (id: string) => void;

    // private
    callbacks: Array<any>;
    callback_ids: Array<any>;
    count: number;
    check: () => void;
    run_callbacks: () => void;
  };

  special: {
    reset: () => void;
  };

  shutdown: () => void;

  api_key?: string;

  frame_mode?: boolean;

  interface?: {
    get_posts: (without_tag?: string, mine?: boolean) => Array<any>;
    post: (
      post: any
    ) => {
      id: number;
      root_id: any;
      owner: string;
      type:
        | "photo"
        | "panorama"
        | "photoset"
        | "quote"
        | "link"
        | "conversation"
        | "audio"
        | "video"
        | "note";
      tags: any;
      liked: boolean;
      permalink: string;
      is_reblogged: boolean;
      is_mine: boolean;
      is_following: boolean;
      avatar: string;

      reblogged?: boolean;
      tumblelog_key?: string;
      note_count?: number;
      reblog_key?: string;
      animated?: boolean;
    };
    find_post: (post_id: string) => any;
    create_control_button: (
      class_name: string,
      icon: string,
      text: string,
      func: Function | string,
      ok_icon?: string
    ) => void;
    add_control_button: (
      post: any,
      class_name: string,
      additional: string
    ) => void;
    disable_control_button: (obj: any, disabled: boolean) => void;
    switch_control_button: (obj: any, working: boolean) => void;
    completed_control_button: (obj: any, will_be_green: boolean) => void;
    form_key: () => string;

    post_window_listener: {
      add: (id: string, func: Function) => void;
      remove: (id: string) => void;
    };

    post_window: {
      state: () => {
        publish: boolean;
        draft: boolean;
        queue: boolean;
        private: boolean;
      };
      add_tag: (tag_or_tags: string | Array<string>) => void;
      tag_exists: (tag: string) => boolean;
      remove_tag: (tag: string) => void;
      blog: () => string;
      open: () => boolean;
      switch_blog: (url: string) => boolean;
      type: () => {
        text: boolean;
        photo: boolean;
        quote: boolean;
        link: boolean;
        chat: boolean;
        video: boolean;
        audio: boolean;
      };
      origin: () => { is_reblog: boolean; is_original: boolean };
    };

    user: () => {
      posts: number;
      followers: number;
      drafts: number;
      queue: number;
    };
    where: () => {
      dashboard: boolean;
      inbox: boolean;
      channel: boolean;

      activity: boolean;
      drafts: boolean;
      endless: boolean;
      explore: boolean;
      followers: boolean;
      following: boolean;
      likes: boolean;
      queue: boolean;
      search: boolean;
      tagged: boolean;
      user_url: string;
    };
    fetch: (post: any, callback: Function, reblog_mode?: boolean) => void;
    revision: number;

    // unlisted
    is_following?: (username: string, blog: string) => Promise<boolean>;
    tag_exists?: (tag: string) => boolean;
    is_tumblr_page?: () => boolean;
    trigger_reflow?: () => void;
    kitty?: any;
  };
}

declare var XKit: XKit;

interface JQuery {
  tipTip: any;
  ColorPicker: any;
}

interface Date {
  stdTimezoneOffset: () => number;
  dst: () => boolean;
}

interface Window {
  Tumblr: any;
}

// Other Global Variables
declare var Tumblr: any;
declare var XBridge: any;
declare var browser: any;
declare var msBrowser: any;
declare var safari: any;
declare var add_tag: string;

// Not sure where this came from
declare var tinyMCE: any;
