"use strict";
const {promise, resolve} = require("./util");
const Container = require("./Container");
const app = new Container();

module.exports = {
	promise,
	resolve,
	app
};