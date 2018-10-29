let isDrawing = false;
let isConnected = false;

let drawing = [];
let database;

let canWidth = 400;
let canHeight = 300;

function setup() {
    createCanvas(canWidth, canHeight, WEBGL);
    background(30);
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
	console.log(firebase);

	//database object
	database = firebase.database();

	let ref = database.ref('drawings');
	ref.on('value', gotData, errData);

    
    drawEndpoints();

}

function draw() {
    fill(255,0,0);

    if(mouseIsPressed&&mouseX > 95 && mouseX < 105 && mouseY < canHeight/2 + 5 && mouseY > canHeight/2 - 5){
        console.log("mouse is in start")
        isDrawing = true;
    }
    if(isConnected&&mouseX < canWidth-95 && mouseX > canWidth-105 && mouseY < canHeight/2 + 5 && mouseY > canHeight/2 - 5){
        console.log("mouse is in end")
        isDrawing = false;
    }

    


    // line only draws if begun
	drawLine();
	if(isConnected){
        isConnected=!isConnected;
        resetDrawing();
        
	}

}

function saveDrawing() {
	//reference drawings location
	let ref = database.ref('drawings');
	let result = ref.push(drawing, dataSent);
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
}

function errData(err) {
	console.log(err);
}



function drawLine(){
    // check if line begun
    if(isDrawing===true){
        var point = {
            x: mouseX,
            y: mouseY,
            z: 0
        }
        // add points to drawing
        drawing.push(point);       
    }
    beginShape();
    stroke(230);
    strokeWeight(3);
    noFill();
    push();
    translate(-canWidth/2,-canHeight/2);
    for(var i=0; i<drawing.length; i++){
        vertex(drawing[i].x,drawing[i].y, drawing[i].z);
    }
    endShape();
    pop();
}

function mouseReleased(){
    if(mouseX < canWidth-95 && mouseX > canWidth-105 && mouseY < canHeight/2 + 5 && mouseY > canHeight/2 - 5){
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
    translate(-canWidth/2, -canHeight/2);
    ellipse(100,canHeight/2, 10,10);
    ellipse(canWidth-100,canHeight/2, 10,10);
}


function resetDrawing(){
	saveDrawing();
	isDrawing=false;
	console.log("connected homie");
	// drawing=[];
	background(30);
    drawEndpoints();
    createCanvas(canWidth*2,canHeight);
    background(0);
    drawEndpoints();
    drawLine();
}