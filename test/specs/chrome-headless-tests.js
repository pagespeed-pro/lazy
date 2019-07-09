/** Async CSS Loader Tests */

var TESTS = [{
    name: 'basic tests',
    tests: [
        'basic'
    ]
}];


const assert = require('assert'),
    webdriver = require('selenium-webdriver'),
    chrome = require("selenium-webdriver/chrome"),
    chromedriver = require("chromedriver"),
    By = webdriver.By,
    until = webdriver.until,
    TEST_DEFINITIONS = require('./test-definitions.js');

// chrome options
const options = new chrome.Options();
options.addArguments("headless");
options.addArguments("no-sandbox");
options.addArguments("disable-dev-shm-usage");

// build chrome driver
var buildDriver = function(caps) {
    return new webdriver.Builder()
        .forBrowser("chrome")
        .setChromeOptions(options)
        .build();
};

var iife_files = [];

describe('Manual tests', function() {
    var driver;

    // setup driver
    before(function(done) {

        // create driver
        driver = buildDriver();
        done();
    });

    // setup tests
    TESTS.forEach(function(test) {

        describe('Test: ' + test.name, function() {

            this.timeout(0);

            // generate IIFE
            before(function(done) {
                done();
            });

            // setup tests
            test.tests.forEach(function(testname) {
                TEST_DEFINITIONS[testname]().forEach(function(definition) {
                    it(definition[0], function(done) {
                        definition[1](driver, done);
                    });
                })
            });
        });
    });

    after(function(done) {
        driver.quit().then(function() {
            done();
        });

    });
});
