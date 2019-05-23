/**
 * Lazy Image and Iframe loader
 * Released under the terms of MIT license
 *
 * Copyright (C) 2019 📐 Style.Tools
 * @link https://github.com/style-tools/lazy
 */

var w = window,
doc = document;

var intersectionObserver = w.IntersectionObserver || false;

// PolyFill for "isIntersecting"
// https://github.com/WICG/IntersectionObserver/issues/211#issuecomment-309144669
if (intersectionObserver && 'IntersectionObserverEntry' in w &&
    'intersectionRatio' in w.IntersectionObserverEntry.prototype &&
    !('isIntersecting' in IntersectionObserverEntry.prototype)
) {
    Object.defineProperty(w.IntersectionObserverEntry.prototype, 'isIntersecting', {
        get: function () {
            return this.intersectionRatio > 0
        }
    });
}

// get attribute
function GET_DATA_ATTR(el, attr) {
    return el.getAttribute('data-' + attr);
}

function IS_OBJECT(obj) {
    return typeof obj === 'object';
}

// query selector
function QUERY(selector) {
    return doc.querySelectorAll(selector);
}

// public object
var $lazy = function(config, callback) {

    // selector as string
    if (!IS_OBJECT(config)) {
        config = [config];
    }

    // inview callback
    if (typeof callback !== 'function') {
        callback = function(entries) {
            var entry;
            for (var i = 0, l = entries.length; i < l; i++) {
                entry = entries[i];

                if (!observer || entry.isIntersecting) {

                    var target = (observer) ? entry.target : entry,
                    _src = 'src',
                    _srcset = _src + 'set',
                    srcset = GET_DATA_ATTR(target,_srcset),
                    src = GET_DATA_ATTR(target,_src);

                    if ( srcset ) {
                        target[_srcset] = srcset;
                    }

                    if ( src ) {
                        target[_src] = src;
                    }

                    if (observer) {
                        observer.unobserve(target);
                    }
                }
            }
        }
    }

    var selector = config[0] || config.selector || '[data-src]',
        threshold = config[1] || config.threshold || 0.006,
        rootMargin = config[2] || config.rootMargin || '0px';

    // the intersection observer
    var observer = (intersectionObserver) ? new intersectionObserver( callback, {
        threshold: [ threshold ],
        rootMargin:  rootMargin
    }) : false;

    var asset,
        assets = QUERY(selector);

    for (var i = 0, l = assets.length; i < l; i++) {
        asset = assets[i];
        if (observer) {
            observer.observe(asset);
        } else {
            callback([asset]);
        }
    }
};

// window.$lazy
w.$lazy = $lazy;