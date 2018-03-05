"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require("./promise"),
    toPromise = _require.toPromise;

var _require2 = require("./interceptor"),
    interceptNode = _require2.interceptNode,
    registerGlobalInterceptor = _require2.registerGlobalInterceptor;

// pipeline interceptor


registerGlobalInterceptor(function (node) {
	return node instanceof Pipeline ? function (payload) {
		return node.dispatch(payload);
	} : null;
});

var Pipeline = function () {
	function Pipeline() {
		_classCallCheck(this, Pipeline);

		this.firstNode = null;
		this.lastNode = null;
		this.innerNodes = [];
		this.errorHandler = null;
		this.interceptors = [];

		// Soon to be deprecated functions (renamed)
		// Polyfill for backwards compatibility with 0.1
		this.pipe = this.through;
		this.capture = this.to;
	}

	_createClass(Pipeline, [{
		key: "from",
		value: function from(node) {
			if (arguments.length === 0) {
				return this.firstNode;
			}

			this.firstNode = node;
			return this;
		}
	}, {
		key: "to",
		value: function to(node) {
			if (arguments.length === 0) {
				return this.lastNode;
			}

			this.lastNode = node;
			return this;
		}
	}, {
		key: "through",
		value: function through() {
			for (var _len = arguments.length, nodes = Array(_len), _key = 0; _key < _len; _key++) {
				nodes[_key] = arguments[_key];
			}

			if (arguments.length === 0) {
				return [].concat(this.innerNodes);
			}

			this.innerNodes = this.innerNodes.concat(nodes);
			return this;
		}
	}, {
		key: "intercept",
		value: function intercept() {
			for (var _len2 = arguments.length, interceptors = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
				interceptors[_key2] = arguments[_key2];
			}

			this.interceptors = this.interceptors.concat(interceptors);
			return this;
		}
	}, {
		key: "report",
		value: function report(errorHandler) {
			this.errorHandler = errorHandler;
			return this;
		}
	}, {
		key: "dispatch",
		value: function dispatch() {
			var _this = this;

			var payload = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			var response = toPromise(payload);

			this.nodes.forEach(function (node) {
				var callback = interceptNode(node, [].concat(_this.interceptors));

				if (typeof callback === "function") {
					response = response.then(function (currentPayload) {
						return toPromise(currentPayload != undefined ? currentPayload : payload).then(callback);
					});
				}
			});

			if (this.errorHandler) {
				var callback = interceptNode(this.errorHandler, [].concat(this.interceptors));

				if (typeof callback === "function") {
					response = response.catch(callback);
				}
			}

			return response;
		}
	}, {
		key: "nodes",
		get: function get() {
			var nodes = [].concat(this.innerNodes);

			if (this.firstNode != undefined) {
				nodes.unshift(this.firstNode);
			}

			if (this.lastNode != undefined) {
				nodes.push(this.lastNode);
			}

			return nodes;
		}
	}]);

	return Pipeline;
}();

// generator


var createPipeline = function createPipeline() {
	return new Pipeline();
};

module.exports = {
	Pipeline,
	createPipeline
};