/*

    Test the scrolling functions.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.test.browser.loadTestingSupport();

var scrollPage = gpii.test.browser.resolveFileUrl("%gpii-test-browser/tests/static/html/scroll.html");

fluid.registerNamespace("gpii.tests.browser.scroll");
gpii.tests.browser.scroll.getWindowOffset = function () {
    /* globals window */
    return [window.pageXOffset, window.pageYOffset];
};

fluid.defaults("gpii.tests.browser.scroll.caseHolder", {
    gradeNames: ["gpii.test.browser.caseHolder.static"],
    rawModules: [{
        name: "Testing `scrollTo` function...",
        tests: [
            {
                name: "Test scrolling once...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [scrollPage]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.scrollTo",
                        args:     [ 50, 50 ]
                    },

                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onScrollToComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.scroll.getWindowOffset]
                    },
                    {
                        listener: "jqUnit.assertDeepEq",
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The offset should be as expected...", [ 50, 50 ], "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test scrolling down and up...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [scrollPage]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.scrollTo",
                        args:     [ 50, 50 ]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onScrollToComplete",
                        listener: "{gpii.test.browser.environment}.browser.scrollTo",
                        args:     [ 0, 0 ]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onScrollToComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.scroll.getWindowOffset]
                    },
                    {
                        listener: "jqUnit.assertDeepEq",
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The offset should be as expected...", [ 0, 0 ], "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.browser.scroll.testEnvironment", {
    gradeNames: ["gpii.test.browser.environment"],
    components: {
        caseHolder: {
            type: "gpii.tests.browser.scroll.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.browser.scroll.testEnvironment");