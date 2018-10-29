var database;

var drawing = [];
var currentPath = [];

function setup() {
    createCanvas(windowWidth, windowHeight, WEBGL);

    background(33);
    // text("Connect the lines ", windowWidth/2, 100) ;
    
    drawEndpoints();


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
    
  var params = getURLParams();
  console.log(params);
  if (params.id) {
    console.log(params.id);
    showDrawing(params.id);
  }


  var ref = database.ref('drawings');
  ref.on('value', gotData, errData);

}

function drawEndpoints(){
    
    fill(233);
    noStroke();
    translate(-windowWidth/2, -windowHeight/2);
    ellipse(100,windowHeight/2, 10,10);
    ellipse(windowWidth-100,windowHeight/2, 10,10);
}



function getDataOnce(){

    var userId = firebase.auth().currentUser.uid;
    return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
        var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
        // ...
    });
}

var drawingCountRef = firebase.database().ref('drawings/' + '-LPx6I66hK-5piLT3cIU' );
drawingCountRef.on('value', function(snapshot) {
  console.log(snapshot.val());
});

let allDrawingKeys=[];

// loop through keys

let allDrawingPoints = [][]; 

for(let i = 0; i > allDrawingKeys.length; i++){
    for(let j = 0; j> allDrawingPoints)
}

function drawAllPoints(){

    
    beginShape();
	stroke(255);
	strokeWeight(4);
	noFill();
	for (let i = 0; i < drawing.length; i++) {
		vertex(drawing[i][j][0].x, drawing[i][j[0].y);
	}
	endShape();
    
}


function gotData(data) {
	let drawings = data.val();
	let keys = Object.keys(drawings);
	for (let i=0; i<keys.length; i++) {
		let key = keys[i];
        console.log(key);
        allDrawingKeys=
	}
}