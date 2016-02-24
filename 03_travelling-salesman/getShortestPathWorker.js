importScripts('getShortestPath.js')

onmessage = function(event) {
  var coords = event.data;

  postMessage(getShortestPath(coords));
}