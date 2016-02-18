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

require("./server/nightmare");

fluid.registerNamespace("gpii.tests.browser");

gpii.tests.browser.loadTestingSupport = function () {
    require("../../tests/js/lib/fixtures");
    require("../../tests/js/lib/resolve-file-url");
    require("../../tests/js/lib/evaluate-client-functions");
};