let isDrawing = false;
let isConnected = false;

let drawing = [];
let database;
let drawingToSave = [];
let ln=0;
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

    
    drawEndpoints();

}

function draw() {
    console.log(mouseX, mouseY);
    fill(255,0,0);

    if(mouseIsPressed&&mouseX > 95 && mouseX < 105 && mouseY < height/2 + 5 && mouseY > height/2 - 5){
        console.log("mouse is in start")
        isDrawing = true;
    }
    if(isConnected&&mouseX < width-95 && mouseX > width-105 && mouseY < height/2 + 5 && mouseY > height/2 - 5){
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
    if(isDrawing===true){
        var point = {
            x: mouseX,
            y: mouseY
                 
        }
        var pointToSave = {
            x:mouseX+ln*1000,
            y: mouseY
            
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
    if(mouseX < width-95 && mouseX > width-105 && mouseY < height/2 + 5 && mouseY > height/2 - 5){
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
    ellipse(100,height/2, 10,10);
    ellipse(width-100,height/2, 10);
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