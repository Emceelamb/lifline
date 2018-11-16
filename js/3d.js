let camX=0, camY=0, camZ=0;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    background(33);


}

function draw() {
    background(33);
    // CAMERA CONTOLS
    camera(camX, camY, (height/2.0) / tan(PI*30.0 / 180.0)+camZ, 0, 0, 0, 0, 1, 0);
    cameraControl();    
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
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// function keyPressed() {
//     if (keyCode === LEFT_ARROW) {
//         camX-=25;
//         console.log(camX, camY, camZ);
//     } else if (keyCode === RIGHT_ARROW) {
//         camX+=25;
//         console.log(camX, camY, camZ);

//     } else if (keyCode === DOWN_ARROW){
//         camY+=25;
//         console.log(camX, camY, camZ);

//     } else if (keyCode === UP_ARROW){
//         camY-=25;
//         console.log(camX, camY, camZ);

    
//     } else if (keyCode === 65){
//         camZ+=25;
//         console.log(camX, camY, camZ);

//     } else if (keyCode === 90){
//         camZ-=25;
//         console.log(camX, camY, camZ);

//     }
// }
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


function cameraControl(){

    if (keyIsDown(LEFT_ARROW)) {
        camX-=25;
        console.log(camX, camY, camZ);
    } else if (keyIsDown(RIGHT_ARROW)) {
        camX+=25;
        console.log(camX, camY, camZ);

    } else if (keyIsDown(DOWN_ARROW)){
        camY+=25;
        console.log(camX, camY, camZ);

    } else if (keyIsDown(UP_ARROW)){
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