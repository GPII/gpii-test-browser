/*

  Test page navigation (back, forward, etc.)

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.tests.browser.loadTestingSupport();

var url      = require("url");
var startUrl = url.resolve(url.resolve("file://", __dirname), "./static/html/click.html");

fluid.defaults("gpii.tests.browser.tests.navigation", {
    gradeNames: ["gpii.tests.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            {
                name: "Test navigating backwards and forwards...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [startUrl]
                    },
                    {
                        listener: "{gpii.tests.browser.environment}.browser.click",
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        args:     ["a"]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onClickComplete",
                        listener: "{gpii.tests.browser.environment}.browser.title"
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.tests.browser.environment}.browser.events.onTitleComplete",
                        args:     ["We should be back on the second page...", "Second Test Page", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.tests.browser.environment}.browser.back"
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onBackComplete",
                        listener: "{gpii.tests.browser.environment}.browser.title"
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.tests.browser.environment}.browser.events.onTitleComplete",
                        args:     ["We should be back on the first page...", "Click Test", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.tests.browser.environment}.browser.forward"
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onForwardComplete",
                        listener: "{gpii.tests.browser.environment}.browser.title"
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.tests.browser.environment}.browser.events.onTitleComplete",
                        args:     ["We should be back on the second page...", "Second Test Page", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.tests.browser.environment({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.tests.navigation"
        }
    }
});
