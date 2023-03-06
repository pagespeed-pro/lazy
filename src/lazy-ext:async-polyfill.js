/**
 * Lazy Image and Iframe loader with $async() polyfill for IntersectionObserver
 * Released under the terms of MIT license
 *
 * Copyright (C) 2019 🔬 Style.Tools
 * @link https://github.com/pagespeed-pro/lazy
 */
// convert to queue
var queue = [];
function LAZY_QUEUE(config) {
    queue.push([].slice.call(arguments));

    return _lazy(config, -1);
}

// load polyfill
if (!intersectionObserver) {

    var POLYFILL, _lazy;
    if (win.$lazypoly) {
        POLYFILL = win.$lazypoly;
    } else if (LAZY_SCRIPT) {
        POLYFILL = GET_DATA_ATTR(LAZY_SCRIPT, 'poly');
    }

    if (POLYFILL) {

        // temporary reference
        _lazy = $lazy;
        win.$lazy = $lazy = LAZY_QUEUE;

        // method to load polyfill
        if (typeof POLYFILL == 'function') {
            POLYFILL = POLYFILL();
        }

        // enable custom promise/callback
        // @example window.$lazypoly = function() { return { then: function(callback) { /* ... */ } } };
        ((typeof POLYFILL != 'string' && "then" in POLYFILL) ? POLYFILL : $async(POLYFILL)).then(function() {

            intersectionObserver = win[intersectionObserverStr];

            // restore lazy handler
            win.$lazy = $lazy = _lazy;

            // process queue
            var item;
            while((item = queue.shift())) {
                $lazy.apply(null, item);
            }
        });
    }
}