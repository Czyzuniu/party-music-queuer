const express = require('express');
const router = express.Router();
const passwordHash = require('password-hash');
const qr = require('node-qr-image');
const uniqueFilename = require('unique-filename')
const url = require('url');

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

  	let fromDate = new Date(`${req.query.fromDate} ${req.query.fromTime}`)
  	let thruDate = new Date(`${req.query.thruDate} ${req.query.thruTime}`)

  	const party = {
  		party_name: req.query.partyName,
  		party_password:hashedPassword,
  		party_qr:generateQR('test'),
  		party_ending_date:dateIntoSql(thruDate),
  		party_created_date:dateIntoSql(fromDate)
  	}

  	insertRow("parties", party, (data) => {
  		if (data) {
  			console.log(`party added with id ${data.results.insertId}`)
  			res.redirect(`/viewParty/${data.results.insertId}`)
  		}
  	})
});


router.get('/viewParty/:partyId', (req,res) => {
	queryDb([],'parties','party_id', req.params.partyId, (data) => {
		if (data.length) {
			let results = data[0]
			console.log(data)
			res.render('viewParty',{party:results, test:new Date()});
		} else {
			console.log('wwe')
			res.render('notFound', {partyId: req.params.partyId});
		}
	})
})


function insertRow(tableName, set, callback) {
  	connection.query(`INSERT INTO ${tableName} SET ?`, set, (error, results, fields) => {
  		if (error) throw error;
  		callback({results:results, fields:fields})
	});
}

function queryDb(columns, tableName, whereField, whereVal, callback) {
	let options = [columns, tableName, whereVal]
	let query = `SELECT ?? FROM ?? WHERE ${whereField} = ?`
	if (!columns.length) {
		query = `SELECT * FROM ?? WHERE ${whereField} = ?`
		options = [tableName, whereVal]
	}
	connection.query(query,options, function (error, results, fields) {
	  if (error) throw error;
	  callback(results)
	});
}

function generateQR(url) {
	const qrCode = uniqueFilename('public/images/qrcodes', 'qr') + '.png'
	let qrImage = qr.image(url, { type: 'png', size:250});
	qrImage.pipe(require('fs').createWriteStream(qrCode));

	return qrCode.replace('public', '')
}


function dateIntoSql(date){
	return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
}




module.exports = router;