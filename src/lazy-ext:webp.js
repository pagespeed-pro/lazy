/**
 * Lazy Image and Iframe loader WebP rewrite
 * Released under the terms of MIT license
 *
 * Copyright (C) 2019 🔬 Style.Tools
 * @link https://github.com/pagespeed-pro/lazy
 */

var WEBP_SUPPORT;

// detect
var webP = new Image();
webP.onload = webP.onerror = function () {
    WEBP_SUPPORT = (webP.height == 2);
};
webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';

var WEBP_FORMAT;

var WEBP_REWRITE_REGEX = /(\.(jp(e)?g|gif|bmp|png|tiff))/ig;
WEBP_REWRITE = function(src, target, webp_config) {
    if (!WEBP_SUPPORT) {
        return src;
    }

    if (!WEBP_FORMAT) {
        WEBP_FORMAT = GET_DATA_ATTR(doc.body, 'webp') || '.webp';
    }

    if (target) {
        webp_config = GET_DATA_ATTR(target, 'webp');
        if (webp_config == 'no') {
            return src;
        }
    }

    var format = (webp_config) ? webp_config : WEBP_FORMAT;

    if (target) {

        // fallback on error or 404
        target.addEventListener('error', function() {
            this.src = src;
        }, {
            "passive": true,
            "once": true
        });
    }

    return src.replace(WEBP_REWRITE_REGEX, format);
}

// public for use in $lazybg
win.$zwebp = WEBP_REWRITE;