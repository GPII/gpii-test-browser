/*

    Test typing into a form field.

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
        name: "Testing `type` function...",
        tests: [
            {
                name: "Test typing into a form field...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [typeDemoUrl]
                    },
                    {
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        args:     [gpii.test.browser.lookupFunction, "#textField", "value"]
                    },
                    {
                        event:     "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The text field should contain the default value...", "default value", "{arguments}.0"]
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
                    }
                ]
            },
            {
                name: "Test typing into two consecutive fields...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [typeDemoUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.type",
                        args:     ["#textField2", "this is the value for field 2"]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onTypeComplete",
                        listener: "{gpii.test.browser.environment}.browser.type",
                        args:     ["#textField3", "this is the value for field 3"]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onTypeComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, "#textField2", "value"]
                    },
                    {
                        event:     "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The second text field should contain the value input earlier...", "this is the value for field 2", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, "#textField3", "value"]
                    },
                    {
                        event:     "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The third text field should contain the value input earlier...", "this is the value for field 3", "{arguments}.0"]
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
