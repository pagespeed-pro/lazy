/** Async CSS Loader Tests */

var SERVER_API = {};

const assert = require('assert');

// load / reload page
SERVER_API.validation = function(fn) {
    return 'return (' + fn.toString() + ')()';
}

// load / reload page
SERVER_API.reload = function(driver, script, exec, inline, html) {

    return driver.get(SERVER_API.query('/', script, exec, inline, html));
}

// build query URL
SERVER_API.query = function(template, script, exec, inline, html) {
    var server = 'http://127.0.0.1:14281' + template + '?script=' + encodeURIComponent(JSON.stringify(script));
    if (html) {
        server += '&html=' + encodeURIComponent(html);
    }
    if (exec) {
        server += '&exec=' + encodeURIComponent(JSON.stringify(exec));
    }
    if (inline) {
        server += '&inline=' + encodeURIComponent(inline);
    }
    return server;
}

module.exports = SERVER_API;