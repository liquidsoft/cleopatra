"use strict";
const util = require("./util");
const createPipeline = require("./createPipeline");
const createContainer = require("./createContainer");

module.exports = {
	toPromise: util.toPromise,
	resolve: util.resolve,
	createPipeline: createPipeline,
	createContainer: createContainer
};