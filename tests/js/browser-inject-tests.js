/*

    Test the injection of content into an existing page.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.tests.browser.loadTestingSupport();

var path           = require("path");
var injectedJsPath = path.resolve(__dirname, "../static/js/inject.js");
var url            = require("url");
var injectUrl      = url.resolve(url.resolve("file://", __dirname), "./static/html/inject.html");

fluid.defaults("gpii.tests.browser.tests.inject", {
    gradeNames: ["gpii.tests.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            {
                name: "Test injecting javascript content into a document...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [injectUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.inject",
                        args:     ["js", injectedJsPath]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onInjectComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, "body", "innerText"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The body should be as expected...", "The body has been updated.", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.tests.browser.environment({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.tests.inject"
        }
    }
});
