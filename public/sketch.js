
let drawing = [];
let database;

function setup() {

	createCanvas(400, 400);
	createCanvas(400, 400);
	// canvas.parent('canvascontainer');

	let saveButton = select('#saveButton');
	saveButton.mousePressed(saveDrawing);

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



}

function draw() {
	background(0);

	if (mouseIsPressed) {
		let point = {
			x: mouseX,
			y: mouseY
		}
		drawing.push(point);
	}

	beginShape();
	stroke(255);
	strokeWeight(4);
	noFill();
	for (let i = 0; i < drawing.length; i++) {
		vertex(drawing[i].x, drawing[i].y);
	}
	endShape();

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