/*

    Tests to look for elements using the `exists` function.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.test.browser.loadTestingSupport();

var goodUrl = gpii.test.browser.resolveFileUrl("%gpii-test-browser/tests/static/html/index.html");

fluid.defaults("gpii.tests.browser.exists.caseHolder", {
    gradeNames: ["gpii.test.browser.caseHolder.static"],
    rawModules: [{
        name: "Testing the `exists` function...",
        tests: [
            {
                name: "Test looking for an element that exists...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [goodUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.exists",
                        args:     ["#bar"]
                    },
                    {
                        listener: "jqUnit.assertTrue",
                        event:    "{gpii.test.browser.environment}.browser.events.onExistsComplete",
                        args:     ["The element should be found...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test looking for an element that doesn't exist...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [goodUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.exists",
                        args:     ["#doesNotExist"]
                    },
                    {
                        listener: "jqUnit.assertFalse",
                        event:    "{gpii.test.browser.environment}.browser.events.onExistsComplete",
                        args:     ["The element should not be found...", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});


fluid.defaults("gpii.tests.browser.exists.testEnvironment", {
    gradeNames: ["gpii.test.browser.environment"],
    components: {
        caseHolder: {
            type: "gpii.tests.browser.exists.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.browser.exists.testEnvironment");
