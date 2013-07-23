(function() {
navigator.getUserMedia ||
  (navigator.getUserMedia = navigator.mozGetUserMedia ||
  navigator.webkitGetUserMedia || navigator.msGetUserMedia);

var canvas = document.getElementById('fft');
var ctx = canvas.getContext('2d');
canvas.width = document.body.clientWidth / 1.4;


const CANVAS_HEIGHT = canvas.height;
const CANVAS_WIDTH = canvas.width;

var context = new webkitAudioContext();
var analyser = context.createAnalyser();

 var logged =1;


function getAverageVolume(array) {
    var values = 0;
    var average;

    var length = array.length;

    // get all the frequency amplitudes
    for (var i = 0; i < length; i++) {
        values += array[i];
    }

    average = values / length;
    return average;
}

function rafCallback(time) {
  window.webkitRequestAnimationFrame(rafCallback, canvas);

  var freqByteData = new Uint8Array(analyser.frequencyBinCount);
  analyser.getByteFrequencyData(freqByteData);

  if(logged<100)
  {
    console.log(getAverageVolume(freqByteData))
    logged++;
  }

  var SPACER_WIDTH = 10;
  var BAR_WIDTH = 5;
  var OFFSET = 100;
  var numBars = Math.round(CANVAS_WIDTH / SPACER_WIDTH);

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = '#F6D565';
  ctx.lineCap = 'round';


  for (var i = 0; i < numBars; ++i) {
    var magnitude = freqByteData[i + OFFSET];
    ctx.fillRect(i * SPACER_WIDTH, CANVAS_HEIGHT, BAR_WIDTH, -magnitude);
  }
}

function onLoad(e) {
  navigator.getUserMedia({audio:true}, gotAudio);
  function gotAudio(stream) {
    var source =  context.createMediaStreamSource(stream);
    source.connect(analyser);

    rafCallback();
  }
}




window.addEventListener('load', onLoad, false);
})();
