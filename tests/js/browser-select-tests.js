/*

    Test setting select values.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.tests.browser.loadTestingSupport();

var url     = require("url");
var typeDemoUrl = url.resolve(url.resolve("file://", __dirname), "./static/html/select.html");

fluid.defaults("gpii.tests.browser.tests.select", {
    gradeNames: ["gpii.tests.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            {
                name: "Test selecting a simple option as a string...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [typeDemoUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.select",
                        args:     ["select", "2"]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onSelectComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.valueLookupFunction, "select"]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The select should be set to the right value...", "2", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test selecting a simple option as a number...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [typeDemoUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.select",
                        args:     ["select", 2]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onSelectComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.valueLookupFunction, "select"]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "jqUnit.assertEquals",
                        args:     ["The select should be set to the right value...", "2", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.tests.browser.environment({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.tests.select"
        }
    }
});
