/**
 * Lazy Image and Iframe loader data-lazy JSON config
 * Released under the terms of MIT license
 *
 * Copyright (C) 2019 🔬 Style.Tools
 * @link https://github.com/style-tools/lazy
 */

if (DATA_ATTR_EXTENSION) {

    // attribute config
    var CONFIG,
        CONFIG_PARAM = 'z',
        MULTI_TOKEN = '||';

    LAZY_SCRIPT = doc.currentScript || QUERY('script[data-' + CONFIG_PARAM + ']')[0];

    var PARSE_JSON = function(json) {
        try {
            json = JSON.parse(json);
        } catch (err) {
            json = false;
        };
        return json;
    }
}