"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _require = require("es6-promise"),
    Promise = _require.Promise;

/**
 * Transform everything into a promise
 *
 * @param {*} promiseLike
 * @returns {Promise}
 */

function promisify() {
    var promiseLike = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

    if (promiseLike instanceof Promise) {
        return promiseLike;
    }

    if (typeof promiseLike === "function") {
        return promisify(promiseLike());
    }

    return new Promise(function (resolve, reject) {
        promiseLike === false ? reject() : resolve(promiseLike);
    });
}

/**
 * Resolves one or more promise-likes
 *
 * @param {*} promiseLike
 * @returns {Promise}
 */
function resolve(promiseLike) {

    // Return if already promised
    if (promiseLike instanceof Promise) {
        return promiseLike;
    }

    var promises = [];

    if (promiseLike instanceof Array) {
        promiseLike.forEach(function (promiseLikeEntry) {
            promises.push(promisify(promiseLikeEntry));
        });
    } else if (promiseLike && (typeof promiseLike === "undefined" ? "undefined" : _typeof(promiseLike)) === "object") {
        Object.keys(promiseLike).forEach(function (key) {
            promises.push(promisify(promiseLike[key]));
        });
    } else {
        return promisify(promiseLike);
    }

    return Promise.all(promises).then(function (result) {
        if (promiseLike instanceof Array) {
            return result;
        }

        var response = {};
        Object.keys(promiseLike).forEach(function (key, index) {
            response[key] = result[index];
        });

        return response;
    });
}

exports.promisify = promisify;
exports.resolve = resolve;