"use strict";
const createPipeline = require("./createPipeline");

class Container {

	constructor() {
		this.pipelines = {};
	}

	pipeline(name) {
		return this.pipelines[name] || (this.pipelines[name] = createPipeline());
	}

	dispatch(name, payload = {}) {
		return this.pipeline(name).dispatch(payload);
	}

}

module.exports = Container;