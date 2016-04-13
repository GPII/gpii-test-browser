/*

  Test page navigation (back, forward, etc.)

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.test.browser.loadTestingSupport();

var startUrl = gpii.test.browser.resolveFileUrl("%gpii-test-browser/tests/static/html/click.html");

fluid.defaults("gpii.tests.browser.navigation", {
    gradeNames: ["gpii.test.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            {
                name: "Test navigating backwards and forwards...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [startUrl]
                    },
                    {
                        listener: "{gpii.test.browser.environment}.browser.click",
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        args:     ["a"]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onClickComplete",
                        listener: "{gpii.test.browser.environment}.browser.title"
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.test.browser.environment}.browser.events.onTitleComplete",
                        args:     ["We should be back on the second page...", "Second Test Page", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.browser.environment}.browser.back"
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onBackComplete",
                        listener: "{gpii.test.browser.environment}.browser.title"
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.test.browser.environment}.browser.events.onTitleComplete",
                        args:     ["We should be back on the first page...", "Click Test", "{arguments}.0"]
                    },
                    {
                        func: "{gpii.test.browser.environment}.browser.forward"
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onForwardComplete",
                        listener: "{gpii.test.browser.environment}.browser.title"
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.test.browser.environment}.browser.events.onTitleComplete",
                        args:     ["We should be back on the second page...", "Second Test Page", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.test.browser.environment({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.navigation"
        }
    }
});
