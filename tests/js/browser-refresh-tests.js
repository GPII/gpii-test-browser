/*

    Test refreshing the page using the `refresh` method.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.test.browser.loadTestingSupport();

var typeDemoUrl = gpii.test.browser.resolveFileUrl("%gpii-test-browser/tests/static/html/type.html");

fluid.defaults("gpii.tests.browser.type.caseHolder", {
    gradeNames: ["gpii.test.browser.caseHolder.static"],
    rawModules: [{
        name: "Testing `refresh` function...",
        tests: [
            {
                name: "Test refreshing a page...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [typeDemoUrl]
                    },
                    {
                        func: "{gpii.test.browser.environment}.browser.type",
                        args: ["#textField", false]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onTypeComplete",
                        listener: "{gpii.test.browser.environment}.browser.type",
                        args:     ["#textField", "this is new text..."]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onTypeComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, "#textField", "value"]
                    },
                    {
                        event:     "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The text field should contain the updated value...", "this is new text...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.browser.environment}.browser.refresh"
                    },
                    {
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        event:    "{gpii.test.browser.environment}.browser.events.onLoaded",
                        args:     [gpii.test.browser.lookupFunction, "#textField", "value"]
                    },
                    {
                        event:     "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The text field should contain the default value...", "default value", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.browser.type.testEnvironment", {
    gradeNames: ["gpii.test.browser.environment"],
    components: {
        caseHolder: {
            type: "gpii.tests.browser.type.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.browser.type.testEnvironment");
