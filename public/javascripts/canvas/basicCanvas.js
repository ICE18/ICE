fabric.Object.prototype.set({
	transparentCorners: false,
	cornerColor: 'rgba(102,153,255,0.5)',
	cornerSize: 12,
	padding: 5
});

document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('.tooltipped');
    var instances = M.Tooltip.init(elems);
  });

  $(document).ready(function(){
    $('.tooltipped').tooltip();
  });

const projectName = $('#hiddenProjectName').val()
const userName = $('#hiddenUserName').val()

var canvas = new fabric.Canvas('mCanvas');

var rect, circle, poly;

function hideProgressBar() {
    var x = document.getElementById("progressBar");
    x.style.display = "none";
}

function showProgressBar() {
    var x = document.getElementById("progressBar");
    x.style.display = "block";
}

function showToastSynced(){
	M.toast({html: 'Synced successfully !!'})
}

function showToastSyncError(){
	M.toast({html: 'Error syncing, please try again.'})
}

function showToast(message){
	M.toast({html: message})
}

function getExistingXml(){
	showProgressBar();
	var svgsRef = db.collection('projects')
					.doc(projectName).collection('svg');
	svgsRef.orderBy("timestamp", "desc").limit(1)
	.get()
	.then(results =>{
		if(results.empty){
			console.log('No data found');
			hideProgressBar();
		} else {
			var strSvg = results.docs[0].data().xml
			console.log('svgData: ',strSvg);
			fabric.loadSVGFromString(strSvg, function(objects, options){
				objects.forEach(svg =>{
					canvas.add(svg).renderAll();
				});
				showToast('Latest commit fetched !!');
				hideProgressBar();
			});
		}
	})
	.catch(error =>{
		showToast('Error reaching servers !!');
		hideProgressBar();
		console.log('Error fetching existing xml', error);
	})

}

getExistingXml();

//Create a rectangle
$('#bSquare').click(function(options) {
  	rect = makeid();
  	rect = new fabric.Rect({
		id: rect,
		left: 50,
		top: 50,
		width: 50,
		height: 50,
		fill: 'rgba(255,255,255,1)',
		stroke: 'rgba(0,0,0,1)',
		strokeWidth: 2
	});
	console.log(rect);
	canvas.add(rect);
	canvas.renderAll();
});

//Create a circle
$('#bCircle').click(function(options) {
	circle = makeid();
	circle = new fabric.Circle({
		id: circle,
		left: 50,
		top: 50,              
		radius:25,
		stroke:'black',
		strokeWidth:2,
		fill:'white'
	});
	console.log(circle);
	canvas.add(circle);
	canvas.renderAll();
});

//Create a triangle
$('#bTriangle').click(function(options) {
	var points=regularPolygonPoints(3,30);
	poly = makeid();
	poly = new fabric.Polygon(points, {
		id: poly,
		stroke: 'black',
		fill: 'white',
		left: 50,
		top: 50,
		strokeWidth: 2,
		strokeLineJoin: 'bevil'
	},	false);
	console.log(poly);
	canvas.add(poly);
	canvas.renderAll();
});

//Create a line
$('#bLine').click(function(options) {
	var points=regularPolygonPoints(2,30);
	poly = makeid();
	poly = new fabric.Line([20, 50, 80, 50], {
		id: poly,
		stroke: 'black',
		fill: 'white',
		left: 50,
		top: 50,
		strokeWidth: 2,
		strokeLineJoin: 'bevil'
	},	false);
	console.log(poly);
	canvas.add(poly);
	canvas.renderAll();
});

//Create a hexagon
$('#bPolygon').click(function(options) {
	var points=regularPolygonPoints(6,30);
	poly = makeid();
	poly = new fabric.Polygon(points, {
		id: poly,
		stroke: 'black',
		fill: 'white',
		left: 50,
		top: 50,
		strokeWidth: 2,
		strokeLineJoin: 'bevil'
	},	false);
	console.log(poly);
	canvas.add(poly);
	canvas.renderAll();
});

//Create a star
$('#bStar').click(function(options) {
	var points=regularStarPoints(6,30);
	poly = makeid();
	poly = new fabric.Polygon(points, {
		id: poly,
		stroke: 'black',
		fill: 'white',
		left: 50,
		top: 50,
		strokeWidth: 2,
		strokeLineJoin: 'bevil'
	},	false);
	console.log(poly);
	canvas.add(poly);
	canvas.renderAll();
	});

//Delete an object
$('#bDelete').click(function(options) {
	canvas.remove(canvas.getActiveObject());
	canvas.renderAll();
});

//Sync you vector with cloud
$('#bSync').click(function(options) {
	showProgressBar();
	db.collection('projects').doc(projectName)
		.collection('svg').add({
			username: userName,
			xml: canvas.toSVG({suppressPreamble: true}),
			timestamp: new Date().getTime()
		})
		.then(doc =>{
			hideProgressBar();
			showToastSynced();
			console.log('Synced successfully')
		})
		.catch(error =>{
			hideProgressBar();
			showToastSyncError();
			console.log('Error syncing: ',error)
		})
});

//Save canvas as png
$('#bSave').click(function(options) {
	let time = new Date().getTime();
	$('#mCanvas').get(0).toBlob(blob =>{
		saveAs(blob,time+'.png');
	});
});

//Stroke range slider
var strokeSlider = document.getElementById("rangeStroke");
var strokeOutput = document.getElementById("strokeValue");
strokeOutput.innerHTML = strokeSlider.value;
strokeSlider.oninput = function(){
	var activeObject = canvas.getActiveObject();
	strokeOutput.innerHTML = this.value;
	activeObject.set('strokeWidth', parseInt(this.value));
	canvas.renderAll();
}

//Stroke color picker
var strokeColorPicker = document.getElementById("strokeColor");
strokeColorPicker.addEventListener("input", function() {
	var activeObject = canvas.getActiveObject();
	activeObject.set('stroke', strokeColorPicker.value);
	canvas.renderAll();
}, false); 

//Fill color picker
var fillColorPicker = document.getElementById("fillColor");
fillColorPicker.addEventListener("input", function() {
	var activeObject = canvas.getActiveObject();
	activeObject.set('fill', fillColorPicker.value);
	canvas.renderAll();
}, false); 
