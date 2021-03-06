/*

  Test taking screen shots

 */
"use strict";
var fluid = require("infusion");
fluid.setLogging(true);
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.test.browser.loadTestingSupport();

var fs       = require("fs");
var jqUnit   = require("node-jqunit");

var startUrl = gpii.test.browser.resolveFileUrl("%gpii-test-browser/tests/static/html/click.html");

fluid.registerNamespace("gpii.tests.browser.screenshot");
gpii.tests.browser.screenshot.fileExists = function (path) {
    var stats = fs.statSync(path);
    jqUnit.assertTrue("The screen shot file should exist...", stats.isFile());
    jqUnit.assertTrue("The file should not be empty...", stats.size > 0);
};

fluid.defaults("gpii.tests.browser.screenshot.caseHolder", {
    gradeNames: ["gpii.test.browser.caseHolder.static"],
    rawModules: [{
        name: "Testing screenshot functions...",
        tests: [
            {
                name: "Test taking a PNG screenshot with the default options...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [startUrl]
                    },
                    // Screenshots appear to fail if they are taken too quickly.  TODO:  Investigate with Antranig.
                    {
                        listener: "{gpii.test.browser.environment}.browser.wait",
                        event:    "{gpii.test.browser.environment}.browser.events.onLoaded",
                        args:     [500]
                    },
                    {
                        listener: "{gpii.test.browser.environment}.browser.screenshot",
                        event:    "{gpii.test.browser.environment}.browser.events.onWaitComplete",
                        args:     []
                    },
                    {
                        listener: "gpii.tests.browser.screenshot.fileExists",
                        event:    "{gpii.test.browser.environment}.browser.events.onScreenshotComplete",
                        args:     ["{arguments}.0"]
                    }
                ]
            },
            // We are not testing the size of the file or its content, only that it was successfully created and is not empty
            {
                name: "Test taking a PNG screenshot with custom dimensions...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [startUrl]
                    },
                    // Screenshots appear to fail if they are taken too quickly.  TODO:  Investigate with Antranig.
                    {
                        listener: "{gpii.test.browser.environment}.browser.wait",
                        event:    "{gpii.test.browser.environment}.browser.events.onLoaded",
                        args:     [500]
                    },
                    {
                        listener: "{gpii.test.browser.environment}.browser.screenshot",
                        event:    "{gpii.test.browser.environment}.browser.events.onWaitComplete",
                        args:     [ null, { x: 1, y: 1, width: 100, height: 100}]
                    },
                    {
                        listener: "gpii.tests.browser.screenshot.fileExists",
                        event:    "{gpii.test.browser.environment}.browser.events.onScreenshotComplete",
                        args:     ["{arguments}.0"]
                    }
                ]
            },
            {
                name: "Test taking a PDF screenshot with the default options...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.browser.goto",
                        args: [startUrl]
                    },
                    {
                        listener: "{gpii.test.browser.environment}.browser.pdf",
                        event:    "{gpii.test.browser.environment}.browser.events.onLoaded",
                        args:     []
                    },
                    {
                        listener: "gpii.tests.browser.screenshot.fileExists",
                        event:    "{gpii.test.browser.environment}.browser.events.onPdfComplete",
                        args:     ["{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.browser.screenshot.testEnvironment", {
    gradeNames: ["gpii.test.browser.environment"],
    components: {
        caseHolder: {
            type: "gpii.tests.browser.screenshot.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.browser.screenshot.testEnvironment");
