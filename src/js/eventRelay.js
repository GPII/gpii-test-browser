/*

    Provides an "event relay" mechanism, which we use in this package to notify the server-side of events that take
    place on the client side.

    Each segment of the relay consists of a "source" (grade firing the event) and a "target" (grade receiving and
    presumably relaying the event.

    You will need to either include this script on the client side or inject it using our nightmare component. You can
    do this from a test sequence using the supplied client-side function `gpii.tests.browser.fireRemoteEvent`.

    [
        {
            func: "{testEnvironment}.eventRelaySource.events.eventName.fire",
            args: [ ... ]
        },
        {
            listener: "your.namespaced.function.or.invoker",
            event: "{testEnvironment}.eventRelayTarget.events.eventName",
            args: [ ... ]
        }
    ]

*/
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.tests.browser.eventRelaySource");

//gpii.tests.browser.eventRelaySource.getIpc = function () {
//    if (__Nightmare && __Nightmare.ipc) {
//        return __Nightmare.ipc
//    }
//    else  {
//        return require("ipc");
//    }
//};

//var ipc = gpii.tests.browser.eventRelaySource.getIpc();

/* globals __nightmare */
gpii.tests.browser.eventRelaySource.send = function (message) {
    if (__nightmare && __nightmare.ipc) {

        __nightmare.ipc.send("page-error", "foo");
        __nightmare.ipc.send("page", "error", "foo", "bar");
        __nightmare.ipc.send("candyGram", message);
        //fluid.fail("SENDINGGGGGG");
    }
    else {
        fluid.fail("No IPC functionality available, cannot send messsage...");
    }
};

fluid.defaults("gpii.tests.browser.eventRelaySource", {
    gradeNames: ["fluid.component"],
    events: {
        onSendMessage: null
    },
    listeners: {
        "onSendMessage": {
            funcName: "gpii.tests.browser.eventRelaySource.send",
            args:     ["{arguments}.0"]
        }
    }
});

fluid.defaults("gpii.tests.browser.eventRelayTarget", {
    gradeNames: ["fluid.component"],
    events: {
        onMessageReceived: null
    },
    invokers: {
        handleIpcMessage: {
            func: "{that}.events.onMessageReceived.fire",
            args: ["{arguments}.0"]
        }
    },
    listeners: {
        "onCreate.listenForIpcMessages": {
            funcName: "fluid.notImplemented"
        }
    }
});

fluid.registerNamespace("gpii.tests.browser.eventRelayTarget.browser");
gpii.tests.browser.eventRelayTarget.browser.listenForIpcMessages = function (that) {
    that.nightmare.child.on("page-error", that.handleIpcMessage);
};

fluid.defaults("gpii.tests.browser.eventRelayTarget.browser", {
    gradeNames: ["gpii.tests.browser", "gpii.tests.browser.eventRelayTarget"],
    listeners: {
        "onCreate.listenForIpcMessages": {
            funcName: "gpii.tests.browser.eventRelayTarget.browser.listenForIpcMessages",
            args:     ["{that}"]
        }
    }
});