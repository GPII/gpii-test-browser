/*

    Test the injection of content into an existing page.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.test.browser.loadTestingSupport();

var path           = require("path");
var injectedJsPath = path.resolve(__dirname, "../static/js/inject.js");

var injectUrl = gpii.test.browser.resolveFileUrl("%gpii-test-browser/tests/static/html/inject.html");

fluid.defaults("gpii.tests.browser.inject", {
    gradeNames: ["gpii.test.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            {
                name: "Test injecting javascript content into a document...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [injectUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.inject",
                        args:     ["js", injectedJsPath]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onInjectComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, "body", "innerText"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The body should be as expected...", "The body has been updated.", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.test.browser.environment({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.inject"
        }
    }
});
