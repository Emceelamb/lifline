
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

function draw() {
    stroke(255);
    strokeWeight(4);
    noFill();
    for (var i = 0; i < drawing.length; i++) {
      var path = drawing[i];
      beginShape();
      for (var j = 0; j < path.length; j++) {
        vertex(path[j].x, path[j].y)
      }
      endShape();
    }
  
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


var allDrawings = [];

function showDrawing(key) {
    //console.log(arguments);
    if (key instanceof MouseEvent) {
      key = this.html();
    }
  
    var ref = database.ref('drawings/' + key);
    ref.once('value', oneDrawing, errData);
  
    function oneDrawing(data) {
      var dbdrawing = data.val();
      drawing = dbdrawing.drawing;
      //console.log(drawing);
    }
  
  }
function drawEndpoints(){
    
    fill(233);
    noStroke();
    translate(-windowWidth/2, -windowHeight/2);
    ellipse(100,windowHeight/2, 10,10);
    ellipse(windowWidth-100,windowHeight/2, 10,10);
}

function gotData(data) {

    // clear the listing
    var elts = selectAll('.listing');
    for (var i = 0; i < elts.length; i++) {
      elts[i].remove();
    }
  
    var drawings = data.val();
    var keys = Object.keys(drawings);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      //console.log(key);
      var li = createElement('li', '');
      li.class('listing');
      var ahref = createA('#', key);
      ahref.mousePressed(showDrawing);
      ahref.parent(li);
  
      var perma = createA('?id=' + key, 'permalink');
      perma.parent(li);
      perma.style('padding', '4px');
  
      li.parent('drawinglist');
    }
  }
  
  function errData(err) {
    console.log(err);
  }
  
  function showDrawing(key) {
    //console.log(arguments);
    if (key instanceof MouseEvent) {
      key = this.html();
    }
  
    var ref = database.ref('drawings/' + key);
    ref.once('value', oneDrawing, errData);
  
    function oneDrawing(data) {
      var dbdrawing = data.val();
      drawing = dbdrawing.drawing;
      //console.log(drawing);
    }
  
  }





  ///////



function startPath() {
    isDrawing = true;
    currentPath = [];
    drawing.push(currentPath);
  }
  
  function endPath() {
    isDrawing = false;
  }
  