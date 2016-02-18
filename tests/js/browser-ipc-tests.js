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
    browser.nightmare.on("page-error", function () {
        console.log("I got a CANDYGRAM!");
    });

    browser.evaluate(function (selector, eventName) {
        var component = gpii.tests.browser.eventRelaySource();

        //var matchingComponents = fluid.queryIoCSelector(fluid.rootComponent, selector);
        //fluid.each(matchingComponents, function (component) {
        component.events[eventName].fire("This is coming from the client side.");
        //});
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
                        func: "{gpii.tests.browser.environment}.browser.goto",
                        args: [ipcDemoUrl]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onLoaded",
                        listener: "gpii.tests.browser.tests.ipc.crudelyFireEvent",
                        args:     ["{gpii.tests.browser.environment}.browser", "gpii.tests.browser.eventRelaySource", "onSendMessage"]
                    },
                    {
                        event:    "{gpii.tests.browser.environment}.browser.events.onMessageReceived",
                        listener: "jqUnit.assertEquals",
                        args:     ["This is coming from the client side.", "{arguments}.0"]
                    }
                ]
            }
        ]
    }]
});

gpii.tests.browser.environment({
    components: {
        browser: {
            type: "gpii.tests.browser.eventRelayTarget.browser",
            options: {
                listeners: {
                    "onError.log": {
                        funcName: "console.log",
                        args:     ["BROWSER ERROR:", "{arguments}.0"]
                    }
                }
            }
        },
        caseHolder: {
            type: "gpii.tests.browser.tests.ipc"
        }
    }
});
