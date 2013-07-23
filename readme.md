# WebRTC Audio Stream Dancing Sunflower
(yes, this is some next level shit!)

## WTF?

Stick on your favorite song, go here in a recent version of Chrome:

http://paulgcampbell.sunflower.jit.su/

Click the `allow` button.

Rock out with the original 80's dancing sunflower (yes, I am available for hire.)


## Err, WTF?

Right, so basically, we're using WebRTC's `getUserMedia` to grab the Audio stream from your computer's microphone.
  navigator.getUserMedia({audio:true}, gotAudio);

Next up we pass this into one of these fancy analyser jobs, to pull out info about the audio in the stream as it comes through:

  var context = new webkitAudioContext();
  var analyser = context.createAnalyser();



  function gotAudio(stream) {
    var source =  context.createMediaStreamSource(stream);
    source.connect(analyser);

    ...
  }

Finally we use some of the values this guy spits out to make that sunflower dance.

Did I mention I'm available for hire???

