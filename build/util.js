"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = require("es6-promise"),
    Promise = _require.Promise;

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

function resolve(promise) {
	if (promise instanceof Promise) {
		return promise;
	}

	var promises = [];

	if (promise instanceof Array) {
		promise.forEach(function (promiseEntry) {
			promises.push(toPromise(promiseEntry));
		});
	} else if (promise && (typeof promise === "undefined" ? "undefined" : _typeof(promise)) === "object") {
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
	toPromise: toPromise,
	resolve: resolve
};