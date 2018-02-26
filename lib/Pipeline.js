"use strict";
const toPromise = require("./util").toPromise;

const pipelineInterceptor = pipe => {
	return pipe instanceof Pipeline ?
		payload => pipe.dispatch(payload) :
		null;
};

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

class Pipeline {

	constructor() {
		this.queue = [];
		this.capturer = null;
		this.reporter = null;
		this.interceptors = [pipelineInterceptor];
	}

	pipe(next) {
		this.queue.push(next);
		return this;
	}

	intercept(interceptor) {
		this.interceptors.push(interceptor);
		return this;
	}

	capture(capturer) {
		this.capturer = capturer;
		return this;
	}

	drop(pipe) {
		let index = this.queue.indexOf(pipe);

		if (index > -1) {
			this.queue.splice(index, 1);
		}

		return this;
	}

	report(reporter) {
		this.reporter = reporter;
		return this;
	}

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

		if (typeof this.reporter === "function") {
			result = result.catch(this.reporter);
		}

		return result;
	}

}

module.exports = Pipeline;