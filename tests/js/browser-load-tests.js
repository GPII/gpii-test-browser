/*

    Test the successful and unsuccessful loading of content using Nightmare.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.tests.browser.loadTestingSupport();

var url     = require("url");
var goodUrl = url.resolve(url.resolve("file://", __dirname), "./static/html/second.html");
var badUrl  = url.resolve(url.resolve("file://", __dirname), "./static/html/bogus.html");

fluid.defaults("gpii.tests.browser.tests.load", {
    gradeNames: ["gpii.tests.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            {
                name: "Test loading a file that exists...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [goodUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
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
                name: "Test loading a file that does not exist...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [badUrl]
                    },
                    {
                        listener: "jqUnit.assertNotUndefined",
                        event:    "{gpii.tests.browser.environment}.browser.events.onError",
                        args:     ["An error should have been thrown...", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.tests.browser.environment({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.tests.load"
        }
    }
});
