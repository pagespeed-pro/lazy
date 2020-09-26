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
                            } else if (check('top') && !check('bottom')) {
                                window.scrollTo(0, document.body.scrollHeight);

                                setTimeout(function() {
                                    if (check('bottom')) {
                                        cb(true);
                                    } else {
                                        cb('footer img not loaded');
                                    }
                                }, 100);

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
                        window.scrollTo(0, 0);

                        var node = document.getElementById('img_bottom');

                        function check(pos) {
                            return document.getElementById('img_' + pos).hasAttribute('src') && document.getElementById('img_' + pos).getAttribute('src') && (document.getElementById('img_' + pos).getAttribute('src').indexOf('.png') !== -1)
                        }

                        $lazy(node);

                        setTimeout(function() {
                            if (check('top')) {
                                cb('top img loaded: ' + document.getElementById('img_top').getAttribute('src') + check('top'));
                            } else if (!check('bottom')) {
                                window.scrollTo(0, document.body.scrollHeight);

                                setTimeout(function() {
                                    if (check('bottom')) {
                                        cb(true);
                                    } else {
                                        cb('footer img not loaded');
                                    }
                                }, 100);

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
                        window.scrollTo(0, 0);

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
                                rootMargin: '100px'
                            }
                        });

                        $lazy({
                            selector: node,
                            observer: {
                                threshold: [0, 1],
                                rootMargin: '0px'
                            }
                        });

                        $lazy([selector, 0, "100px"]);

                        var documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
                        var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
                        var offset = document.getElementById('footer').offsetTop;
                        var toScroll = Math.round(documentHeight - offset < windowHeight ? documentHeight - windowHeight : offset);

                        setTimeout(function() {
                            if (check('top')) {
                                cb('top img loaded: ' + document.getElementById('img_top').getAttribute('src') + check('top'));
                            } else if (!check('bottom')) {
                                window.scrollTo(0, toScroll - 250);

                                setTimeout(function() {

                                    if (check('bottom') || check('bottom2') || check('bottom3') || check('bottom4')) {
                                        cb('img loaded beyond rootMargin' + toScroll + JSON.stringify([check('bottom2'), check('bottom3'), check('bottom'), check('bottom4')]));
                                    } else {

                                        window.scrollTo(0, toScroll - 100);

                                        setTimeout(function() {
                                            if (check('bottom4')) {
                                                cb('footer img was loaded: ' + check('bottom'));

                                            } else if (check('bottom') && check('bottom2') && check('bottom3')) {

                                                node.scrollIntoView();

                                                setTimeout(function() {
                                                    if (check('bottom4')) {
                                                        cb(true);

                                                    } else {

                                                        cb('footer img 4 not loaded: ' + document.getElementById('img_bottom4').src);
                                                    }
                                                }, 100);
                                            } else {
                                                cb('footer img 2,3 not loaded');
                                            }
                                        }, 100);
                                    }

                                }, 100);

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

        }],
        ['$lazy() using lazy-tiny.js', function(driver, done) {

            SERVER_API.reload(driver, {
                src: '/lazy-tiny.js'
            }).then(function() {
                return driver.executeAsyncScript(function() {
                    var cb = arguments[arguments.length - 1];


                    // domready
                    window.requestAnimationFrame(function() {
                        window.scrollTo(0, 0);

                        $z(); // tiny

                        function check(pos) {
                            return document.getElementById('img_' + pos).hasAttribute('src') && document.getElementById('img_' + pos).getAttribute('src') && (document.getElementById('img_' + pos).getAttribute('src').indexOf('.png') !== -1)
                        }

                        setTimeout(function() {
                            if (!check('top')) {
                                cb('top img not loaded: ' + document.getElementById('img_top').getAttribute('src') + check('top'));
                            } else if (check('top') && !check('bottom')) {
                                window.scrollTo(0, document.body.scrollHeight);

                                setTimeout(function() {
                                    if (check('bottom')) {
                                        cb(true);
                                    } else {
                                        cb('footer img not loaded');
                                    }
                                }, 100);

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

                    SERVER_API.reload(driver, {
                        src: '/lazy-tiny.js'
                    }).then(function() {
                        return driver.executeAsyncScript(function() {
                            var cb = arguments[arguments.length - 1];

                            // domready
                            window.requestAnimationFrame(function() {
                                window.scrollTo(0, 0);

                                // should fail (Node not supported in minimum)
                                var failed;
                                try {
                                    $lazy([document.getElementById('img_bottom')]);
                                } catch (e) {
                                    failed = true;
                                }
                                if (!failed) {
                                    return cb('$lazy did not fail with Node input')
                                }

                                function check(pos) {
                                    return document.getElementById('img_' + pos).hasAttribute('src') && document.getElementById('img_' + pos).getAttribute('src') && (document.getElementById('img_' + pos).getAttribute('src').indexOf('.png') !== -1)
                                }

                                setTimeout(function() {
                                    if (check('top')) {
                                        cb('top img loaded ');
                                    } else if (!check('bottom')) {
                                        window.scrollTo(0, document.body.scrollHeight);

                                        setTimeout(function() {
                                            if (!check('bottom')) {
                                                cb(true);
                                            } else {
                                                cb('footer img was loaded');
                                            }
                                        }, 100);

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

                        });
                    });



                }).catch(done);

            });

        }],
        ['$lazy() with custom inview callback', function(driver, done) {

            SERVER_API.reload(driver, false).then(function() {
                return driver.executeAsyncScript(function() {
                    var cb = arguments[arguments.length - 1];

                    // domready
                    window.requestAnimationFrame(function() {
                        window.scrollTo(0, 0);

                        var nodelist = document.querySelectorAll('#img_bottom2,#img_bottom3');

                        function check(pos) {
                            return document.getElementById('img_' + pos).hasAttribute('src') && document.getElementById('img_' + pos).getAttribute('src') && (document.getElementById('img_' + pos).getAttribute('src').indexOf('.png') !== -1)
                        }

                        var inview_count = 0;

                        $lazy(nodelist, function(target, observer, inview) {
                            if (inview) {
                                inview_count++;
                            }
                        });

                        var documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
                        var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
                        var offset = document.getElementById('footer').offsetTop;
                        var toScroll = Math.round(documentHeight - offset < windowHeight ? documentHeight - windowHeight : offset);

                        setTimeout(function() {
                            if (check('top')) {
                                cb('top img loaded: ' + document.getElementById('img_top').getAttribute('src') + check('top'));
                            } else {
                                window.scrollTo(0, toScroll);

                                setTimeout(function() {

                                    if (inview_count === 2) {
                                        cb(true);
                                    } else {
                                        cb('inview_count: ' + inview_count);
                                    }

                                }, 100);

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
        ['$lazy() with custom inview + out-of-view callback', function(driver, done) {

            SERVER_API.reload(driver, false).then(function() {
                return driver.executeAsyncScript(function() {
                    var cb = arguments[arguments.length - 1];

                    // domready
                    window.requestAnimationFrame(function() {
                        window.scrollTo(0, 0);

                        var nodelist = document.querySelectorAll('#img_bottom2,#img_bottom3');

                        function check(pos) {
                            return document.getElementById('img_' + pos).hasAttribute('src') && document.getElementById('img_' + pos).getAttribute('src') && (document.getElementById('img_' + pos).getAttribute('src').indexOf('.png') !== -1)
                        }

                        var inview_count = 0,
                            outofview_count = 0;

                        $lazy(nodelist, [function(target, observer, inview) {
                            if (inview) {
                                inview_count++;
                            } else {
                                outofview_count++;
                            }
                            return false;
                        }]);

                        var documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
                        var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
                        var offset = document.getElementById('footer').offsetTop;
                        var toScroll = Math.round(documentHeight - offset < windowHeight ? documentHeight - windowHeight : offset);

                        setTimeout(function() {
                            if (check('top')) {
                                cb('top img loaded: ' + document.getElementById('img_top').getAttribute('src') + check('top'));
                            } else {
                                window.scrollTo(0, toScroll);

                                setTimeout(function() {

                                    if (outofview_count === 2 && inview_count === 2) {
                                        window.scrollTo(0, 0);
                                        setTimeout(function() {

                                            if (outofview_count === 4) {
                                                cb(true);
                                            } else {
                                                cb('outofview_count: ' + outofview_count);
                                            }
                                        }, 100);

                                    } else {
                                        cb('inview_count: ' + inview_count + ', outofview_count: ' + outofview_count);
                                    }

                                }, 100);

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
        ['$lazy() with custom after-inview hook callback', function(driver, done) {

            SERVER_API.reload(driver, false).then(function() {
                return driver.executeAsyncScript(function() {
                    var cb = arguments[arguments.length - 1];

                    // domready
                    window.requestAnimationFrame(function() {
                        window.scrollTo(0, 0);

                        var nodelist = document.querySelectorAll('#img_bottom2,#img_bottom3');

                        function check(pos) {
                            return document.getElementById('img_' + pos).hasAttribute('src') && document.getElementById('img_' + pos).getAttribute('src') && (document.getElementById('img_' + pos).getAttribute('src').indexOf('.png') !== -1)
                        }

                        var after_inview_count = 0;

                        $lazy(nodelist, [, , function(target) {
                            after_inview_count++;
                        }]);

                        var documentHeight = Math.max(document.body.scrollHeight, document.body.offsetHeight, document.documentElement.clientHeight, document.documentElement.scrollHeight, document.documentElement.offsetHeight);
                        var windowHeight = window.innerHeight || document.documentElement.clientHeight || document.getElementsByTagName('body')[0].clientHeight;
                        var offset = document.getElementById('footer').offsetTop;
                        var toScroll = Math.round(documentHeight - offset < windowHeight ? documentHeight - windowHeight : offset);

                        setTimeout(function() {
                            if (check('top')) {
                                cb('top img loaded: ' + document.getElementById('img_top').getAttribute('src') + check('top'));
                            } else {
                                window.scrollTo(0, toScroll);

                                setTimeout(function() {

                                    if (after_inview_count === 2) {
                                        cb(true);
                                    } else {
                                        cb('after_inview_count: ' + after_inview_count);
                                    }

                                }, 100);

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
        ['$lazy() with .webp rewrite', function(driver, done) {

            SERVER_API.reload(driver, {
                src: '/lazy+webp.js'
            }).then(function() {
                return driver.executeAsyncScript(function() {
                    var cb = arguments[arguments.length - 1];

                    // domready
                    window.requestAnimationFrame(function() {
                        window.scrollTo(0, 0);

                        $lazy();

                        function check(pos, type) {
                            if (!type) {
                                type = '.webp';
                            }
                            return document.getElementById('img_' + pos).hasAttribute('src') && document.getElementById('img_' + pos).getAttribute('src')
                                // check for .webp
                                &&
                                (document.getElementById('img_' + pos).getAttribute('src').indexOf(type) !== -1)
                        }

                        setTimeout(function() {

                            if (!check('top')) {
                                cb('top img not loaded: ' + document.getElementById('img_top').getAttribute('src') + check('top'));
                            } else if (check('top') && !check('bottom')) {
                                window.scrollTo(0, document.body.scrollHeight);

                                setTimeout(function() {

                                    // test error fallback on bottom5 (test2.jpg = 404)
                                    if (check('bottom') && check('bottom5', '.jpg')) {
                                        cb(true);
                                    } else {
                                        cb('footer img not loaded ' + document.getElementById('img_bottom').getAttribute('src') + ' 5:' + document.getElementById('img_bottom5').getAttribute('src'));
                                    }
                                }, 100);

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
        ['$lazy() with .webp 404 error fallback', function(driver, done) {

            SERVER_API.reload(driver, {
                src: '/lazy+webp.js'
            }).then(function() {
                return driver.executeAsyncScript(function() {
                    var cb = arguments[arguments.length - 1];

                    // domready
                    window.requestAnimationFrame(function() {
                        window.scrollTo(0, 0);

                        $lazy();

                        function check(pos, type) {
                            if (!type) {
                                type = '.webp';
                            }
                            return document.getElementById('img_' + pos).hasAttribute('src') && document.getElementById('img_' + pos).getAttribute('src')
                                // check for .webp
                                &&
                                (document.getElementById('img_' + pos).getAttribute('src').indexOf(type) !== -1)
                        }

                        setTimeout(function() {

                            if (!check('no_webp', '.png')) {
                                cb('top img not loaded: ' + document.getElementById('img_no_webp').getAttribute('src') + check('no_webp'));
                            } else {
                                cb(true);
                            }
                        }, 100);
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
        ['$lazy() with responsive background image rewrite', function(driver, done) {

            SERVER_API.reload(driver, {
                src: '/lazy+webp+data-attr+bg.js'
            }, false, false, 'bg.html').then(function() {
                return driver.executeAsyncScript(function() {
                    var cb = arguments[arguments.length - 1];

                    // domready
                    window.requestAnimationFrame(function() {
                        window.scrollTo(0, 0);

                        $lazy(["zb", "/i/"]);

                        $lazy(["z", "/i/"]);

                        function check(pos, type) {
                            if (!type) {
                                type = '.webp';
                            }
                            return document.getElementById('img_' + pos).hasAttribute('src') && document.getElementById('img_' + pos).getAttribute('src')
                                // check for .webp
                                &&
                                (document.getElementById('img_' + pos).getAttribute('src').indexOf(type) !== -1)
                        }

                        function checkbg(pos, type) {
                            if (!type) {
                                type = '.webp';
                            }
                            var bg = document.getElementById('bg_' + pos).style.backgroundImage;
                            return bg
                                // check for .webp
                                &&
                                (bg.indexOf(type) !== -1)
                        }

                        setTimeout(function() {

                            if (!check('top')) {
                                cb('top img not loaded: ' + document.getElementById('img_top').getAttribute('src') + check('top'));
                            } else if (!checkbg('top')) {
                                cb('top bg not loaded: ' + document.getElementById('bg_top').style.backgroundImage + checkbg('top'));
                            } else if (check('top') && !check('bottom')) {
                                window.scrollTo(0, document.body.scrollHeight);

                                setTimeout(function() {

                                    // test error fallback on bottom5 (test2.jpg = 404)
                                    if (check('bottom') && check('bottom5', '.jpg') && checkbg('bottom')) {
                                        cb(true);
                                    } else {
                                        cb('footer img not loaded ' + document.getElementById('img_bottom').getAttribute('src') + ' 5:' + document.getElementById('img_bottom5').getAttribute('src'));
                                    }
                                }, 100);

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
        ['$lazy() with events fallback', function(driver, done) {

            SERVER_API.reload(driver, {
                src: '/lazy+webp+data-attr+polyfill+events.js'
            }).then(function() {
                return driver.executeAsyncScript(function() {
                    var cb = arguments[arguments.length - 1];

                    // domready
                    window.requestAnimationFrame(function() {
                        window.scrollTo(0, 0);

                        $lazy();

                        function check(pos, type) {
                            if (!type) {
                                type = '.webp';
                            }
                            return document.getElementById('img_' + pos).hasAttribute('src') && document.getElementById('img_' + pos).getAttribute('src')
                                // check for .webp
                                &&
                                (document.getElementById('img_' + pos).getAttribute('src').indexOf(type) !== -1)
                        }

                        setTimeout(function() {

                            if (!check('top')) {
                                cb('top img not loaded: ' + document.getElementById('img_top').getAttribute('src') + check('top'));
                            } else if (!check('bottom')) {

                                // send click event
                                var bottom = document.getElementById('img_bottom');
                                var evt = new MouseEvent('click', {
                                    bubbles: false,
                                    cancelable: true,
                                    view: window
                                });
                                // If cancelled, don't dispatch our event
                                bottom.dispatchEvent(evt);

                                setTimeout(function() {

                                    // test error fallback on bottom5 (test2.jpg = 404)
                                    if (check('bottom')) {
                                        cb(true);
                                    } else {
                                        cb('footer img not loaded ' + document.getElementById('img_bottom').getAttribute('src') + ' 5:' + document.getElementById('img_bottom5').getAttribute('src'));
                                    }
                                }, 100);

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
        ['$lazybg() background images in stylesheets', function(driver, done) {

            SERVER_API.reload(driver, {
                    src: '/lazy+webp.js',
                    lazybg: true
                }, 0, '<style>' +
                ':root {--z--test: url(\'test.png?test\');}' +
                ' footer { background-image: var(--z-test, none); }' +
                ' footer h1 {' +
                ' background-image: url(\'test.png?fallback\');' +
                ' background-image: var(--z-dXJsKCcvdGVzdC5wbmc—YmFzZTY0Jyk•, none);' // "/" = —, "=" = • (DOMString)
                +
                '}' +
                ' footer h2 { background-image: var(--z-custom, none); }' +
                ' footer h3 { background-image: var(--z-custom_js, none); }' +
                '</style>').then(function() {
                return driver.executeAsyncScript(function() {
                    var cb = arguments[arguments.length - 1];

                    // domready
                    window.requestAnimationFrame(function() {
                        window.scrollTo(0, 0);

                        $lazybg();

                        setTimeout(function() {

                            var top_img = getComputedStyle(document.querySelector('footer')).backgroundImage;
                            var div_img = getComputedStyle(document.querySelector('footer h1')).backgroundImage;

                            if (top_img !== 'none' || div_img !== 'none') {
                                // already resolved while out of view
                                cb('background images already resolved:' + top_img + ' / ' + div_img);
                            } else {

                                window.scrollTo(0, document.body.scrollHeight);

                                setTimeout(function() {

                                    top_img = getComputedStyle(document.querySelector('footer')).backgroundImage;
                                    div_img = getComputedStyle(document.querySelector('footer h1')).backgroundImage;

                                    if (top_img.indexOf('test.png?test') !== -1 && div_img.indexOf('test.png?base64') !== -1) {
                                        cb(true);
                                    } else {
                                        cb('background images not resolved:' + top_img + ' / ' + div_img);
                                    }
                                }, 100);
                            }
                        }, 100);
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
        ['$lazybg() background images in stylesheets, JSON resolver and <style> element target', function(driver, done) {

            SERVER_API.reload(driver, {
                    src: '/lazy+webp.js',
                    lazybg: true
                }, 0, '<style>' +
                ':root {--z--test: url(\'test.png?test\');}' +
                ' footer { background-image: var(--z-test, none); }' +
                ' footer h1 {' +
                ' background-image: url(\'test.png?fallback\');' +
                ' background-image: var(--z-dXJsKCcvdGVzdC5wbmc—YmFzZTY0Jyk•, none);' // "/" = —, "=" = • (DOMString)
                +
                '}' +
                ' footer h2 { background-image: var(--z-custom, none); }' +
                ' footer h3 { background-image: var(--z-custom_js, none); }' +
                '</style>').then(function() {
                return driver.executeAsyncScript(function() {
                    var cb = arguments[arguments.length - 1];

                    // domready
                    window.requestAnimationFrame(function() {
                        window.scrollTo(0, 0);

                        $lazybg(document.querySelector('style'), {
                            observer: {
                                threshold: [0, 1],
                                rootMargin: '100px'
                            }
                        }, {
                            "custom": "url('test.png?custom')"
                        });

                        setTimeout(function() {

                            var top_img = getComputedStyle(document.querySelector('footer')).backgroundImage;
                            var div_img = getComputedStyle(document.querySelector('footer h1')).backgroundImage;
                            var footer_img = getComputedStyle(document.querySelector('footer h2')).backgroundImage;

                            if (top_img !== 'none' || div_img !== 'none' || footer_img !== 'none') {

                                // already resolved while out of view
                                cb('background images already resolved:' + top_img + ' / ' + div_img);
                            } else {

                                window.scrollTo(0, document.body.scrollHeight);

                                setTimeout(function() {

                                    footer_img = getComputedStyle(document.querySelector('footer h2')).backgroundImage;

                                    if (footer_img.indexOf('test.png?custom') !== -1) {
                                        cb(true);
                                    } else {
                                        cb('footer background image not resolved:' + footer_img);
                                    }

                                }, 100);


                            }
                        }, 100);
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
        ['$lazybg() background images in stylesheets, javascript resolver and NodeList target', function(driver, done) {

            SERVER_API.reload(driver, {
                    src: '/lazy+webp.js',
                    lazybg: true
                }, 0, '<style>' +
                ':root {--z--test: url(\'test.png?test\');}' +
                ' footer { background-image: var(--z-test, none); }' +
                ' footer h1 {' +
                ' background-image: url(\'test.png?fallback\');' +
                ' background-image: var(--z-dXJsKCcvdGVzdC5wbmc—YmFzZTY0Jyk•, none);' // "/" = —, "=" = • (DOMString)
                +
                '}' +
                ' footer h2 { background-image: var(--z-custom, none); }' +
                ' footer h3 { background-image: var(--z-custom_js, none); }' +
                '</style>').then(function() {
                return driver.executeAsyncScript(function() {
                    var cb = arguments[arguments.length - 1];

                    // domready
                    window.requestAnimationFrame(function() {
                        window.scrollTo(0, 0);

                        $lazybg(document.querySelectorAll('style'), {
                            observer: {
                                threshold: [0, 1],
                                rootMargin: '100px'
                            }
                        }, function(key) {
                            return "url('test.png?" + key + "')";
                        });

                        setTimeout(function() {

                            var top_img = getComputedStyle(document.querySelector('footer')).backgroundImage;
                            var div_img = getComputedStyle(document.querySelector('footer h1')).backgroundImage;
                            var footer_img = getComputedStyle(document.querySelector('footer h3')).backgroundImage;

                            if (top_img !== 'none' || div_img !== 'none' || footer_img !== 'none') {

                                // already resolved while out of view
                                cb('background images already resolved:' + top_img + ' / ' + div_img);
                            } else {

                                window.scrollTo(0, document.body.scrollHeight);

                                setTimeout(function() {

                                    footer_img = getComputedStyle(document.querySelector('footer h3')).backgroundImage;

                                    if (footer_img.indexOf('test.png?custom_js') !== -1) {
                                        cb(true);
                                    } else {
                                        cb('footer background image not resolved:' + footer_img);
                                    }

                                }, 100);


                            }
                        }, 100);
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
        ['$lazybg() background images in stylesheets with WebP rewrite', function(driver, done) {

            SERVER_API.reload(driver, {
                    src: '/lazy+webp.js',
                    lazybg_webp: true
                }, 0, '<style>' +
                ':root {--z--test: url(\'test.png?test\');}' +
                ' footer { background-image: var(--z-test, none); }' +
                ' footer h1 {' +
                ' background-image: url(\'test.png?fallback\');' +
                ' background-image: var(--z-dXJsKCcvdGVzdC5wbmc—YmFzZTY0Jyk•, none);' // "/" = —, "=" = • (DOMString)
                +
                '}' +
                ' footer h2 { background-image: var(--z-custom, none); }' +
                ' footer h3 { background-image: var(--z-custom_js, none); }' +
                '</style>').then(function() {
                return driver.executeAsyncScript(function() {
                    var cb = arguments[arguments.length - 1];

                    // domready
                    window.requestAnimationFrame(function() {
                        window.scrollTo(0, 0);

                        $lazybg();

                        setTimeout(function() {

                            var top_img = getComputedStyle(document.querySelector('footer')).backgroundImage;
                            var div_img = getComputedStyle(document.querySelector('footer h1')).backgroundImage;

                            if (top_img !== 'none' || div_img !== 'none') {
                                // already resolved while out of view
                                cb('background images already resolved:' + top_img + ' / ' + div_img);
                            } else {

                                window.scrollTo(0, document.body.scrollHeight);

                                setTimeout(function() {

                                    top_img = getComputedStyle(document.querySelector('footer')).backgroundImage;
                                    div_img = getComputedStyle(document.querySelector('footer h1')).backgroundImage;

                                    if (top_img.indexOf('test.webp?test') !== -1 && div_img.indexOf('test.webp?base64') !== -1) {
                                        cb(true);
                                    } else {
                                        cb('background images not resolved:' + top_img + ' / ' + div_img);
                                    }
                                }, 100);
                            }
                        }, 100);
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