# cleopatra
Module for creating pipelines

```js
const {createPipeline} = require("cleopatra");

const logPipeline = createPipeline().pipe(function(payload) {
    console.log(payload);
    return payload;
});

const mainPipeline = createPipeline().pipe(function(payload) {
    payload.firstPipe = "Passed through first pipe.";
    
    // You can return the actual payload
    // or a promise that would resolve payload for
    // the next elements in queue
    // NOTE: By returning false you can break the pipeline (main promise will be rejected)
    return payload;
    
}).pipe(function(payload) {
    payload.someOtherProperty = "Pushed another property into payload.";
    return payload;
    
}).pipe(logPipeline);

// The capture method is similar to a pipe but is attached at the end
// of the pipeline
mainPipeline.capture(payload => console.log("Finished"));

mainPipeline.dispatch({ someProperty: "This is the payload object." });
```