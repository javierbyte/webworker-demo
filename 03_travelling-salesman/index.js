var content = document.getElementById('content');
var canvas = document.getElementById('canvas');

var worker = {
  0: new Worker('getShortestPathWorker.js'),
  1: new Worker('getShortestPathWorker.js')
}

function getShortestPathWorker(coords, callback, containerId) {
  worker[containerId].terminate();
  worker[containerId] = new Worker('getShortestPathWorker.js');

  worker[containerId].postMessage(coords);
  worker[containerId].onmessage = function(event) {
    callback(event.data);
  }
}

var ctx = canvas.getContext('2d');

var dotContainer = [
  document.getElementById('dotContainer0'),
  document.getElementById('dotContainer1')
];

var state = {
  first: [],
  second: [],

  path: [[], []]
}

function onDotClick(event, coordId, containerId) {
  event.stopPropagation();

  if (containerId === 0) {
    state.first.splice(coordId, 1);
    draw(state.first, containerId);
  } else {
    state.second.splice(coordId, 1);
    draw(state.second, containerId);
  }
}

var totalBenchmark = null;

randomButton.addEventListener('click', function () {
  var contentSize = content.getBoundingClientRect();
  var width = contentSize.width;
  var height = contentSize.height;

  state.first = [];
  state.second = [];

  for (var x = 9; x--;) {
    state.first.push([Math.floor(width * Math.random()), Math.floor(height * Math.random())]);
    state.second.push([Math.floor(width * Math.random()), Math.floor(height * Math.random())]);
  }

  totalBenchmark = new Date().getTime()

  window.setTimeout(function() {draw(state.first, 0)}, 0)
  window.setTimeout(function() {draw(state.second, 1)}, 0)
})

content.addEventListener('click', function (e) {
  var x = e.clientX;
  var y = e.clientY;

  state.first.push([x, y])

  draw(state.first, 0)
}, false);

content.addEventListener('contextmenu', function (e) {
  e.preventDefault();

  var x = e.clientX;
  var y = e.clientY;

  state.second.push([x, y])

  draw(state.second, 1)

  return false
}, false);

var benchmark = [];

function draw (coords, containerId) {
  drawDots(coords, containerId)

  console.log(containerId, ' started')
  benchmark[containerId] = new Date().getTime()

  // getShortestPathAsync
  // getShortestPathWorker
  getShortestPathWorker(coords, function(path) {
    state.path[containerId] = path
    drawPath()

    console.log(containerId, ' finished in ', new Date().getTime() - benchmark[containerId])
    benchmark[containerId] = null

    if (benchmark[0] === null && benchmark[1] === null && totalBenchmark) {
      console.log('\nAll finished', new Date().getTime() - totalBenchmark)
    }
  }, containerId)
}

function drawDots(coords, containerId) {
  dotContainer[containerId].innerHTML = coords.map((coord, coordId) => {
    return `<div onclick="onDotClick(event, ${coordId}, ${containerId})" data-dotid="${coordId}" class="dot" style="left: ${coord[0]}px; top:${coord[1]}px"></div>`
  }).join('')
}

function drawPath() {
  var contentSize = content.getBoundingClientRect();

  canvas.width = contentSize.width;
  canvas.height = contentSize.height;

  function drawPath(toDraw, color) {
    if (!toDraw || toDraw.length === 0) return;

    ctx.beginPath();
    ctx.moveTo(toDraw[0][0], toDraw[0][1]);

    toDraw.forEach(dot => {
      ctx.lineTo(dot[0], dot[1]);
    })

    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  drawPath(state.path[0], '#FFDC00')
  drawPath(state.path[1], '#7FDBFF')
}
