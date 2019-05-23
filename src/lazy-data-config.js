/**
 * Lazy Image and Iframe loader
 * Released under the terms of MIT license
 *
 * Copyright (C) 2019 📐 Style.Tools
 * @link https://github.com/style-tools/lazy
 */

// attribute config
var CONFIG;
var CONFIG_PARAM = 'l';
var LAZY_SCRIPT = doc.currentScript || QUERY('script[' + CONFIG_PARAM + ']');
if (LAZY_SCRIPT) {

    // extract config from data-optimization parameter
    CONFIG = GET_DATA_ATTR(LAZY_SCRIPT, CONFIG_PARAM);

    try {
        CONFIG = JSON.parse(CONFIG);
    } catch (err) {};

    if (CONFIG) {
        if (!IS_OBJECT(CONFIG)) {
            CONFIG=[CONFIG];
        }
        for (var i = 0, l = CONFIG.length; i < l; i++) {
            $lazy(CONFIG[i]);
        }
    }
}