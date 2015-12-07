/*

    Tests to look for elements using the `exists` function.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.tests.browser.loadTestingSupport();

var url     = require("url");
var goodUrl = url.resolve(url.resolve("file://", __dirname), "./static/html/index.html");

fluid.defaults("gpii.tests.browser.tests.exists", {
    gradeNames: ["gpii.tests.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            {
                name: "Test looking for an element that exists...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [goodUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.exists",
                        args:     ["#bar"]
                    },
                    {
                        listener: "jqUnit.assertTrue",
                        event:    "{gpii.tests.browser.environment}.browser.events.onExistsComplete",
                        args:     ["The element should be found...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test looking for an element that doesn't exist...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [goodUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.exists",
                        args:     ["#doesNotExist"]
                    },
                    {
                        listener: "jqUnit.assertFalse",
                        event:    "{gpii.tests.browser.environment}.browser.events.onExistsComplete",
                        args:     ["The element should not be found...", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.tests.browser.environment({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.tests.exists"
        }
    }
});
