/*

    Test checking checkboxes and radio buttons.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../");
gpii.test.browser.loadTestingSupport();
var ipcDemoUrl = gpii.test.browser.resolveFileUrl("%gpii-test-browser/tests/static/html/ipc.html");

fluid.registerNamespace("gpii.tests.browser.ipc");

gpii.tests.browser.ipc.crudelyFireEvent = function (browser, selector, eventName) {
    browser.evaluate(function (selector, eventName) {
        //var component = gpii.test.browser.eventRelaySource();

        var matchingComponents = fluid.queryIoCSelector(fluid.rootComponent, selector);
        fluid.each(matchingComponents, function (component) {
            component.events[eventName].fire("This is coming from the client side.");
        });
    }, selector, eventName);
};

fluid.defaults("gpii.tests.browser.ipc.caseHolder", {
    gradeNames: ["gpii.test.browser.caseHolder.static"],
    rawModules: [{
        name: "Test IPC communication...",
        tests: [
            {
                name: "Test IPC communication...",
                sequence: [
                    {
                        func: "{gpii.test.browser.environment}.events.constructFixtures.fire"
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onReady",
                        listener: "{gpii.test.browser.environment}.browser.goto",
                        args: [ipcDemoUrl]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.browser.events.onLoaded",
                        listener: "gpii.tests.browser.ipc.crudelyFireEvent",
                        args:     ["{gpii.test.browser.environment}.browser", "gpii.test.browser.eventRelaySource", "onArbitraryEvent"]
                    },
                    {
                        event:    "{gpii.test.browser.environment}.eventRelayTarget.events.onArbitraryEvent",
                        listener: "jqUnit.assertEquals",
                        args:     ["The client side payload should be visible...", "This is coming from the client side.", "{arguments}.0"]

                    }
                ]
            }
        ]
    }]
});

fluid.defaults("gpii.tests.browser.ipc.testEnvironment", {
    gradeNames: ["gpii.test.browser.environment"],
    components: {
        browser: {
            type: "gpii.test.browser.eventRelay.browserWithMultiplexer",
            options: {
                components: {
                    eventRelayTarget: {
                        type: "gpii.test.browser.eventRelay.target",
                        options: {
                            sourceSelector: "gpii.test.browser.eventRelaySource",
                            sourceEvents: ["onArbitraryEvent"],
                            events: {
                                onArbitraryEvent: null
                            }
                        }
                    }
                }
            }
        },
        caseHolder: {
            type: "gpii.tests.browser.ipc.caseHolder"
        }
    }
});

fluid.test.runTests("gpii.tests.browser.ipc.testEnvironment");

