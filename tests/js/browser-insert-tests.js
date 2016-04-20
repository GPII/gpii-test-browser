/*

    Test typing into a form field.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.test.browser.loadTestingSupport();

var typeDemoUrl = gpii.test.browser.resolveFileUrl("%gpii-test-browser/tests/static/html/type.html");

fluid.defaults("gpii.tests.browser.insert.caseHolder", {
    gradeNames: ["gpii.test.browser.caseHolder.static"],
    rawModules: [{
        name: "Test `insert` function...",
        tests: [
            {
                name: "Test inserting into and clearing a form field...",
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
                        func: "{gpii.test.browser.environment}.browser.insert",
                        args:     ["#textField", "this is new text..."]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onInsertComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, "#textField", "value"]
                    },
                    {
                        event:     "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The text field should contain the newly insert value...", "this is new text...default value", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test using insert to clear an existing value...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [typeDemoUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.insert",
                        args:     ["#textField", false]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onInsertComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, "#textField", "value"]
                    },
                    {
                        event:     "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The first text field should no longer contain the default value...", undefined, "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.browser.insert.testEnvironment", {
    gradeNames: ["gpii.test.browser.environment"],
    components: {
        caseHolder: {
            type: "gpii.tests.browser.insert.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.browser.insert.testEnvironment");
