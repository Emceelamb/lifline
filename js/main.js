function setup() {
    createCanvas(windowWidth, windowHeight);
    time = windowWidth;
    timeW = 10;
    timeH = windowHeight;
    timeStart = windowWidth;

}

function draw() {
    // background(33);
    fill(233);
    textSize(24);
    textAlign(CENTER);
    text("Add your mark: ", windowWidth/2, 100) ;

    noStroke();
    fill(200);
    rect(time, 0, timeW, timeH);
    time--;

    if(mouseIsPressed){
        var point = {
            x: mouseX,
            y: mouseY
        }
        drawing.push(point.x,point.y);        
    }

    beginShape();
    fill(230);
    for(var i; i<drawing.length; i++){
        vertex(drawing[i].x,drawing[i].y);
    }
    endShape();
    

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

// var countDown = function countDown(){
//     var time = 0;
//     var width = 5;
//     var height = windowHeight;    
    
// }

var time, timeW, timeH, timeStart;

var drawing[];

