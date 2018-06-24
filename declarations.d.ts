interface XKit {
  version: number | string;

  api_key: string;

  page: {
    standard: boolean;
    ask_frame: boolean;
    blog_frame: boolean;
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
    github_fetch: (path: string, callback: Function) => void;
    extension: (extension_id: string, callback: Function) => void;
    page: (page: string, callback: Function) => void;

    try_count?: number;
    max_try_count?: number;
  };

  install: (extension_id: string, callback: Function) => void;

  installed: {
    add: (extension_id: string) => void;
    remove: (extension_id: string) => void;
    list: () => any;
    check: (extension_id: string) => boolean;
    when_running: (
      extension_id: string,
      onRunning: Function,
      onFailure?: Function
    ) => void;
    is_running: (extension_id: string) => boolean;
    get: (extension_id: string) => any;
    update: (extension_id: string, new_object: any) => void;
    enable: (extension_id: string) => void;
    disable: (extension_id: string) => void;
    enabled: (extension_id: string) => boolean;
    version: (extension_id: string) => string;
    title: (extension_id: string) => string;
    developer: (extension_id: string) => string;
    description: (extension_id: string) => string;
    script: (extension_id: string) => string;
    icon: (extension_id: string) => string;
    css: (extension_id: string) => string;
  };

  progress: {
    add: (id: string) => string;
    value: (id: string, value: string | number) => void;
  };

  storage: {
    max_area_size: number;
    unlimited_storage: boolean;
    size: (extension_id: string) => number;
    quota: (extension_id: string) => number;
    get: (extension_id: string, key: string, default_value?: any) => any;
    set: (extension_id: string, key: string, default_value: any) => boolean;
    remove: (extension_id: string, key: any) => boolean;
    get_all: (extension_id: string) => any;
    clear: (extension_id: string) => void;
    show_error: (extension_id: string, size: number) => void;
  };

  browser: () => {
    name: string;
    version: number;
    spoofed: boolean;
    chrome: boolean;
    firefox: boolean;
    safari: boolean;
    opera: boolean;
    mobile: boolean;
  };

  iframe: {
    get_tumblelog: () => string;
    single_post_id: () => string;
    form_key: () => string;
    hide_button: (button: JQuery) => void;
    tx_button_selector: (name: string) => JQuery;
    follow_button: () => JQuery;
    unfollow_button: () => JQuery;
    delete_button: () => JQuery;
    reblog_button: () => JQuery;
    dashboard_button: () => JQuery;
    size_frame_to_fit: () => void;

    // dynamically defined
    full?: () => void;
    restore?: () => void;
  };

  window: {
    show: (
      title: string,
      msg: string,
      icon?: "error" | "warning" | "question" | "info",
      buttons?: any,
      wide?: boolean
    ) => void;
    close: () => void;
  };

  notifications: {
    count: number;
    init: () => void;
    show_error: (id: string, e: Error) => void;
    add: (
      message: string,
      type?: "ok" | "warning" | "error" | "info" | "mail" | "pokes",
      sticky?: boolean,
      callback?: Function
    ) => void;
  };

  toast: {
    count: number;
    add: (
      created: boolean,
      action: string,
      url: string,
      id?: number | string,
      crumb?: string
    ) => void;
  };

  conflicts: {
    check: () => { count: number; fatal: boolean; html: string };
    show: (m_obj: { count: number; fatal: boolean; html: string }) => void;
  };

  tools: {
    init_css: (ext_id: string) => void;
    add_css: (css: string, ext_id: string) => void;
    remove_css: (ext_id: string) => void;
    random_string: () => string;
    blog_list_message_listener: (e: any) => void;
    get_blogs: () => Array<string>;
    get_current_blog: () => string;
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
    parse_version: (
      input: string
    ) => { major: number; minor: number; patch: number };
    add_function_nonce: string;
    add_function: (func: Function, exec: boolean, addt?: any) => void;
    make_file: (
      filename: string,
      data: Array<any> | string,
      options?: any
    ) => boolean;
    github_issue: (title: string, data?: any, error?: Error) => string;
    debounce: (func: Function, wait: number) => Function;
    dump_config: () => any;
    escape_html: (text: string) => string;
    getParameterByName: (name: string) => string;
    Nx_XHR: (details: any) => void;
    show_timestamps_help: () => void;
  };

  interface: {
    revision: number;
    added_icon: any;
    added_icon_icon: any;
    added_icon_text: any;
    post_window_listener_id: any;
    post_window_listener_func: any;
    post_window_listener_running: boolean;
    post_window_listener_window_id: number | string;

    kitty: {
      stored: string;
      store_time: number;
      expire_time: number;
      set: (kitty: string) => void;
      get: (callback: Function) => void;
    };

    post_window: {
      added_icon: any;
      added_icon_icon: any;
      added_icon_text: any;
      create_control_button: (
        class_name: string,
        icon: string,
        text: string,
        func?: EventListener
      ) => void;
      add_control_button: (class_name: string, additional?: string) => void;
      get_content_html: () => string;
      set_content_html: (new_content: string) => void;
      add_tag: (tag_or_tags: string | Array<string>) => void;
      tag_exists: (tag: string) => boolean;
      remove_all_tags: () => void;
      remove_tag: (tag: string) => void;
      state: () => {
        publish: boolean;
        draft: boolean;
        queue: boolean;
        private: boolean;
      };
      post_type: () => {
        text: boolean;
        photo: boolean;
        video: boolean;
        chat: boolean;
        quote: boolean;
        audio: boolean;
        link: boolean;
      };
      blog: () => string;
      switch_blog: (url: string) => boolean;
      open: () => boolean;
      type: () =>
        | "text"
        | "photo"
        | "video"
        | "chat"
        | "quote"
        | "audio"
        | "link";
      origin: () => { is_reblog: boolean; is_original: boolean };
    };

    post_window_listener: {
      run: () => void;
      set_listen: () => void;
      do: () => void;
      add: (id: string, func: Function) => void;
      remove: (id: string) => void;
    };

    update_view: {
      tags: (post_obj: any, tags: string) => void;
    };

    edit_post_object: (tumblr_object?: any, settings?: any) => any;
    edit: (tumblr_object: any, func: Function, retry_mode?: boolean) => void;
    fetch: (post_object: any, func: Function, reblog_mode?: boolean) => void;
    switch_control_button: (obj: JQuery, working: boolean) => void;
    disable_control_button: (obj: JQuery, disabled: boolean) => void;
    completed_control_button: (obj: JQuery, completed: boolean) => void;
    create_control_button: (
      class_name: string,
      icon: string,
      text: string,
      func?: EventListener,
      ok_icon?: string
    ) => void;
    add_control_button: (
      obj: any,
      class_name: string,
      additional?: string
    ) => void;
    get_posts: (
      without_tag?: string,
      mine?: boolean,
      can_edit?: boolean
    ) => Array<any>;
    find_post: (post_id: string) => any;
    post: (obj: JQuery) => any;
    form_key: () => string;
    check_key: () => string;
    user: () => {
      posts: number;
      followers: number;
      drafts: number;
      processing: number;
      queue: number;
      activity: string;
      name: string;
      title: string;
    };
    where: () => {
      activity: boolean;
      channel: boolean;
      dashboard: boolean;
      drafts: boolean;
      endless: boolean;
      explore: boolean;
      followers: boolean;
      following: boolean;
      inbox: boolean;
      likes: boolean;
      queue: boolean;
      search: boolean;
      tagged: boolean;
      user_url: string;
    };
    is_tumblr_page: () => boolean;
    trigger_reflow: () => void;
    show_peepr_for: (blog: any, post?: any) => void;
    is_following: (username: string, blog: string) => Promise<boolean>;
  };

  post_listener: {
    callbacks: any;
    add: (id: string, func: Function) => void;
    remove: (id: string, func?: Function) => void;
    observer: MutationObserver;
    check: () => void;
  };

  special: {
    reset: () => void;
  };

  shutdown: () => void;

  // Dynamically defined
  frame_mode?: boolean;
  blogs_from_tumblr?: Array<any>;
  retina?: boolean;
  servers?: any;
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
  _: any;
  ace: AceAjax.Ace;
  jQuery: JQuery;
  Tumblr: any;
  xkit_restore_fastdash: Function;
}

// Other Global Variables
declare var _: any;
declare var ace: AceAjax.Ace;
declare var add_tag: any;
declare var browser: any;
declare var centerIt: any;
declare var last_object: any;
declare var msBrowser: any;
declare var safari: any;
declare var tinyMCE: any;
declare var Tumblr: any;
declare var XBridge: any;

declare function show_error_installation(msg: string);
declare function show_error_reset(msg: string);
declare function xkit_check_storage();
