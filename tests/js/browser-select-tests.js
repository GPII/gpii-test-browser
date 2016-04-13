/*

    Test setting select values.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.test.browser.loadTestingSupport();

var typeDemoUrl = gpii.test.browser.resolveFileUrl("%gpii-test-browser/tests/static/html/select.html");

fluid.defaults("gpii.tests.browser.select", {
    gradeNames: ["gpii.test.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            {
                name: "Test selecting a simple option as a string...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [typeDemoUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.select",
                        args:     ["select", "2"]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onSelectComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, "select", "value"]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The select should be set to the right value...", "2", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test selecting a simple option as a number...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [typeDemoUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.select",
                        args:     ["select", 2]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onSelectComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, "select", "value"]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The select should be set to the right value...", "2", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.test.browser.environment({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.select"
        }
    }
});
