const
    {promisify} = require("./promises"),
    Symbol = require("es6-symbol"),
    _queue = Symbol("queue");

/**
 * @class Pipeline
 */
module.exports = class Pipeline {

    constructor() {
        this[_queue] = [];
    }

    pipe(callback) {
        // Convert to function if pipeline was passed
        if (callback instanceof Pipeline) {
            let pipeline = callback;
            callback = function (payload) {
                return pipeline.dispatch(payload);
            };
        }

        this[_queue].push(callback);
        return this;
    }

    unpipe(callback) {
        let index = this[_queue].indexOf(callback);

        if (index > -1) {
            this[_queue].splice(index, 1);
        }

        return this;
    }

    dispatch(payload = {}) {
        let promise = promisify(payload);

        // Enqueue all callbacks
        this[_queue].forEach((callback) => {
            promise = promise.then(callback);
        });

        return promise;
    }
};