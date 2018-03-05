"use strict";
const createPipeline = require("./createPipeline");
const {resolve} = require("./util");

//
// @private
//

const reportToContainer = (container, pipeline) => {
	pipeline.report(error => {
		if (typeof container.reporter === "function") {
			return container.reporter(error);
		}

		// Continue chain
		throw error;
	})
};

const captureToContainer = (container, )

//
// @public
//

class Container {

	constructor() {
		this.pipelines = {};
	}

	/////////////////////////////////
	// Container specific
	/////////////////////////////////

	/**
	 * Returns existing pipeline or creates a new one
	 *
	 * @param name
	 * @returns {*|Pipeline}
	 */
	pipeline(name) {
		if (this.pipelines[name] == undefined) {
			this.pipelines[name] = createPipeline()
		}

		return (this.pipelines[name] || (this.pipelines[name] = createPipeline()))
	}

	/**
	 * Applies each pipeline to the callback and returns an array of the resulted
	 * values
	 *
	 * @param callback
	 * @returns {any[]}
	 */
	each(callback) {
		return Object.keys(this.pipelines).map(key => callback(this.pipelines[key], key));
	}

	/**
	 * Runs a mutator on one specific pipeline (pipelineName) or on all of them (if no pipelineName is supplied)
	 *
	 * @param mutator
	 * @param pipelineName
	 * @param args
	 * @returns {*}
	 */
	apply(mutator, pipelineName, ...args) {
		if (typeof pipelineName === "string") {
			return mutator(this.pipeline(pipelineName), pipelineName, ...args);
		}

		return this.each((pipeline, name) => mutator(pipeline, name, pipelineName, ...args));
	}

	/////////////////////////////////
	// Pipeline specific
	/////////////////////////////////

	/**
	 * Queue a pipe on a specific pipeline or on all of them
	 *
	 * pipe(pipelineName, callback)
	 * pipe(callback)
	 *
	 * @param args
	 * @returns {Container}
	 */
	pipe(...args) {
		this.apply((pipeline, name, ...args) => pipeline.pipe(...args), ...args);
		return this;
	}

	/**
	 * Drop a pipe on a specific pipeline or on all of them
	 * Alternatively: Drop an entire pipeline (delete it)
	 *
	 * drop(pipelineName, callback)
	 * drop(callback)
	 * drop(pipelineName)
	 *
	 * @param pipelineName
	 * @param args
	 * @returns {Container}
	 */
	drop(pipelineName, ...args) {
		// Drop entire pipeline
		if (typeof pipelineName === "string" && arguments.length === 1) {
			delete this.pipelines[pipelineName];
			return this;
		}

		this.apply((pipeline, name, ...args) => pipeline.drop(...args), pipelineName, ...args);
		return this;
	}

	/**
	 * Set capturer pipe on a specific pipeline or on all of them
	 *
	 * capture(pipelineName, callback)
	 * capture(callback)
	 *
	 * @param args
	 * @returns {Container}
	 */
	capture(...args) {
		this.apply((pipeline, name, ...args) => pipeline.capture(...args), ...args);
		return this;
	}

	/**
	 * Set reporter pipe on a specific pipeline or on all of them
	 *
	 * report(pipelineName, callback)
	 * report(callback)
	 *
	 * @param args
	 * @returns {Container}
	 */
	report(...args) {
		this.apply("report", ...args);
		return this;
	}

	/**
	 * Register a new interceptor on a specific pipeline or on all of them
	 *
	 * intercept(pipelineName, callback)
	 * intercept(callback)
	 *
	 * @param args
	 * @returns {Container}
	 */
	intercept(...args) {
		this.apply("intercept", ...args);
		return this;
	}

	/**
	 * Dispatches a payload through a specific pipeline or through all of them
	 * Returns a promise chain which provide the resulting payload(s) (array of payloads if through all)
	 *
	 * dispatch(pipelineName, payload)
	 * dispatch(payload)
	 *
	 * @param args
	 * @returns {*}
	 */
	dispatch(...args) {
		return resolve(this.apply("dispatch", ...args));
	}

}

module.exports = Container;