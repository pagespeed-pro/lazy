/** Async CSS Loader Tests */

var SERVER_API = {};

const assert = require('assert');

// load / reload page
SERVER_API.validation = function(fn) {
    return 'return (' + fn.toString() + ')()';
}

// load / reload page
SERVER_API.reload = function(driver, script, exec, inline) {

    return driver.get(SERVER_API.query('/', script, exec, inline));
}

// build query URL
SERVER_API.query = function(template, script, exec, inline) {
    var server = 'http://127.0.0.1:14281' + template + '?script=' + encodeURIComponent(JSON.stringify(script));
    if (exec) {
        server += '&exec=' + encodeURIComponent(JSON.stringify(exec));
    }
    if (inline) {
        server += '&inline=' + encodeURIComponent(inline);
    }
    return server;
}

module.exports = SERVER_API;