/**
 * Lazy CSS background image loader
 * Released under the terms of MIT license
 *
 * Copyright (C) 2019 🔬 Style.Tools
 * @link https://github.com/style-tools/lazy
 */

var BG_IMG_REGEX = /var\s*\(\s*--z-([^,\s]+)[,|\s]/;
var DOC_ELEMENT = doc.documentElement;
var ROOT_STYLE;

// render lazy loaded background image
var LAZY_BG_STYLE;
function LAZY_BG_RENDER(key, value, sheet, index, head) {
    if (!LAZY_BG_STYLE) {
        LAZY_BG_STYLE = doc.createElement('style');
        LAZY_BG_STYLE.id = '$lazybg';
        head = doc.head;
        head.insertBefore(LAZY_BG_STYLE, head.firstChild);
    }

    requestAnimationFrame(function() {
        try {
            sheet = LAZY_BG_STYLE.sheet;
            sheet.insertRule(':root { --z-' + key + ': ' + value + '; }', sheet.cssRules.length);
        } catch(e) {}
    });
}

// public object
function $lazybg(sheet, lazy_config, resolver, webp) {
    if (!sheet) {
        sheet = doc.styleSheets;
    }

    if (WEBP_EXTENSION) {
        // default enabled
        if (webp == undefined) {
            webp = true;
        }
    }

    // default resolver
    if (typeof resolver != 'function') {
        resolver = (function(custom_src) {
            return function(key) {
                if (custom_src && key in custom_src) {
                    src = custom_src[key];
                } else {

                    if (!ROOT_STYLE) {
                        ROOT_STYLE = getComputedStyle(DOC_ELEMENT);
                    }

                    // detect --z-- var in :root {}
                    var src = ROOT_STYLE.getPropertyValue('--z--' + key);
                    if (!src) {

                        // try base decode of key
                        try {
                            src = atob(key.replace(/•/g,'=').replace(/—/g,'/'));
                        } catch(e) {}
                    }
                }

                if (WEBP_EXTENSION) {
                    if (webp) {
                        src = $zwebp(src);
                    }
                }

                return src;
            }
        })(resolver);
    }

    if (sheet.length) {
        for(var i = 0, l = sheet.length; i < l; i++) {
            if (sheet[i]) {
                $lazybg(sheet[i], lazy_config, resolver);
            }
        }
    } else {
        try {
            if (sheet.sheet) {
                sheet = sheet.sheet;
            }

            var rules = sheet.cssRules, 
                i, l, rule, img, match, selector, src;

            if (rules) {
                for (i = 0, l = rules.length; i < l; i++) {
                    rule = rules[i];
                    if (rule && rule.style) {
                        img = rule.style.backgroundImage;

                        // lazy variable
                        if (img && img.indexOf('--z-') !== -1) {

                            // extract var(--z-...) value
                            match = img.match(BG_IMG_REGEX);

                            if (match) {
                                (function(lazy_config, selector, key, value, lazy_loaded) {

                                    // resolve value
                                    value = resolver(key);

                                    if (!lazy_config) {
                                        lazy_config = selector;
                                    } else {
                                        lazy_config = JSON.parse(JSON.stringify(lazy_config));
                                        if (lazy_config instanceof Array) {
                                            lazy_config[0] = selector;
                                        } else {
                                            lazy_config.selector = selector;
                                        }
                                    }

                                    // setup $lazy with custom inview
                                    $lazy(lazy_config,function(target) {
                                        if (!lazy_loaded) {
                                            lazy_loaded = 1;
                                            LAZY_BG_RENDER(key, value);
                                        }
                                    });
                                })(lazy_config, rule.selectorText, match[1]);
                            }
                        }
                    }
                }
            }
        } catch(e) {}
    }
}

// window.$lazybg
win.$lazybg = $lazybg;