const pace = 10;
const dataLink = "https://timeline-5237.restdb.io/rest/timeline-data";
let dataLoaded = null;

function getData() {
  fetch(dataLink, {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=uf-8",
        "x-apikey": "5dcad81864e7774913b6ebd3",
        "cache-control": "no-cache"
      }
    })
    .then(result => result.json())
    .then(res => {
      const data = res.sort((a, b) => (a.year > b.year ? 1 : b.year > a.year ? -1 : 0));
      createInitialTimeline(data);
    });
}

getData();

function populateInfobox(data) {
  console.log(data);
  document.querySelector("#topbar").innerHTML = data.origin;

  fetch("./assets/masking_img.svg").then(e => e.text()).then(svg => {
    document.querySelector("#content #svgImage").innerHTML = svg;
    document.querySelector(".clip-svg #imageToChange").href.baseVal = `assets/${data.year}.jpg`;
  });

  document.querySelector("#modalGenre").innerHTML = data.genre;
  document.querySelector("#modalDate").innerHTML = data.year;
  document.querySelector("#modalOrigin").innerHTML = data.origin;
  document.querySelector("#modalInfo").innerHTML = data.info;


}

function getPace() {
  if ($(window).width() <= 920 && !($(window).width() <= 460)) {
    return 2 * pace;
  }

  if ($(window).width() > 920) {
    return pace;
  }

  if ($(window).width() <= 460) {
    return 3 * pace;
  }
}

function createInitialTimeline(dataCircles) {

  const currentPace = getPace();

  dataLoaded = dataCircles;

  const initialTimelineMain = 0;

  populateInfobox(dataLoaded[0]);

  dataCircles.forEach((value, index) => {

    const distanceFromMain = initialTimelineMain - index;

    let containerTop = `<div class="container-top"></div>`;

    let circle = `<div id=${value.year} class="circle">${value.year}</div>`;

    if (index === initialTimelineMain) {
      circle = `<div id=${value.year} class="circle main">${value.year}</div>`;

    } else if (index === initialTimelineMain - 1) {
      circle = `<div id=${value.year} class="circle prev">${value.year}</div>`;
    } else if (index === initialTimelineMain + 1) {
      circle = `<div id=${value.year} class="circle next">${value.year}</div>`;
    }



    $(".timeline_circles").append(circle);

    $(".circle").get(index).style.left = `${50 -
      distanceFromMain * currentPace}%`;
  });

  // $('.timeline_circles').css({
  //     transition: "transform 1s",
  //     transform: "translateX(" + 0 + "px)"
  // });
  // setTimeout(function () {
  //     $('.timeline_circles').css({
  //         transition: "none"
  //     })
  // }, 1000);
}

$(document).on("click mousewheel DOMMouseScroll", ".circle", function (e) {
  if ($(this).hasClass("main")) {
    return;
  }

  const years = dataLoaded.map(element => element.year);

  const indexOfMain = years.indexOf($(".circle.main").text()),
    indexOfThis = years.indexOf($(this).text());

  populateInfobox(dataLoaded[indexOfThis]);

  const difference = indexOfMain - indexOfThis;

  const currentValueRaw = $(".timeline_circles").css("transform");
  let lastIndexCommma = currentValueRaw.lastIndexOf(",");
  let newString = currentValueRaw.substring(0, lastIndexCommma);
  let lastIndexComma2 = newString.lastIndexOf(",");
  const currentValue = parseInt(
    newString.substring(lastIndexComma2 + 1).trim()
  );

  const fullScreen = $(window).width();

  let percent = 0;

  if (currentValue !== 0) {
    percent = (currentValue * 100) / fullScreen;
    percent = Math.round(percent);
  }

  const currentPace = getPace();

  adjustTimeline(percent + difference * currentPace);

  resetMain(this);
});

function adjustTimeline(size) {
  $(".timeline_circles").css({
    transition: "transform 1s",
    transform: "translateX(" + size + "%)"
  });
  setTimeout(function () {
    $(".timeline_circles").css({
      transition: "none"
    });
  }, 1000);
}

