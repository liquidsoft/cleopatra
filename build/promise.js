"use strict";

var _require = require("es6-promise"),
    Promise = _require.Promise;

var assign = require("object-assign");

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

	return new Promise(function (resolve, reject) {
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

	var promises = [];

	if (promise instanceof Array) {
		promise.forEach(function (promiseEntry) {
			promises.push(toPromise(promiseEntry));
		});
	} else if (promise && typeof promise === "object") {
		Object.keys(promise).forEach(function (key) {
			promises.push(toPromise(promise[key]));
		});
	} else {
		return toPromise(promise);
	}

	return Promise.all(promises).then(function (result) {
		if (promise instanceof Array) {
			return result;
		}

		var response = {};
		Object.keys(promise).forEach(function (key, index) {
			response[key] = result[index];
		});

		return response;
	});
}

module.exports = {
	toPromise,
	resolvePromise
};