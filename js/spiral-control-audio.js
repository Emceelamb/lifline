let drawing = [];
let database;

let scaleAdd = 1;
let scaleCons = 1;
let panCons = -20;
let heightCons = 0;

var attackLevel = 1.0;
var releaseLevel = 0;

var attackTime = 0.001
var decayTime = 0.2;
var susPercent = 0.2;
var releaseTime = 0.5;

var env, triOsc;

let ln;

let serial;

let rad = 0; rag = 0; col = 0;

function setup() {
    createCanvas(windowWidth, windowHeight);


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

    //database object
    database = firebase.database();

    let ref = database.ref('drawings');
    ref.on('value', gotData, errData);

    background(30);
    frameRate(60);
    setTimeout(drawAllLines, 200)



    // envelope code
    env = new p5.Env();
    env.setADSR(attackTime, decayTime, susPercent, releaseTime);
    env.setRange(attackLevel, releaseLevel);

    triOsc = new p5.Oscillator('sine');
    triOsc.amp(env);
    triOsc.start();


    // SERIAL

    serial = new p5.SerialPort(); // make a new instance of  serialport librar
    serial.on('list', printList); // callback function for serialport list event
    serial.on('data', serialEvent); // callback for new data coming in
    serial.list(); // list the serial ports
    serial.open("/dev/ttyACM0"); // open a port

}

function draw() {

    background(30);
    drawAllLines();
    text(frameRate(), 0, 50);
    text(allDrawingPts.length, 0, 100);
}

let allDrawingPts = [];
let drawNo = 0;


//play envelope
function playEnv() {
    env.play();
}

function tracking(audioX, audioY) {
    ellipse(audioX, audioY, 50, 50);
}


function gotData(data) {
    let drawings = data.val();
    let keys = Object.keys(drawings);
    ln = keys.length;
    allDrawingPts = [];
    for (let i = 0; i < keys.length; i++) {
        let key = keys[i];
        // console.log(key);
        var drawingCountRef = firebase.database().ref('drawings/' + key);
        drawingCountRef.on('value', function (snapshot) {
            // console.log(snapshot.val());
            allDrawingPts.push(snapshot.val());
        });

    }
}

let r = 50;

function errData(err) {
    console.log(err);
}

function drawAllLines() {
    beginShape(TRIANGLES);
    stroke(230);
    strokeWeight(0.5);
    noFill();


    let mPos = map(mouseY, 0, windowHeight, 0, 1);

    for (var i = 0; i < allDrawingPts.length; i++) {
        push();
        translate(windowWidth / 2, windowHeight / 2)
        beginShape();
        // stroke(random(240))
        for (var j = 0; j < allDrawingPts[i].length; j++) {
            if (col === 1) {
                stroke(random(240), random(240), random(240));
            }
            allDrawingPts[i][j].y = allDrawingPts[i][j].y * map(rag, 0, 1023, 0.95, 0.99);
            // allDrawingPts[i][j].y*=0.98
            // let r=map(allDrawingPts[i][j].y, allDrawingPts[i][0].y,allDrawingPts[i][allDrawingPts[i].length-1].y, 1, 1);
            // let rx=map(map(allDrawingPts[i][j].x*0.5,0,1000,0,20),map(allDrawingPts[i][0].x*0.5,0,1000,0,20),map(allDrawingPts[i][allDrawingPts[i].length-1].x*0.5,0,1000,0,20), 0+rpos , 2+rpos);
            // let ry=map(map(allDrawingPts[i][j].y*0.5,0,1000,0,20),map(allDrawingPts[i][0].y*0.5,0,1000,0,20),map(allDrawingPts[i][allDrawingPts[i].length-1].y*0.5,0,1000,0,20), 0+rpos , 2+rpos);
            // let x=ry*sin(globalpos)*1
            // let y = rx*cos(globalpos)*1;

            let r = map(map(allDrawingPts[i][j].y * 0.5, 0, 1000, 0, 20), map(allDrawingPts[i][0].y * 0.5, 0, 1000, 0, 20), map(allDrawingPts[i][allDrawingPts[i].length - 1].y * 0.5, 0, 1000, 0, 20), 0 + rpos, 1 + rpos);
            let x = r * sin(allDrawingPts[i][j].x * 0.001) 
            let y = r * cos(allDrawingPts[i][j].x * 0.001) ;

            vertex(x * 0.1, y * 0.1);


            if ((millis() % 1000) == 0) {


                // k+=25;
                //   noStroke();
                stroke(255, 0, 0);
                fill(255, 255, 255);
                ellipse(x * 0.1, y * 0.1, 10, 10);
                triOsc.freq((allDrawingPts[i][j].x + allDrawingPts[i][j].y) / 2);
                // console.log(allDrawingPts[i][k].x,"!")
                //   tracking(allDrawingPts[i][k].x, allDrawingPts[i][k].y/scaleCons+heightCons);


                env.play();

            }
            noFill();
            if (i === allDrawingPts.length - 1) {
                stroke(255, 0, 0);
            }
            // vertex(allDrawingPts[i][j].x*mPos,allDrawingPts[i][j].y*mPos)
            endShape();
            globalpos += 0.01;
            rpos += map(rad, 0, 1023, 0.1, 2);

        }
        pop();

    }
    rpos = 10
    if (globalpos > 100) {
        console.log(globalpos);
        globalpos = 100;
    }
}
let rpos = 10
let globalpos = 0;



// SERIAL


// get the list of ports:
function printList(portList) {
    for (var i = 0; i < portList.length; i++) {
        // Display the list the console:
        print(i + " " + portList[i]);
    }
}

function serialEvent() {
    // this is called when data is recieved, data will then live in fromSerial
    var stringFromSerial = serial.readLine();
    // console.log(stringFromSerial);
    // reads everything till the new line charecter
    if (stringFromSerial.length > 0) {             // is the something there ?
        var trimmedString = trim(stringFromSerial);  // get rid of all white space
        var myArray = split(trimmedString, ",")      // splits the string into an array on commas
        rad = Number(myArray[0]);             // get the first item in the array and turn into integer
        rag = Number(myArray[1]); 					 // get the second item in the array and turn into integer
        col = Number(myArray[2]);
    }
}
