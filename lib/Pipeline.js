"use strict";
const {toPromise} = require("./promise");
const {interceptNode, registerGlobalInterceptor} = require("./interceptor");

// pipeline interceptor
registerGlobalInterceptor(node => node instanceof Pipeline ? (payload => node.dispatch(payload)) : null);

class Pipeline {

	constructor() {
		this.firstNode = null;
		this.lastNode = null;
		this.eagerNodes = [];
		this.innerNodes = [];
		this.deferedNodes = [];
		this.errorHandler = null;
		this.interceptors = [];

		// Soon to be deprecated functions (renamed)
		// Polyfill for backwards compatibility with 0.1
		this.pipe = this.through;
		this.capture = this.to;
	}

	from(node) {
		if (arguments.length === 0) {
			return this.firstNode;
		}

		this.firstNode = node;
		return this;
	}

	to(node) {
		if (arguments.length === 0) {
			return this.lastNode;
		}

		this.lastNode = node;
		return this;
	}

	through(...nodes) {
		if (arguments.length === 0) {
			return [].concat(this.innerNodes);
		}

		this.innerNodes = this.innerNodes.concat(nodes);
		return this;
	}

	eager(...nodes) {
		if (arguments.length === 0) {
			return [].concat(this.eagerNodes);
		}

		this.eagerNodes = this.eagerNodes.concat(nodes);
		return this;
	}

	defer(...nodes) {
		if (arguments.length === 0) {
			return [].concat(this.deferedNodes);
		}

		this.deferedNodes = this.deferedNodes.concat(nodes);
		return this;
	}

	intercept(...interceptors) {
		this.interceptors = this.interceptors.concat(interceptors);
		return this;
	}

	get nodes() {
		const nodes = [].concat(this.eagerNodes, this.innerNodes, this.deferedNodes);

		if (this.firstNode != undefined) {
			nodes.unshift(this.firstNode);
		}

		if (this.lastNode != undefined) {
			nodes.push(this.lastNode);
		}

		return nodes;
	}

	report(errorHandler) {
		this.errorHandler = errorHandler;
		return this;
	}

	dispatch(payload = {}) {
		let response = toPromise(payload);

		this.nodes.forEach(node => {
			const callback = interceptNode(node, [].concat(this.interceptors));

			if (typeof callback === "function") {
				response = response.then(
					currentPayload => toPromise(currentPayload != undefined ? currentPayload : payload).then(callback)
				);
			}
		});

		if (this.errorHandler) {
			const callback = interceptNode(this.errorHandler, [].concat(this.interceptors));

			if (typeof callback === "function") {
				response = response.catch(callback);
			}
		}

		return response;
	}

}

// generator
const createPipeline = () => new Pipeline();

module.exports = {
	Pipeline,
	createPipeline
};