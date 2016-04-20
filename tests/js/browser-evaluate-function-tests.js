/*

    Test the utility functions we provide for use with `evaluate`.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.test.browser.loadTestingSupport();

var testUrl = gpii.test.browser.resolveFileUrl("%gpii-test-browser/tests/static/html/evaluate-functions.html");

fluid.defaults("gpii.tests.browser.evaluate.caseHolder", {
    gradeNames: ["gpii.test.browser.caseHolder.static"],
    rawModules: [{
        name: "Testing the `evaluate` function...",
        tests: [
            {
                name: "Test looking up the text of a single element...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [testUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, ".singleText", "innerText"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The single text value should be as expected...", "This is text.", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test looking up the html content of a single element...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [testUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, ".singleHtml", "innerHTML"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The single html value should be as expected...", "This is <b>html</b>.", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test looking up the value of a single element using `lookupFunction`...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [testUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, ".singleValue", "value"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The single value should be as expected...", "one", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test looking up the text of multiple elements...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [testUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, ".multiText", "innerText"]
                    },
                    {
                        listener: "jqUnit.assertDeepEq",
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The text values should be as expected...", ["This is text.", "This is also text."], "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test looking up the html content of multiple elements...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [testUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, ".multiHtml", "innerHTML"]
                    },
                    {
                        listener: "jqUnit.assertDeepEq",
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The html values should be as expected...", ["This is <b>html</b>.", "This is <b>also html</b>."], "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test looking up the value of multiple elements...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [testUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.lookupFunction, ".multiValue", "value"]
                    },
                    {
                        listener: "jqUnit.assertDeepEq",
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The values should be as expected...", ["one", "two", "three"], "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test using getElementHtml without a function name...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [testUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.getElementHtml, ".singleHtml"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The selector's html value should be as expected...", "This is <b>html</b>.", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test using getElementHtml with a function name...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [testUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.getElementHtml, ".singleHtml", "next"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The next html value should be as expected...", "valueLookupFunction", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Confirm a match using elementMatches with a function name...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [testUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.elementMatches, ".singleHtml", "l.+o.+tion", "next"] // "lookupValueFunction"
                    },
                    {
                        listener: "jqUnit.assertTrue",
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["There should be a match...", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Confirm that content does not match using elementMatches with a function name...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [testUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.elementMatches, ".singleHtml", "not found", "next"]
                    },
                    {
                        listener: "jqUnit.assertFalse",
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["There should not be a match...", "{arguments}.0"]
                    }
                ]
            },
            // gpii.tests.browser.evaluate.valTestFunction
            // .singleValue
            {
                name: "Test looking up the value of a single element using `val`...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [testUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.val, ".singleValue"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The value should be as expected...", "one", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test setting the value of a single element using `val` and a regular value...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [testUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.val, ".singleValue", "something else"]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args:     [gpii.test.browser.val, ".singleValue"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event:    "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        args:     ["The value should have been updated...", "something else", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});


fluid.defaults("gpii.tests.browser.evaluate.testEnvironment", {
    gradeNames: ["gpii.test.browser.environment"],
    components: {
        caseHolder: {
            type: "gpii.tests.browser.evaluate.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.browser.evaluate.testEnvironment");
