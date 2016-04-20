/*

    Test the "wait" function...

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.test.browser.loadTestingSupport();

var waitUrl = gpii.test.browser.resolveFileUrl("%gpii-test-browser/tests/static/html/wait.html");

fluid.defaults("gpii.tests.browser.wait.caseHolder", {
    gradeNames: ["gpii.test.browser.caseHolder.static"],
    rawModules: [{
        name: "Testing `wait` function...",
        tests: [
            {
                name: "Test waiting for dynamic content...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [waitUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, "#waiting", "innerText"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The body should be as expected...", "The table has not yet been set.", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.browser.environment}.browser.wait",
                        args: [500]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onWaitComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, "#waiting", "innerText"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The body should be as expected...", "The table has been set.", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.browser.wait.testEnvironment", {
    gradeNames: ["gpii.test.browser.environment"],
    components: {
        caseHolder: {
            type: "gpii.tests.browser.wait.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.browser.wait.testEnvironment");
