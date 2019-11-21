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
      res.sort((a, b) => (a.year > b.year ? 1 : b.year > a.year ? -1 : 0));
      createInitialTimeline(res);
    });
}

getData();

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

  const initialTimelineMain = Math.floor(dataCircles.length / 2);

  dataCircles.forEach((value, index) => {
    const distanceFromMain = initialTimelineMain - index;

    // <img src="assets/${value.year}.jpg"/>

    let infoBox = `<div class="infobox ${value.year}">
        <div class="modal-img"><svg class="clip-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 720 720">

        <image width="720" height="720" href="assets/${value.year}.jpg" clip-path="url(#masking)" />
      
        <clipPath id="masking">
            <rect class="mscBox_01" x="090" y="0" width="80" height="80"/>
            <rect class="mscBox_02" x="180" y="0" width="80" height="80"/>
            <rect class="mscBox_03" x="270" y="0" width="80" height="80"/>
            <rect class="mscBox_04" x="360" y="0" width="80" height="80"/>
            <rect class="mscBox_05" x="450" y="0" width="80" height="80"/>
            <rect class="mscBox_06" x="540" y="0" width="80" height="80"/>
            <rect class="mscBox_07" x="630" y="0" width="80" height="80"/>
            <rect class="mscBox_08" x="090" y="090" width="80" height="80"/>
            <rect class="mscBox_09" x="180" y="090" width="80" height="80"/>
            <rect class="mscBox_10" x="270" y="090" width="80" height="80"/>
            <rect class="mscBox_11" x="360" y="090" width="80" height="80"/>
            <rect class="mscBox_12" x="450" y="090" width="80" height="80"/>
            <rect class="mscBox_13" x="540" y="090" width="80" height="80"/>
            <rect class="mscBox_14" x="630" y="090" width="80" height="80"/>
            <rect class="mscBox_15" x="090" y="180" width="80" height="80"/>
            <rect class="mscBox_16" x="180" y="180" width="80" height="80"/>
            <rect class="mscBox_17" x="270" y="180" width="80" height="80"/>
            <rect class="mscBox_18" x="360" y="180" width="80" height="80"/>
            <rect class="mscBox_19" x="450" y="180" width="80" height="80"/>
            <rect class="mscBox_20" x="540" y="180" width="80" height="80"/>
            <rect class="mscBox_21" x="630" y="180" width="80" height="80"/>
            <rect class="mscBox_22" x="090" y="270" width="80" height="80"/>
            <rect class="mscBox_23" x="180" y="270" width="80" height="80"/>
            <rect class="mscBox_24" x="270" y="270" width="80" height="80"/>
            <rect class="mscBox_25" x="360" y="270" width="80" height="80"/>
            <rect class="mscBox_26" x="450" y="270" width="80" height="80"/>
            <rect class="mscBox_27" x="540" y="270" width="80" height="80"/>
            <rect class="mscBox_28" x="630" y="270" width="80" height="80"/>
            <rect class="mscBox_29" x="090" y="360" width="80" height="80"/>
            <rect class="mscBox_30" x="180" y="360" width="80" height="80"/>
            <rect class="mscBox_31" x="270" y="360" width="80" height="80"/>
            <rect class="mscBox_32" x="360" y="360" width="80" height="80"/>
            <rect class="mscBox_33" x="450" y="360" width="80" height="80"/>
            <rect class="mscBox_34" x="540" y="360" width="80" height="80"/>
            <rect class="mscBox_35" x="630" y="360" width="80" height="80"/>
            <rect class="mscBox_36" x="090" y="450" width="80" height="80"/>
            <rect class="mscBox_37" x="180" y="450" width="80" height="80"/>
            <rect class="mscBox_38" x="270" y="450" width="80" height="80"/>
            <rect class="mscBox_39" x="360" y="450" width="80" height="80"/>
            <rect class="mscBox_40" x="450" y="450" width="80" height="80"/>
            <rect class="mscBox_41" x="540" y="450" width="80" height="80"/>
            <rect class="mscBox_42" x="630" y="450" width="80" height="80"/>
            <rect class="mscBox_43" x="090" y="540" width="80" height="80"/>
            <rect class="mscBox_44" x="180" y="540" width="80" height="80"/>
            <rect class="mscBox_45" x="270" y="540" width="80" height="80"/>
            <rect class="mscBox_46" x="360" y="540" width="80" height="80"/>
            <rect class="mscBox_47" x="450" y="540" width="80" height="80"/>
            <rect class="mscBox_48" x="540" y="540" width="80" height="80"/>
            <rect class="mscBox_49" x="630" y="540" width="80" height="80"/>
        </clipPath>
      </svg>
      </div>
        <div class="modal-position">
        <div class="modal-h1">Genre: ${value.genre}</div>
        <div class="modal-h2">Origin: ${value.origin}</div>
        </div>
        </div>`;

    let containerTop = `<div class="container-top"></div>`;

    let circle = `<div id=${value.year} class="circle">${value.year}</div>`;

    if (index === initialTimelineMain) {
      circle = `<div id=${value.year} class="circle main">${value.year}</div>`;
      infoBox = `<div class="infobox show ${value.year}">
            <div class="modal-img"><svg class="clip-svg" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 720 720">

            <image width="720" height="720" href="assets/${value.year}.jpg" clip-path="url(#masking)" />
          
            <clipPath id="masking">
                <rect class="mscBox_01" x="090" y="0" width="80" height="80"/>
                <rect class="mscBox_02" x="180" y="0" width="80" height="80"/>
                <rect class="mscBox_03" x="270" y="0" width="80" height="80"/>
                <rect class="mscBox_04" x="360" y="0" width="80" height="80"/>
                <rect class="mscBox_05" x="450" y="0" width="80" height="80"/>
                <rect class="mscBox_06" x="540" y="0" width="80" height="80"/>
                <rect class="mscBox_07" x="630" y="0" width="80" height="80"/>
                <rect class="mscBox_08" x="090" y="090" width="80" height="80"/>
                <rect class="mscBox_09" x="180" y="090" width="80" height="80"/>
                <rect class="mscBox_10" x="270" y="090" width="80" height="80"/>
                <rect class="mscBox_11" x="360" y="090" width="80" height="80"/>
                <rect class="mscBox_12" x="450" y="090" width="80" height="80"/>
                <rect class="mscBox_13" x="540" y="090" width="80" height="80"/>
                <rect class="mscBox_14" x="630" y="090" width="80" height="80"/>
                <rect class="mscBox_15" x="090" y="180" width="80" height="80"/>
                <rect class="mscBox_16" x="180" y="180" width="80" height="80"/>
                <rect class="mscBox_17" x="270" y="180" width="80" height="80"/>
                <rect class="mscBox_18" x="360" y="180" width="80" height="80"/>
                <rect class="mscBox_19" x="450" y="180" width="80" height="80"/>
                <rect class="mscBox_20" x="540" y="180" width="80" height="80"/>
                <rect class="mscBox_21" x="630" y="180" width="80" height="80"/>
                <rect class="mscBox_22" x="090" y="270" width="80" height="80"/>
                <rect class="mscBox_23" x="180" y="270" width="80" height="80"/>
                <rect class="mscBox_24" x="270" y="270" width="80" height="80"/>
                <rect class="mscBox_25" x="360" y="270" width="80" height="80"/>
                <rect class="mscBox_26" x="450" y="270" width="80" height="80"/>
                <rect class="mscBox_27" x="540" y="270" width="80" height="80"/>
                <rect class="mscBox_28" x="630" y="270" width="80" height="80"/>
                <rect class="mscBox_29" x="090" y="360" width="80" height="80"/>
                <rect class="mscBox_30" x="180" y="360" width="80" height="80"/>
                <rect class="mscBox_31" x="270" y="360" width="80" height="80"/>
                <rect class="mscBox_32" x="360" y="360" width="80" height="80"/>
                <rect class="mscBox_33" x="450" y="360" width="80" height="80"/>
                <rect class="mscBox_34" x="540" y="360" width="80" height="80"/>
                <rect class="mscBox_35" x="630" y="360" width="80" height="80"/>
                <rect class="mscBox_36" x="090" y="450" width="80" height="80"/>
                <rect class="mscBox_37" x="180" y="450" width="80" height="80"/>
                <rect class="mscBox_38" x="270" y="450" width="80" height="80"/>
                <rect class="mscBox_39" x="360" y="450" width="80" height="80"/>
                <rect class="mscBox_40" x="450" y="450" width="80" height="80"/>
                <rect class="mscBox_41" x="540" y="450" width="80" height="80"/>
                <rect class="mscBox_42" x="630" y="450" width="80" height="80"/>
                <rect class="mscBox_43" x="090" y="540" width="80" height="80"/>
                <rect class="mscBox_44" x="180" y="540" width="80" height="80"/>
                <rect class="mscBox_45" x="270" y="540" width="80" height="80"/>
                <rect class="mscBox_46" x="360" y="540" width="80" height="80"/>
                <rect class="mscBox_47" x="450" y="540" width="80" height="80"/>
                <rect class="mscBox_48" x="540" y="540" width="80" height="80"/>
                <rect class="mscBox_49" x="630" y="540" width="80" height="80"/>
            </clipPath>
          </svg>
          </div>
            <div class="modal-position">
            <div class="modal-h1">Genre: ${value.genre}</div>
            <div class="modal-h2">Origin: ${value.origin}</div>
            </div>
            </div>`;
    } else if (index === initialTimelineMain - 1) {
      circle = `<div id=${value.year} class="circle prev">${value.year}</div>`;
    } else if (index === initialTimelineMain + 1) {
      circle = `<div id=${value.year} class="circle next">${value.year}</div>`;
    }

    $("#container").append(containerTop);

    $("#container").append(infoBox);

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
      progressDonut: await (await fetch("./assets/progress-donut.svg")).text()
    };

    document.getElementById("logo-container").innerHTML = SVG.logo;
    document.getElementById("play-button-SVG").innerHTML = SVG.playButton;
    startMusic();
    document.getElementById("progressDonut").innerHTML = SVG.progressDonut;
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
}
startSpectrum();
document.body.onload = doStart;
