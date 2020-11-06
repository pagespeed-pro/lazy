/**
 * Lazy Image and Iframe loader data-lazy JSON config
 * Released under the terms of MIT license
 *
 * Copyright (C) 2019 🔬 Style.Tools
 * @link https://github.com/style-tools/lazy
 */

// attribute config
if (LAZY_SCRIPT) {

    // extract config from data-optimization parameter
    CONFIG = GET_DATA_ATTR(LAZY_SCRIPT, CONFIG_PARAM);
    if (!CONFIG) {
        CONFIG = PARSE_JSON(GET_DATA_ATTR(LAZY_SCRIPT, CONFIG_MULTI_PARAM));
    } else {
        CONFIG = [CONFIG];
    }

    // extract base path
    DATA_ATTR_BASE = GET_DATA_ATTR(LAZY_SCRIPT, BASE_PARAM);

    var config;
    for (var i = 0, l = CONFIG.length; i < l; i++) {
        config = PARSE_JSON(CONFIG[i]);

        if (config) {
            $lazy(config);
        } else {
            $lazy();
        }
    }
}