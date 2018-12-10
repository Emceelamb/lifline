let isDrawing = false;
let isConnected = false;


let database;
let drawing = [];
let drawingToSave = [];
let audioArray = [];
let audioToSave = [];
let ln=0;

let timer = 0;
let audioTimer = 0;

var attackLevel = 1.0;
var releaseLevel = 0;

var attackTime = 0.001
var decayTime = 0.2;
var susPercent = 0.2;
var releaseTime = 0.5;

var env, triOsc;

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

    triOsc = new p5.Oscillator('sine');
    triOsc.amp(env);
    triOsc.start();


    drawEndpoints();

}

function draw() {

    // console.log(mouseX, mouseY, timer);

    fill(255,0,0);

    if(mouseIsPressed&&mouseX > 85 && mouseX < 115 && mouseY < height/2 + 15 && mouseY > height/2 - 15 ){
        console.log("mouse is in start")
        isDrawing = true;
    }
    if(isConnected&&mouseX < width-85 && mouseX > width-95 && mouseY < height/2 + 15 && mouseY > height/2 - 15){
        console.log("mouse is in end")
        isDrawing = false;
    }




    // line only draws if begun

    drawLine();


	if(isConnected){        // resetDrawing();
        success();
	}

}

function saveDrawing() {

	//reference drawings location
	let drawingRef = database.ref('drawings');
	let drawingResult = drawingRef.push(drawingToSave, dataSent);
	console.log("drawing - ", drawingResult.key);

  let audioRef = database.ref('audio');
  let audioResult = audioRef.push(audioToSave, dataSent);
  console.log("audio - ", audioResult.key);

	function dataSent() {
		console.log(status);
	}
}

function gotData(data) {
	let drawings = data.val();
	let keys = Object.keys(drawings);
	for (let i=0; i<keys.length; i++) {
		let key = keys[i];
		console.log(key);
    }
    ln = keys.length;
}

function errData(err) {
	console.log(err);
}



function drawLine(){
    // check if line begun
    background(30);

    if(isDrawing===true){

        var point = {
            x: mouseX,
            y: mouseY
        }
        var pointToSave = {
            x: mouseX+ln*800,
            y: mouseY
        }
        var audioPoint = {
            x: mouseX,
            y: mouseY
        }
        var audioPointToSave = {
            x: mouseX+ln*800,
            y: mouseY
        }
        // add points to drawing
        drawing.push(point);

        if (millis() > timer) {
          drawingToSave.push(pointToSave);
          timer = millis() + 100;
        }

        if (millis() > audioTimer) {
          audioArray.push(audioPoint);
          audioToSave.push(audioPointToSave);
          audioTimer = millis() + 1000;

          env.play();
        }

    }

    beginShape();
    stroke(230);
    strokeWeight(3);
    noFill();

    push();
    for(var i=0; i<drawing.length; i++){
        vertex(drawing[i].x,drawing[i].y);
    }

    for(var i=0; i<audioArray.length; i++){
        let pointTone = sqrt(audioArray[i].y * audioArray[i].y);

        stroke(pointTone);
        fill(pointTone);
        ellipse(audioArray[i].x, audioArray[i].y, 10, 10);
        triOsc.freq(pointTone*.5);
    }

    stroke(230);
    strokeWeight(3);
    noFill();

    endShape();
    pop();
    noFill();
    drawEndpoints();
}

function touchEnded(){
    // var fs = fullscreen();
    fullscreen(true);
    ellipse(mouseX, mouseY, 30,30)
    if(mouseX < width-285 && mouseX > width-315 && mouseY < height/2 + 15 && mouseY > height/2 -15){
        isConnected = true;
    } else if(!isConnected){
        isDrawing=false;
        console.log("failed to connect homie");
        drawing=[];
        drawingToSave=[];
        audioArray=[];
        audioToSave=[];
        background(30);
        drawEndpoints();
    }
}

var continuousLine= {"line": drawing};


function drawEndpoints(){
    // background(30);
    fill(233);
    noStroke();

    if(isDrawing){

        push();
        // stroke(150);
        fill(150);
        // ellipse(100,height/2, 15,15);
        fill(233);
        ellipse(width-300,height/2, 30, 30);
        pop();
    } else {
        push();
        fill(233);
        ellipse(100,height/2, 30,30);
        stroke(150);

        fill(150);
        ellipse(width-300,height/2, 15, 15);
        pop();
    }
}


function resetDrawing(){
	saveDrawing();
	isDrawing=false;
	console.log("connected homie");
    drawing=[];
    drawingToSave=[];
    audioArray=[];
    audioToSave=[];
	background(30);
    // drawEndpoints();
}

let success_color = 230;

function success(){
    background(30);
    beginShape();
    stroke(success_color);
    strokeWeight(3);
    // noFill();

    push();
    for(var i=0; i<drawing.length; i++){
        noFill();
        vertex(drawing[i].x,drawing[i].y);
    }

    for(var i=0; i<audioArray.length; i++){
        let pointTone = sqrt(audioArray[i].y * audioArray[i].y);
        // fill(success_color)

        stroke(success_color);
        // fill(success_color);
        // ellipse(audioArray[i].x, audioArray[i].y, 10, 10);
        triOsc.freq(pointTone*.5);
    }


    endShape();
    pop();
    // drawEndpoints();
    success_color-=2;
    if (success_color<30){

        success_color=230;
        resetDrawing();
        isConnected=!isConnected;
        audioArray=[];
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
