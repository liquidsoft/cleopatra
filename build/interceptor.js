"use strict";

// global interceptors
var globalInterceptors = [];

// interception helper
function interceptNode(node) {
	var interceptors = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

	if (node == undefined) {
		return;
	}

	// Merge with global interceptors
	interceptors = interceptors.concat(globalInterceptors);

	var interceptor = void 0;
	var interception = void 0;

	while (typeof interception !== "function" && interceptors.length > 0) {
		interceptor = interceptors.shift();
		interception = interceptor(node);
	}

	if (typeof interception !== "function") {
		interception = node;
	}

	return typeof interception === "function" ? interception : null;
}

function registerGlobalInterceptor() {
	for (var _len = arguments.length, interceptors = Array(_len), _key = 0; _key < _len; _key++) {
		interceptors[_key] = arguments[_key];
	}

	globalInterceptors = globalInterceptors.concat(interceptors);
	return [].concat(globalInterceptors);
}

module.exports = {
	interceptNode,
	registerGlobalInterceptor
};