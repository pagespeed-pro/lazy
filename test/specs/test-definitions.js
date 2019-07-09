/** Async CSS Loader Tests */

const SERVER_API = require('./server-api.js'),
    assert = require('assert');

var TEST_DEFINITIONS = {};

// basic tests
TEST_DEFINITIONS.basic = function() {

    return [
        ['window.$lazy exists', function(driver, done) {
            SERVER_API.reload(driver, false).then(function() {
                driver.executeScript('return typeof $lazy', function(return_value) {
                    return return_value === 'function';
                }).then(function(return_value) {
                    assert.equal(return_value, 'function');
                    done();
                }).catch(function(err) {
                    done(err);
                });
            });
        }],
        ['$lazy() without config (default [data-src] selector)', function(driver, done) {

            SERVER_API.reload(driver, false).then(function() {
                return driver.executeAsyncScript(function() {
                    var cb = arguments[arguments.length - 1];

                    // domready
                    window.requestAnimationFrame(function() {

                        $lazy();

                        function check(pos) {
                            return document.getElementById('img_' + pos).hasAttribute('src') && document.getElementById('img_' + pos).getAttribute('src') && (document.getElementById('img_' + pos).getAttribute('src').indexOf('.png') !== -1)
                        }

                        setTimeout(function() {
                            if (!check('top')) {
                                cb('top img not loaded: ' + document.getElementById('img_top').getAttribute('src') + check('top'));
                            } else if ( check('top') && !check('bottom') ) {
                                window.scrollTo(0,document.body.scrollHeight);

                                setTimeout(function() {
                                    if (check('bottom')) {
                                        cb(true);
                                    } else {
                                        cb('footer img not loaded');
                                    }
                                },100);

                            } else {

                                // footer was loaded while not visible
                                cb('footer img was loaded: ' + document.getElementById('img_bottom').getAttribute('src') + check('bottom'));
                            }
                        });
                    });

                }).then(function(return_value) {

                    if (typeof return_value === 'string') {
                        throw new Error(return_value);
                    }

                    assert.equal(return_value, true);
                    done();
                }).catch(done);

            });

        }],
        ['$lazy() with Node and default observer config', function(driver, done) {

            SERVER_API.reload(driver, false).then(function() {
                return driver.executeAsyncScript(function() {
                    var cb = arguments[arguments.length - 1];

                    // domready
                    window.requestAnimationFrame(function() {
                        window.scrollTo(0,0);

                        var node = document.getElementById('img_bottom');

                        function check(pos) {
                            return document.getElementById('img_' + pos).hasAttribute('src') && document.getElementById('img_' + pos).getAttribute('src') && (document.getElementById('img_' + pos).getAttribute('src').indexOf('.png') !== -1)
                        }

                        $lazy(node);

                        setTimeout(function() {
                            if (check('top')) {
                                cb('top img loaded: ' + document.getElementById('img_top').getAttribute('src') + check('top'));
                            } else if ( !check('bottom') ) {
                                window.scrollTo(0,document.body.scrollHeight);

                                setTimeout(function() {
                                    if (check('bottom')) {
                                        cb(true);
                                    } else {
                                        cb('footer img not loaded');
                                    }
                                },100);

                            } else {

                                // footer was loaded while not visible
                                cb('footer img was loaded: ' + node.getAttribute('src') + check('bottom'));
                            }
                        });
                    });

                }).then(function(return_value) {

                    if (typeof return_value === 'string') {
                        throw new Error(return_value);
                    }

                    assert.equal(return_value, true);
                    done();
                }).catch(done);

            });

        }],
        ['$lazy() with NodeList, multi-config and 100px rootMargin', function(driver, done) {

            SERVER_API.reload(driver, false).then(function() {
                return driver.executeAsyncScript(function() {
                    var cb = arguments[arguments.length - 1];

                    // domready
                    window.requestAnimationFrame(function() {
                        window.scrollTo(0,0);

                        var nodelist = document.querySelectorAll('#img_bottom2,#img_bottom3');
                        var node = document.getElementById('img_bottom4');
                        var selector = '#img_bottom';

                        function check(pos) {
                            return document.getElementById('img_' + pos).hasAttribute('src') && document.getElementById('img_' + pos).getAttribute('src') && (document.getElementById('img_' + pos).getAttribute('src').indexOf('.png') !== -1)
                        }

                        $lazy({
                            selector: nodelist,
                            observer: {
                                threshold: 0,
                                rootMargin:'100px'
                            }
                        });

                        $lazy({
                            selector: node,
                            observer: {
                                threshold: 0,
                                rootMargin:'0px'
                            }
                        });

                        $lazy([selector,0,"100px"]);

                        var documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
                        var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
                        var offset = document.getElementById('footer').offsetTop;
                        var toScroll = Math.round(documentHeight - offset < windowHeight ? documentHeight - windowHeight : offset);

                        setTimeout(function() {
                            if (check('top')) {
                                cb('top img loaded: ' + document.getElementById('img_top').getAttribute('src') + check('top'));
                            } else if ( !check('bottom') ) {
                                window.scrollTo(0,toScroll-250);

                                setTimeout(function() {

                                    if ( check('bottom') || check('bottom2') || check('bottom3') ||check('bottom4')) {
                                        cb('img loaded beyond rootMargin' + toScroll + JSON.stringify([check('bottom2'), check('bottom3'), check('bottom'), check('bottom4')]));
                                    } else {

                                        window.scrollTo(0,toScroll - 100);

                                        setTimeout(function() { 
                                            if ( check('bottom4')) {
                                                cb('footer img was loaded: ' + check('bottom'));
                                                
                                            } else if (check('bottom') && check('bottom2') && check('bottom3')) {

                                                window.scrollTo(0,toScroll);

                                                setTimeout(function() { 
                                                    if ( check('bottom4')) {
                                                        cb(true); 

                                                    } else {

                                                        cb('footer img 4 not loaded');
                                                    }
                                                },100);
                                            } else {
                                                cb('footer img 2,3 not loaded');
                                            }
                                        },100);
                                    }

                                },100);

                            } else {

                                // footer was loaded while not visible
                                cb('footer img was loaded');
                            }
                        });
                    });

                }).then(function(return_value) {

                    if (typeof return_value === 'string') {
                        throw new Error(return_value);
                    }

                    assert.equal(return_value, true);
                    done();
                }).catch(done);

            });

        }]
    ];
};


module.exports = TEST_DEFINITIONS;