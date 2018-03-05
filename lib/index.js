"use strict";
const {toPromise, resolve} = require("./promise");
const {registerGlobalInterceptor} = require("./interceptor");
const {createPipeline} = require("./pipeline");
const {createContainer} = require("./container");

module.exports = {
	toPromise,
	resolve,
	registerGlobalInterceptor,
	createPipeline,
	createContainer
};