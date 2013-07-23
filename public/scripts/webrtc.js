(function() {

  // shim!
  navigator.getUserMedia ||
    (navigator.getUserMedia = navigator.mozGetUserMedia ||
    navigator.webkitGetUserMedia || navigator.msGetUserMedia);

  window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame    ||
            function( callback ){
              window.setTimeout(callback, 1000 / 60);
            };
  })();


  // Graphic equaliser
  var graphicEqualiserCanvas = document.getElementById('graphicEqualiser');
  var geCtx = graphicEqualiserCanvas.getContext('2d');
  graphicEqualiserCanvas.width = graphicEqualiserCanvas.parentNode.clientWidth;
  const GE_CANVAS_HEIGHT = graphicEqualiserCanvas.height;
  const GE_CANVAS_WIDTH = graphicEqualiserCanvas.width;

  function paintTheGraphicEqualiser(freqByteData) {
    var SPACER_WIDTH = 10;
    var BAR_WIDTH = 5;
    var OFFSET = 100;
    var numBars = Math.round(GE_CANVAS_WIDTH / SPACER_WIDTH);

    geCtx.clearRect(0, 0, GE_CANVAS_WIDTH, GE_CANVAS_HEIGHT);
    geCtx.fillStyle = '#F6D565';
    geCtx.lineCap = 'round';

    for (var i = 0; i < numBars; ++i) {
      var magnitude = freqByteData[i + OFFSET];
      geCtx.fillRect(i * SPACER_WIDTH, GE_CANVAS_HEIGHT, BAR_WIDTH, -magnitude/2);
    }
  }

  // Sunflower
  var sunflowerCanvas = document.getElementById('sunflower') ;
  var sunflowerContext = sunflowerCanvas.getContext('2d');
  var sunflowerSpeed = 3;
  var swingPosition = 100;
  var swingDirection = +1;


  function drawHeadAndPot (){
  // draw the face and flower pot
    sunflowerContext.beginPath();
    sunflowerContext.arc(100, 45, 40, 0, 2 * Math.PI, false);
    sunflowerContext.fillStyle = 'yellow';
    sunflowerContext.fill();
    sunflowerContext.lineWidth = 3;
    sunflowerContext.strokeStyle = '#003300';
    sunflowerContext.stroke();
  }

  function drawSunflower() {
    sunflowerContext.clearRect(0, 0, sunflowerCanvas.width, sunflowerCanvas.height);

    drawHeadAndPot();


    if(swingDirection == +1) {
      swingPosition = swingPosition + sunflowerSpeed;;
      if(swingPosition >200) {
        swingDirection = -1;
      }
    }
    else {
      swingPosition = swingPosition - sunflowerSpeed;
            if(swingPosition <1) {
              swingDirection = +1;
            }
    }

    sunflowerContext.beginPath();
    sunflowerContext.moveTo(100, 84);
    sunflowerContext.bezierCurveTo(swingPosition, 145, 100, 145, 100, 200);
    sunflowerContext.lineWidth = 5;
    sunflowerContext.strokeStyle = 'green';
    sunflowerContext.stroke();

  }

  var context = new webkitAudioContext();
  var analyser = context.createAnalyser();

  function getAverageVolume(array) {
    var values = 0;
    var average;
    var length = array.length;
    for (var i = 0; i < length; i++) {
        values += array[i];
    }
    average = values / length;
    return average;
  }


  function rafCallback(time) {

    requestAnimFrame(rafCallback, graphicEqualiserCanvas);
    drawSunflower();
    var freqByteData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(freqByteData);

    //set volume
    var volume = getAverageVolume(freqByteData);
    if(volume < 10) {
      sunflowerSpeed = 0
    }
    else  {
      sunflowerSpeed = volume / 10
    }
    paintTheGraphicEqualiser(freqByteData);
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
