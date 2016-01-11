/*

    The wrapper file that is called by `require("gpii-test-browser").  Provides a `loadTestingSupport` function to
    optionally load testing support.

 */
var fluid = require("infusion");
fluid.module.register("gpii-test-browser", __dirname, require);

require("./src/js/index");