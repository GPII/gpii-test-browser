"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");
var url   = require("url");

fluid.registerNamespace("gpii.tests.browser.tests");

/*

    Static functions for use in interrogating the browser component's `evaluate` invoker.  You can set up
    standard assertions such as `jqUnit.assertTrue` as listeners for the `onEvaluateComplete` event fired once
    this function completed, as in:

    ```
    {
        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
        listener: "{gpii.tests.browser.environment}.browser.evaluate",
        args:     [gpii.tests.browser.tests.lookupFunction, "body", "innerText"]
    },
    {
        event:    "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
        listener: "jqUnit.assertEquals",
        args:     ["The body should be as expected...", "foo", "{arguments}.0"]
    }
    ```

 */

gpii.tests.browser.tests.lookupFunction = function (selector, fnName) {
    /* globals document */
    var elements = document.querySelectorAll(selector), results  = [];
    for (var a = 0; a < elements.length; a++) {
        var element = elements[a];
        if (element && element[fnName]) {
            results.push(element[fnName]);
        }
    }
    if (results.length === 0) {
        return undefined;
    }
    else if (results.length === 1) {
        return results[0];
    }
    else {
        return results;
    }
};

/*

    Function that uses Fluid to look up namespaced global variables according to their path.  Your client-side page must
    have Fluid loaded in order to use this.  You would wire this into a test using a sequence like:


     ```
     {
         event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
         listener: "{gpii.tests.browser.environment}.browser.evaluate",
         args:     [gpii.tests.browser.tests.getGlobalValue, "document.title"]
     },
     {
         event:    "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
         listener: "jqUnit.assertEquals",
         args:     ["The title should be as expected...", "Test environment for exercising evaluation functions...", "{arguments}.0"]
     }
     ```

    For more details, check out `browser-fluid-tests.js`.
 */
gpii.tests.browser.tests.getGlobalValue = function (path) {
    /* globals fluid */
    return fluid.getGlobalValue(path);
};

/*
    Resolve File URLs relative to the location this module. `path` should be something like:

    `%gpii-test-browser/tests/static/html/check.html`
*/
gpii.tests.browser.tests.resolveFileUrl = function (path) {
    return url.resolve("file://", fluid.module.resolvePath(path));
};
