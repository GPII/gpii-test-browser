/*

A test script to look at how Nightmare behaves natively.  This should not be used.

 */
"use strict";
var Nightmare = require("nightmare");

//var path = require("path");
var url = require("url");

var startPage = url.resolve(url.resolve("file://", __dirname), "./static/html/select.html");

//var browser = Nightmare({ show: true});
//browser.goto(startPage);
//
//var args = fluid.makeArray("input[type='submit']");
//browser.click.apply(browser, args).then(function () {
//    console.log(JSON.stringify(fluid.makeArray(arguments), null, 2));
//    console.log("yo");
//
//    browser.evaluate.apply(browser, [
//        function (selector){
//            return document.querySelector(selector);
//        },
//        "body"
//    ]).then(function() {
//        console.log(JSON.stringify(fluid.makeArray(arguments), null, 2));
//        console.log("joe");
//
//        browser.end();
//    });
//});


//var browser = new Nightmare({ show: true});
//browser.goto.apply(browser, [startPage]);
//browser.click.apply(browser, ["input[type='submit']"]);
//browser.evaluate.apply(browser, [function (selector) {
//    return document.querySelector(selector).innerText;
//}, "body"]);
//browser.run.apply(browser, [function (err, result) {
//    if (err) { console.log("error:", err); }
//    console.log("result:", result);
//}]);
//browser.end.apply(browser);


//var browser = new Nightmare({ show: true});
//browser.goto.apply(browser, [startPage]);
//browser.evaluate.apply(browser, [function () {
//    return component;
//}]);
//browser.run.apply(browser, [function (err, result) {
//    if (err) { console.log("error:", err); }
//    console.log("result:", result);
//}]);
//browser.end.apply(browser);

var browser = new Nightmare({ show: true});
browser["goto"].apply(browser, [startPage]);
browser.select.apply(browser, ["select", "two"]);
browser.evaluate.apply(browser, [function () {
    /* globals document */
    return document.querySelector("select").value;
}]);
browser.run.apply(browser, [function (err, result) {
    if (err) { console.log("error:", err); }
    console.log("result:", result);
}]);
browser.end.apply(browser);