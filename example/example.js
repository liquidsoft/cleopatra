"use strict";
/*eslint no-console:0 no-unused-vars:0*/

const {app} = require("../lib");

/*
 -------------------------------
 Initialize pipelines
 -------------------------------
 */

app.pipeline("goodbye").pipe((payload) => {
	console.log("Goodbye!");
});

app.pipeline("example").pipe((payload) => {

	console.log(payload);
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve();

		}, 2500);
	});

}).pipe(app.pipeline("goodbye"));

/*
 -------------------------------
 Dispatch
 -------------------------------
 */

app.dispatch("example", {
	someProperty: "testing"
});