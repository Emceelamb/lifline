let isDrawing = false;
let isConnected = false;

let drawing = [];
let database;
let drawingToSave = [];
let ln=0;

let mic;
let fft;

let x = 100;
let vol = null;
let micBass;
let micTreble;

let micX;
let micY;

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

	let ref = database.ref('drawings');
	ref.on('value', gotData, errData);

    // Create an Audio input
    mic = new p5.AudioIn();

    // start the Audio Input.
    // By default, it does not .connect() (to the computer speakers)
    mic.start();

    fft = new p5.FFT();
    fft.setInput(mic);

    drawEndpoints();

}

function draw() {

  console.log(micX, micY);


  if(mouseIsPressed&&micX > 85 && micX < 115 && micY < height/2 + 15 && micY > height/2 - 15){
    console.log("mouse is in start")
    isDrawing = true;
  }

  if(isConnected&&micX < width-85 && micX > width-95 && micY < height/2 + 15 && micY > height/2 - 15){
    console.log("mouse is in end")
    isDrawing = false;
  }

  // Get the overall volume (between 0 and 1.0)
    vol = mic.getLevel();

  	fft.analyze();
  	// micBass = fft.getEnergy("bass");

    micBass = map(fft.getEnergy("bass"), 0, 255, -50, 50);
    micTreble = map(fft.getEnergy("treble"), 0, 255, -50, 50);


    fill(255);
    noStroke();

    if (x < 835) {
      if (vol != null && vol > 0.1) {
      	x += 5;
      } else {
        x = x;
      }
    } else {
      x = width-300;
      micY = height/2;


    }
  	// } else {
  	// x = x;
  	// }
    // Draw an ellipse with height based on volume
    var h = map(vol, 0, 1, width, 0);

    micX = x;
    micY = micBass-micTreble+(height/2);

    drawLine();
}



function saveDrawing() {

	//reference drawings location
	let ref = database.ref('drawings');
	let result = ref.push(drawingToSave, dataSent);
	console.log(result.key);

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
    if(vol>0){
        var point = {
            x:micX,
            y:micY

        }
        var pointToSave = {
            x:micX+ln*1000,
            y:micY

        }
        // add points to drawing
        drawing.push(point);
        drawingToSave.push(pointToSave);
    }
    beginShape();
    stroke(230);
    strokeWeight(3);
    noFill();
    push();
    for(var i=0; i<drawing.length; i++){
        vertex(drawing[i].x,drawing[i].y);
    }
    endShape();
    pop();
}

function mouseReleased(){
    // var fs = fullscreen();
    fullscreen(true);
    ellipse(micX, micY, 30,30)
    if(micX < width-285 && micX > width-315 && micY < height/2 + 15 && micY > height/2 -15){
        isConnected = true;
    } else if(!isConnected){
        isDrawing=false;
        console.log("failed to connect homie");
        drawing=[];
        background(30);
        drawEndpoints();
    }
}

var continuousLine= {"line": drawing};


function drawEndpoints(){

    fill(233);
    noStroke();
    ellipse(100,height/2, 30,30);
    ellipse(width-300,height/2, 30, 30);
}


function resetDrawing(){
	saveDrawing();
	isDrawing=false;
	console.log("connected homie");
    drawing=[];
    drawingToSave=[];
	background(30);
    drawEndpoints();
}

// function mousePressed() {
//     if (micX > 0 && micX < 100 && micY > 0 && micY < 100) {
//       var fs = fullscreen();
//       fullscreen(!fs);
//     }
//   }
