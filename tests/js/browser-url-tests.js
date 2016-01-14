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
gpii.tests.browser.loadTestingSupport();

var goodUrl = gpii.tests.browser.tests.resolveFileUrl("%gpii-test-browser/tests/static/html/index.html");

fluid.defaults("gpii.tests.browser.tests.url", {
    gradeNames: ["gpii.tests.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            {
                name: "Test querying the URL of a sample page...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [goodUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.url"
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onUrlComplete",
                        listener: "{gpii.tests.browser.environment}.browser.goto",
                        args:     ["{arguments}.0"]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.title"
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.tests.browser.environment}.browser.events.onTitleComplete",
                        args:     ["The title of the final destination should be as expected...", "Test environment for exercising Nightmare", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.tests.browser.environment({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.tests.url"
        }
    }
});
