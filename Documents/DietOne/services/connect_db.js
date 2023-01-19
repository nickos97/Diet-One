const mysql = require('mysql');

const REMOTE_ACCESS = parseInt(process.env.REMOTE)
console.log("REMOTE:",REMOTE_ACCESS)
if(REMOTE_ACCESS){
	var db = mysql.createConnection({
		host     : 'localhost',
		user     : 'root',
		password : 'Becomelegend1',
		database : 'diet2',
		port: 3306,
		timezone: 'Z'
	});
	db.connect(function(err) {
		if(err) {
			throw err
		}
		console.log("remote database connected");
	});
}

else {
	var db = mysql.createConnection({
		host     : process.env.DB_HOST,
		user     : process.env.DB_USER,
		password : process.env.DB_PASSWORD,
		database : process.env.DB_NAME,
		port: process.env.DB_PORT,
		timezone: 'Z'
	});


	
	db.connect(function(err) {
		if(err) {
			throw err
		}
		console.log("local database connected");
	});
}

module.exports=db;