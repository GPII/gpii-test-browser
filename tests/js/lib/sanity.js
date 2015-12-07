"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

var jqUnit = require("node-jqunit");

fluid.registerNamespace("gpii.tests.browser.tests");

/*

    Static functions for use in interrogating the browser component's `evaluate` invoker.  You can set up
    standard assertions such as `jqUnit.assertTrue` as listeners for the `onEvaluateComplete` event fired once
    this function completed, as in:

    ```
    {
        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
        listener: "{gpii.tests.browser.environment}.browser.evaluate",
        args:     [gpii.tests.browser.tests.textLookupFunction, "body"]
    },
    {
        event:    "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
        listener: "jqUnit.assertEquals",
        args:     ["The body should be as expected...", "foo", "{arguments}.0"]
    }
    ```

 */

gpii.tests.browser.tests.textLookupFunction = function (selector) {
    var element = document.querySelector(selector);
    return element && element.innerText ? element.innerText : undefined;
};

gpii.tests.browser.tests.htmlLookupFunction = function (selector) {
    var element = document.querySelector(selector);
    return element && element.innerHTML ? element.innerHTML : undefined;
};

gpii.tests.browser.tests.valueLookupFunction = function (selector) {
    var element = document.querySelector(selector);
    return element && element.value ? element.value : undefined;
};

/*

  Static function to handle (expected) errors.

 */
gpii.tests.browser.tests.hasError = function (error) {
    jqUnit.assertNotUndefined("There should have been an error...", error);
};