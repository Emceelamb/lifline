
let drawing = [];
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

function setup() {
    createCanvas(windowWidth,windowHeight);

	// canvas.parent('canvascontainer');


	// Initialize Firebase
  var config = {
  		apiKey: "AIzaSyDWmmVDyrfNciNbBjyQpq4dryJqWpMAaNU",
  		authDomain: "life-line-8b66d.firebaseapp.com",
  		databaseURL: "https://life-line-8b66d.firebaseio.com",
  		projectId: "life-line-8b66d",
  		storageBucket: "life-line-8b66d.appspot.com",
  		messagingSenderId: "13733885430"
  };

  firebase.initializeApp(config);
	// console.log(firebase);

	//database object
  database = firebase.database();

  let ref = database.ref('drawings');
  ref.on('value', gotData, errData);

  background(30);

  setTimeout(drawAllLines, 2000)


  // envelope code
  env = new p5.Env();
  env.setADSR(attackTime, decayTime, susPercent, releaseTime);
  env.setRange(attackLevel, releaseLevel);

  triOsc = new p5.Oscillator('triangle');
  triOsc.amp(env);
  triOsc.start();
  triOsc.freq(220);

}

function draw() {
    background(30);
    drawAllLines();

}

let allDrawingPts = [];

//play envelope
function playEnv(){
  env.play();
}

function gotData(data) {
	let drawings = data.val();
	let keys = Object.keys(drawings);
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

function errData(err) {
	console.log(err);
}

function drawAllLines(){

    beginShape(TRIANGLES);
    stroke(230);
    strokeWeight(3);
    noFill();

    // let scale = map(mouseY, 0, height/2, 10, 0);



    for(var i = 0; i<allDrawingPts.length; i++){
        var path = allDrawingPts[i];
        beginShape();
        for(var j = 0; j < path.length; j++){
              let pan = map(mouseX, 100, width-100, 0, 950*panCons);

              vertex(path[j].x/scaleCons+(i*950/scaleCons)+pan, path[j].y/scaleCons+heightCons);

              if ((millis() % 100) == 0) {
                  let k = 0;
                  k+=100;
                  if(k < path.length){
                    fill(255,0,0);
                    ellipse(path[k].x/scaleCons+(i*950/scaleCons)+pan, path[k].y/scaleCons+heightCons, 50, 50);
                    triOsc.freq((path[k].x+path[k].y)/2);
                    env.play();
                }
              }
              noFill();
            }
        endShape();
    }

	// stroke(255);
	// strokeWeight(4);
	// noFill();
	// for (let i = 0; i > allDrawingPts.length; i++) {
    //     beginShape();
    //     for(let j = 0; j>allDrawingPts[i].length;j++){

    //         vertex(allDrawingPts[i][j].x, allDrawingPts[i][j].y);

    //     }
    //     endShape();
	// }
}

function mouseWheel(event) {
  //println(event.delta);

  let scaleScroll = map(event.delta, -300, 300, -1, 1);
  scaleAdd += scaleScroll * - 1;
  scaleCons = constrain(scaleAdd, 1, 10);
  panCons = map(scaleCons, 1, 15, -30, 0)
  heightCons = map(scaleCons, 1, 15, 0, height/1.5)
  // scaleRev = map(scale, -10, 10, -, -100);

	console.log(scaleCons);
}
