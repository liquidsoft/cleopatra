const
    Pipeline = require("./pipeline"),
    Symbol = require("es6-symbol"),
    _pipelines = Symbol("pipelines");

module.exports = class Container {

    constructor() {
        this[_pipelines] = {};
    }

    pipeline(name) {
        if (this[_pipelines][name] == undefined) {
            this[_pipelines][name] = new Pipeline();
        }

        return this[_pipelines][name];
    }

    dispatch(name, payload = {}) {
        return this.pipeline(name).dispatch(payload);
    }

};