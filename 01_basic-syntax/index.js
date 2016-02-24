// index.js

var webWorker = new Worker('ww-demo1.js');

webWorker.onmessage = function (event) {
  console.log('Respuesta! ' + event.data);
};

webWorker.postMessage('hello');
