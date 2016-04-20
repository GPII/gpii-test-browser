/*

    Test the "browser + express" test environment....

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("gpii-express");

require("../../");
gpii.test.browser.loadTestingSupport();


fluid.defaults("gpii.tests.browser.express.handler", {
    gradeNames: ["gpii.express.handler"],
    invokers: {
        handleRequest: {
            func: "{that}.sendResponse",
            args: [ 200, "<html><head><title>Testing...</title></head><body>Hello, indifferent universe.</body></html>" ]
        }
    }
});

fluid.defaults("gpii.tests.browser.express.middleware", {
    gradeNames: ["gpii.express.middleware.requestAware"],
    path: "/",
    handlerGrades: ["gpii.tests.browser.express.handler"]
});

fluid.defaults("gpii.tests.browser.express.caseHolder", {
    gradeNames: ["gpii.test.browser.caseHolder.withExpress"],
    rawModules: [{
        name:  "Testing the browser in combination with `gpii.express`...",
        tests: [
            {
                name: "Confirm that express content is loaded as expected...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: ["{gpii.test.browser.environment}.express.options.baseUrl"]
                    },
                    {
                        event: "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.lookupFunction, "body", "innerText"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event: "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        args: ["The body should be as expected...", "Hello, indifferent universe.", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Confirm that content can be loaded from a second test...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: ["{gpii.test.browser.environment}.express.options.baseUrl"]
                    },
                    {
                        event: "{gpii.test.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.test.browser.environment}.browser.evaluate",
                        args: [gpii.test.browser.lookupFunction, "body", "innerText"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event: "{gpii.test.browser.environment}.browser.events.onEvaluateComplete",
                        args: ["The body should be as expected...", "Hello, indifferent universe.", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.browser.express.testEnvironment", {
    gradeNames: ["gpii.test.browser.environment.withExpress"],
    components: {
        caseHolder: {
            type: "gpii.tests.browser.express.caseHolder"
        },
        express: {
            options: {
                components: {
                    router: {
                        type: "gpii.tests.browser.express.middleware"
                    }
                }
            }
        }
    }
});

fluid.test.runTests("gpii.tests.browser.express.testEnvironment");