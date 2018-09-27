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

var mTimestamp;

var prevCanvas = new fabric.Canvas('mPreviewCanvas');
prevCanvas. preserveObjectStacking = true;
var canvas = new fabric.Canvas('mCanvas');
canvas. preserveObjectStacking = true;
var strokeSlider = document.getElementById("rangeStroke");
var strokeOutput = document.getElementById("strokeValue");
var strokeColorPicker = document.getElementById("strokeColor");
var fillColorPicker = document.getElementById("fillColor");

var rect, circle, poly;

function listenToLatestChanges(){
	console.log('Listening...')
	db.collection('projects')
		.doc(projectName).collection('svg').where('timestamp','>',mTimestamp)
			.onSnapshot(snapshot =>{
				snapshot.docChanges().forEach(function(change) {
					console.log('Some stuff changed!!')
					if (change.type === "added") {
						console.log("New city: ", change.doc.data());
						if(change.doc.data().username == userName){
							//Do nothing
						} else{
							showToast(change.doc.data().username+' made some changes !!')
						}
					}
				});
			})
}

function hideProgressBar() {
    var x = document.getElementById("progressBar");
    x.style.display = "none";
}

function showProgressBar() {
    var x = document.getElementById("progressBar");
    x.style.display = "block";
}

function hidePrevProgressBar() {
    var x = document.getElementById("prevProgressBar");
    x.style.display = "none";
}

function showPrevProgressBar() {
    var x = document.getElementById("prevProgressBar");
    x.style.display = "block";
}

function showOptionsToolBar(){
	var optionsToolbar = document.getElementById("mOptionsToolbar")
	optionsToolbar.style.display = "block";
}

function hideOptionsToolBar(){
	var optionsToolbar = document.getElementById("mOptionsToolbar")
	optionsToolbar.style.display = "none";
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
			mTimestamp = results.docs[0].data().timestamp
			console.log('svgData: ',strSvg);
			fabric.loadSVGFromString(strSvg, function(objects, options){
				objects.forEach(svg =>{
					canvas.add(svg).renderAll();
				});
				//showToast('Latest commit fetched !!');
				listenToLatestChanges();
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

function getExistingXmlPreview(){
	showPrevProgressBar();
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
					prevCanvas.add(svg).renderAll();
				});
				hidePrevProgressBar();
			});
		}
	})
	.catch(error =>{
		showToast('Error reaching servers !!');
		hidePrevProgressBar();
		console.log('Error fetching existing xml', error);
	})

}

function rgb2hex(rgb){
	if(rgb[0] == '#'){
		return rgb;
	} else{
	rgb = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
	return (rgb && rgb.length === 4) ? "#" +
	 ("0" + parseInt(rgb[1],10).toString(16)).slice(-2) +
	 ("0" + parseInt(rgb[2],10).toString(16)).slice(-2) +
	 ("0" + parseInt(rgb[3],10).toString(16)).slice(-2) : '';
	}
}

function onObjectSelected(e) {
	showOptionsToolBar();
	strokeSlider.value  = parseInt(e.target.get('strokeWidth'))
	strokeOutput.innerHTML  = e.target.get('strokeWidth')

	strokeColorPicker.value  = rgb2hex(e.target.get('stroke'))
	fillColorPicker.value  = rgb2hex(e.target.get('fill'))
}

function onObjectSelectionCleared(e){
	hideOptionsToolBar();
}

function openPrev() {
	document.getElementById("myNav").style.width = "100%";
	prevCanvas.clear();
	getExistingXmlPreview();
}

function closePrev() {
    document.getElementById("myNav").style.width = "0%";
}

getExistingXml();


//Listen for object selected
canvas.on('object:selected', onObjectSelected);
canvas.on('selection:updated', onObjectSelected);
canvas.on('selection:cleared', onObjectSelectionCleared);

