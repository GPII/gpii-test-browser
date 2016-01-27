/*

  A test component that wraps an instance of [Nightmare](https://github.com/segmentio/nightmare) up as a Fluid
  component, so that it can be used in a standard test case.

  Nightmare depends on the [Atom Electron Browser](http://electron.atom.io/docs/v0.30.0/api/browser-window/).  Select
  events from Nightmare and Atom Electron are mapped to internal events using `options.eventBindings`, which should be
  something like:

    eventBindings: {
        fluidEvent1: "atomEvent1",
        fluidEvent2: ["atomEvent2", "nightmareEvent3"]
    }

  This mechanism maps one or more native atom and nightmare events down into local events.  We use this by default to
  collapse a whole range of error states into a single `onError` event.

  This component also wraps Nightmare's key methods in invokers that:

  1. Take the same arguments as Nightmare, but do not accept a callback or return a promise.
  2. Fire an event with the results once Nightmare completes its work.  For example, the `click` function will fire an
     `onClickComplete` when it completes.

  With this simple mechanism, you can wire together clicks, text entry, and anything else you like and intersperse
  them with tests, as in:

    sequence: [
         {
             func: "{sampleNightmareComponent}.goto",
             args: ["http://www.cnn.com"]
         },
         {
             listener: "{sampleNightmareComponent}.click",
             event:    "{sampleNightmareComponent}.events.onLoaded",
             args:     ["input[type='submit']"]
         },
         {
             listener: "my.namespace.myTestFunction",
             event:    "{sampleNightmareComponent}.events.onClickComplete",
             args:     ["{sampleNightmareComponent}"]
         }
    ]

 Functions that take some kind of action in the browser are implicitly wrapped in a call to Nightmare's `evaluate`
 function that returns the entire browser `document` object.  Thus, if you want to inspect the document, you can use
 `{arguments}.0` in your listener arguments.  The functions which are wrapped like this are:  `goto`, `back`, `forward`,
 `refresh`, `click`, `type`, `check`, `select`, `scrollTo`, `inject`, and `wait`.

 Nightmare also provides test functions that return a value based on the current state of the browser.  These are also
 wrapped in invokers that fire an event with the native result.  For these, `{arguments}.0` corresponds to the
 value that would have be returned by calling the function directly.  These functions are: `exists`, `visible`, `title`,
 and `url`.

 Nightmare provides two screenshot functions (`screenshot` and `pdf`).  These are wrapped in invokers that fire an
 event when the screenshot is complete.  The returned value (`{arguments}.0`) represents the path to the generated file.

 In addition to the functions provided by Nightmare, we provide:

    1. `sendKey(int keyCode)`: a function to simulate a keyboard event.  Fires `onKeySent` when complete.
    2. `getFocusedElement()`: a function to get the object that is currently focused
    3. `isFocused(selector)`: a function that returns true if the specified selector is currently focused.

  See the tests in this package for examples of how this can all be used together.

 */
"use strict";
var fluid = require("infusion");
var gpii = fluid.registerNamespace("gpii");

fluid.registerNamespace("gpii.tests.browser");

gpii.tests.browser.loadTestingSupport = function () {
    require("../../tests/js/lib/fixtures");
    require("../../tests/js/lib/resolve-file-url");
    require("../../tests/js/lib/evaluate-client-functions");
};

var Nightmare = require("nightmare");
var os        = require("os");
var path      = require("path");

gpii.tests.browser.init = function (that) {
    that.nightmare = new Nightmare(that.options.nightmareOptions);

    fluid.each(that.options.eventBindings, function (rawEventOrEvents, fluidEvent) {
        var rawEvents = fluid.makeArray(rawEventOrEvents);
        fluid.each(rawEvents, function (rawEvent) {
            that.nightmare.on(rawEvent, function () {
                that.events[fluidEvent].fire(fluid.makeArray(arguments));
            });
        });
    });

    that.events.onReady.fire(that);
};

