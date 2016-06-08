/*

    A script to launch Nightmare in a window for manual testing.

 */
"use strict";
var fluid = require("infusion");
fluid.setLogging(true);

var gpii  = fluid.registerNamespace("gpii");

require("../../index");

var path = require("path");
var pagePath = path.resolve(__dirname, "../static/html/launch.html");

var url = require("url");
var startUrl = url.resolve("file://", pagePath);

gpii.test.browser({
    startUrl: startUrl,
    nightmareOptions: { show: true, dock: true},
    listeners: {
        "onCreate.goHome": {
            func: "{that}.goto",
            args: ["{that}.options.startUrl"]
        },
        "onError.log": {
            funcName: "fluid.log",
            args:     ["BROWSER ERROR:", "{arguents}.0"]
        }
    }
});
