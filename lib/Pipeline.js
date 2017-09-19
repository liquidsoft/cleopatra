"use strict";
const {promise} = require("./util");

class Pipeline {

	constructor() {
		this.queue = [];
	}

	pipe(next) {
		this.queue.push(next);
		return this;
	}

	drop(next) {
		let index = this.queue.indexOf(next);

		if (index > -1) {
			this.queue.splice(index, 1);
		}

		return this;
	}

	dispatch(payload = {}) {
		let result = promise(payload);

		this.queue.forEach(next => {
			result = result.then(next instanceof Pipeline ? payload => next.dispatch(payload) : next);
		});

		return result;
	}

}

module.exports = Pipeline;