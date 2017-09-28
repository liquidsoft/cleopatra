"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var toPromise = require("./util").toPromise;

var Pipeline = function () {
	function Pipeline() {
		_classCallCheck(this, Pipeline);

		this.queue = [];
		this.capturer = null;
	}

	_createClass(Pipeline, [{
		key: "pipe",
		value: function pipe(next) {
			this.queue.push(next);
			return this;
		}
	}, {
		key: "capture",
		value: function capture(capturer) {
			this.capturer = capturer;
			return this;
		}
	}, {
		key: "drop",
		value: function drop(pipe) {
			var index = this.queue.indexOf(pipe);

			if (index > -1) {
				this.queue.splice(index, 1);
			}

			return this;
		}
	}, {
		key: "dispatch",
		value: function dispatch() {
			var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var result = toPromise(payload);
			var queue = this.queue.concat(this.capturer ? [this.capturer] : []);

			queue.forEach(function (next) {
				result = result.then(next instanceof Pipeline ? function (payload) {
					return next.dispatch(payload);
				} : next);
			});

			return result;
		}
	}]);

	return Pipeline;
}();

module.exports = Pipeline;