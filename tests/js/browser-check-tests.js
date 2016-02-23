/*

    Test checking checkboxes and radio buttons.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.tests.browser.loadTestingSupport();

var typeDemoUrl = gpii.tests.browser.tests.resolveFileUrl("%gpii-test-browser/tests/static/html/check.html");

fluid.defaults("gpii.tests.browser.tests.check", {
    gradeNames: ["gpii.tests.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            {
                name: "Test checking a checkbox...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [typeDemoUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, "[name='checked']", "checked"]
                    },
                    {
                        event:     "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertFalse",
                        args:      ["The checkbox should not be checked...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.tests.browser.environment}.browser.check",
                        args: ["[name='checked']"]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onCheckComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, "[name='checked']", "checked"]
                    },
                    {
                        event:     "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:      ["The checkbox should now be checked...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test unchecking a checkbox...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [typeDemoUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, "input[name='alreadyChecked']", "checked"]
                    },
                    {
                        event:     "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertTrue",
                        args:      ["The checkbox should be checked...", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.tests.browser.environment}.browser.uncheck",
                        args: ["input[name='alreadyChecked']"]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onUncheckComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, "input[name='alreadyChecked']", "checked"]
                    },
                    {
                        event:     "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertFalse",
                        args:      ["The checkbox should no longer be checked...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test checking a radio button...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [typeDemoUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.check",
                        args:     ["#redButton"]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onCheckComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, "input[type='radio']:checked", "value"]
                    },
                    {
                        event:     "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The checkbox should be checked...", "red", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.tests.browser.environment({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.tests.check"
        }
    }
});
