"use strict";
/*eslint no-console:0 no-unused-vars:0*/

const {createPipeline} = require("./../lib");

/*
 -------------------------------
 Initialize pipelines
 -------------------------------
 */

const goodbyePipeline = createPipeline().pipe((payload) => {
	console.log("Goodbye!");
});

const examplePipeline = createPipeline().pipe((payload) => {

	console.log(payload);
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();

		}, 2500);
	});

}).pipe(goodbyePipeline);

/*
 -------------------------------
 Dispatch
 -------------------------------
 */

examplePipeline.dispatch({
	someProperty: "testing"
});