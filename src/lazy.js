/**
 * Lazy Image and Iframe loader
 * Released under the terms of MIT license
 *
 * Copyright (C) 2019 🔬 Style.Tools
 * @link https://github.com/style-tools/lazy
 */

var intersectionObserver, intersectionObserverStr = 'IntersectionObserver',
    intersectionObserverEntryProto = ((intersectionObserverStr +'Entry' in win) ? win[intersectionObserverStr + 'Entry'].prototype : 0),
    LAZY_SCRIPT, WEBP_REWRITE;
if (
    intersectionObserverEntryProto
    && 'intersectionRatio' in intersectionObserverEntryProto
    && 'isIntersecting' in intersectionObserverEntryProto
) {
    intersectionObserver = win[intersectionObserverStr];
};

// get data-* attribute
function GET_DATA_ATTR(el, attr) {
    return el.getAttribute('data-' + attr);
}

// query
function QUERY(selector) {
    return doc.querySelectorAll(selector);
}

// public object
function $lazy(config, inview, observer_callback) {

    // selector as string, Node or NodeList
    if (!config || typeof config == 'string' || !(config instanceof Array || config.selector)) {
        config = [config];
    }

    var selector = config[0] || config.selector || '[data-src]',
        threshold = config[1] || config.threshold || config.observer,
        rootMargin = config[2] || config.rootMargin,
        asset,assets,
        SRC = 'src',
        SRCSET = SRC + 'set',
        observerConfig = (typeof threshold == 'object') ? threshold : {
            rootMargin: rootMargin || '0px',
            threshold: threshold || 0
        },
        outofview, after_inview,
        observer;

    if (WEBP_EXTENSION) {
        var webp = (config[3] === false || config.webp === false) ? false : true;
    }

    // out of view / after_inview callback
    if (inview instanceof Array) {
        after_inview = inview[2];
        outofview = inview[1];
        inview = inview[0];
        outofview = outofview || inview;
    }

    // default inview callback
    inview = inview || function(target, src, srcset) {
        srcset = GET_DATA_ATTR(target,SRCSET),
        src = GET_DATA_ATTR(target,SRC);

        if ( srcset ) {

            if (WEBP_EXTENSION) {
                if (webp) {
                    srcset = WEBP_REWRITE(srcset, target);
                }
            }
            target[SRCSET] = srcset;
        }

        if ( src ) {

            if (WEBP_EXTENSION) {
                if (webp) {
                    src = WEBP_REWRITE(src, target);
                }
            }
            target[SRC] = src;
        }

        // hook for sending a custom event etc.
        if (after_inview) {
            after_inview(target);
        }
    }

    // default observer callback
    observer_callback = observer_callback || function(entries) {
        var entry, target, unobserve, is_inview;

        for (var i = 0, l = entries.length; i < l; i++) {
            entry = entries[i];
            is_inview = (!observer || entry.isIntersecting);
            if (is_inview || outofview) {

                target = (observer) ? entry.target : entry;
                unobserve = ((!is_inview) ? outofview : inview)(target, observer, is_inview);

                // not specifically instructed to keep observing (= out-of-view callback)
                if (observer && unobserve !== false) {
                    observer.unobserve(target);
                }
            }
        }
    }

    // the intersection observer
    observer = (intersectionObserver) ? new intersectionObserver( observer_callback, observerConfig ) : false;

    // single node
    if (typeof selector == 'string') {
        // query
        assets = QUERY(selector);    
    } else { 
        // Node type detection IE8, convert to NodeList
        assets = (selector && selector.length == undefined) ? [selector] : selector;
    }

    for (var i = 0, l = assets.length; i < l; i++) {
        asset = assets[i];
        if (observer) {
            observer.observe(asset);
        } else {
            // simple fallback if Intersection Observer is not available
            observer_callback([asset]);
        }
    }

    return assets;
};

// window.$lazy
win.$lazy = $lazy;