/*

  Test clicking on various page elements.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.tests.browser.loadTestingSupport();

var url      = require("url");
var startUrl = url.resolve(url.resolve("file://", __dirname), "./static/html/click.html");

fluid.defaults("gpii.tests.browser.tests.click", {
    gradeNames: ["gpii.tests.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            {
                name: "Test clicking a selector that doesn't exist...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [startUrl]
                    },
                    {
                        listener: "{gpii.tests.browser.environment}.browser.click",
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        args:     [".bogus"]
                    },
                    {
                        listener: "jqUnit.assertNotUndefined",
                        event:    "{gpii.tests.browser.environment}.browser.events.onError",
                        args:     ["An error should have been thrown...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test clicking a submit button...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [startUrl]
                    },
                    {
                        listener: "{gpii.tests.browser.environment}.browser.click",
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        args:     ["input[type='submit']"]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, "body", "innerText"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The body should be as expected...", "This is the second page.", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test clicking a link...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [startUrl]
                    },
                    {
                        listener: "{gpii.tests.browser.environment}.browser.click",
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        args:     ["a"]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, "body", "innerText"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The body should be as expected...", "This is the second page.", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test clicking a span...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [startUrl]
                    },
                    {
                        listener: "{gpii.tests.browser.environment}.browser.click",
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        args:     [".clickableSpan"]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onLoaded",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, "body", "innerText"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The body should be as expected...", "This is the second page.", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.tests.browser.environment({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.tests.click"
        }
    }
});
