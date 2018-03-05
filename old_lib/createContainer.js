"use strict";

const Container = require("./Container");

module.exports = function createContainer(...args) {
	return new Container(...args);
};