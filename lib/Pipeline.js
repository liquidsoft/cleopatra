"use strict";
const toPromise = require("./util").toPromise;

class Pipeline {

	constructor() {
		this.queue = [];
		this.capturer = null;
	}

	pipe(next) {
		this.queue.push(next);
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

	dispatch(payload = {}) {
		let result = toPromise(payload);
		let queue = this.queue.concat(this.capturer ? [this.capturer] : []);

		queue.forEach(next => {
			result = result.then(
				payload => toPromise(payload).then(next instanceof Pipeline ? payload => next.dispatch(payload) : next)
			);
		});

		return result;
	}

}

module.exports = Pipeline;