/*

    Test the "wait" function...

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.tests.browser.loadTestingSupport();

var url     = require("url");
var waitUrl = url.resolve(url.resolve("file://", __dirname), "./static/html/wait.html");

fluid.defaults("gpii.tests.browser.tests.wait", {
    gradeNames: ["gpii.tests.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            {
                name: "Test waiting for dynamic content...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [waitUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, "#waiting", "innerText"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The body should be as expected...", "The table has not yet been set.", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.tests.browser.environment}.browser.wait",
                        args: [500]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onWaitComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, "#waiting", "innerText"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The body should be as expected...", "The table has been set.", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.tests.browser.environment({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.tests.wait"
        }
    }
});
