let drawing = [];
let database;

let ln;

function setup() {
    createCanvas(windowWidth,windowHeight);

    //create 3d camera

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

let r=50;

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
        push();
        translate(windowWidth/2,windowHeight/2)
        beginShape();
        for(var j = 0; j < path.length; j++){
            for(var j = 0; j < path.length; j++){
                let r=map(path[j].y,0,1,height,0);
                let mPos=map(mouseY,0,windowHeight,0,1);
                let x=r*cos(i);
                let y=r*sin(i);
                // vertex(cos(path[j].x)*r, r*sin(path[j].y));
                vertex(cos(path[j].x), y);
            }
            endShape();
        }
        pop();
    }

}




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

    
    } 
}


function keyPressed() {
 
    if(keyCode===ENTER){
        camX=0,camY=0,camZ=0;
    }
}