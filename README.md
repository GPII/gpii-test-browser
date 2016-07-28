# **NOTE: THIS PROJECT IS DEPRECATED**

**This project has been superseded by the `gpii-webdriver` project, which makes it possible to test everything here
and much more.  If you are using this project in your tests, you are encouraged to migrated to `gpii-webdriver` ASAP.
That project can be found at:**

**[https://github.com/GPII/gpii-webdriver](https://github.com/GPII/gpii-webdriver)**

**This project will only be updated until the projects we know of that use it can be migrated to `gpii-webdriver`.  If
you cannot update in a reasonable time frame, please get in touch so that we are aware of your project and so that we
can assist in the migration as needed.**

----

# Introduction

This package provides a set of Fluid components designed to assist in testing complex suites of components, such as
those which have both a server and client side.  It is based on [Nightmare.js](https://github.com/segmentio/nightmare),
which itself uses [Atom Electron](https://github.com/atom/electron).  The ultimate goal of this package is to allow
you to test your components using only Fluid IoC test fixtures, and in many cases, only test sequence definitions.

# How does `Nightmare` work?

Nightmare allows you to send commands to and inspect the state of an Atom Electron browser.  The browser can run with a
visible output window, or in "headless" mode.  Typically, you will:

 1. `goto` a starting page.
 2. Optionally `inject` javascript used by your tests.
 2. Execute one or more actions (such as `click`, `type`, or `submit`).
 3. Evaluate the state of the browser.

# Adding this package to your tests

You will typically use this package by wiring an instance of `gpii.tests.browser` into your `testEnvironment`.
There is a reusable set of test components provided with this package, which can be used from your tests by adding
boilerplate like:

```
require("gpii-test-browser");
gpii.tests.browser.loadTestingSupport();
```

Once you have done this, you can use the provided caseHolder (`gpii.tests.browser.caseHolder.static`) and test
environment (`gpii.tests.browser.environment`) in your tests.  These include wiring to ensure that the tests are fired
once QUnit is ready, and to ensure that the browser is shut down completely at the end of each test.

# How does this package work?

Each of the underlying [Nightmare.js](https://github.com/segmentio/nightmare) functions is available via a
corresponding invoker.  Each function's use has been simplified and standardized for use in test cases.

There is no option to supply a callback to any Nightmare function.  Instead, a call to a Nightmare functions ultimately
fires a corresponding component event with the result.  For example, `goto` fires `onGotoComplete` when it completes.
This allows you to chain complex operations and inspections together in a standard Fluid IoC test sequence, as in this
example:

```
{
    name: "Test clicking a link...",
    sequence: [
        {
            func: "{gpii.tests.browser.environment}.browser.goto",
            args: [startUrl]
        },
        {
            listener: "{gpii.tests.browser.environment}.browser.click",
            event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
            args:     ["a"]
        },
        {
            event:    "{gpii.tests.browser.environment}.browser.events.onClickComplete",
            listener: "{gpii.tests.browser.environment}.browser.evaluate",
            args:     [gpii.tests.browser.tests.textLookupFunction, "body"]
        },
        {
            listener: "jqUnit.assertEquals",
            event:    "{gpii.tests.browser.environment}.browser.events.onEvaluateComplete",
            args:     ["The body should be as expected...", "This is the second page.", "{arguments}.0"]
        }
    ]
}
```

# Evaluating the State of the Browser

Commonly, you will want to test the state of the browser to confirm whether one or more conditions is true. Nightmare
provides a few functions to confirm the existance or visibility of an element based on a selector.  It also provides
functions to examine the title and URL of the browser window.  You can listen for the result of these
actions with a `jqUnit` method, as in the following example:

```
name: "Test querying the title of a sample page...",
sequence: [
    {
        func: "{gpii.tests.browser.environment}.browser.goto",
        args: [goodUrl]
    },
    {
        event:    "{gpii.tests.browser.environment}.browser.events.onGotoComplete",
        listener: "{gpii.tests.browser.environment}.browser.title"
    },
    {
        listener: "jqUnit.assertEquals",
        event:    "{gpii.tests.browser.environment}.browser.events.onTitleComplete",
        args:     ["The title should be as expected...", "Test environment for exercising Nightmare", "{arguments}.0"]
    }
]
```
For more complex inspections, you'll want to use the `evaluate` method.  This allows you to pass in either one of
the functions provided by this package (see "advanced topics" below)or one or your own choosing.  A few things to note:

1. The function will be evaluated within the browser, and needs to be self-contained.
2. If an error occurs in executing the function, it will be passed along to the `onError` event.
3. You will generally want to return a value from the function, which will be passed along when the `onEvaluateComplete` event is fired.
4. You will typically want to return simple values.  Complex objects such as the `document` and `window` are stripped of their functions (see "advanced topics" below).

# Further Reading

Check out the Nightmare documentation for details on what a function is meant to do.  Review the tests in
this package for examples of how each can be used from within a test sequence.

# Advanced topics

## What predefined functions are available?

This package provides simple, dependency-free functions that can be passed to `evaluate`, which are as follows:

| Component | Arguments | Returns |
| --------- | --------- | ------- |
|`gpii.tests.browser.tests.textLookupFunction`| `selector`: A CSS-style selector that can be used with `document.querySelector`. | The `innerText` of the selected element. |
|`gpii.tests.browser.tests.LookupFunction`| `selector`: A CSS-style selector that can be used with `document.querySelector`. | The `innerHTML` of the selected element. |
|`gpii.tests.browser.tests.valueLookupFunction`| `selector`: A CSS-style selector that can be used with `document.querySelector`. | The `value` of the selected element. |

## What can be returned from `evaluate`?

If none of the above functions meet your needs, you may want to create your own function.  In that case, you need to
know what can be returned. Let's say that you have the following client-side component on your page:

```
<script type="text/javascript">
    var component = fluid.modelComponent({
        data: {
            isAwesome: true
        },
        members: {
            myId: "12345"
        },
        model: {
            count: 0
        }
    });
    component.applier.change("count", 1);
</script>
```

Let's say also that you passed the following function to `evaluate`:

```
function () {
    return component;
}
```

The result would look like:

```
{
  "applier": {
    "applierId": "aa64te49-14",
    "changeListeners": {
      "listeners": [],
      "transListeners": []
    },
    "holder": null,
    "modelChanged": {},
    "options": null,
    "postCommit": {
      "byId": {
        "aa64te49-19": null
      },
      "eventId": "aa64te49-16",
      "listeners": {
        "aa64te49-19": [
          {
            "namespace": "aa64te49-19",
            "priority": {
              "constraint": null,
              "count": 0,
              "fixed": 0,
              "site": "listeners"
            }
          }
        ]
      },
      "name": "postCommit event for ChangeApplier ",
      "sortedListeners": [
        null
      ],
      "typeName": "fluid.event.firer"
    },
    "preCommit": {
      "byId": {
        "aa64te49-17": null,
        "aa64te49-18": null
      },
      "eventId": "aa64te49-15",
      "listeners": {
        "aa64te49-17": [
          {
            "namespace": "aa64te49-17",
            "priority": {
              "constraint": null,
              "count": 0,
              "fixed": 0,
              "site": "listeners"
            }
          }
        ],
        "aa64te49-18": [
          {
            "namespace": "aa64te49-18",
            "priority": {
              "constraint": null,
              "count": 1,
              "fixed": 0.0009765625,
              "site": "listeners"
            }
          }
        ]
      },
      "name": "preCommit event for ChangeApplier ",
      "sortedListeners": [
        null,
        null
      ],
      "typeName": "fluid.event.firer"
    }
  },
  "events": {
    "afterDestroy": {
      "eventId": "aa64te49-13",
      "name": "afterDestroy of component with typename fluid.modelComponent and id aa64te49-10",
      "ownerId": "aa64te49-10",
      "typeName": "fluid.event.firer"
    },
    "onCreate": {
      "eventId": "aa64te49-11",
      "name": "onCreate of component with typename fluid.modelComponent and id aa64te49-10",
      "ownerId": "aa64te49-10",
      "typeName": "fluid.event.firer"
    },
    "onDestroy": {
      "eventId": "aa64te49-12",
      "name": "onDestroy of component with typename fluid.modelComponent and id aa64te49-10",
      "ownerId": "aa64te49-10",
      "typeName": "fluid.event.firer"
    }
  },
  "id": "aa64te49-10",
  "lifecycleStatus": "treeConstructed",
  "model": {
    "count": 1
  },
  "modelRelay": null,
  "myId": "12345",
  "options": {
    "argumentMap": {
      "options": 0
    },
    "changeApplierOptions": {
      "cullUnchanged": true,
      "relayStyle": true,
      "resolverGetConfig": {
        "parser": null,
        "strategies": [
          null
        ]
      },
      "resolverSetConfig": {
        "parser": {},
        "strategies": [
          null,
          null
        ]
      }
    },
    "data": {
      "isAwesome": true
    },
    "events": {
      "afterDestroy": null,
      "onCreate": null,
      "onDestroy": null
    },
    "gradeNames": [
      "fluid.component",
      "fluid.modelComponent"
    ],
    "initFunction": "fluid.initLittleComponent",
    "members": {
      "applier": {
        "0": {
          "expander": {
            "args": [
              "{that}",
              "{that}.options.changeApplierOptions"
            ],
            "funcName": "fluid.makeHolderChangeApplier"
          }
        },
        "length": 1
      },
      "model": {
        "0": {
          "expander": {
            "args": [
              "{that}",
              "{that}.modelRelay"
            ],
            "funcName": "fluid.initRelayModel"
          }
        },
        "length": 1
      },
      "modelRelay": {
        "0": {
          "expander": {
            "args": [
              "{that}",
              "{that}.options.model",
              "{that}.options.modelListeners",
              "{that}.options.modelRelay",
              "{that}.applier"
            ],
            "funcName": "fluid.establishModelRelay"
          }
        },
        "length": 1
      },
      "myId": {
        "0": "12345",
        "length": 1
      }
    },
    "model": [
      {
        "count": 0
      }
    ]
  },
  "typeName": "fluid.modelComponent"
}
```

So, you can see the model data, you can see the options, you can see member data, but you can't use
any invokers or other functions that were originally part of your component.  If you need to arbitrarily modify a
client-side component, you can:

1. Inject client-side scripts that perform the work.
2. Evalute the results once the `onInjectComplete` event is fired.