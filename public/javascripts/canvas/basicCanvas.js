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

var canvas = new fabric.Canvas('mCanvas');

var rect, circle, poly;

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
});

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
});

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
	});

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
		});

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
});

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
	});

//Stroke range slider
var strokeSlider = document.getElementById("rangeStroke");
var strokeOutput = document.getElementById("strokeValue");
strokeOutput.innerHTML = strokeSlider.value;
strokeSlider.oninput = function(){
	var activeObject = canvas.getActiveObject();
	strokeOutput.innerHTML = this.value;
	activeObject.set('strokeWidth', parseInt(this.value));
	canvas.add(activeObject);
}

//Stroke color picker
var strokeColorPicker = document.getElementById("strokeColor");
strokeColorPicker.addEventListener("input", function() {
	var activeObject = canvas.getActiveObject();
	activeObject.set('stroke', strokeColorPicker.value);
	canvas.add(activeObject);
}, false); 

//Fill color picker
var fillColorPicker = document.getElementById("fillColor");
fillColorPicker.addEventListener("input", function() {
	var activeObject = canvas.getActiveObject();
	activeObject.set('fill', fillColorPicker.value);
	canvas.add(activeObject);
}, false); 



//console.log('Required svg is : ', canvas.toSVG({
//suppressPreamble: true
//}));