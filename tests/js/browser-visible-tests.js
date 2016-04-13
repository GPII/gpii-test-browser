/*

    Tests for confirming whether an element is visible or not.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.test.browser.loadTestingSupport();

var goodUrl = gpii.test.browser.resolveFileUrl("%gpii-test-browser/tests/static/html/visible.html");

fluid.defaults("gpii.tests.browser.visible", {
    gradeNames: ["gpii.test.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            {
                name: "Examine a visible element...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [goodUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.visible",
                        args:     ["#visible"]
                    },
                    {
                        listener: "jqUnit.assertTrue",
                        event:    "{gpii.test.browser.environment}.browser.events.onVisibleComplete",
                        args:     ["The #visible element should be visible...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Examine an hidden element...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [goodUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.visible",
                        args:     ["#invisible"]
                    },
                    {
                        listener: "jqUnit.assertFalse",
                        event:    "{gpii.test.browser.environment}.browser.events.onVisibleComplete",
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
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [goodUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.visible",
                        args:     ["#notNobodyNotNohow"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.test.browser.environment}.browser.events.onVisibleComplete",
                        args:     ["A non-existent element should not be visible...", undefined, "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.test.browser.environment({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.visible"
        }
    }
});
