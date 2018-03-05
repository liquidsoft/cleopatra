// global interceptors
let globalInterceptors = [];

// interception helper
function interceptNode(node, interceptors = []) {
	if (node == undefined) {
		return;
	}

	// Merge with global interceptors
	interceptors = interceptors.concat(globalInterceptors);

	let interceptor;
	let interception;

	while ((typeof interception !== "function") && (interceptors.length > 0)) {
		interceptor = interceptors.shift();
		interception = interceptor(node);
	}

	if (typeof interception !== "function") {
		interception = node;
	}

	return typeof interception === "function" ? interception : null;
}

function registerGlobalInterceptor(...interceptors) {
	globalInterceptors = globalInterceptors.concat(interceptors);
	return [].concat(globalInterceptors);
}

module.exports = {
	interceptNode,
	registerGlobalInterceptor
};