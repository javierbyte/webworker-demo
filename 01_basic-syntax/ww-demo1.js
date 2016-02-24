// webworker-demo1.js

onmessage = function (event) {
  postMessage(event.data + ' world');
}
