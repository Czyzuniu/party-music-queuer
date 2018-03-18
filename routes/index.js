const express = require('express');
const router = express.Router();
const passwordHash = require('password-hash');
var qr = require('node-qr-image');
var uniqueFilename = require('unique-filename')


const mysql      = require('mysql');
const connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'root',
  database : 'QUEUER'
});


connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  console.log('connected as id ' + connection.threadId);
});


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express'});
});




router.get('/createParty', function(req, res, next) {
	//hash the password
  	const hashedPassword = req.query.password ? passwordHash.generate(req.query.password) : ""

  	const party = {
  		party_name: req.query.partyName,
  		party_password:hashedPassword,
  		party_qr:generateQR('test')
  	}

  	insertRow("parties", party, (data) => {
  		if (data) {
  			console.log(`party added with id ${data.results.insertId}`)

  		}
  	})


});



function insertRow(tableName, set, callback) {
  	connection.query(`INSERT INTO ${tableName} SET ?`, set, (error, results, fields) => {
  		if (error) throw error;
  		callback({results:results, fields:fields})
	});
}





function generateQR(url) {
	const qrCode = uniqueFilename('public/images/qrcodes', 'qr') + '.png'
	let qrImage = qr.image(url, { type: 'png', size:250});
	qrImage.pipe(require('fs').createWriteStream(qrCode));

	return qrCode.replace('public', '')
}



module.exports = router;