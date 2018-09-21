var express = require('express');
var router = express.Router();
var admin = require('firebase-admin');

var serviceAccount = require('../serviceAccount.json');
var firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ice18-fe14e.firebaseio.com"
});

var db = admin.firestore();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('Logging Kashish');
  res.render('index', { title: 'Express' });
});

/* POST create new project from home page */
router.post('/createNewProject', function(req, res, next){
	var pname = req.body.pname;
	var uname = req.body.uname;

	var projectId;
	var userId;
	
	var addDoc = db.collection('projects').add({
		name: pname[0],
		timestamp: new Date().getTime()
	}).then(projectRef => {
			projectId = projectRef.id;
			console.log('Added project with ID: ', projectRef.id);
			db.collection('users').add({
				name: pname[1],
				timestamp: new Date().getTime()
			})
			.then(userRef => {
				userId = userRef.id;
				console.log('Added user with ID: ', userRef.id);
				db.collection('projects').doc(projectId)
					.collection('users').doc(userId).set({
						id: userId,
						timestamp: new Date().getTime()
					})
					.then(subProjectRef => {
						console.log('Added user in project with ID: ', subProjectRef.id);
						db.collection('users').doc(userId)
							.collection('projects').doc(projectId).set({
								id: projectId,
								timestamp: new Date().getTime()
							})
							.then(subUserRef => {
								console.log("Everything completed");
								res.redirect('/'+projectRef.id+'/editor');
							})
							.catch(error => {
								console.log('Error adding project in user: ', error);
							})
					})
					.catch(error => {
						console.log('Error adding user in project: ', error);
					})
			})
			.catch(error => {
				console.log('Error adding user: ', error);
			})
	})
	.catch(error => {
		console.log('Error adding project: ', error);
	})

});
	

router.get('/:projectId/editor', function(req, res, next){
	var projectId = req.params.projectId;
	res.render('editor',{projectId: projectId});
});

module.exports = router;
