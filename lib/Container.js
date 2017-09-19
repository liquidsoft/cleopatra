"use strict";
const Pipeline = require("./Pipeline");

class Container {

	constructor() {
		this.pipelines = {};
	}

	pipeline(name) {
		return this.pipelines[name] || (this.pipelines[name] = new Pipeline());
	}

	dispatch(name, payload = {}) {
		return this.pipeline(name).dispatch(payload);
	}

}

module.exports = Container;