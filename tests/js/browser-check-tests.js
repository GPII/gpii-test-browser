/*

    Test checking checkboxes and radio buttons.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.test.browser.loadTestingSupport();

var typeDemoUrl = gpii.test.browser.resolveFileUrl("%gpii-test-browser/tests/static/html/check.html");

fluid.defaults("gpii.tests.browser.check", {
    gradeNames: ["gpii.test.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            {
                name: "Test checking a checkbox...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [typeDemoUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, "[name='checked']", "checked"]
                    },
                    {
                        event:     "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertFalse",
                        args:      ["The checkbox should not be checked...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.browser.environment}.browser.check",
                        args: ["[name='checked']"]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onCheckComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, "[name='checked']", "checked"]
                    },
                    {
                        event:     "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:      ["The checkbox should now be checked...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test unchecking a checkbox...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [typeDemoUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, "input[name='alreadyChecked']", "checked"]
                    },
                    {
                        event:     "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:      ["The checkbox should be checked...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.browser.environment}.browser.uncheck",
                        args: ["input[name='alreadyChecked']"]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onUncheckComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, "input[name='alreadyChecked']", "checked"]
                    },
                    {
                        event:     "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertFalse",
                        args:      ["The checkbox should no longer be checked...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test checking a radio button...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [typeDemoUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.check",
                        args:     ["#redButton"]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onCheckComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, "input[type='radio']:checked", "value"]
                    },
                    {
                        event:     "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The checkbox should be checked...", "red", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.test.browser.environment({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.check"
        }
    }
});
