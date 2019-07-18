/**
 * Lazy Image and Iframe loader
 * Released under the terms of MIT license
 *
 * Copyright (C) 2019 📐 Style.Tools
 * @link https://github.com/style-tools/lazy
 */

// lazy-minimum.js: no browser check
if (TINY) {
    var intersectionObserver = win['IntersectionObserver'];
} else {

    var intersectionObserver, intersectionObserverStr = 'IntersectionObserver',
        intersectionObserverEntryProto = ((intersectionObserverStr +'Entry' in win) ? win[intersectionObserverStr + 'Entry'].prototype : 0),
        LAZY_SCRIPT;
    if (
        intersectionObserverEntryProto
        && 'intersectionRatio' in intersectionObserverEntryProto
        && 'isIntersecting' in intersectionObserverEntryProto
    ) {
        intersectionObserver = win[intersectionObserverStr];
    };
}

// get data-* attribute
function GET_DATA_ATTR(el, attr) {
    return el.getAttribute('data-' + attr);
}

// query
function QUERY(selector) {
    return doc.querySelectorAll(selector);
}

// public object
function $lazy(config, callback) {

    // lazy-minimum.js: basic config, no Node/NodeList support
    if (TINY) {
        var selector,observerConfig,
            asset,assets,
            SRC = 'src',
            SRCSET = SRC + 'set';
        if (typeof config != 'object') {
            config = [config];
        }
        selector = config[0] || config.selector || '[data-src]';
        observerConfig = config[1] || config.observer;
    
    } else {

        // selector as string, Node or NodeList
        if (!config || typeof config == 'string' || !((config instanceof Array) || config.selector)) {
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
            }
    }
        
    // inview callback
    if (!callback) {
        callback = function(entries) {
            var entry;
            for (var i = 0, l = entries.length; i < l; i++) {
                entry = entries[i];

                if (!observer || entry.isIntersecting) {

                    var target = (observer) ? entry.target : entry,
                        srcset = GET_DATA_ATTR(target,SRCSET),
                        src = GET_DATA_ATTR(target,SRC);

                    if ( srcset ) {
                        target[SRCSET] = srcset;
                    }

                    if ( src ) {
                        target[SRC] = src;
                    }

                    // fire event
                    if (!TINY && "CustomEvent" in win) {
                        try {
                            target.dispatchEvent(new CustomEvent('$lazy', {
                                bubbles: true,
                                cancelable: true,
                                detail: {
                                    el: target,
                                    entry: entry
                                }
                            }));
                        } catch(e) {}
                    }

                    if (observer) {
                        observer.unobserve(target);
                    }
                }
            }
        }
    }

    // the intersection observer
    var observer = (intersectionObserver) ? new intersectionObserver( callback, observerConfig ) : false;

    // single node
    if (!TINY) {
        if (typeof selector == 'string') {
            // query
            assets = QUERY(selector);    
        } else { 
            // Node type detection IE8, convert to NodeList
            assets = (selector && selector.length == undefined) ? [selector] : selector;
        }
    } else {
        // query
        assets = QUERY(selector);
    }

    for (var i = 0, l = assets.length; i < l; i++) {
        asset = assets[i];
        if (observer) {
            observer.observe(asset);
        } else if (!TINY) {
            // simple fallback if Intersection Observer is not available
            callback([asset]);
        }
    }

    // lazy-minimum.js
    if (!TINY) {
        return assets;
    }
};

// window.$lazy
win.$lazy = $lazy;