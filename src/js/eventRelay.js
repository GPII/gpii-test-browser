/*

    Provides an "event relay" mechanism, which we use in this package to notify the server-side of events that take
    place on the client side.

    Each segment of the relay consists of a "source" (grade firing the event) and a "target" (grade receiving and
    presumably relaying the event.

    You will need to either include this script on the client side or inject it using our nightmare component. You can
    do this from a test sequence using the supplied client-side function `gpii.test.browser.fireRemoteEvent`.

    [
        {
            func: "{testEnvironment}.eventRelay.source.events.eventName.fire",
            args: [ ... ]
        },
        {
            listener: "your.namespaced.function.or.invoker",
            event: "{testEnvironment}.eventRelay.target.events.eventName",
            args: [ ... ]
        }
    ]

*/
"use strict";
var fluid = fluid || require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.test.browser.eventRelay.source");

/* globals __nightmare */
gpii.test.browser.eventRelay.source.relayFunction = function (targetId, eventName, args) {
    if (__nightmare && __nightmare.ipc) {
        __nightmare.ipc.sendSync("page", "event", { targetId: targetId, eventName: eventName, args: args});
    }
    else {
        fluid.fail("No IPC functionality available, cannot send messsage...");
    }
};

gpii.test.browser.eventRelay.source.wireRelayListeners = function (that, targetId, eventNames) {
    fluid.each(eventNames, function (eventName) {
        that.events[eventName].addListener(function () { gpii.test.browser.eventRelay.source.relayFunction(targetId, eventNames, arguments); });
    });
};

fluid.defaults("gpii.test.browser.eventRelay.source", {
    gradeNames: ["fluid.component"]
});

fluid.registerNamespace("gpii.test.browser.eventRelay.target");

fluid.defaults("gpii.test.browser.eventRelay.target", {
    gradeNames: ["fluid.component"],
    // sourceSelector: A string identifying the `eventRelay.source` we will be relaying events from.
    // sourceEvents: A block of options that describe the `events` the source instance supports.
    listeners: {
        "onCreate.registerTarget": {
            "func": "{gpii.test.browser.eventRelay.multiplexer}.registerTarget",
            "args": ["{that}"]
        }
    }
});

fluid.registerNamespace("gpii.test.browser.eventRelay.multiplexer");
gpii.test.browser.eventRelay.multiplexer.listenForIpcMessages = function (that) {
    that.nightmare.child.on("page", function () {
        that.handleIpcMessage.apply(null, arguments);
    });
};

gpii.test.browser.eventRelay.multiplexer.registerTarget = function (multiplexerThat, targetThat) {
    gpii.test.browser.eventRelay.multiplexer.connectSource(multiplexerThat, targetThat.id, targetThat.options.sourceSelector, targetThat.options.sourceEvents);
};

gpii.test.browser.eventRelay.multiplexer.connectSource = function (that, targetId, sourceSelector, eventNames) {
    that.evaluate(function (targetId, sourceSelector, eventNames) {
        var matchingComponents = fluid.queryIoCSelector(fluid.rootComponent, sourceSelector);
        fluid.each(matchingComponents, function (component) {
            gpii.test.browser.eventRelay.source.wireRelayListeners(component, targetId, eventNames);
        });
    }, targetId, sourceSelector, eventNames);
};

gpii.test.browser.eventRelay.multiplexer.unpackMessage = function (that, bundleToUnpack) {
    // { targetId: targetId, eventName: eventName, args: args}
    var instantiatior = fluid.getInstantiator(that);
    var shadow = instantiatior.idToShadow(bundleToUnpack.targetId);
    shadow.that.events[bundleToUnpack.eventName].fire.apply(null, bundleToUnpack.args);
};

fluid.defaults("gpii.test.browser.eventRelay.multiplexer", {
    gradeNames: ["fluid.component"],
    events: {
        onMessageReceived: null
    },
    invokers: {
        handleIpcMessage: {
            func: "{that}.events.onMessageReceived.fire",
            args: ["{arguments}.2"]
        },
        registerTarget: {
            funcName: "gpii.test.browser.eventRelay.multiplexer.registerTarget",
            args: ["{that}", "{arguments}.0"]
        },
        connectSource: {
            funcName: "gpii.test.browser.eventRelay.multiplexer.connectSource",
            args:     ["{that}", "{arguments}.0", "{arguments}.1"]
        }
    },
    listeners: {
        "onCreate.listenForIpcMessages": {
            funcName: "gpii.test.browser.eventRelay.multiplexer.listenForIpcMessages",
            args:     ["{that}"]
        },
        "onMessageReceived.unpackMessage": {
            funcName: "gpii.test.browser.eventRelay.multiplexer.unpackMessage",
            args:     ["{that}", "{arguments}.0"]
        }
    }
});

fluid.defaults("gpii.test.browser.eventRelay.browserWithMultiplexer", {
    gradeNames: ["gpii.test.browser", "gpii.test.browser.eventRelay.multiplexer"]
});