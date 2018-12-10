let drawing = [];

let allDrawingPts = [];
let allAudioPts = [];

let currentAudio = 0;
let note = 0;

let drawNo=0;

let database;

let scaleAdd = 1;
let scaleCons = 1;
let panCons = -20;
let heightCons = 0;

var attackLevel = 1.0;
var releaseLevel = 0;

var attackTime = 0.001
var decayTime = 0.2;
var susPercent = 0.2;
var releaseTime = 0.5;

var env, triOsc;

let ln;
let lnA;

let timer = 0;

function setup() {
    createCanvas(windowWidth,windowHeight);


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

	//database object
	database = firebase.database();

	let drawingRef = database.ref('drawings');
	drawingRef.on('value', gotDrawingData, errData);

  let audioRef = database.ref('audio');
  audioRef.on('value', gotAudioData, errData);

    background(30);
    frameRate(60);
    setTimeout(drawAllLines, 200)



  // envelope code
  env = new p5.Env();
  env.setADSR(attackTime, decayTime, susPercent, releaseTime);
  env.setRange(attackLevel, releaseLevel);

  triOsc = new p5.Oscillator('sine');
  triOsc.amp(env);
  triOsc.start();


}

function draw() {

    background(30);
    drawAllLines();
    text(frameRate(),0,50);
    text(allDrawingPts.length,0,100);
}


//play envelope
function playEnv(){
    env.play();
  }

function gotDrawingData(data) {
	let drawings = data.val();
    let keys = Object.keys(drawings);
    ln=keys.length;
    allDrawingPts=[];
	for (let i=0; i<keys.length; i++) {
		let key = keys[i];
        // console.log(key);
        var drawingCountRef = firebase.database().ref('drawings/' + key );
        drawingCountRef.on('value', function(snapshot) {
        // console.log(snapshot.val());
        allDrawingPts.push(snapshot.val());
        });

	}
}

function gotAudioData(data) {
	let audio = data.val();
    let keys = Object.keys(audio);
    lnA=keys.length;
    allAudioPts=[];
	for (let i=0; i<keys.length; i++) {
		let key = keys[i];
        // console.log(key);
        var audioCountRef = firebase.database().ref('audio/' + key );
        audioCountRef.on('value', function(snapshot) {
        // console.log(snapshot.val());
        allAudioPts.push(snapshot.val());
        });

	}
}

let r=50;

function errData(err) {
	console.log(err);
}

function drawAllLines(){
    beginShape(TRIANGLES);
    stroke(230);
    strokeWeight(0.5);
    noFill();


    let mPos=map(mouseY,0,windowHeight,0,1);

    for(var i = 0; i<allDrawingPts.length; i++){
        push();
        translate(windowWidth/2,windowHeight/2)
        beginShape();
        // stroke(random(240))
        for(var j = 0; j < allDrawingPts[i].length; j++){
            stroke(i*30)
            allDrawingPts[i][j].y= allDrawingPts[i][j].y*map(mouseY,0,windowHeight,0.95,0.99);
            // allDrawingPts[i][j].y*=0.98
            // let r=map(allDrawingPts[i][j].y, allDrawingPts[i][0].y,allDrawingPts[i][allDrawingPts[i].length-1].y, 1, 1);
            // let rx=map(map(allDrawingPts[i][j].x*0.5,0,1000,0,20),map(allDrawingPts[i][0].x*0.5,0,1000,0,20),map(allDrawingPts[i][allDrawingPts[i].length-1].x*0.5,0,1000,0,20), 0+rpos , 2+rpos);
            // let ry=map(map(allDrawingPts[i][j].y*0.5,0,1000,0,20),map(allDrawingPts[i][0].y*0.5,0,1000,0,20),map(allDrawingPts[i][allDrawingPts[i].length-1].y*0.5,0,1000,0,20), 0+rpos , 2+rpos);
            // let x=ry*sin(globalpos)*1
            // let y = rx*cos(globalpos)*1;

            let r=map(map(allDrawingPts[i][j].y*0.5,0,1000,0,20),map(allDrawingPts[i][0].y*0.5,0,1000,0,20),map(allDrawingPts[i][allDrawingPts[i].length-1].y*0.5,0,1000,0,20), 0+rpos , 2+rpos);
            let x=r*sin(allDrawingPts[i][j].x*0.001)*1
            let y = r*cos(allDrawingPts[i][j].x*0.001)*1;

            vertex(x*0.1,y*0.1);

            noFill();
            stroke(255);
            if(i===allDrawingPts.length-1){
                stroke(255,0,0);
            }
            // vertex(allDrawingPts[i][j].x*mPos,allDrawingPts[i][j].y*mPos)
            endShape();
            globalpos+=0.01;
            rpos+=map(mouseX,0,width,0.1,2);

        }

        pop();

    }




      for(var i = 0; i<allAudioPts.length; i++){
          push();
          translate(windowWidth/2,windowHeight/2)
          // stroke(random(240))

          for(var j = 0; j<allAudioPts.length; j++){

              stroke(i*30)
              allAudioPts[i][j].y = allAudioPts[i][j].y*map(mouseY,0,windowHeight,0.95,0.99);
              // allDrawingPts[i][j].y*=0.98
              // let r=map(allDrawingPts[i][j].y, allDrawingPts[i][0].y,allDrawingPts[i][allDrawingPts[i].length-1].y, 1, 1);
              // let rx=map(map(allDrawingPts[i][j].x*0.5,0,1000,0,20),map(allDrawingPts[i][0].x*0.5,0,1000,0,20),map(allDrawingPts[i][allDrawingPts[i].length-1].x*0.5,0,1000,0,20), 0+rpos , 2+rpos);
              // let ry=map(map(allDrawingPts[i][j].y*0.5,0,1000,0,20),map(allDrawingPts[i][0].y*0.5,0,1000,0,20),map(allDrawingPts[i][allDrawingPts[i].length-1].y*0.5,0,1000,0,20), 0+rpos , 2+rpos);
              // let x=ry*sin(globalpos)*1
              // let y = rx*cos(globalpos)*1;

              let r=map(map(allAudioPts[i][j].y*0.5,0,1000,0,20),map(allAudioPts[i][0].y*0.5,0,1000,0,20),map(allAudioPts[i][allAudioPts[i].length-1].y*0.5,0,1000,0,20), 0+rpos , 2+rpos);
              let x=r*sin(allAudioPts[i][j].x*0.001)*1
              let y = r*cos(allAudioPts[i][j].x*0.001)*1;

              globalpos+=0.01;
              rpos+=map(mouseX,0,width,0.1,2);

              stroke(255,0,0);
              fill(255,255,255);

              // ellipse(x*0.1,y*0.1,10,10);

          }

          if (frameCount % 60 == 0 || frameCount == 1) {
            let pointTone = sqrt(allAudioPts[i][note].x * allAudioPts[i][note].y);

            ellipse(allAudioPts[currentAudio][note].x, allAudioPts[currentAudio][note].y, 10, 10);

            triOsc.freq(pointTone * 0.5);

            env.play();

            note = (note + 1) % allAudioPts.length;

            // if (note == audioPts.length -1) {
            //   currentAudio++;
            // }

            // timer = millis() + 1000;
          }

          pop();




      }







    rpos=10
    if(globalpos>100){
        console.log(globalpos);
        globalpos=100;
    }
}
let rpos=10
let globalpos=0;
