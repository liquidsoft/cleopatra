"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require("./promises"),
    promisify = _require.promisify,
    _Symbol = require("es6-symbol"),
    _queue = _Symbol("queue");

/**
 * @class Pipeline
 */


module.exports = function () {
    function Pipeline() {
        _classCallCheck(this, Pipeline);

        this[_queue] = [];
    }

    _createClass(Pipeline, [{
        key: "pipe",
        value: function pipe(callback) {
            // Convert to function if pipeline was passed
            if (callback instanceof Pipeline) {
                var pipeline = callback;
                callback = function callback(payload) {
                    return pipeline.dispatch(payload);
                };
            }

            this[_queue].push(callback);
            return this;
        }
    }, {
        key: "unpipe",
        value: function unpipe(callback) {
            var index = this[_queue].indexOf(callback);

            if (index > -1) {
                this[_queue].splice(index, 1);
            }

            return this;
        }
    }, {
        key: "dispatch",
        value: function dispatch() {
            var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var promise = promisify(payload);

            // Enqueue all callbacks
            this[_queue].forEach(function (callback) {
                promise = promise.then(callback);
            });

            return promise;
        }
    }]);

    return Pipeline;
}();