// TODO:  Review and see why the process must be killed.
gpii.tests.browser.end = function (that) {
    that.nightmare.end();

    // For some reason the "end" callback does not always execute, so we use an interval to take care of business
    var millis = 0, intervalTimer = setInterval(function () {
        millis += that.options.endInterval;
        if (that.nightmare.ended) {
            clearInterval(intervalTimer);
            that.events.onEndComplete.fire(that);
        } else if (millis > that.options.endTimeout) {
            clearInterval(intervalTimer);

            process.kill(that.nightmare.proc.pid);

            fluid.log("Nightmare browser timed out and was killed manually....");
            that.events.onEndComplete.fire(that);
        }
    }, that.options.endInterval);
};

/*

    Return a function that can be used to process the results of a Nightmare function call.  For most functions,
    the return value from Nightmare is fired as an argument when triggering `eventName`.  For functions like `pdf` and
    `screenshot` that do not return important information, the `externalResult` option can be used.  This value will be
    passed to the event if there are no errors and if Nightmare itself does not return a result.

 */
gpii.tests.browser.makeNightmareHandlerFunction = function (that, eventName, externalResult)  {
    return function (error, result) {
        if (!result && externalResult) { result = externalResult; }
        if (error) {
            that.events.onError.fire(error);
        } else {
            that.events[eventName].fire(result);
        }
    };
};

/*

    Execute the Nightmare function 'fnName' with the supplied `args` and handle the result.  This will typically result in either
    firing an 'onError' event with any errors or firing `eventName` with any results.

 */
gpii.tests.browser.execute = function (that, eventName, fnName, args) {
    var argsArray = args ? fluid.makeArray(args) : [];
    that.nightmare[fnName].apply(that.nightmare, argsArray).run(gpii.tests.browser.makeNightmareHandlerFunction(that, eventName));
};

/*

    Generate the path to a file in the temp directory.  Used as the default for screenshots and PDFs.

 */
gpii.tests.browser.generateTempFilePath = function (tag, extension) {
    return path.resolve(os.tmpdir(), tag + "-" + (new Date()).getTime() + "." + extension);
};

/*

    We have a separate wrapper for the `screenshot` function so that we can:

      1. Pass a filename and sane defaults
      2. Return the output path instead of `undefined`, which is the default.

    You can override the file location and clipping options by passing in your own `args`.

 */
gpii.tests.browser.executeScreenshot = function (that, eventName, args) {
    var argsArray = fluid.makeArray(args);
    if (!argsArray[0]) {
        argsArray[0] = gpii.tests.browser.generateTempFilePath("screenshot", "png");
    }

    if (!argsArray[1]) {
        argsArray[1] = { x: 1, y: 1, width: 1200, height: 800};
    }

    fluid.log("Saving screenshot to '" + argsArray[0] + "'...");
    that.nightmare.screenshot.apply(that.nightmare, argsArray).run(gpii.tests.browser.makeNightmareHandlerFunction(that, eventName, argsArray[0]));
};

/*

    We have a separate wrapper for the `pdf` function so that we can:

      1. Pass a sensible default filename.
      2. Return the output path instead of `undefined`, which is the default.

    You can supply your own filename (and any PDF options) by passing in your own `args`.

 */
gpii.tests.browser.executePdf = function (that, eventName, args) {
    var argsArray = fluid.makeArray(args);
    if (!argsArray[0]) {
        argsArray[0] = gpii.tests.browser.generateTempFilePath("pdf", "pdf");
    }

    fluid.log("Saving PDF file to '" + argsArray[0] + "'...");
    that.nightmare.pdf.apply(that.nightmare, argsArray).run(gpii.tests.browser.makeNightmareHandlerFunction(that, eventName, argsArray[0]));
};

// TODO:  Implement this once this issue is resolved -> https://github.com/segmentio/nightmare/issues/244
//gpii.tests.browser.sendKey = function (that, keyCode) {
//};


