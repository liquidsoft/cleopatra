"use strict";
const {createPipeline} = require("./pipeline");

class Container {

	constructor() {
		this.pipelines = {};
		this.errorHandler = null;
	}

	pipeline(name) {
		if (this.pipelines[name] == undefined) {
			this.pipelines[name] = createPipeline();
			this.pipelines[name].report(this.errorHandler);
		}

		return this.pipelines[name];
	}

	pipe(name, ...nodes) {
		this.pipeline(name).through(...nodes);
		return this;
	}

	dispatch(name, payload) {
		return this.pipeline(name).dispatch(payload);
	}

	report(errorHandler) {
		this.errorHandler = errorHandler;
		return this;
	}

}

// generator
const createContainer = () => new Container();

module.exports = {
	Container,
	createContainer
};
