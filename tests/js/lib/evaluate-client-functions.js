"use strict";
var fluid = fluid || require("infusion");
var gpii  = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.tests.browser.tests");
/* globals $, fluid */
/*

    This suite contains functions that are meant to be used in interrogating the browser state using the
    `evaluate` invoker.  These will return the results, which you can tests by listening for the `onEvaluateComplete`
    with a standard `jqUnit` function, as in:

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

    `lookupFunction` is the only function that does not require either `jQuery` or `fluid` on the client side.
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

 Look up an element using the jQuery selector `selector`.  By default, returns the element's HTML for further inspection.

 If `fnName` is supplied (such as "next" or "previous"), the element's named function will be executed.  That
 function is expected to return an object which has an `html` function.  Good examples include the `prev` and `next`
 functions, which you can use to inspect the previous and next element adjacent to a given selector.

 You are only expected to use this with element that exist and which have the named function.  An error will be thrown
 if the element doesn't exist or if any of the required functions cannot be found.

 As with jQuery itself, if there are multiple matches, `fnName` will only be executed against the first match.

 */
gpii.tests.browser.tests.getElementHtml = function (selector, fnName) {
    var element = fnName ? $(selector)[fnName]() : $(selector);
    return element.html();
};

/*

 Use the client-side jQuery to find an element matching `selector`, and (by default) confirm if its HTML content matches `patternString`.

 Note that (as we are working with JSON configuration options), `patternString`is expected to be a string rather than an
 existing RegExp object.

 As with `getElementHtml`, if `fnName` is supplied, the element's named function will be executed and then the match
 will be checked.  That function is expected to return an object which has an `html` function.  Good examples include
 the `prev` and `next` functions, which you can use to inspect the previous and next elements adjacent to a given selector.

 If the element with the given selector does not exist or does not have the named function, an error will be thrown.

 */
gpii.tests.browser.tests.elementMatches = function (selector, patternString, fnName) {
    var element = fnName ? $(selector)[fnName]() : $(selector);
    return Boolean(element.html().match(new RegExp(patternString, "mi")));
};


/*

    A wrapper to allow [jQuery's `val` function](http://api.jquery.com/val/) to be accessed using the `evaluate`
    function.  As with the  underlying jQuery function:

        1.  If `valueOrFn` is omitted, the current value for the first element with selector `selector` will be returned.
        2.  If `valueOrFn` is a non-function, all elements matching `selector` will have their value set to the supplied value.
        3.  When setting values, the updated element(s) will be returned.

    NOTE:
        Unlike jQuery's `val` function, you cannot pass a client-side function and use its return value to set the
        value. See: https://github.com/segmentio/nightmare/issues/89#issuecomment-102769448

 */
gpii.tests.browser.tests.val = function (selector, valueOrFn) {
    return arguments.length > 1 ? $(selector).val(valueOrFn) : $(selector).val();
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
    return fluid.getGlobalValue(path);
};

