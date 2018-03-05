"use strict";
/*eslint no-console:0 no-unused-vars:0*/

const {createPipeline, registerGlobalInterceptor} = require("./../lib");

/////////////////////////////////
// Intercepted pipeline
/////////////////////////////////

// Design your node (global node in this case)
// - the node has a method that executes a piece of code then returns the new payload
class MyGlobalNode {
	run(payload) {
		console.log("My global piped node runs...");
		return payload;
	}
}

// Create your global interceptor
const myGlobalNodeInterceptor = node => node instanceof MyGlobalNode ? (payload => node.run(payload)) : null;

// The error handler is also regarded as a node. You may push whatever object to "report" and intercept
// it as usual
class MyErrorHandler {
	report(error) {
		console.error(error);
	}
}

// Create your interceptor
const myErrorHandlerInterceptor = node => node instanceof MyErrorHandler ? (payload => node.report(payload)) : null;

// Register both myGlobalNodeInterceptor and myErrorHandlerInterceptor as global interceptors
registerGlobalInterceptor(myErrorHandlerInterceptor, myGlobalNodeInterceptor);

// Design your node (local node in this case)
// - the node has a method that executes a piece of code then returns the new payload
class MyNode {
	runStuff(payload) {
		console.log("My pipe node runs stuff");
		return payload;
	}
}

// Create your interceptor
// - when an instance of MyNode is passed through the pipes we would like to execute the
// runStuff method on it therefore we return a callback that does exactly that
const myNodeInterceptor = node => node instanceof MyNode ? (payload => node.runStuff(payload)) : null;

const interceptedPipeline = createPipeline()
// register interceptor locally (local interceptors have priority over global)
	.intercept(myNodeInterceptor)
	// pipe an instance of MyGlobalNode
	.through(new MyGlobalNode())
	// pipe an instance of MyNode
	.through(new MyNode())
	// set error handler
	.report(new MyErrorHandler())
	// set last node (capturer)
	.to(payload => {
		console.log("done intercepting");

		// NOTE: From 0.2 you can omit returning the payload
		// In this case the original payload object will continue to be pushed through
	});

/////////////////////////////////
// Sample pipeline
/////////////////////////////////

const examplePipeline = createPipeline()
// set error handler
	.report(new MyErrorHandler())

	// wait 2.5 seconds at this node before continuing
	.through((payload) => {
		console.log(payload);
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(payload);

			}, 2500);
		});
	})

	// go through the intercepted pipeline
	.through(interceptedPipeline)

	// check if the payload has been pushed through
	.through(payload => {
		console.log(payload);
	})

	// set last node (will throw an error just for the sake of testing the handler)
	.to(payload => {
		throw new Error("Something went wrong");
	});

/////////////////////////////////
// Setup is ready. Dispatch something through the pipelines
/////////////////////////////////

examplePipeline.dispatch({
	someProperty: "testing"
});