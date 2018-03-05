"use strict";

const Pipeline = require("./Pipeline");

module.exports = function createPipeline(...args) {
	return new Pipeline(...args);
};