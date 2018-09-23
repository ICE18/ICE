var express = require('express');
var router = express.Router();
var admin = require('firebase-admin');

var serviceAccount = require('../serviceAccount.json');
var firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ice18-fe14e.firebaseio.com"
});


var db = admin.firestore();
const settings = {timestampsInSnapshots: true};
db.settings(settings);

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 16; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
  }

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'ICE-Home', isUser: false });
});

router.get('/:uname/:status', function(req, res, next) {
	var status = req.params.status
	var uname = req.params.uname
  res.render('index', { title: 'ICE-Home', isUser: status, uname: uname });
});

router.get('/editor/:id/:projectName', function(req, res, next){
	var projectName = req.params.projectName;
	var projectId = req.params.id;
	db.collection("projects").where('id', "==", projectId)
    .get()
    .then(function(querySnapshot) {
		if(querySnapshot.size != 0){

			db.collection("projects").where('name', "==", projectName)
				.get()
				.then(function(querySnapshot){
					if(querySnapshot.size != 0){
						 res.render('editor',{projectId: projectId, projectName: projectName});
					} else{
						res.send('Unauthorised access !!');
					}
				})
				.catch(function(error) {
					console.log("Error getting documents: ", error);
				});
		} else{
			res.send('Unauthorised access !!');
		}
	})
	.catch(function(error) {
        console.log("Error getting documents: ", error);
    });


	
});


/* POST create new project from home page */
router.post('/submitHomeUserName', function(req, res, next){
	var uname = req.body.uname;
	var uid = makeid();

	//Checking if user exists or not (if exists redirect, else create one)
	db.collection("users").where("name", "==", uname)
    .get()
    .then(function(querySnapshot) {
        if(querySnapshot.size != 0){
			//User exists, redirect to get projectname
			querySnapshot.forEach(function(doc) {
				console.log(doc.id, " => ", doc.data());
				res.redirect('/'+uname+'/'+true)
			});
		} else {
			//User does not exist, create one
			db.collection("users").doc(uname).set({
				id: uid,
				name: uname,
				timestamp: new Date().getTime()
			})
			.then(userRef =>{
				//User created, redirect
				res.redirect('/'+uname+'/'+true)
			})
			.catch(function(error) {
				console.log("Error creating documents: ", error);
			});
		}
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
	
});

router.post('/submitHomeProjectName', function(req, res, next){
	var pname = req.body.pname;
	var uname = req.body.username;
	var pid = makeid();

	//Checking if project exists or not (if exists redirect, else create one)
	db.collection("projects").where("name", "==", pname)
    .get()
    .then(function(querySnapshot) {
        if(querySnapshot.size != 0){
			//Project exists, redirect to the editor
			querySnapshot.forEach(function(doc) {
				console.log(doc.id, " => ", doc.data());
				res.redirect('/editor/'+doc.data().id+'/'+pname)
			});
		} else {
			//Project does not exist, create one
			db.collection("projects").doc(pname).set({
				id: pid,
				name: pname,
				timestamp: new Date().getTime()
			})
			.then(projectRef =>{
				//Project created, now add this project in users->projects
				db.collection('users').doc(uname).collection('projects')
				.doc(pname).set({
					id: pid,
					name: pname,
					timestamp: new Date().getTime()
				})
				.then(subProjectRef =>{
					//Project added, now fetch user details from username to get userid
					db.collection('users').doc(uname)
						.get()
						.then(doc => {
							if (!doc.exists) {
							console.log('No such document!');
							} else {
								//Got userid, now add this user in projects->users
								db.collection('projects').doc(pname)
								.collection('users').doc(uname).set({
									id: doc.data().id,
									name: uname,
									timestamp: new Date().getTime()
								})
								.then(subUserRef =>{
									//Everything complete, redirect to editor
									res.redirect('/editor/'+pid+'/'+pname)
								})
							}
						})
						.catch(err => {
							console.log('Error getting document', err);
						});
				})
			})
			.catch(function(error) {
				console.log("Error creating project: ", error);
			});
		}
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
});

module.exports = router;
