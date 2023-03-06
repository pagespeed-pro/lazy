/**
 * Lazy Image and Iframe loader data-lazy JSON config
 * Released under the terms of MIT license
 *
 * Copyright (C) 2019 🔬 Style.Tools
 * @link https://github.com/pagespeed-pro/lazy
 */

if (DATA_ATTR_EXTENSION) {

    // attribute config
    var CONFIG,
        CONFIG_PARAM = 'z',
        CONFIG_MULTI_PARAM = 'zz',
        BASE_PARAM = 'b',
        MULTI_TOKEN = '||';

    LAZY_SCRIPT = doc.currentScript || QUERY('script[data-z],script[data-zz]')[0];

    var PARSE_JSON = function(json) {
        var parsed;
        try {
            parsed = JSON.parse(json);
        } catch (err) {
            parsed = json;
        };
        return parsed;
    }
}