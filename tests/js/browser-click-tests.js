/*

  Test clicking on various page elements.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.test.browser.loadTestingSupport();

var startUrl = gpii.test.browser.resolveFileUrl("%gpii-test-browser/tests/static/html/click.html");

fluid.defaults("gpii.tests.browser.click", {
    gradeNames: ["gpii.test.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            {
                name: "Test clicking a selector that doesn't exist...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [startUrl]
                    },
                    {
                        listener: "{gpii.test.browser.environment}.browser.click",
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        args:     [".bogus"]
                    },
                    {
                        listener: "jqUnit.assertNotUndefined",
                        event:    "{gpii.test.browser.environment}.browser.events.onError",
                        args:     ["An error should have been thrown...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test clicking a submit button...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [startUrl]
                    },
                    {
                        listener: "{gpii.test.browser.environment}.browser.click",
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        args:     ["input[type='submit']"]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, "body", "innerText"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The body should be as expected...", "This is the second page.", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test clicking a link...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [startUrl]
                    },
                    {
                        listener: "{gpii.test.browser.environment}.browser.click",
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        args:     ["a"]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, "body", "innerText"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The body should be as expected...", "This is the second page.", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test clicking a span...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [startUrl]
                    },
                    {
                        listener: "{gpii.test.browser.environment}.browser.click",
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        args:     [".clickableSpan"]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, "body", "innerText"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The body should be as expected...", "This is the second page.", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.test.browser.environment({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.click"
        }
    }
});
