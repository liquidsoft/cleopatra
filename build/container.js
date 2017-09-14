"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Pipeline = require("./pipeline"),
    _Symbol = require("es6-symbol"),
    _pipelines = _Symbol("pipelines");

module.exports = function () {
    function Container() {
        _classCallCheck(this, Container);

        this[_pipelines] = {};
    }

    _createClass(Container, [{
        key: "pipeline",
        value: function pipeline(name) {
            if (this[_pipelines][name] == undefined) {
                this[_pipelines][name] = new Pipeline();
            }

            return this[_pipelines][name];
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