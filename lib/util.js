"use strict";

const {Promise} = require("es6-promise");

function toPromise(payload) {
	if (payload instanceof Promise) {
		return payload;
	}

	if (typeof payload === "function") {
		return toPromise(payload());
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
			promises.push(toPromise(promiseEntry));
		});
	}
	else if (promise && (typeof promise === "object")) {
		Object.keys(promise).forEach((key) => {
			promises.push(toPromise(promise[key]));
		});
	}
	else {
		return toPromise(promise);
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
	toPromise: toPromise,
	resolve: resolve
};