/*

    Test checking checkboxes and radio buttons.

 */
"use strict";
var fluid = require("infusion");
var gpii  = fluid.registerNamespace("gpii");

require("../../");
gpii.tests.browser.loadTestingSupport();
var ipcDemoUrl = gpii.tests.browser.tests.resolveFileUrl("%gpii-test-browser/tests/static/html/ipc.html");

fluid.registerNamespace("gpii.tests.browser.tests.ipc");

gpii.tests.browser.tests.ipc.crudelyFireEvent = function (browser, selector, eventName) {
    browser.evaluate(function (selector, eventName) {
        //var component = gpii.tests.browser.eventRelaySource();

        var matchingComponents = fluid.queryIoCSelector(fluid.rootComponent, selector);
        fluid.each(matchingComponents, function (component) {
            component.events[eventName].fire("This is coming from the client side.");
        });
    }, selector, eventName);
};

fluid.defaults("gpii.tests.browser.tests.ipc", {
    gradeNames: ["gpii.tests.browser.caseHolder.static"],
    rawModules: [{
        tests: [
            {
                name: "Test IPC communication...",
                sequence: [
                    {
                        func: "{gpii.tests.browser.environment}.events.constructFixtures.fire"
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onReady",
                        listener: "{gpii.tests.browser.environment}.browser.goto",
                        args: [ipcDemoUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onLoaded",
                        listener: "gpii.tests.browser.tests.ipc.crudelyFireEvent",
                        args:     ["{gpii.tests.browser.environment}.browser", "gpii.tests.browser.eventRelaySource", "onArbitraryEvent"]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.eventRelayTarget.events.onArbitraryEvent",
                        listener: "jqUnit.assertEquals",
                        args:     ["The client side payload should be visible...", "This is coming from the client side.", "{arguments}.0"]

                    }
                ]
            }
        ]
    }]
});

gpii.tests.browser.environment({
    components: {
        browser: {
            type: "gpii.tests.browser.eventRelay.browserWithMultiplexer",
            options: {
                components: {
                    eventRelayTarget: {
                        type: "gpii.tests.browser.eventRelay.target",
                        options: {
                            sourceSelector: "gpii.tests.browser.eventRelaySource",
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
            type: "gpii.tests.browser.tests.ipc"
        }
    }
});
