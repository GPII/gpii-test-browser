/*

    Test refreshing the page using the `refresh` method.

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
                name: "Test refreshing a page...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [typeDemoUrl]
                    },
                    {
                        event: "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        func:  "{gpii.tests.browser.environment}.browser.type",
                        args:  ["#textField", "this is new text..."]
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
                    },
                    {
                        func: "{gpii.tests.browser.environment}.browser.refresh"
                    },
                    {
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        event:    "{gpii.tests.browser.environment}.browser.events.onLoaded",
                        args:     [gpii.tests.browser.tests.lookupFunction, "#textField", "value"]
                    },
                    {
                        event:     "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:      ["The text field should contain the default value...", "default value", "{arguments}.0"]
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
