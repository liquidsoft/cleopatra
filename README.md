# cleopatra
Module for creating pipelines and managing promise based pipelines.

```js
const {createPipeline} = require("cleopatra");
const myPipeline = createPipeline()
	.from(payload => {
		console.log("Initial payload: ", payload);
	})
	.to(payload => {
		console.log("Final payload: ", payload);
	})
	.through(payload => {
		payload.mutation = "Changed this attribute";
	});

myPipeline.dispatch({ myProp: "Initial value" }).then(result => {
	console.log("Pipeline finished with result", result);
});
```

## Pipeline
A pipeline is a directional set of nodes that digest an object (the **payload**) passing it through to the other nodes. Each node can hold for as long as is needed or even change the payload before passing it further (**async**).

Each pipeline consists of three elements:
- an initial node (**from**)
- an array of inner nodes
- a final node (**to**)

The payload object is sent through the pipeline starting at the initial node and ending at the final node (if no error or rejection is encountered within the process).

A **node** is typically a callback that receives a payload object and does something with it. The callback may return nothing (original payload is passed through), a new payload object, a promise (**async**) or **false** (the pipeline chain is broken and the main promise is rejected).

A **report** node may also be defined that would capture any errors and pass them through.
```js
createPipeline().report(error => console.error(error));
```
**Dispatching** a payload through the pipeline returns a promise that provides the result of the chain.

### Methods
> **from(node)**

Sets the initial node in the pipeline.

> **to(node)**

Sets the last node in the pipeline.

> **through(...nodes)**

Pushes new nodes into the pipeline.

> **report(node)**

Sets the error handling node.

> **intercept(...interceptors)**

Registers a new interceptor into the pipeline.

> **dispatch(payload = {})**

Sends a payload through the pipeline and returns a promise.

> **pipe(...nodes)**

Alias of **through**.

> **capture(node)**

Alias of **to**.

### Interceptors
While a node is typically a function it can be any kind of variable. By default you may pass a **function** or a **pipeline**, otherwise you will have to define interceptors.

An interceptor is a function that receives a node and returns a callback that connects to that node. Interceptors will be passed each node in the pipeline (including the **report** node) and should return a **callback** if the node matches the case or nothing (**null**). First interceptor to return a callback will be used for that specific node.

```js
class MyNode {
	run(payload) {
		console.log(payload);
	}
}

const myNodeInterceptor = node => {
	return node instanceof MyNode ? (payload) => node.run(payload) : null;
};

createPipeline().intercept(myNodeInterceptor).through(new MyNode());
```
Interceptors can also be registered globally, however, the local interceptors will always have first choice.
```js
const {registerGlobalInterceptor, createPipeline} = require("cleopatra");

registerGlobalInterceptor(myNodeInterceptor);
createPipeline().through(new MyNode());
```
## Container
A container is a simple pipeline manager that stores and handles named pipelines.

### Methods
> **pipeline(name)**

Creates or returns the pipeline with that name.

> **pipe(name, ...nodes)**

Pushes new nodes into the pipeline with that name.

> **report(node)**

Sets the error handler node at the container level. Pipelines within this container will report errors through this handler unless manually set to report through something else.

> **dispatch(name, payload = {})**

Dispatches the payload through the pipeline with that name.

```js
const {createContainer} = require("cleopatra");
const container = createContainer().report(error => console.error(error));

container.pipe("my-pipeline", payload => { console.log(payload); });
container.dispatch("my-other-pipeline");
container.dispatch("my-pipeline", {prop: "the payload"});
```