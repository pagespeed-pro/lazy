/** Async CSS Loader Tests */

var SERVER_API = {};

const assert = require('assert');

// load / reload page
SERVER_API.validation = function(fn) {
    return 'return (' + fn.toString() + ')()';
}

// load / reload page
SERVER_API.reload = function(driver, script, exec) {

    return driver.get(SERVER_API.query('/', script, exec));
}

// build query URL
SERVER_API.query = function(template, script, exec) {
    var server = 'http://127.0.0.1:14281' + template + '?iife=' + encodeURIComponent(JSON.stringify(script));
    if (exec) {
        server += '&exec=' + encodeURIComponent(JSON.stringify(exec));
    }
    return server;
}

module.exports = SERVER_API;