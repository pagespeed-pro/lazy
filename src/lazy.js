/**
 * Lazy Image and Iframe loader
 * Released under the terms of MIT license
 *
 * Copyright (C) 2019 🔬 Style.Tools
 * @link https://github.com/pagespeed-pro/lazy
 */

var intersectionObserver, intersectionObserverStr = 'IntersectionObserver',
    intersectionObserverEntryProto = ((intersectionObserverStr + 'Entry' in win) ? win[intersectionObserverStr + 'Entry'].prototype : 0),
    LAZY_SCRIPT, WEBP_REWRITE, DATA_ATTR_BASE = '', PROTOCOL_REGEX = /^[a-z]+:\/\//i;
if (
    intersectionObserverEntryProto &&
    'intersectionRatio' in intersectionObserverEntryProto &&
    'isIntersecting' in intersectionObserverEntryProto
) { 
    intersectionObserver = win[intersectionObserverStr];
};

// get data-* attribute
function GET_DATA_ATTR(el, attr) {
    return el.getAttribute('data-' + attr);
}

function REMOVE_DATA_ATTR(el, attr) {
    return el.removeAttribute('data-' + attr);
}

// query
function QUERY(selector) {
    return doc.querySelectorAll(selector);
}

function REBASE(url, base) {
    if (url[0] === '/' || PROTOCOL_REGEX.test(url)) {
        return url;
    }
    return (base ? base : '') + url;
}

