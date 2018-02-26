"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var toPromise = require("./util").toPromise;

var pipelineInterceptor = function pipelineInterceptor(pipe) {
	return pipe instanceof Pipeline ? function (payload) {
		return pipe.dispatch(payload);
	} : pipe;
};

var getInterception = function getInterception(interceptors, pipe) {
	var interceptor = void 0;
	var interception = pipe;

	while (typeof interception !== "function" && interceptors.length > 0) {
		interceptor = interceptors.shift();
		interception = interceptor(pipe);
	}

	return typeof interception === "function" ? interception : null;
};

var Pipeline = function () {
	function Pipeline() {
		_classCallCheck(this, Pipeline);

		this.queue = [];
		this.capturer = null;
		this.reporter = null;
		this.interceptors = [pipelineInterceptor];
	}

	_createClass(Pipeline, [{
		key: "pipe",
		value: function pipe(next) {
			this.queue.push(next);
			return this;
		}
	}, {
		key: "intercept",
		value: function intercept(interceptor) {
			this.interceptors.push(interceptor);
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
		key: "report",
		value: function report(reporter) {
			this.reporter = reporter;
			return this;
		}
	}, {
		key: "dispatch",
		value: function dispatch() {
			var _this = this;

			var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var result = toPromise(payload);
			var queue = this.queue.concat(this.capturer ? [this.capturer] : []);

			queue.forEach(function (next) {
				var callback = getInterception(_this.interceptors, next);

				if (typeof callback === "function") {
					result = result.then(function (payload) {
						return toPromise(payload).then(callback);
					});
				}
			});

			if (typeof this.reporter === "function") {
				result = result.catch(this.reporter);
			}

			return result;
		}
	}]);

	return Pipeline;
}();

module.exports = Pipeline;