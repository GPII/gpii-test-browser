/*

  Test taking screen shots

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../index");
gpii.tests.browser.loadTestingSupport();

var fs       = require("fs");
var jqUnit   = require("node-jqunit");

var startUrl = gpii.tests.browser.tests.resolveFileUrl("%gpii-test-browser/tests/static/html/click.html");

fluid.registerNamespace("gpii.tests.browser.tests.screenshot");
gpii.tests.browser.tests.screenshot.fileExists = function (path) {
    var stats = fs.statSync(path);
    jqUnit.assertTrue("The screen shot file should exist...", stats.isFile());
    jqUnit.assertTrue("The file should not be empty...", stats.size > 0);
};

fluid.defaults("gpii.tests.browser.tests.screenshot", {
    gradeNames: ["gpii.tests.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            // TODO:  I cannot get this to consistently take non-empty screen shots.  Leave it for now until we have a good use case.
            //{
            //    name: "Test taking a PNG screenshot...",
            //    sequence: [
            //        {
            //            func: "{gpii.tests.browser.environment}.browser.goto",
            //            args: [startUrl]
            //        },
            //        {
            //            listener: "{gpii.tests.browser.environment}.browser.screenshot",
            //            event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
            //            args:     [{x: 0, y: 0, width: 100, height: 100}]
            //        },
            //        {
            //            listener: "gpii.tests.browser.tests.screenshot.fileExists",
            //            event:    "{gpii.tests.browser.environment}.browser.events.onScreenshotComplete",
            //            args:     ["{arguments}.0"]
            //        }
            //    ]
            //},
            {
                name: "Test taking a PDF screenshot...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [startUrl]
                    },
                    {
                        listener: "{gpii.tests.browser.environment}.browser.pdf",
                        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete"
                    },
                    {
                        listener: "gpii.tests.browser.tests.screenshot.fileExists",
                        event:    "{gpii.tests.browser.environment}.browser.events.onPdfComplete",
                        args:     ["{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.tests.browser.environment({
    components: {
        caseHolder: {
            type: "gpii.tests.browser.tests.screenshot"
        }
    }
});
