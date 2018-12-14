let drawing = [];

let allDrawingPts = [];
let allAudioPtsToDraw = [];
let allAudioPtsToPlay = [];

let drawNo=0;

let database;

let scaleAdd = 1;
let scaleCons = 1;
let panCons = -20;
let heightCons = 0;

var attackLevel = 1.0;
var releaseLevel = 0;

var attackTime = 0.1
var decayTime = 0.2;
var susPercent = 0.2;
var releaseTime = 0.5;

var env, triOsc;

let ln;
let lnA;

let currentNotes = 0;
let noteToPlay = 0;

let noteFade = 230;

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

  let audioToDrawRef = database.ref('audioToDraw');
  audioToDrawRef.on('value', gotAudioToDrawData, errData);

  let audioToPlayRef = database.ref('audioToPlay');
  audioToPlayRef.on('value', gotAudioToPlayData, errData);

    background(30);
    frameRate(60);
    setTimeout(drawAllLines, 200);

  // envelope code
  env = new p5.Env();
  env.setADSR(attackTime, decayTime, susPercent, releaseTime);
  env.setRange(attackLevel, releaseLevel);

  triOsc = new p5.Oscillator('sine');
  triOsc.amp(env);
  triOsc.start();

  setInterval(playPointAudio, 1000);

}

function draw() {

    background(30);
    drawAllLines();
    // drawPointAudio();
    text(frameRate(),0,50);
    text(allDrawingPts.length,0,100);

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

function gotAudioToDrawData(data) {
	let audio = data.val();
    let keys = Object.keys(audio);
    lnA=keys.length;
    allAudioPtsToDraw=[];
	for (let i=0; i<keys.length; i++) {
		let key = keys[i];
        // console.log(key);
        var audioToDrawCountRef = firebase.database().ref('audioToDraw/' + key );
        audioToDrawCountRef.on('value', function(snapshot) {
        // console.log(snapshot.val());
        allAudioPtsToDraw.push(snapshot.val());
        });
	}
}

function gotAudioToPlayData(data) {
	let audio = data.val();
    let keys = Object.keys(audio);
    lnA=keys.length;
    allAudioPtsToPlay=[];
	for (let i=0; i<keys.length; i++) {
		let key = keys[i];
        // console.log(key);
        var audioToPlayCountRef = firebase.database().ref('audioToPlay/' + key );
        audioToPlayCountRef.on('value', function(snapshot) {
        // console.log(snapshot.val());
        allAudioPtsToPlay.push(snapshot.val());
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

    for(let i = 0; i<allDrawingPts.length; i++){
        push();
        translate(windowWidth/2,windowHeight/2)
        beginShape();
        // stroke(random(240))
        for(let j = 0; j < allDrawingPts[i].length; j++){
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


        for(let j = 0; j < allAudioPtsToDraw[i].length; j++){
            allAudioPtsToDraw[i][j].y = allAudioPtsToDraw[i][j].y*map(mouseY,0,windowHeight,0.95,0.99);

            let r=map(map(allAudioPtsToDraw[i][j].y*0.5,0,1000,0,20),map(allAudioPtsToDraw[i][0].y*0.5,0,1000,0,20),map(allAudioPtsToDraw[i][allAudioPtsToDraw[i].length-1].y*0.5,0,1000,0,20), 0+rpos , 2+rpos);
            let x=r*sin(allAudioPtsToDraw[i][j].x*0.001)*1
            let y = r*cos(allAudioPtsToDraw[i][j].x*0.001)*1;

            noStroke();
            fill(noteFade, noteFade);

          if(i == currentNotes && j == noteToPlay) {
              noteFade-=10;
              ellipse(x*0.1,y*0.1,10,10);
          }



            globalpos+=0.01;
            rpos+=map(mouseX,0,width,0.1,2);
        }

        pop();

      }

    rpos=10
    if(globalpos>100){
        // console.log(globalpos);
        globalpos=100;
    }
}

let rpos=10
let globalpos=0;


function playPointAudio() {
    let pointTone = int(map(allAudioPtsToPlay[currentNotes][noteToPlay].y, 0, 900, 0,-250)) ;

    let midiValue = int(map(allAudioPtsToPlay[currentNotes][noteToPlay].x, 0, 1200, 60, 70));
    let freqValue = midiToFreq(midiValue);

    console.log(midiValue);

    triOsc.freq(freqValue + pointTone);

    env.play();




    noteFade = 230;

    // console.log(currentNotes);
    // console.log(allAudioPtsToPlay.length);

    // console.log(noteToPlay);
    // console.log(allAudioPtsToPlay[currentNotes].length);

    // ellipse(allAudioPtsToPlay[currentNotes][noteToPlay].x, allAudioPtsToPlay[currentNotes][noteToPlay].y,50,50);


    if (currentNotes >= allAudioPtsToPlay.length - 1) {
      currentNotes = 0;
    }

    if (noteToPlay < allAudioPtsToPlay[currentNotes].length - 1) {
        noteToPlay++;
    } else {
        currentNotes++;
        noteToPlay = 0;
    }
}