fluid.defaults("gpii.tests.browser", {
    gradeNames:  ["fluid.component"],
    endInterval: 500,
    endTimeout:  2500,
    events: {
        // Indicate that we are finished with our own startup process, including wiring listeners to all Nightmare events.
        onReady: null,

        // Nightmare / Atom Electron events
        onLoaded:   null,
        onError:    null,
        onDomReady: null,
        onPageLog:  null,

        // Nightmare function completion events
        onEndComplete: null,
        onGotoComplete: null,
        onBackComplete: null,
        onForwardComplete: null,
        onRefreshComplete: null,
        onClickComplete: null,
        onTypeComplete: null,
        onCheckComplete: null,
        onSelectComplete: null,
        onScrollToComplete: null,
        onInjectComplete: null,
        onEvaluateComplete: null,
        onWaitComplete: null,
        onExistsComplete: null,
        onVisibleComplete: null,
        onScreenshotComplete: null,
        onPdfComplete: null,
        onTitleComplete: null,
        onUrlComplete: null,

        // Custom function events
        onKeySent: null
    },
    eventBindings: {
        onLoaded:   ["did-finish-load", "did-frame-finish-load"],
        onError:    ["did-fail-load", "crashed", "plugin-crashed", "page-error"],
        onDomReady: ["dom-ready"],
        onPageLog:  ["page-logged"]
    },
    nightmareOptions: {
        waitTimeout: 30000 // Required until release 2.1.4 of Nightmare is available.  See https://github.com/segmentio/nightmare/issues/453
    },
    listeners: {
        "onCreate.init": {
            funcName: "gpii.tests.browser.init",
            args:     ["{that}"]
        }
    },
    invokers: {
        // Functions that take action and then return the current `document`.
        "goto": {
            funcName: "gpii.tests.browser.execute",
            args:     ["{that}", "onGotoComplete", "goto", "{arguments}"]
        },
        back: {
            funcName: "gpii.tests.browser.execute",
            args:     ["{that}", "onBackComplete", "back", "{arguments}"]
        },
        evaluate: {
            funcName: "gpii.tests.browser.execute",
            args:     ["{that}", "onEvaluateComplete", "evaluate", "{arguments}"]
        },
        forward: {
            funcName: "gpii.tests.browser.execute",
            args:     ["{that}", "onForwardComplete", "forward", "{arguments}"]
        },
        refresh: {
            funcName: "gpii.tests.browser.execute",
            args:     ["{that}", "onRefreshComplete", "refresh", "{arguments}"]
        },
        end: {
            funcName: "gpii.tests.browser.end",
            args:     ["{that}"]
        },
        click: {
            funcName: "gpii.tests.browser.execute",
            args:     ["{that}", "onClickComplete", "click", "{arguments}"]
        },
        type: {
            funcName: "gpii.tests.browser.execute",
            args: ["{that}", "onTypeComplete", "type", "{arguments}"]
        },
        check: {
            funcName: "gpii.tests.browser.execute",
            args:     ["{that}", "onCheckComplete", "check", "{arguments}"]
        },
        select: {
            funcName: "gpii.tests.browser.execute",
            args:     ["{that}", "onSelectComplete", "select", "{arguments}"]
        },
        scrollTo: {
            funcName: "gpii.tests.browser.execute",
            args:     ["{that}", "onScrollToComplete", "scrollTo", "{arguments}"]
        },
        inject: {
            funcName: "gpii.tests.browser.execute",
            args:     ["{that}", "onInjectComplete", "inject", "{arguments}"]
        },
        wait: {
            funcName: "gpii.tests.browser.execute",
            args:     ["{that}", "onWaitComplete", "wait", "{arguments}"]
        },
        exists: {
            funcName: "gpii.tests.browser.execute",
            args:     ["{that}", "onExistsComplete", "exists", "{arguments}"]
        },
        // Functions that return a native value.
        visible: {
            funcName: "gpii.tests.browser.execute",
            args:     ["{that}", "onVisibleComplete", "visible", "{arguments}"]
        },
        title: {
            funcName: "gpii.tests.browser.execute",
            args:     ["{that}", "onTitleComplete", "title"]
        },
        url: {
            funcName: "gpii.tests.browser.execute",
            args:     ["{that}", "onUrlComplete", "url"]
        },
        // Functions that return the path to a saved screen shot.
        screenshot: {
            funcName: "gpii.tests.browser.executeScreenshot",
            args: ["{that}", "onScreenshotComplete", "{arguments}"]
        },
        pdf: {
            funcName: "gpii.tests.browser.executePdf",
            args: ["{that}", "onPdfComplete", "{arguments}"]
        }
        //,
        //// End wrappers for Nightmare functions, begin our custom value-add functions.
        //sendKey: {
        //    funcName: "gpii.tests.browser.sendKey",
        //    args:     ["{that}", "{arguments}.0"] // keyCode
        //}

    }
});