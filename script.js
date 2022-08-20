const card = document.getElementById("card");
const tag = document.getElementById("searchBox");
const ratingButton = document.getElementById("rating");
const ratioButton = document.getElementById("ratio");
const S1 = document.getElementById("S1");
const S2 = document.getElementById("S2");
const gallery = document.getElementById("gallery");
const progressBar = document.getElementById("progressbar");
const progressBarValue = document.getElementById("progressbarValue");
const sectionWrapper = document.getElementById("sectionWrapper");

let count = 4;
let e621Page = 75;
let audio = new Audio("audio/wasted.mp3");
let isSquare = true;
let allPagesLoaded = false;
let rating = "rating:safe";

async function start(query) {
    showProgressBar();
    let posts = await loadPages(query, count);
    console.log(posts);
    let imgList = await preloadImages(posts);
    showResult(imgList);
}

async function preloadImages(posts) {
    let imgList = [];
    for (let post of posts) {
        let img = new Image();
        let src = post.sample.url;
        if (typeof src != "object") {
            img.src = src;
            await img.decode();
            imgList.push(img);
            console.log(imgList.length);
            changeProgress(imgList.length, count * e621Page);
        }
    }
    return imgList;
}

async function loadPages(query, count) {
    let data = [];
    for (let i = 1; i <= count; i++) {
        data = data.concat(
            [],
            await loadPage(query + `&page=${i}`)
        );       
    }
    return data;
}

async function loadPage(query) {
    let result = await fetch(query);
    console.log(result);
    let posts = await result.json();
    return posts.posts;
}

function showProgressBar() {
    S1.style.opacity = "0%";
    S2.style.opacity = "100%";
}

async function changeProgress(state, expectedValue) {
    progressBarValue.style.width = `${(state / expectedValue) * 100 + 5}%`;
}

async function showResult(imgList) {
    card.style.opacity = "0%"
    S2.style.opacity = "0%";
    S3.style.opacity = "100%"
    sectionWrapper.style.opacity = "100";
    await(1300);
    audio.play();
    for (let i = 0; i < imgList.length; i++) {
        let newItem = `${imgList[i].outerHTML}`;
        gallery.innerHTML = newItem;
        await delay(75);
    }
    audio.pause();
    audio.currentTime = 0;
}

function check(ele) {
    if (event.key === "Enter") {
        search();
    }
}

function changeRating() {
    switch (ratingButton.value) {
        case "safe":
            rating = "rating:questionable";
            ratingButton.value = "questionable";
            ratingButton.style.borderColor = "yellow";
            break;
        case "questionable":
            rating = "rating:explicit";
            ratingButton.value = "explicit";
            ratingButton.style.borderColor = "red";
            break;
        case "explicit":
            rating = "rating:safe";
            ratingButton.value = "safe";
            ratingButton.style.borderColor = "#0074DA";
            break;
    }
    console.log(rating);
}

function changeRatio() {
    switch (isSquare) {
        case true:
            isSquare = false;
            ratioButton.style.borderColor = "red";
            break;
        case false:
            isSquare = true;
            ratioButton.style.borderColor = "#0074DA";
            break;
    }
    console.log(isSquare);
}

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}


function search() {
    const tag = document.getElementById("searchBox").value;
    let query = `https://e621.net/posts.json?tags=${tag}`;
    if (isSquare) {
        query = query + ` type:png` + ` ${rating}` + ` 1:1` + ` order:score`;
    } else {
        query = query + ` type:png` + ` ${rating}` + ` order:score`;
    }
    console.log(query);
    start(query);
}
