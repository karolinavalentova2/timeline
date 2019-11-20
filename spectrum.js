/**************************** 
 
    code by http://xmas2016.petlatkea.dk/19/
    modified by Simon Erasmus Johansen

*****************************/
window.addEventListener("load", initialize);

function initialize() {
  initializeAudioAnalyser();

  window.requestAnimationFrame(doAnimations);
}

// ****************************************************************

// AUDIO

var audioinfo = {
  analyser: null,
  frequencyData: null
};

function initializeAudioAnalyser() {
  // build 100 audiobars in the spritesarea
  var area = document.querySelector("#spectrum");

  for (var i = 0; i < 100; i++) {
    var bar = document.createElement("div");
    bar.className = "audiobar";
    area.appendChild(bar);
  }

  // create analyser
  var context = new AudioContext();
  var audio = document.querySelector("#music");

  var audioSrc = context.createMediaElementSource(audio);
  audioinfo.analyser = context.createAnalyser();
  //    audioinfo.analyser.smoothingTimeConstant = 0;
  //    audioinfo.analyser.fftSize = 32768;

  // we have to connect the MediaElementSource with the analyser
  audioSrc.connect(audioinfo.analyser);
  // also connect the source to the output
  audioSrc.connect(context.destination);

  // frequencyBinCount tells you how many values you'll receive from the analyser
  audioinfo.frequencyData = new Float32Array(
    audioinfo.analyser.frequencyBinCount
  );
}

// ******************************************************

var lasttime;

function doAnimations() {
  requestAnimationFrame(doAnimations);

  // calculate deltaTime ...
  var now = Date.now();
  var deltaTime = (now - (lasttime || now)) / 1000;
  lasttime = now;

  doAudioAnalyser(deltaTime);
}

function doAudioAnalyser(deltaTime) {
  audioinfo.analyser.getFloatFrequencyData(audioinfo.frequencyData);
  // analyser has maxDecibels and minDecibels (-30 and -100 default, )
  // also a smoothing time-contant
  //    console.log("freq("+audioinfo.frequencyData.length+"): " + audioinfo.frequencyData );

  // the array of frequencydata contains 1024 values of frequency-data

  // loop through the array - set the heights of the audiobars to something
  var audiobars = document.querySelectorAll("#spectrum .audiobar");

  //    var dist = audioinfo.analyser.maxDecibels - audioinfo.analyser.minDecibels;

  var datasize = Math.floor(audioinfo.frequencyData.length * 0.75);
  var step = Math.floor(datasize / audiobars.length);

  for (var i = 0; i < audiobars.length; i++) {
    // load 10 values from the frequencyData, and find the average
    var avg = 0;
    for (var j = 0; j < step; j++) {
      avg += audioinfo.frequencyData[j + i * step];
    }
    var value = avg / step;

    //        var value = audioinfo.frequencyData[i*step];
    var fraction =
      (value - audioinfo.analyser.minDecibels) /
      (audioinfo.analyser.maxDecibels - audioinfo.analyser.minDecibels);
    if (fraction < 0 || fraction > 1) {
      fraction = 0;
    }

    // adjust fraction for lower frequencies
    //        if( i < 30 ) {
    //            fraction = fraction * Math.log10((i+3)/3);
    //        }

    //audiobars[i].style.height = fraction * 100 + "%";
    audiobars[i].style.transform = `scale(1,${fraction})`;

    //audiobars[i].style.height = ((fraction * Math.sqrt(i + 2)) / Math.sqrt(audiobars.length)) * 100 + "%";

    //        console.log(fraction);
  }
  //console.log("--------------------");
}
