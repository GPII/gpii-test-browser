/*

    Use `fluid.getGlobalValue` to inspect client-side variables.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.test.browser.loadTestingSupport();

var testUrl = gpii.test.browser.resolveFileUrl("%gpii-test-browser/tests/static/html/fluid.html");

fluid.defaults("gpii.tests.browser.fluid.caseHolder", {
    gradeNames: ["gpii.test.browser.caseHolder.static"],
    rawModules: [{
        name: "Testing the client-side functions that require infusion...",
        tests: [
            {
                name: "Test looking up the document title...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [testUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.getGlobalValue, "document.title"]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The title should be as expected...", "Fluid component test...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test inspecting a fluid component's model data...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [testUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.getGlobalValue, "component.model.count"]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The title should be as expected...", 1, "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.browser.fluid.testEnvironment", {
    gradeNames: ["gpii.test.browser.environment"],
    components: {
        caseHolder: {
            type: "gpii.tests.browser.fluid.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.browser.fluid.testEnvironment");