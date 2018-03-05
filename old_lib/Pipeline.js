"use strict";
const toPromise = require("./util").toPromise;

/**
 * Pipeline object interceptor (wraps an entire pipeline in a pipe interface - callback)
 *
 * @param pipe
 * @returns {*}
 */
const pipelineInterceptor = pipe => {
	return pipe instanceof Pipeline ?
		payload => pipe.dispatch(payload) :
		null;
};

/**
 * Returns the first interception found by a list of interceptors
 *
 * @param interceptors
 * @param pipe
 * @returns {*}
 */
const getInterception = (interceptors, pipe) => {
	let interceptor;
	let interception;

	while ((typeof interception !== "function") && (interceptors.length > 0)) {
		interceptor = interceptors.shift();
		interception = interceptor(pipe);
	}

	if (typeof interception !== "function") {
		interception = pipe;
	}

	return typeof interception === "function" ? interception : null;
};

/**
 * Pipeline class
 */
class Pipeline {

	constructor() {
		this.queue = [];
		this.capturer = null;
		this.reporter = null;
		this.interceptors = [pipelineInterceptor];
	}

	/**
	 * Queues a new pipe into the pipeline
	 *
	 * @param next
	 * @returns {Pipeline}
	 */
	pipe(next) {
		this.queue.push(next);
		return this;
	}

	/**
	 * Drops a pipe from the pipeline
	 *
	 * @param pipe
	 * @returns {Pipeline}
	 */
	drop(pipe) {
		let index = this.queue.indexOf(pipe);

		if (index > -1) {
			this.queue.splice(index, 1);
		}

		return this;
	}

	/**
	 * Sets capturer pipe (last pipe to receive the payload)
	 *
	 * @param capturer
	 * @returns {Pipeline}
	 */
	capture(capturer) {
		this.capturer = capturer;
		return this;
	}

	/**
	 * Sets reporter pipe (the pipe to receive errors / rejected promises and handle them)
	 *
	 * @param reporter
	 * @returns {Pipeline}
	 */
	report(reporter) {
		this.reporter = reporter;
		return this;
	}

	/**
	 * Registers a new pipe interceptor on the pipeline
	 *
	 * @param interceptor
	 * @returns {Pipeline}
	 */
	intercept(interceptor) {
		this.interceptors.push(interceptor);
		return this;
	}

	/**
	 * Dispatches a payload through the pipeline
	 * Returns a promise providing the results
	 *
	 * @param payload
	 * @returns {Promise}
	 */
	dispatch(payload = {}) {
		let result = toPromise(payload);
		let queue = this.queue.concat(this.capturer ? [this.capturer] : []);

		queue.forEach(next => {
			const callback = getInterception(this.interceptors.slice(), next);

			if (typeof callback === "function") {
				result = result.then(
					payload => toPromise(payload).then(callback)
				);
			}
		});

		if (this.reporter) {
			const callback = getInterception(this.interceptors.slice(), this.reporter);

			if (typeof callback === "function") {
				result = result.catch(callback);
			}
		}

		return result;
	}

}

module.exports = Pipeline;