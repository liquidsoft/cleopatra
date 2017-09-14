# cleopatra
Pipeline driven application container.

```js
const {app} = require("cleopatra");

app.pipeline("log").pipe(function(payload) {
    console.log(payload);
    return payload;
});

app.pipeline("example").pipe(function(payload) {
    payload.firstPipe = "Passed through first pipe.";
    
    // You can return the actual payload
    // or a promise that would resolve payload for
    // the next elements in queue
    // NOTE: By returning false you can break the pipeline (main promise will be rejected)
    return payload;
    
}).pipe(function(payload) {
    payload.someOtherProperty = "Pushed another property into payload.";
    return payload;
    
}).pipe(app.pipeline("log"));

app.dispatch("example", { someProperty: "This is the payload object." });
```