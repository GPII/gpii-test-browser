/*

    Test the utility functions we provide for use with `evaluate`.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.tests.browser.loadTestingSupport();

var url     = require("url");
var testUrl = url.resolve(url.resolve("file://", __dirname), "./static/html/evaluate-functions.html");

fluid.defaults("gpii.tests.browser.tests.evaluate", {
    gradeNames: ["gpii.tests.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            {
                name: "Test looking up the text of a single element...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [testUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, ".singleText", "innerText"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The single text value should be as expected...", "This is text.", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test looking up the html content of a single element...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [testUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, ".singleHtml", "innerHTML"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The single html value should be as expected...", "This is <b>html</b>.", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test looking up the value of a single element...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [testUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, ".singleValue", "value"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The single value should be as expected...", "one", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test looking up the text of multiple elements...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [testUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, ".multiText", "innerText"]
                    },
                    {
                        listener: "jqUnit.assertDeepEq",
                        event:    "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The text values should be as expected...", ["This is text.", "This is also text."], "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test looking up the html content of multiple elements...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [testUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, ".multiHtml", "innerHTML"]
                    },
                    {
                        listener: "jqUnit.assertDeepEq",
                        event:    "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The html values should be as expected...", ["This is <b>html</b>.", "This is <b>also html</b>."], "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test looking up the value of multiple elements...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [testUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args:     [gpii.tests.browser.tests.lookupFunction, ".multiValue", "value"]
                    },
                    {
                        listener: "jqUnit.assertDeepEq",
                        event:    "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The values should be as expected...", ["one", "two", "three"], "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.tests.browser.environment({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.tests.evaluate"
        }
    }
});
