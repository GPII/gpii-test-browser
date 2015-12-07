"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");

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