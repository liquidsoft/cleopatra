const {app} = require("../build");

/*
 -------------------------------
 Initialize pipelines
 -------------------------------
 */

app.pipeline("goodbye").pipe((payload) => {
    console.log("Goodbye!");
});

app.pipeline("example")
    .pipe((payload) => {
        console.log(payload);
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();

            }, 2500);
        });
    })
    .pipe(app.pipeline("goodbye"));

/*
 -------------------------------
 Dispatch
 -------------------------------
 */

app.dispatch("example", {
    someProperty: "testing"
});