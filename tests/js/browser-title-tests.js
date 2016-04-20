/*

    Test retrieving the page title using the `title` function.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.test.browser.loadTestingSupport();

var goodUrl = gpii.test.browser.resolveFileUrl("%gpii-test-browser/tests/static/html/index.html");

fluid.defaults("gpii.tests.browser.title.caseHolder", {
    gradeNames: ["gpii.test.browser.caseHolder.static"],
    rawModules: [{
        name: "Testing `title` function...",
        tests: [
            {
                name: "Test querying the title of a sample page...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [goodUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.title"
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.test.browser.environment}.browser.events.onTitleComplete",
                        args:     ["The title should be as expected...", "Test environment for exercising Nightmare", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.browser.title.testEnvironment", {
    gradeNames: ["gpii.test.browser.environment"],
    components: {
        caseHolder: {
            type: "gpii.tests.browser.title.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.browser.title.testEnvironment");