"use strict";

const {Promise} = require("es6-promise");

function _promise(payload) {
	if (payload instanceof Promise) {
		return payload;
	}

	if (typeof payload === "function") {
		return _promise(payload());
	}

	return new Promise((resolve, reject) => {
		payload === false ? reject() : resolve(payload);
	});
}

function resolve(promise) {
	if (promise instanceof Promise) {
		return promise;
	}

	let promises = [];

	if (promise instanceof Array) {
		promise.forEach((promiseEntry) => {
			promises.push(_promise(promiseEntry));
		});
	}
	else if (promise && (typeof promise === "object")) {
		Object.keys(promise).forEach((key) => {
			promises.push(_promise(promise[key]));
		});
	}
	else {
		return _promise(promise);
	}

	return Promise.all(promises).then((result) => {
		if (promise instanceof Array) {
			return result;
		}

		let response = {};
		Object.keys(promise).forEach((key, index) => {
			response[key] = result[index];
		});

		return response;
	});
}

module.exports = {
	promise: _promise,
	resolve
};