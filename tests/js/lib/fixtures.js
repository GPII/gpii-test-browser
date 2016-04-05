/*

  Provides a sample test case holder, environment, and a handful of related utility functions.

  TODO:  Agree where this should live and move it there.

 */
"use strict";
var fluid = require("infusion");

var express = require("gpii-express");
express.loadTestingSupport();

// The common base caseholder with no `sequenceStart` or `sequenceEnd` data.
//
fluid.defaults("gpii.tests.browser.caseHolder.base", {
    // Extend the express grade that gives us the standard sequence auto-wiring.
    gradeNames: ["gpii.express.tests.caseHolder.base"]
});


// An intermediate caseholder which wires in the `sequenceStart` used by both our final caseHolder implementations.
fluid.defaults("gpii.tests.browser.caseHolder.withStandardStart", {
    gradeNames: ["gpii.tests.browser.caseHolder.base"],
    sequenceStart: [
        { // This sequence point is required because of a QUnit bug - it defers the start of sequence by 13ms "to avoid any current callbacks" in its words
            func: "{gpii.tests.browser.environment}.events.constructFixtures.fire"
        },
        {
            listener: "fluid.identity",
            event: "{gpii.tests.browser.environment}.events.onReady"
        }
    ]
});

// A caseholder for tests where you are only using Nightmare itself, for example to load content from the filesystem.
// Use this with the `gpii.tests.browser.environment` test environment.
//
fluid.defaults("gpii.tests.browser.caseHolder.static", {
    gradeNames: ["gpii.tests.browser.caseHolder.withStandardStart"],
    // Manually kill off our browser instances when the tests are finished.
    sequenceEnd: [
        {
            func: "{gpii.tests.browser.environment}.browser.end"
        },
        {
            listener: "fluid.identity",
            event: "{gpii.tests.browser.environment}.events.onAllDone"
        }
    ]
});

// A caseholder for tests that use both a browser and express.  Use this with the `gpii.tests.browser.environment.withExpress`
// test environment.
//
fluid.defaults("gpii.tests.browser.caseHolder.withExpress", {
    gradeNames: ["gpii.tests.browser.caseHolder.withStandardStart"],
    // Manually kill off our fixtures when the tests are finished, and wait for them to die.
    sequenceEnd: [
        {
            func: "{gpii.tests.browser.environment.withExpress}.express.stopServer"
        },
        {
            func: "{gpii.tests.browser.environment.withExpress}.browser.end"
        },
        {
            listener: "fluid.identity",
            event: "{gpii.tests.browser.environment.withExpress}.events.onAllDone"
        }
    ]
});

// A test environment that only has a browser.  Intended for use with an instance of the `gpii.tests.browser.caseHolder.static`
// case holder.
fluid.defaults("gpii.tests.browser.environment", {
    gradeNames: ["fluid.test.testEnvironment"],
    events: {
        constructFixtures: null,
        onBrowserDone:     null,
        onBrowserReady:    null,
        onReady: {
            events: {
                onBrowserReady: "onBrowserReady"
            }
        },
        onAllDone: {
            events: {
                onBrowserDone:  "onBrowserDone"
            }
        }
    },
    components: {
        browser: {
            type: "gpii.tests.browser",
            createOnEvent: "constructFixtures",
            options: {
                // Uncomment the next line (or add your own options in a derived grade) if you want to see the browser output on your screen.
                //nightmareOptions: { show: true},
                listeners: {
                    "onReady.notifyEnvironment": {
                        func: "{gpii.tests.browser.environment}.events.onBrowserReady.fire"
                    },
                    "onEndComplete.notifyEnvironment": {
                        func: "{gpii.tests.browser.environment}.events.onBrowserDone.fire"
                    }
                }
            }
        }
    }
});




// A test environment that has an express instance as well as a Browser instance.  Intended for use with an instance of
// the `gpii.tests.browser.caseHolder.withExpress` case holder.
//
fluid.defaults("gpii.tests.browser.environment.withExpress", {
    gradeNames: ["gpii.tests.browser.environment"],
    port: 6984,
    path: "",
    events: {
        onExpressDone:  null,
        onExpressReady: null,
        onAllDone: {
            events: {
                onBrowserDone: "onBrowserDone",
                onExpressDone: "onExpressDone"
            }
        },
        onReady: {
            events: {
                onExpressReady: "onExpressReady",
                onBrowserReady: "onBrowserReady"
            }
        }
    },
    url: {
        expander: {
            funcName: "fluid.stringTemplate",
            args: ["http://localhost:%port/%path", { port: "{that}.options.port", path: "{that}.options.path"}]
        }
    },
    components: {
        express: {
            type: "gpii.express",
            createOnEvent: "constructFixtures",
            options: {
                port: "{gpii.tests.browser.environment.withExpress}.options.port",
                baseUrl: {
                    expander: {
                        funcName: "fluid.stringTemplate",
                        args: ["http://localhost:%port/", { port: "{that}.options.port"}]
                    }
                },
                invokers: {
                    "stopServer": {
                        funcName: "gpii.express.stopServer",
                        args:     ["{that}"]
                    }
                },
                listeners: {
                    "onStarted.notifyEnvironment": {
                        func: "{gpii.tests.browser.environment.withExpress}.events.onExpressReady.fire"
                    },
                    "onStopped.notifyEnvironment": {
                        func: "{gpii.tests.browser.environment.withExpress}.events.onExpressDone.fire"
                    },
                    // Disable the onDestroy listener inherited from gpii.express, as it will not result in a notification when the server is finally stopped.
                    "onDestroy.stopServer": { funcName: "fluid.identity" }
                }
            }
        }
    }
});
