var express = require('express');
var router = express.Router();
var admin = require('firebase-admin');

var serviceAccount = require('../serviceAccount.json');
var firebaseAdmin = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ice18-fe14e.firebaseio.com"
})


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
