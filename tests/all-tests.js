/*

    Nightmare does not currently clean up all of its listeners before it's destroyed, which results in warnings like the
    following when running more than 10 tests:

    ```
    (node) warning: possible EventEmitter memory leak detected. 11 uncaughtException listeners added. Use emitter.setMaxListeners() to increase limit.
    ```

    For now, we increase the number of listeners to supress the warning.

    TODO:  Remove the workaround once this issue is resolved: https://github.com/segmentio/nightmare/issues/282
 */
"use strict";
process.setMaxListeners(50);

require("./js/browser-check-tests.js");
require("./js/browser-click-tests.js");
require("./js/browser-exists-tests.js");
require("./js/browser-fluid-tests.js");
require("./js/browser-evaluate-function-tests.js");
require("./js/browser-inject-tests");
require("./js/browser-insert-tests");
require("./js/browser-load-tests");
require("./js/browser-navigation-tests.js");
require("./js/browser-refresh-tests.js");
require("./js/browser-screenshot-tests.js");
require("./js/browser-select-tests.js");
require("./js/browser-title-tests.js");
require("./js/browser-type-tests.js");
require("./js/browser-url-tests.js");
require("./js/browser-visible-tests.js");
require("./js/browser-wait-tests.js");
