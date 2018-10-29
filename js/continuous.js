
let drawing = [];
let database;

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

	// canvas.parent('canvascontainer');


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

    background(30);
    drawAllLines();

}

function draw() {
}

let allDrawingPts = [];

function gotData(data) {
	let drawings = data.val();
	let keys = Object.keys(drawings);
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

function errData(err) {
	console.log(err);
}

function drawAllLines(){
    
    // translate(-windowWidth/2, -windowHeight/2);
    
	stroke(255);
	strokeWeight(4);
	noFill();
	for (let i = 0; i > allDrawingPts.length; i++) {
        beginShape();
        for(let j = 0; j>allDrawingPts[i].length;j++){

            vertex(allDrawingPts[i][j].x, allDrawingPts[i][j].y,0);
            
        }
        endShape();
	}
}