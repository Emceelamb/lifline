var first, second;  
function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    leftBuffer = createGraphics(400, 400);
    rightBuffer = createGraphics(400, 400);
    time = windowWidth;
    timeW = 10;
    timeH = windowHeight;
    timeStart = windowWidth;
    background(33);
    // text("Connect the lines ", windowWidth/2, 100) ;

    fill(233);
    noStroke();
    translate(-windowWidth/2, -windowHeight/2);
    ellipse(100,windowHeight/2, 10,10);
    ellipse(windowWidth-100,windowHeight/2, 10,10);
}

function draw() {
    fill(255,0,0);

    leftBuffer = createGraphics(400, 400);
    rightBuffer = createGraphics(400, 400);
    console.log(mouseX, mouseY);

    // if mouse is in the start point begin drawing
    if(mouseX > 95 && mouseX < 105 && mouseY < windowHeight/2 + 5 && mouseY > windowHeight/2 - 5){
        console.log("mouse is in start")
        inTheBeginning = !inTheBeginning;
    }

    // if mouse is in the endpoint end drawing.
    if(mouseX > windowWidth-105 && mouseX < windowWidth-95 && mouseY < windowHeight/2 + 5 && mouseY > windowHeight/2 - 5){
        console.log("mouse is in start")
        inTheBeginning = !inTheBeginning;
    }

    // line only draws if begun
    drawLine();
    left();right();
    image(left,0,0);
    image(right,0,0);
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

var inTheBeginning = false;

var time, timeW, timeH, timeStart;

var drawing = [];

function drawLine(){
    // check if line begun
    if(inTheBeginning){
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
    translate(-windowWidth/2,-windowHeight/2);
    for(var i=0; i<drawing.length; i++){
        vertex(drawing[i].x,drawing[i].y, drawing[i].z);
    }
    endShape();
}

function keyPressed(){
    if(keyCode===ENTER){
        saveJSON(continuousLine, 'line.json')
        print("saved line to json")
    }
}

var continuousLine= {"line": drawing};


function left() {
    leftBuffer.background(0, 0, 0);
    leftBuffer.fill(255, 255, 255);
    leftBuffer.textSize(32);
    leftBuffer.text("This is the left buffer!", 50, 50);
}

function right() {
    rightBuffer.background(255, 100, 255);
    rightBuffer.fill(0, 0, 0);
    rightBuffer.textSize(32);
    rightBuffer.text("This is the right buffer!", 50, 50);
}