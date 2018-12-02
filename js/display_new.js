let drawing = [];
let database;

let ln;

function setup() {
    createCanvas(windowWidth,windowHeight);


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
	// console.log(firebase);

	//database object
	database = firebase.database();

	let ref = database.ref('drawings');
	ref.on('value', gotData, errData);

    background(30);
    frameRate(60);
    setTimeout(drawAllLines, 200)




}

function draw() {

    background(30);
    drawAllLines();
    text(frameRate(),0,50);
}

let allDrawingPts = [];

function gotData(data) {
	let drawings = data.val();
    let keys = Object.keys(drawings);
    ln=keys.length;
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

let r=50;

function errData(err) {
	console.log(err);
}

function drawAllLines(){
    beginShape(TRIANGLES);
    stroke(230);
    strokeWeight(0.5);
    noFill();
    
    
    
    // for(var i = 0; i<allDrawingPts.length; i++){
    //     var path = allDrawingPts[i];
    //     push();
    //     translate(0,windowHeight/2)
    //     beginShape();
    //     for(var j = 0; j < path.length; j++){
    //         // for(var j = 0; j < path.length; j++){
    //             // let r=map(path[j].x,0,1,height,0);
    //             // let mPosY=map(mouseY,0,windowHeight,0,1);
    //             // let mPosX=map(mouseX,0,windowWidth,0,1);
    //             let mPos=map(mouseY,0,windowHeight,0,1);
    //             // let r=map(path[j].x,0,path[j],0,100);
    //             console.log(allDrawingPts[allDrawingPts.length-1][path.length-1])
    //             // let x=r*cos(i);
    //             // let y=r*sin(i);
    //             // stroke(random(255),random(255),random(255))
               
    //             // vertex(x,y);
                
    //                 vertex(path[j].x*mPos,path[j].y*mPos);
                
    //             // vertex(cos(path[j].x), y);
    //         // }
    //         endShape();
    //     }
    //     pop();
    // }
                let mPos=map(mouseY,0,windowHeight,0,1);
    
    for(var i = 0; i<allDrawingPts.length; i++){
        push();
        translate(windowWidth/2,windowHeight/2)
        beginShape();
        // stroke(random(240))
        stroke(i*30)
        for(var j = 0; j < allDrawingPts[i].length; j++){
            allDrawingPts[i][j].y= allDrawingPts[i][j].y*map(mouseY,0,windowHeight,0.95,0.99);
            // allDrawingPts[i][j].y*=0.98
            // let r=map(allDrawingPts[i][j].y, allDrawingPts[i][0].y,allDrawingPts[i][allDrawingPts[i].length-1].y, 1, 1);
            let r=map(map(allDrawingPts[i][j].y*0.5,0,1000,0,20),map(allDrawingPts[i][0].y*0.5,0,1000,0,20),map(allDrawingPts[i][allDrawingPts[i].length-1].y*0.5,0,1000,0,20), 0+rpos , 2+rpos);

            let x=r*sin(globalpos)*0.1
            let y = r*cos(globalpos)*0.1;
            vertex(x,y);
            // vertex(allDrawingPts[i][j].x*mPos,allDrawingPts[i][j].y*mPos)
            endShape();
            globalpos+=0.01
            rpos+=0.1;
        }
        pop();
        
    }
    rpos=10
    if(globalpos>100){
        console.log(globalpos); 
        globalpos=100;
    }
}
let rpos=10
let globalpos=0;