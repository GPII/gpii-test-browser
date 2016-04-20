/*

    Test retrieving the page URL using the `url` function.  Because `url.resolve` works oddly on Windows, we cannot
    simply stuff in a simple `file://` URL and then compare that to the result.

    Instead, we "round trip" the URL by stuffing it in, reading it, and visiting the returned value.  Even though the
    value is slightly different, we end up on the same page.

    Another way to test this would be to access a URL served over http.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.test.browser.loadTestingSupport();

var goodUrl = gpii.test.browser.resolveFileUrl("%gpii-test-browser/tests/static/html/index.html");

fluid.defaults("gpii.tests.browser.url.caseHolder", {
    gradeNames: ["gpii.test.browser.caseHolder.static"],
    rawModules: [{
        name: "Testing `url` function...",
        tests: [
            {
                name: "Test querying the URL of a sample page...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [goodUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.url"
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onUrlComplete",
                        listener: "{gpii.test.browser.environment}.browser.goto",
                        args:     ["{arguments}.0"]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.title"
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.test.browser.environment}.browser.events.onTitleComplete",
                        args:     ["The title of the final destination should be as expected...", "Test environment for exercising Nightmare", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.browser.url.testEnvironment", {
    gradeNames: ["gpii.test.browser.environment"],
    components: {
        caseHolder: {
            type: "gpii.tests.browser.url.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.browser.url.testEnvironment");