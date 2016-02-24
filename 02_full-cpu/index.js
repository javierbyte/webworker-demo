// A Blob object represents a file-like object of immutable, raw data
var bb = new Blob(['while(1){}'], {type : 'text/javascript'});

// A url that points to an in-memory "file."
code = window.URL.createObjectURL(bb);

// navigator.hardwareConcurrency tell us the number logical processors <3
for (var x = navigator.hardwareConcurrency; x--;) {
  console.log('Spawn worker ' + x)
  new Worker(code);
}
