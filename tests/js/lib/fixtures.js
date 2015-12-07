/*

  Provides a sample test case holder, environment, and a handful of related utility functions.

  TODO:  Agree where this should live and move it there.

 */
"use strict";
var fluid = require("infusion");

var express = require("gpii-express");
express.loadTestingSupport();

// A caseholder for pure browser tests, i.e. where you are only waiting for Nightmare itself.
fluid.defaults("gpii.tests.browser.caseHolder.static", {
    gradeNames: ["gpii.express.tests.caseHolder.base"],
    sequenceStart: [
        { // This sequence point is required because of a QUnit bug - it defers the start of sequence by 13ms "to avoid any current callbacks" in its words
            func: "{gpii.tests.browser.environment}.events.constructBrowser.fire"
        },
        {
            listener: "fluid.identity",
            event: "{gpii.tests.browser.environment}.events.onBrowserReady"
        }
    ],
    // Manually kill off our browser instances when the tests are finished.
    sequenceEnd: [
        {
            func: "{gpii.tests.browser.environment}.browser.end"
        },
        {
            listener: "fluid.identity",
            event: "{gpii.tests.browser.environment}.browser.events.onEndComplete"
        }
    ]
});

// The test environment intended for use with an instance of the `gpii.tests.browser.caseHolder.static` case holder.
fluid.defaults("gpii.tests.browser.environment", {
    gradeNames: ["fluid.test.testEnvironment"],
    events: {
        constructBrowser: null,
        onBrowserReady:   null
    },
    components: {
        browser: {
            type: "gpii.tests.browser",
            createOnEvent: "constructBrowser",
            options: {
                // Uncomment the next line (or add your own options in a derived grade) if you want to see the browser output on your screen.
                //nightmareOptions: { show: true},
                listeners: {
                    "onReady.notifyEnvironment": {
                        func: "{gpii.tests.browser.environment}.events.onBrowserReady.fire"
                    }
                }
            }
        }
    }
});