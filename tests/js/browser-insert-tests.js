/*

    Test typing into a form field.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.tests.browser.loadTestingSupport();

var typeDemoUrl = gpii.tests.browser.tests.resolveFileUrl("%gpii-test-browser/tests/static/html/type.html");

fluid.defaults("gpii.tests.browser.tests.insert", {
    gradeNames: ["gpii.tests.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            {
                name: "Test inserting into and clearing a form field...",
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
                        func: "{gpii.tests.browser.environment}.browser.insert",
                        args:     ["#textField", "this is new text..."]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onInsertComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, "#textField", "value"]
                    },
                    {
                        event:     "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The text field should contain the newly insert value...", "this is new text...default value", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test using insert to clear an existing value...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [typeDemoUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.insert",
                        args:     ["#textField", false]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onInsertComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, "#textField", "value"]
                    },
                    {
                        event:     "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The first text field should no longer contain the default value...", undefined, "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.tests.browser.environment({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.tests.insert"
        }
    }
});
