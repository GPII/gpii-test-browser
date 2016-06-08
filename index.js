/*

    The wrapper file that is called by `require("gpii-test-browser").  Provides a `loadTestingSupport` function to
    optionally load testing support.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.module.register("gpii-test-browser", __dirname, require);

require("./src/js/nightmare");
require("./src/js/eventRelay");

fluid.registerNamespace("gpii.test.browser");

gpii.test.browser.loadTestingSupport = function () {
    require("./tests/js/lib/fixtures");
    require("./tests/js/lib/resolve-file-url");
    require("./tests/js/lib/evaluate-client-functions");
};

module.exports = gpii.test.browser;
