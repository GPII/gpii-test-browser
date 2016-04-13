/*

    Test the successful and unsuccessful loading of content using Nightmare.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.test.browser.loadTestingSupport();

var goodUrl = gpii.test.browser.resolveFileUrl("%gpii-test-browser/tests/static/html/second.html");
var badUrl  = gpii.test.browser.resolveFileUrl("%gpii-test-browser/tests/static/html/bogus.html");

fluid.defaults("gpii.tests.browser.load", {
    gradeNames: ["gpii.test.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            {
                name: "Test loading a file that exists...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [goodUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
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
                name: "Test loading a file that does not exist...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [badUrl]
                    },
                    {
                        listener: "jqUnit.assertNotUndefined",
                        event:    "{gpii.test.browser.environment}.browser.events.onError",
                        args:     ["An error should have been thrown...", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.test.browser.environment({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.load"
        }
    }
});
