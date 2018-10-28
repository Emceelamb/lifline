let isDrawing = false;
let isConnected = false;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    background(33);
    // text("Connect the lines ", windowWidth/2, 100) ;
    
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
  
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

var inTheBeginning = false;

var time, timeW, timeH, timeStart;

var drawing = [];

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
    translate(-windowWidth/2,-windowHeight/2);
    for(var i=0; i<drawing.length; i++){
        vertex(drawing[i].x,drawing[i].y, drawing[i].z);
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
    translate(-windowWidth/2, -windowHeight/2);
    ellipse(100,windowHeight/2, 10,10);
    ellipse(windowWidth-100,windowHeight/2, 10,10);
}