function resetMain(newMain) {
  $(".infobox").removeClass("show");
  $(`.${newMain.id}`).addClass("show");

  $(".circle").removeClass("main");
  $(".circle").removeClass("prev");
  $(".circle").removeClass("next");

  setTimeout(() => {
    $(newMain).text(newMain.id);
    if ($(newMain).next().length > 0) {
      $(newMain)
        .next()
        .text(newMain.nextSibling.id);
    }
    if ($(newMain).prev().length > 0) {
      $(newMain)
        .prev()
        .text(newMain.previousSibling.id);
    }
  }, 300);

  $(newMain).addClass("main");
  $(newMain)
    .next()
    .addClass("next");
  $(newMain)
    .prev()
    .addClass("prev");
}

// --------------------------------------- music player and donut chart
let isMusicPlaying = false;
const MusicPlayer = new Audio("./assets/intro.mp3");
let MusicPlayerPercentageUpdater;

function doStart() {
  loadSVG();
}

async function loadSVG() {
  try {
    const SVG = {
      logo: await (await fetch("./assets/logo.svg")).text(),
      playButton: await (await fetch("./assets/play-button.svg")).text(),
      progressDonut: await (await fetch("./assets/progress-donut.svg")).text(),
      progressDonutTime: await (await fetch("./assets/progress-donut-time.svg")).text(),
    };

    document.getElementById("logo-container").innerHTML = SVG.logo;
    document.getElementById("play-button-SVG").innerHTML = SVG.playButton;
    startMusic();
    document.getElementById("progressDonut").innerHTML = SVG.progressDonut;
    document.getElementById("progressDonut2").innerHTML = SVG.progressDonutTime;

  } catch (error) {
    console.error("Cannot read svg file, reason: " + error.message);
  }
}

function startMusic() {
  const playButton = document.getElementById("playBtn");

  playButton.onclick = async () => {
    if (isMusicPlaying) {
      MusicPlayer.pause();
      //MusicPlayer.currentTime = 0;
      isMusicPlaying = false;
      document.getElementById("playMusic").style.display = "block";
      document.getElementById("stopMusic").style.display = "none";
      // clearInterval(MusicPlayerPercentageUpdater);
      // document.getElementById('donutText').textContent = '0%';
      // doResetPlayDonut();
    } else {
      await MusicPlayer.play();
      isMusicPlaying = true;
      document.getElementById("playMusic").style.display = "none";
      document.getElementById("stopMusic").style.display = "block";
    }

    MusicPlayerPercentageUpdater = setInterval(() => {
      const currentPlayedPercent = calculatePercentage(
        MusicPlayer.currentTime,
        MusicPlayer.duration
      );
      document.getElementById("donutText").textContent =
        currentPlayedPercent + "%";

      doStartPlayDonut(currentPlayedPercent);
      doStartTimeDonut(currentPlayedPercent);

    }, 500);
  };
}

function doStartPlayDonut(currentPlayedPercent) {
  document
    .getElementById("donutFill")
    .setAttribute(
      "stroke-dasharray",
      `${currentPlayedPercent} ${100 - parseInt(currentPlayedPercent)}`
    );
}

function doResetPlayDonut() {
  document
    .getElementById("donutFill")
    .setAttribute("stroke-dasharray", `0 100`);
}

function calculatePercentage(currentSeconds, totalSeconds) {
  return String(Math.round((currentSeconds / totalSeconds) * 100));
}

function doStartTimeDonut(currentPlayedPercent) {
    document.getElementById('timeDonutFill').setAttribute('stroke-dasharray', `${100 - parseInt(currentPlayedPercent)} ${currentPlayedPercent}`);
    const time =  millisToMinutesAndSeconds(MusicPlayer.duration - MusicPlayer.currentTime);

    const test = document.getElementById('timeDonutText');
    test.textContent = time;
}

// ----------- Source: https://stackoverflow.com/questions/21294302/converting-milliseconds-to-minutes-and-seconds-with-javascript
function millisToMinutesAndSeconds(millis) {
    millis = millis  * 1000;
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}

function startSpectrum() {
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
    // console.log("freq("+audioinfo.frequencyData.length+"): " + audioinfo.frequencyData );

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
}
startSpectrum();
document.body.onload = doStart;
console.log(
  "%cHello World",
  "background: black; color: white; font-size: 25px; padding: 5px; box-shadow: 5px 5px 10px black;"
);
