setTimeout(() => {
    console.log("1. setTimeout");
}, 0);

setImmediate(() => {
    console.log("2. setImmediate");
});

process.nextTick(() => {
    console.log("3. process.nextTick");
});

Promise.resolve().then(() => {
    console.log("4. Promise.then");
});

console.log("5. Sync code");

/*
  EXPLANATION OF THE EVENT LOOP ORDER:
  1. "5. Sync code" executes first because it is synchronous and blocks the main thread.
  2. "3. process.nextTick" executes next because its queue is processed immediately after the current operation, before micro-tasks.
  3. "4. Promise.then" executes after process.nextTick queue empties, within the micro-task phase before macro-tasks.
  4. "1. setTimeout" executes in the Timers phase of the next Event Loop iteration.
  5. "2. setImmediate" executes in the Check phase, which runs after Poll/Timers phases handle pending callbacks.
*/
