let isDrawing = false;
let isConnected = false;


let database;
let drawing = [];
let drawingToSave = [];
let audioToPlay = [];
let audioToDraw = [];
let ln = 0;

let timer = 0;
let audioTimer = 0;

var attackLevel = 1.0;
var releaseLevel = 0;

var attackTime = 0.1
var decayTime = 0.2;
var susPercent = 0.2;
var releaseTime = 0.5;

let pointTone = 0;

let midiValue = 0;
let freqValue = 0;

var env, sineOsc;

function setup() {
    createCanvas(1200, 900);
    background(30);
    // Initialize Firebase
    var config = {
        apiKey: "AIzaSyAsQomaBoDzBMXfNrQpf2qVcLdfSed08JY",
        authDomain: "dcontinuousline.firebaseapp.com",
        databaseURL: "https://dcontinuousline.firebaseio.com",
        projectId: "dcontinuousline",
        storageBucket: "dcontinuousline.appspot.com",
        messagingSenderId: "954311962102"
    };


    firebase.initializeApp(config);
    console.log(firebase);

    //database object
    database = firebase.database();

    let drawingRef = database.ref('drawings');
    drawingRef.on('value', gotData, errData);

    //envelope code
    env = new p5.Env();
    env.setADSR(attackTime, decayTime, susPercent, releaseTime);
    env.setRange(attackLevel, releaseLevel);

    sineOsc = new p5.Oscillator('sine');
    sineOsc.amp(env);
    sineOsc.start();


    drawEndpoints();

}

function draw() {

    // console.log(mouseX, mouseY, timer);

    fill(255, 0, 0);

    if (mouseIsPressed && mouseX > 65 && mouseX < 125 && mouseY < height / 2 + 25 && mouseY > height / 2 - 25) {
        console.log("mouse is in start")
        isDrawing = true;
    }
    if (isConnected && mouseX < width - 75 && mouseX > width - 105 && mouseY < height / 2 + 25 && mouseY > height / 2 - 25) {
        console.log("mouse is in end")
        isDrawing = false;
    }




    // line only draws if begun

    drawLine();


    if (isConnected) {        // resetDrawing();
        success();
    }

}

function saveDrawing() {

    //reference drawings location
    let drawingRef = database.ref('drawings');
    let drawingResult = drawingRef.push(drawingToSave, dataSent);
    console.log("drawing - ", drawingResult.key);

    let audioToDrawRef = database.ref('audioToDraw');
    let audioToDrawResult = audioToDrawRef.push(audioToDraw, dataSent);
    console.log("audio - ", audioToDrawResult.key);

    let audioToPlayRef = database.ref('audioToPlay');
    let audioToPlayResult = audioToPlayRef.push(audioToPlay, dataSent);
    console.log("audio - ", audioToPlayResult.key);

    function dataSent() {
        console.log(status);
    }
}

function gotData(data) {
    let drawings = data.val();
    let keys = Object.keys(drawings);
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        console.log(key);
    }
    ln = keys.length;
}

function errData(err) {
    console.log(err);
}



function drawLine() {
    // check if line begun
    background(30);
    sineOsc.freq(freqValue + pointTone);

    if (isDrawing === true) {

        var point = {
            x: mouseX,
            y: mouseY
        }
        var pointToSave = {
            x: mouseX + ln * 800,
            y: mouseY
        }
        var audioPointToPlay = {
            x: mouseX,
            y: mouseY
        }
        var audioPointToDraw = {
            x: mouseX + ln * 800,
            y: mouseY
        }
        // add points to drawing
        drawing.push(point);


        if (millis() > timer) {
            drawingToSave.push(pointToSave);
            
            timer = millis() + 100;
        }

        if (millis() > audioTimer) {
            audioToPlay.push(audioPointToPlay);
            audioToDraw.push(audioPointToDraw);
            audioTimer = millis() + 1000;

            env.play();
        }

    }

    beginShape();
    stroke(230);
    strokeWeight(3);
    noFill();

    push();
    for (var i = 0; i < drawing.length; i++) {
        vertex(drawing[i].x, drawing[i].y);
    }

    for (var i = 0; i < audioToPlay.length; i++) {
        pointTone = int(map(audioToPlay[i].y, 0, 900, 0, -250));

        midiValue = int(map(audioToPlay[i].x, 0, 1200, 60, 70));
        freqValue = midiToFreq(midiValue);

        console.log(midiValue);

        stroke(255);
        fill(255);
        ellipse(audioToPlay[i].x, audioToPlay[i].y, 10, 10);
    }

    stroke(230);
    strokeWeight(3);
    noFill();

    endShape();
    pop();
    noFill();
    drawEndpoints();
}

function touchEnded() {
    // var fs = fullscreen();
    fullscreen(true);
    ellipse(mouseX, mouseY, 30, 30)
    if (mouseX < width - 275 && mouseX > width - 325 && mouseY < height / 2 + 25 && mouseY > height / 2 - 25) {
        isConnected = true;
    } else if (!isConnected) {
        isDrawing = false;
        console.log("failed to connect homie");
        drawing = [];
        drawingToSave = [];
        audioToPlay = [];
        audioToDraw = [];
        background(30);
        drawEndpoints();
    }
}

var continuousLine = { "line": drawing };

let blinkTime = 200;
function drawEndpoints() {
    // background(30);
    fill(233);
    noStroke();
    
    if (isDrawing) {

        push();
        // stroke(150);
        fill(150,0,0);
        // ellipse(100,height/2, 15,15);
        // fill(233);
        ellipse(width - 300, height / 2, 50, 50);
        pop();
    } else {
        push();
        noStroke();
        noFill();

        fill(150,0,0);

        ellipse(100, height / 2, 50, 50);

        fill(150);
        // stroke(150);

       
        ellipse(width - 300, height / 2, 15, 15);
        pop();
    }
}


function resetDrawing() {
    saveDrawing();
    isDrawing = false;
    console.log("connected homie");
    drawing = [];
    drawingToSave = [];
    audioToPlay = [];
    audioToDraw = [];
    background(30);
    // drawEndpoints();
}

let success_color = 230;

function success() {
    background(30);
    beginShape();
    stroke(success_color, 0, 0);
    strokeWeight(3);
    // noFill();

    push();
    for (var i = 0; i < drawing.length; i++) {
        noFill();
        vertex(drawing[i].x, drawing[i].y);
    }

    for (var i = 0; i < audioToPlay.length; i++) {

        // sineOsc.freq(freqValue + pointTone);



        // fill(success_color)

        stroke(success_color, 0, 0);
        // fill(success_color);
        // ellipse(audioToPlay[i].x, audioToPlay[i].y, 10, 10);
    }


    endShape();
    pop();
    // drawEndpoints();
    success_color -= 2;
    if (success_color < 30) {

        success_color = 230;
        resetDrawing();
        isConnected = !isConnected;
        audioToPlay = [];
        background(30);
        drawEndpoints();
    }
}
// function mousePressed() {
//     if (mouseX > 0 && mouseX < 100 && mouseY > 0 && mouseY < 100) {
//       var fs = fullscreen();
//       fullscreen(!fs);
//     }
//   }
