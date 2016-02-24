function getShortestPath(coordArray) {
  var minValue;
  var shortestPath = null;

  permute(coordArray).forEach(currentArray => {
    var travelDistance = currentArray.reduce((res, coord, index) => {
      var distance;
      var nextCoord;

      if (index >= currentArray.length - 1) {
        return res;
      }

      nextCoord = currentArray[index + 1];

      distance = Math.sqrt(Math.pow(nextCoord[0] - coord[0], 2) + Math.pow(nextCoord[1] - coord[1], 2))

      return res + distance;
    }, 0)

    if (!shortestPath || minValue > travelDistance) {
      minValue = travelDistance;
      shortestPath = currentArray;
    }
  })

  return shortestPath;
}

function permute(data) {
  var permArr = [];
  var usedChars = [];

  function doPermute(input) {
    var i, ch;
    for (i = 0; i < input.length; i++) {
      ch = input.splice(i, 1)[0];
      usedChars.push(ch);
      if (input.length == 0) {
        permArr.push(usedChars.slice());
      }
      doPermute(input);
      input.splice(i, 0, ch);
      usedChars.pop();
    }
    return permArr;
  };
  return doPermute(data);
}
