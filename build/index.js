"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _require = require("./promises"),
    promisify = _require.promisify,
    resolve = _require.resolve,
    Pipeline = require("./pipeline"),
    Container = require("./container"),
    app = new Container();

exports.promise = promisify;
exports.resolve = resolve;
exports.Pipeline = Pipeline;
exports.Container = Container;
exports.app = app;