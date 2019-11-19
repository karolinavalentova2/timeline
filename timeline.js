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
    }).then(result => result.json()).then(res => createInitialTimeline(res));
}

getData();

function getPace(){
    if($(window).width() <= 920 && !($(window).width() <= 460)){
        return 2 * pace;
    } 

    if($(window).width() > 920){
        return pace;
    }

    if($(window).width() <= 460){
        return 3 * pace;
    }
}

function createInitialTimeline(dataCircles) {

   const currentPace = getPace(); 

    dataLoaded = dataCircles;

    const initialTimelineMain = Math.floor(dataCircles.length / 2);

    dataCircles.forEach((value, index) => {

        const distanceFromMain = initialTimelineMain - index;

        let infoBox = `<div class="infobox ${value.year}">
        <div>${value.year}</div>
        <div>${value.genre}</div>
        <div>${value.origin}</div>
        </div>`;

        let containerTop = `<div class="container-top"></div>`;

        let circle = `<div id=${value.year} class="circle">${value.year}</div>`;

        if (index === initialTimelineMain) {
            circle = `<div id=${value.year} class="circle main">${value.year}</div>`;
            infoBox = `<div class="infobox show ${value.year}">
            <div>${value.year}</div>
            <div>${value.genre}</div>
            <div>${value.origin}</div>
            </div>`;
        } else if (index === initialTimelineMain - 1) {
            circle = `<div id=${value.year} class="circle prev">${value.year}</div>`;
        } else if (index === initialTimelineMain + 1) {
            circle = `<div id=${value.year} class="circle next">${value.year}</div>`;
        }

        $('#container').append(containerTop);

        $('#container').append(infoBox);

        $('.timeline_circles').append(circle);

        if(distanceFromMain !== initialTimelineMain){
            $('.circle').get(index).style.left = `${ 50 - distanceFromMain * currentPace }%`;
        } 
        
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
    if ($(this).hasClass('main')) {
        return;
    }
    
    const years = dataLoaded.map(element => element.year);
    
    const indexOfMain = years.indexOf($('.circle.main').text()),
        indexOfThis = years.indexOf($(this).text());
    
    const difference = indexOfMain - indexOfThis;

    const currentValueRaw = $('.timeline_circles').css("transform");
    let lastIndexCommma = currentValueRaw.lastIndexOf(",");
    let newString = currentValueRaw.substring(0, lastIndexCommma);
    let lastIndexComma2 = newString.lastIndexOf(",");
    const currentValue = parseInt(newString.substring(lastIndexComma2 + 1).trim());

    const fullScreen = $(window).width();

    let percent = 0;

    if(currentValue !== 0) {
        percent = currentValue * 100 / fullScreen;
        percent = Math.round(percent);
    }

    const currentPace = getPace();

    adjustTimeline(percent + difference * currentPace);

    resetMain(this); 
    
});


function adjustTimeline(size) {

    $('.timeline_circles').css({
        transition: "transform 1s",
        transform: "translateX(" + size + "%)"
    });
    setTimeout(function () {
        $('.timeline_circles').css({
            transition: "none"
        })
    }, 1000);
}

function resetMain(newMain) {

    $('.infobox').removeClass('show');
    $(`.${newMain.id}`).addClass('show');

    //console.log($(`.${newMain.id}`));

    $('.circle').removeClass('main');
    $('.circle').removeClass('prev');
    $('.circle').removeClass('next');

    setTimeout(() => {
        $(newMain).text(newMain.id);
        if ($(newMain).next().length > 0) {
            $(newMain).next().text(newMain.nextSibling.id);
        }
        if ($(newMain).prev().length > 0) {
            $(newMain).prev().text(newMain.previousSibling.id);
        }
    }, 300);

    $(newMain).addClass('main');
    $(newMain).next().addClass('next');
    $(newMain).prev().addClass('prev');

}
