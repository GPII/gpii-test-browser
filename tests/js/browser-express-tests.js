/*

    Test the "browser + express" test environment....

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("gpii-express");

require("../../");
gpii.tests.browser.loadTestingSupport();


fluid.defaults("gpii.tests.browser.tests.express.handler", {
    gradeNames: ["gpii.express.handler"],
    invokers: {
        handleRequest: {
            func: "{that}.sendResponse",
            args: [ 200, "<html><head><title>Testing...</title></head><body>Hello, indifferent universe.</body></html>" ]
        }
    }
});

fluid.defaults("gpii.tests.browser.tests.express.router", {
    gradeNames: ["gpii.express.requestAware.router"],
    path: "/",
    handlerGrades: ["gpii.tests.browser.tests.express.handler"]
});

fluid.defaults("gpii.tests.browser.tests.express", {
    gradeNames: ["gpii.tests.browser.caseHolder.withExpress"],
    rawModules: [{
        tests: [
            {
                name: "Confirm that express content is loaded as expected...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: ["{gpii.tests.browser.environment}.express.options.baseUrl"]
                    },
                    {
                        event: "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args: [gpii.tests.browser.tests.lookupFunction, "body", "innerText"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event: "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        args: ["The body should be as expected...", "Hello, indifferent universe.", "{arguments}.0"]
                    }
                ]
            },
            {
                name: "Confirm that content can be loaded from a second test...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: ["{gpii.tests.browser.environment}.express.options.baseUrl"]
                    },
                    {
                        event: "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
                        listener: "{gpii.tests.browser.environment}.browser.evaluate",
                        args: [gpii.tests.browser.tests.lookupFunction, "body", "innerText"]
                    },
                    {
                        listener: "jqUnit.assertEquals",
                        event: "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
                        args: ["The body should be as expected...", "Hello, indifferent universe.", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.tests.browser.environment.withExpress({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.tests.express"
        },
        express: {
            options: {
                components: {
                    router: {
                        type: "gpii.tests.browser.tests.express.router"
                    }
                }
            }
        }
    }
});
