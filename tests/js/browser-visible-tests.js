/*

    Tests for confirming whether an element is visible or not.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.tests.browser.loadTestingSupport();

var url     = require("url");
var goodUrl = url.resolve(url.resolve("file://", __dirname), "./static/html/visible.html");

fluid.defaults("gpii.tests.browser.tests.visible", {
    gradeNames: ["gpii.tests.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            {
                name: "Examine a visible element...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [goodUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.visible",
                        args:     ["#visible"]
                    },
                    {
                        listener: "jqUnit.assertTrue",
                        event:    "{gpii.tests.browser.environment}.browser.events.onVisibleComplete",
                        args:     ["The #visible element should be visible...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Examine an hidden element...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [goodUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.visible",
                        args:     ["#invisible"]
                    },
                    {
                        listener: "jqUnit.assertFalse",
                        event:    "{gpii.tests.browser.environment}.browser.events.onVisibleComplete",
                        args:     ["The #invisible element should be invisible...", "{arguments}.0"]
                    }
                ]
            },
            // This is a safety check confirming that Nightmare (still) returns `false` when checking the visibility of
            // a non-existant element.  If they update to throw an error or otherwise change the behavior, this test
            // will break.
            {
                name: "Check the visibility of an element that doesn't exist...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [goodUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.visible",
                        args:     ["#notNobodyNotNohow"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.tests.browser.environment}.browser.events.onVisibleComplete",
                        args:     ["A non-existent element should not be visible...", false, "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.tests.browser.environment({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.tests.visible"
        }
    }
});
