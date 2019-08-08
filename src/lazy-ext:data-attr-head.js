/**
 * Lazy Image and Iframe loader data-lazy JSON config
 * Released under the terms of MIT license
 *
 * Copyright (C) 2019 🔬 Style.Tools
 * @link https://github.com/style-tools/lazy
 */

// attribute config
var CONFIG,
    CONFIG_PARAM = 'l',
    MULTI_TOKEN = '||';

LAZY_SCRIPT = doc.currentScript || QUERY('script[data-' + CONFIG_PARAM + ']')[0];