//Create a rectangle
$('#bSquare').click(function(options) {
  	rect = new fabric.Rect({
		id: makeid(),
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
	circle = new fabric.Circle({
		id: makeid(),
		left: 50,
		top: 50,              
		radius:25,
		fill: 'rgba(255,255,255,1)',
		stroke: 'rgba(0,0,0,1)',
		strokeWidth:2
	});
	console.log(circle);
	canvas.add(circle);
	canvas.renderAll();
});

//Create a triangle
$('#bTriangle').click(function(options) {
	var points=regularPolygonPoints(3,30);
	poly = new fabric.Polygon(points, {
		id: makeid(),
		fill: 'rgba(255,255,255,1)',
		stroke: 'rgba(0,0,0,1)',
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
	poly = new fabric.Line([20, 50, 80, 50], {
		id: makeid(),
		fill: 'rgba(255,255,255,1)',
		stroke: 'rgba(0,0,0,1)',
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
	poly = new fabric.Polygon(points, {
		id: makeid(),
		fill: 'rgba(255,255,255,1)',
		stroke: 'rgba(0,0,0,1)',
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
	poly = new fabric.Polygon(points, {
		id: makeid(),
		fill: 'rgba(255,255,255,1)',
		stroke: 'rgba(0,0,0,1)',
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
	// var svgsRef = db.collection('projects')
	// .doc(projectName).collection('svg');
	// svgsRef.orderBy("timestamp", "desc").limit(1)
	// .get()
	// .then(results =>{
	// 	if(results.empty){
	// 		hideProgressBar();
	// 		console.log('No data found');
	// 	} else {
	// 		var fetchedJson = results.docs[0].data().json;
	// 		if(results.docs[0].data().timestamp == mTimestamp){
	// 			//We are working on latest commit
	// 				db.collection('projects').doc(projectName)
	// 					.collection('svg').add({
	// 						username: userName,
	// 						json: canvas.toJSON({suppressPreamble: true}),
	// 						xml: canvas.toSVG({suppressPreamble: true}),
	// 						timestamp: new Date().getTime()
	// 					})
	// 					.then(doc =>{
	// 						hideProgressBar();
	// 						showToastSynced();
	// 						console.log('Synced successfully')
	// 					})
	// 					.catch(error =>{
	// 						hideProgressBar();
	// 						showToastSyncError();
	// 						console.log('Error syncing: ',error)
	// 					})
	// 		} else{
	// 			//We are working on outdated commit
	// 			var resJson = mergeAdvanced(fetchedJson, canvas.toJSON({suppressPreamble: true})
	// 				,{
	// 					cb: (inputArg1, inputArg2, resultAboutToBeReturned, infoObj) => {
	// 					  if (typeof inputArg1 === "boolean" && typeof inputArg2 === "boolean") {
	// 						return inputArg2;
	// 					  	}
	// 					  return resultAboutToBeReturned;
	// 					}
	// 				})
	// 			console.log(resJson)
	// 			canvas.loadFromJson(resJson)
	// 					showToast('Latest commit fetched !!');
	// 					hideProgressBar();
	// 				// fabric.loadSVGFromString(strSvg, function(objects, options){
	// 				// 	objects.forEach(svg =>{
	// 				// 		canvas.add(svg).renderAll();
	// 				// 	});
	// 				// 	showToast('Latest commit fetched !!');
	// 				// 	hideProgressBar();
	// 				// });
	// 		}			
	// 	}
	// })
	// .catch(error =>{
	// 	showToast('Error reaching servers !!');
	// 	hideProgressBar();
	// 	console.log('Error fetching existing xml', error);
	// })

	db.collection('projects').doc(projectName)
		.collection('svg').add({
			username: userName,
			json: canvas.toJSON({suppressPreamble: true}),
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
strokeOutput.innerHTML = strokeSlider.value;
strokeSlider.oninput = function(){
	var activeObject = canvas.getActiveObject();
	strokeOutput.innerHTML = this.value;
	activeObject.set('strokeWidth', parseInt(this.value));
	canvas.renderAll();
}

//Stroke color picker
strokeColorPicker.addEventListener("input", function() {
	var activeObject = canvas.getActiveObject();
	activeObject.set('stroke', strokeColorPicker.value);
	canvas.renderAll();
}, false); 

//Fill color picker
fillColorPicker.addEventListener("input", function() {
	var activeObject = canvas.getActiveObject();
	activeObject.set('fill', fillColorPicker.value);
	canvas.renderAll();
}, false); 
