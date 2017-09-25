"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var createPipeline = require("./createPipeline");

var Container = function () {
	function Container() {
		_classCallCheck(this, Container);

		this.pipelines = {};
	}

	_createClass(Container, [{
		key: "pipeline",
		value: function pipeline(name) {
			return this.pipelines[name] || (this.pipelines[name] = createPipeline());
		}
	}, {
		key: "dispatch",
		value: function dispatch(name) {
			var payload = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

			return this.pipeline(name).dispatch(payload);
		}
	}]);

	return Container;
}();

module.exports = Container;