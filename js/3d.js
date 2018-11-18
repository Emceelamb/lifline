let camX=0, camY=0, camZ=0;

let serial;
let xPos = 0, yPos = 0;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    background(33);
    serial = new p5.SerialPort(); // make a new instance of  serialport librar	
    serial.on('list', printList); // callback function for serialport list event
    serial.on('data', serialEvent); // callback for new data coming in	
    serial.list(); // list the serial ports
    serial.open("/dev/ttyACM0"); // open a port


}

function draw() {
    background(33);
    // CAMERA CONTOLS
    camera(camX, camY, (height/2.0) / tan(PI*30.0 / 180.0)+camZ, 0, 0, 0, 0, 1, 0);
    cameraControl(); 
    // print(xPos, yPos);   
    stroke(230);
    strokeWeight(5);
    beginShape();
    vertex(0,0,0);
    vertex(5,50,0);

    vertex(5,50,0);
    vertex(0,5,0);

    endShape(CLOSE);
    // orbitControl();
    box();
    if(mouseIsPressed){

        drawLine();
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

    // serial = new p5.SerialPort(); // make a new instance of  serialport librar	
    // serial.on('list', printList); // callback function for serialport list event
    // serial.on('data', serialEvent); // callback for new data coming in	
    // serial.list(); // list the serial ports
    // serial.open("/dev/ttyACM0"); // open a port
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
    // if (keyCode === LEFT_ARROW) {
    //     camX-=25;
    //     console.log(camX, camY, camZ);
    // } else if (keyCode === RIGHT_ARROW) {
    //     camX+=25;
    //     console.log(camX, camY, camZ);

    // } else if (keyCode === DOWN_ARROW){
    //     camY+=25;
    //     console.log(camX, camY, camZ);

    // } else if (keyCode === UP_ARROW){
    //     camY-=25;
    //     console.log(camX, camY, camZ);

    
    // } else if (keyCode === 65){
    //     camZ+=25;
    //     console.log(camX, camY, camZ);

    // } else if (keyCode === 90){
    //     camZ-=25;
    //     console.log(camX, camY, camZ);

    // }
    if(keyCode===ENTER){
        camX=0,camY=0,camZ=0;
    }
}
let drawing=[];



function drawLine(){
    // check if line begun
    
        var point = {
            x: mouseX,
            y: mouseY,
            z: 0
        }
        // add points to drawing
        drawing.push(point);       
    

}

// Keyboard camera control
function _cameraControl(){

    if (xPos<400) {
        camX-=25;
        console.log(camX, camY, camZ);
    } else if (xPos>600) {
        camX+=25;
        console.log(camX, camY, camZ);

    } else if (yPos>600){
        camY+=25;
        console.log(camX, camY, camZ);

    } else if (yPos<400){
        camY-=25;
        console.log(camX, camY, camZ);

    
    } else if (keyIsDown(65)){
        camZ+=25;
        console.log(camX, camY, camZ);

    } else if (keyIsDown(90)){
        camZ-=25;
        console.log(camX, camY, camZ);

    }
}


function cameraControl(){

    // console.log(xPos, yPos);
    if (xPos<40) {
        camX-=25;
        console.log(xPos, yPos);
        // console.log(camX, camY, camZ);
    } else if (xPos>190) {
        camX+=25;
        console.log(xPos, yPos);
        // console.log(camX, camY, camZ);

    } else if (yPos<40){
        camY+=25;
        console.log(xPos, yPos);
        // console.log(camX, camY, camZ);

    } else if (yPos>190){
        camY-=25;
        console.log(xPos, yPos);
        // console.log(camX, camY, camZ);

    
    } else if (keyIsDown(65)){
        camZ+=25;
        console.log(camX, camY, camZ);

    } else if (keyIsDown(90)){
        camZ-=25;
        console.log(camX, camY, camZ);

    }
}

// get the list of ports:
function printList(portList) {
    for (var i = 0; i < portList.length; i++) {
        // Display the list the console:
        print(i + " " + portList[i]);
    }
}

function serialEvent() {
    // this is called when data is recieved, data will then live in fromSerial	
    var stringFromSerial = serial.readLine();    // reads everything till the new line charecter
    if (stringFromSerial.length > 0) {             // is the something there ?
        var trimmedString = trim(stringFromSerial);  // get rid of all white space
        var myArray = split(trimmedString, ",")      // splits the string into an array on commas
        xPos = Number(myArray[0]);             // get the first item in the array and turn into integer
        yPos = Number(myArray[1]); 					 // get the second item in the array and turn into integer
    }
}
