let isDrawing = false;
let isConnected = false;

let drawing = [];
let database;

function setup() {
    createCanvas(windowWidth, windowHeight);
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

    if(mouseIsPressed&&mouseX > 95 && mouseX < 105 && mouseY < windowHeight/2 + 5 && mouseY > windowHeight/2 - 5){
        console.log("mouse is in start")
        isDrawing = true;
    }
    if(isConnected&&mouseX < windowWidth-95 && mouseX > windowWidth-105 && mouseY < windowHeight/2 + 5 && mouseY > windowHeight/2 - 5){
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
          
        }
        // add points to drawing
        drawing.push(point);       
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
    if(mouseX < windowWidth-95 && mouseX > windowWidth-105 && mouseY < windowHeight/2 + 5 && mouseY > windowHeight/2 - 5){
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
    ellipse(100,windowHeight/2, 10,10);
    ellipse(windowWidth-100,windowHeight/2, 10,10);
}


function resetDrawing(){
	saveDrawing();
	isDrawing=false;
	console.log("connected homie");
	drawing=[];
	background(30);
    drawEndpoints();
    window.location = 'continuousline.html';
}