// public object
function $lazy(config, inview, observer_callback) {

    // selector as string, Node or NodeList
    if (!config || typeof config == 'string' || !(config instanceof Array || config.selector)) {
        config = [config];
    }

    // data-z and data-zb
    // compressed srcset and responsive background config
    if (DATA_ATTR_EXTENSION) {
        var config_z = config[0];
        if (config_z == 'z' || config_z == 'zb') {
            config = {
                selector: config[3] || '[data-' + config_z + ']',
                src: config_z,
                base: config[1],
                webp: !(config[2] === false)
            }
            if (config_z == 'zb') {
                config.bg = true;
            }
        }
    }

    if (BG_EXTENSION) {
        var bg = config[6] || config.bg;
    }

    var selector = config[0] || config.selector || '[data-src]',
        threshold = config[1] || config.threshold || config.observer,
        rootMargin = config[2] || config.rootMargin,
        asset, assets,
        observerConfig = (typeof threshold == 'object') ? threshold : {
            rootMargin: rootMargin || '0px',
            threshold: threshold || 0
        },
        outofview, after_inview, force_inview,
        observer, webp, eventtypes,
        SRC = 'src',
        SRCSET = SRC + 'set',
        DATA_SRC = config.src || SRC,
        DATA_SRCSET = config.srcset || SRCSET,
        // DATA_ATTR_EXTENSION
        BASE, EXT_REGEX, SIZES_MQ_REGEX;

    if (DATA_ATTR_EXTENSION) {
        BASE = config[5] || config.base || DATA_ATTR_BASE;
        EXT_REGEX = /(\.[a-z]{2,4}(\.[a-z]{2,4})?(\?.*)?)$/i;
        SIZES_MQ_REGEX = /^(.*)\s(\d+w)$/;
        if (config_z) {
            DATA_SRC = config_z;
        }
    }

    if (WEBP_EXTENSION) {
        webp = (config[3] === false || config.webp === false) ? false : true;
    }
    if (CLICK_EXTENSION) {
        eventtypes = config[4] || config.events || ['click', 'mouseover', 'z'];
    }

    // out of view / after_inview callback
    if (inview instanceof Array) {
        after_inview = inview[2];
        outofview = inview[1];
        inview = inview[0];
        outofview = outofview || inview;
    }

    // @TODO added on 30-03-2020
    if (inview === 1) {
        inview = false;
        force_inview = true;
    }

    if (BG_EXTENSION) {
        inview = (!inview && bg) ? function(el) {
            function render_responsive_bg(e) {

                if (e) {

                    // match once
                    if (bg === 1) {

                        if (e.matches) {
                            // media query still matches
                            return;
                        }

                        mqMatch.removeListener(render_responsive_bg);
                    }
                }

                var match, baseImg;
                bg.forEach(function(img) {
                    if (!match) {
                        if (typeof img != 'object') {

                            // image url
                            if (isNaN(img)) {
                                img = [img];
                            } else {
                                img = [,img];
                            }
                        }
                        if (!baseImg) {
                            baseImg = bg[bg.length - 1];
                            if (baseImg instanceof Array) {
                                baseImg = baseImg[0];
                            }
                        }
                        if (img[1]) {
                            mqMatch = window.matchMedia(((!isNaN(img[1])) ? '(max-width: ' + img[1] + 'px)' : img[1]));
                            if (mqMatch.matches) {
                                match = img[0] || ((baseImg) ? baseImg.replace(EXT_REGEX, '-' + img[1] + 'w$1') : false);
                                mqMatch.addListener(render_responsive_bg);
                            } else {
                                mqMatch = false;
                            }
                        } else {
                            match = img[0];
                        }
                    }
                });
                if (match) {
                    if (WEBP_EXTENSION) {
                        if (webp) {
                            match = WEBP_REWRITE(match);
                        }
                    }
                    el.style.backgroundImage = 'url(' + REBASE(match, BASE) + ')';
                }
            }

            var mqMatch, responsive,
                bg = GET_DATA_ATTR(el, DATA_SRC);
            if (bg) {
                responsive = (bg.substr(0, 1) == '[') ? PARSE_JSON(bg) : 0;
                if (responsive instanceof Array) {
                    bg = responsive;

                    // render
                    render_responsive_bg();
                } else {
                    if (WEBP_EXTENSION) {
                        if (webp) {
                            bg = WEBP_REWRITE(bg);
                        }
                    }
                    el.style.backgroundImage = 'url(' + REBASE(bg, BASE) + ')';
                }

                REMOVE_DATA_ATTR(el, DATA_SRC);
            }

        } : inview;
    }

    // default inview callback
    inview = inview || function(target, src, srcset, base, fallback, _webp, _sizes) {
        src = GET_DATA_ATTR(target, DATA_SRC);
        _webp = webp;
        if (DATA_ATTR_EXTENSION) {
            srcset = false;
            if (src) {
                if (src.substr(0, 1) == '[') {
                    src = PARSE_JSON(src);
                    if (WEBP_EXTENSION) {
                        _webp = webp || !!src[3];
                    }
                    srcset = src[1];
                    base = src[2] || BASE;
                    fallback = src[3];
                    src = REBASE(src[0], base);
                    fallback = fallback || src;

                    // compressed srcset
                    // data-z='["img.jpg",[200,300]]' -> BASE + img-200w.jpg
                    // data-z='["img.jpg",[["path/img-200w.jpg",200],["path/img-300w.jpg",300]]]'
                    if (srcset) {
                        var set = [],
                            set_config, set_src, set_size,
                            set_width, set_ext_rewrite;
                        for (var i = 0, l = srcset.length; i < l; i++) {
                            set_config = srcset[i];
                            if (set_config instanceof Array) {
                                set_src = set_config[0];
                                set_width = set_config[1];
                                set_ext_rewrite = 0;
                            } else {
                                set_src = src;
                                set_width = set_config;
                                set_ext_rewrite = 1;
                            }
                            if (!isNaN(set_width)) {
                                set_width += 'w';
                            }
                            set_size = set_width;
                            if (set_ext_rewrite) {
                                set_src = set_src.replace(EXT_REGEX, '-' + set_width + '$1');
                            }

                            set.push(set_src + ((set_width) ? ' ' + set_width : ''));
                        }

                        // fallback
                        set.push(fallback);

                        srcset = set.join(',');
                    }

                    _sizes = target.getAttribute('sizes');
                    if (_sizes) {
                        _sizes = _sizes.split(',');
                        for (var i = 0, _size, mqMatch, l = _sizes.length; i < l; i++) {
                            _size = _sizes[i].match(SIZES_MQ_REGEX);
                            if (_size) {
                                mqMatch = window.matchMedia(_size[1]);
                                if (mqMatch.matches) {
                                    src = src.replace(EXT_REGEX, '-' + _size[2] + '$1');
                                    break;
                                }
                            }
                        }
                    }
                } else {
                    src = REBASE(src, BASE);
                    srcset = GET_DATA_ATTR(target, DATA_SRCSET);
                }
            }
        } else {
            srcset = GET_DATA_ATTR(target, DATA_SRCSET);
        }

        if (srcset) {

            if (WEBP_EXTENSION) {
                if (_webp) {
                    srcset = WEBP_REWRITE(srcset, target);
                }
            }
            target[SRCSET] = srcset;

            REMOVE_DATA_ATTR(target, DATA_SRCSET);
        }

        if (src) {

            if (WEBP_EXTENSION) {
                if (_webp) {
                    src = WEBP_REWRITE(src, target);
                }
            }
            target[SRC] = src;

            REMOVE_DATA_ATTR(target, DATA_SRC);
        }

        // hook for sending a custom event etc.
        if (after_inview) {
            after_inview(target);
        }
    }

    // default observer callback
    observer_callback = observer_callback || function(entries, fallback) {
        var entry, target, unobserve, is_inview;

        for (var i = 0, l = entries.length; i < l; i++) {
            entry = entries[i];

            if (CLICK_EXTENSION) {
                fallback = (fallback === entry);
                is_inview = (fallback || !observer || entry.isIntersecting);
            } else {
                is_inview = (!observer || entry.isIntersecting);
            }

            if (is_inview || outofview) {

                if (CLICK_EXTENSION) {
                    target = (!fallback && observer) ? entry.target : entry;
                } else {
                    target = (observer) ? entry.target : entry;
                }

                unobserve = ((!is_inview) ? outofview : inview)(target, observer, is_inview);

                // not specifically instructed to keep observing (= out-of-view callback)
                if (observer && unobserve !== false) {
                    observer.unobserve(target);
                }
            }
        }
    }

    // single node
    if (typeof selector == 'string') {
        // query
        assets = QUERY(selector);
    } else {
        // Node type detection IE8, convert to NodeList
        assets = (selector && selector.length == undefined) ? [selector] : selector;
    }

    // return elements for polyfill
    if (inview === -1) {
        return assets;
    }

    // the intersection observer
    observer = (intersectionObserver && !force_inview) ? new intersectionObserver(observer_callback, observerConfig) : false;

    // event based fallback
    if (CLICK_EXTENSION) {

        if (assets) {
            assets.forEach(function(asset) {
                if (observer) {
                    observer.observe(asset);
                } else {
                    // simple fallback if Intersection Observer is not available
                    observer_callback([asset]);
                }

                // event listener
                var listener = function(e) {

                    // remove event
                    asset.removeEventListener(e.type, listener);

                    // call handler
                    observer_callback([asset], asset);
                };

                for (var _i = 0, _l = eventtypes.length; _i < _l; _i++) {
                    asset.addEventListener(eventtypes[_i], listener, {
                        "passive": true,
                        "once": true
                    });
                }
            });
        }

    } else {

        if (assets) {
            assets.forEach(function(asset) {
                if (observer) {
                    observer.observe(asset);
                } else {
                    // simple fallback if Intersection Observer is not available
                    observer_callback([asset]);
                }
            });
        }
    }

    return assets;
};

// window.$lazy
win.$lazy = $lazy;