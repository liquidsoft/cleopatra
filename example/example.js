"use strict";
/*eslint no-console:0 no-unused-vars:0*/

const {createPipeline} = require("./../lib");

/////////////////////////////////
// Intercepted pipeline
/////////////////////////////////

class MyPipe {
	runStuff(payload) {
		console.log("My pipe runs stuff");
		return payload;
	}
}

const myPipeInterceptor = (pipe) => {
	return pipe instanceof MyPipe ?
		payload => pipe.runStuff(payload) :
		null;
};

const interceptedPipeline = createPipeline()
	.intercept(myPipeInterceptor).pipe(new MyPipe())
	.capture(payload => {
		console.log("done intercepting");
		return payload;
	});

/////////////////////////////////
// Sample pipeline with report and throw
/////////////////////////////////

const examplePipeline = createPipeline()
	.report(error => console.log(error))
	.pipe((payload) => {
		console.log(payload);
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(payload);

			}, 2500);
		});

	})
	.pipe(interceptedPipeline)
	.capture(payload => {
		console.log("Done.")
		return payload;
	});

/*
 -------------------------------
 Dispatch
 -------------------------------
 */

examplePipeline.dispatch({
	someProperty: "testing"
});