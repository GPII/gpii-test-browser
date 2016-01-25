/*

    The wrapper file that is called by `require("gpii-test-browser").  Provides a `loadTestingSupport` function to
    optionally load testing support.

 */
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.module.register("gpii-test-browser", __dirname, require);

require("./src/js/index");

module.exports = gpii.tests.browser;