let drawing = [];
let database;

let camX=0, camY=0, camZ=0;
let xPos = 0, yPos = 0;

let ln;

function setup() {
    createCanvas(windowWidth,windowHeight,WEBGL);

    //create 3d camera
    camera(camX, camY, (height/2.0) / tan(PI*30.0 / 180.0)+camZ, 0, 0, 0, 0, 1, 0);

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
	// console.log(firebase);

	//database object
	database = firebase.database();

	let ref = database.ref('drawings');
	ref.on('value', gotData, errData);

    background(30);

    setTimeout(drawAllLines, 2000)




}

function draw() {
    cameraControl();
    // camera(camX, camY, (height/2.0) / tan(PI*30.0 / 180.0)+camZ+1000, ln/2*400, 0, 0, 0, 1, 0);
    camera(camX, camY, (height/2.0) / tan(PI*30.0 / 180.0)+camZ, ln/2*400, 0, 0, 0, camY, 0);

    background(30);
    drawAllLines();
}

let allDrawingPts = [];

function gotData(data) {
	let drawings = data.val();
    let keys = Object.keys(drawings);
    ln=keys.length;
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
    
    
    
    for(var i = 0; i<allDrawingPts.length; i++){
        var path = allDrawingPts[i];
        beginShape();
        for(var j = 0; j < path.length; j++){
            for(var j = 0; j < path.length; j++){
                vertex(path[j].x, path[j].y,0);
            }
            endShape();
        }
    }

}


// // Keyboard camera control
function cameraControl(){

    if (keyIsDown(LEFT_ARROW)) {
        camX-=50;
        console.log(camX, camY, camZ);
    } else if (keyIsDown(RIGHT_ARROW)) {
        camX+=50;
        console.log(camX, camY, camZ);

    } else if (keyIsDown(DOWN_ARROW)){
        camY+=50;
        console.log(camX, camY, camZ);

    } else if (keyIsDown(UP_ARROW)){
        camY-=50;
        console.log(camX, camY, camZ);

    
    } else if (keyIsDown(65)){yPos<400
        camZ+=50;
        console.log(camX, camY, camZ);

    } else if (keyIsDown(90)){
        camZ-=50;
        console.log(camX, camY, camZ);

    }
}


function keyPressed() {
 
    if(keyCode===ENTER){
        camX=0,camY=0,camZ=0;
    }
}

    