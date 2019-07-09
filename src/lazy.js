/**
 * Lazy Image and Iframe loader
 * Released under the terms of MIT license
 *
 * Copyright (C) 2019 📐 Style.Tools
 * @link https://github.com/style-tools/lazy
 */

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

// get data-* attribute
function GET_DATA_ATTR(el, attr) {
    return el.getAttribute('data-' + attr);
}

// verify instance type
function IS_INSTANCE(obj, type) {
    if (!type) {
        type = Object;
    }
    return obj instanceof type;
}

// query
function QUERY(selector) {
    return doc.querySelectorAll(selector);
}

// public object
function $lazy(config, callback) {

    // selector as string, Node or NodeList
    if (!config || typeof config != 'object' || IS_INSTANCE(config, Node) || IS_INSTANCE(config, NodeList)) {
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
        
    // inview callback
    if (typeof callback != 'function') {
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
                    if ("CustomEvent" in win) {
                        target.dispatchEvent(new CustomEvent('$lazy', {
                            bubbles: true,
                            cancelable: true,
                            detail: {
                                el: target,
                                entry: entry
                            }
                        }));
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
    if (IS_INSTANCE(selector, Node)) {
        assets = [selector];
    } else if (IS_INSTANCE(selector, NodeList)) {
        // node list
        assets = selector;
    } else {
        // query
        assets = QUERY(selector);
    }

    for (var i = 0, l = assets.length; i < l; i++) {
        asset = assets[i];
        if (observer) {
            observer.observe(asset);
        } else {
            callback([asset]);
        }
    }

    return assets;
};

// window.$lazy
win.$lazy = $lazy;