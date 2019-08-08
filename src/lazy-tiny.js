/**
 * Lazy Image and Iframe loader
 * Released under the terms of MIT license
 *
 * Copyright (C) 2019 🔬 Style.Tools
 * @link https://github.com/style-tools/lazy
 */

// lazy-tiny.js: no browser check
var intersectionObserver = win.IntersectionObserver;

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

    // lazy-tiny.js: basic config, no Node/NodeList support
    var selector,observerConfig,
        asset,assets,
        SRC = 'src',
        SRCSET = SRC + 'set';
    if (typeof config != 'object') {
        config = [config];
    }
    selector = config[0] || config.selector || '[data-src]';
    observerConfig = config[1] || config.observer;
        
    callback = callback || function(entries) {
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

                if (observer) {
                    observer.unobserve(target);
                }
            }
        }
    }

    // the intersection observer
    var observer = (intersectionObserver) ? new intersectionObserver( callback, observerConfig ) : false;

    // query
    assets = QUERY(selector);

    for (var i = 0, l = assets.length; i < l; i++) {
        asset = assets[i];
        if (observer) {
            observer.observe(asset);
        } else {
            // simple fallback if Intersection Observer is not available
            callback([asset]);
        }
    }
};

// window.$z
win.$z = $lazy;