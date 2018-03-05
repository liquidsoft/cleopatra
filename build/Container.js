"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _require = require("./pipeline"),
    createPipeline = _require.createPipeline;

var Container = function () {
	function Container() {
		_classCallCheck(this, Container);

		this.pipelines = {};
		this.errorHandler = null;
	}

	_createClass(Container, [{
		key: "pipeline",
		value: function pipeline(name) {
			if (this.pipelines[name] == undefined) {
				this.pipelines[name] = createPipeline();
				this.pipelines[name].report(this.errorHandler);
			}

			return this.pipelines[name];
		}
	}, {
		key: "pipe",
		value: function pipe(name) {
			var _pipeline;

			for (var _len = arguments.length, nodes = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
				nodes[_key - 1] = arguments[_key];
			}

			(_pipeline = this.pipeline(name)).through.apply(_pipeline, nodes);
			return this;
		}
	}, {
		key: "dispatch",
		value: function dispatch(name, payload) {
			return this.pipeline(name).dispatch(payload);
		}
	}, {
		key: "report",
		value: function report(errorHandler) {
			this.errorHandler = errorHandler;
			return this;
		}
	}]);

	return Container;
}();

// generator


var createContainer = function createContainer() {
	return new Container();
};

module.exports = {
	Container,
	createContainer
};