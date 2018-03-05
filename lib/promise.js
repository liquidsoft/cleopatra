"use strict";

const {Promise} = require("es6-promise");
const assign = require("object-assign");

/**
 * Transforms any input into a promise
 *
 * Arguments:
 * promise -> promise
 * function -> return result of the function
 * false -> rejected promise
 * * -> resolved promise
 *
 * @param payload
 * @returns {Promise}
 */
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

/**
 * Resolves a promise or an array of promises or an object of key => promise pairs
 * Returns a promise which provides the result
 *
 * @param promise
 * @returns {*}
 */
function resolvePromise(promise) {
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
	toPromise,
	resolvePromise
};
