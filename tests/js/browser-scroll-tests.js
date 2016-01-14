/*

    Test the scrolling functions.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.tests.browser.loadTestingSupport();

var scrollPage = gpii.tests.browser.tests.resolveFileUrl("%gpii-test-browser/tests/static/html/scroll.html");

fluid.registerNamespace("gpii.tests.browser.tests.scroll");
gpii.tests.browser.tests.scroll.getWindowOffset = function () {
    /* globals window */
    return [window.pageXOffset, window.pageYOffset];
};

fluid.defaults("gpii.tests.browser.tests.scroll", {
    gradeNames: ["gpii.tests.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            {
                name: "Test scrolling once...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [scrollPage]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.scrollTo",
                        args:     [ 50, 50 ]
                    },

                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onScrollToComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.scroll.getWindowOffset]
                    },
                    {
                        listener: "jqUnit.assertDeepEq",
                        event:    "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The offset should be as expected...", [ 50, 50 ], "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test scrolling down and up...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [scrollPage]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.scrollTo",
                        args:     [ 50, 50 ]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onScrollToComplete",
                        listener: "{gpii.tests.browser.environment}.browser.scrollTo",
                        args:     [ 0, 0 ]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onScrollToComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.scroll.getWindowOffset]
                    },
                    {
                        listener: "jqUnit.assertDeepEq",
                        event:    "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The offset should be as expected...", [ 0, 0 ], "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.tests.browser.environment({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.tests.scroll"
        }
    }
});
