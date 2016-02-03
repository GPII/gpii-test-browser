/*

    Test typing into a form field.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.tests.browser.loadTestingSupport();

var typeDemoUrl = gpii.tests.browser.tests.resolveFileUrl("%gpii-test-browser/tests/static/html/type.html");

fluid.defaults("gpii.tests.browser.tests.type", {
    gradeNames: ["gpii.tests.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            {
                name: "Test typing into a form field...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [typeDemoUrl]
                    },
                    {
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        args:     [gpii.tests.browser.tests.lookupFunction, "#textField", "value"]
                    },
                    {
                        event:     "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The text field should contain the default value...", "default value", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.tests.browser.environment}.browser.type",
                        args: ["#textField", false]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onTypeComplete",
                        listener: "{gpii.tests.browser.environment}.browser.type",
                        args:     ["#textField", "this is new text..."]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onTypeComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, "#textField", "value"]
                    },
                    {
                        event:     "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The text field should contain the updated value...", "this is new text...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test typing into two consecutive fields...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [typeDemoUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.type",
                        args:     ["#textField2", "this is the value for field 2"]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onTypeComplete",
                        listener: "{gpii.tests.browser.environment}.browser.type",
                        args:     ["#textField3", "this is the value for field 3"]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onTypeComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, "#textField2", "value"]
                    },
                    {
                        event:     "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The second text field should contain the value input earlier...", "this is the value for field 2", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, "#textField3", "value"]
                    },
                    {
                        event:     "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The third text field should contain the value input earlier...", "this is the value for field 3", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.tests.browser.environment({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.tests.type"
        }
    }
});
