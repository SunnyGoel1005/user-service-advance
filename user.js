const express = require('express');
var mysql = require('mysql');
const app = express();
const port = process.env.USER_PORT||3000;
const fs = require('fs');
const { Tags, FORMAT_HTTP_HEADERS } = require('opentracing');
const db_user = process.env.DB_USER||'root'
const db_password = process.env.DB_PASSWORD||'password'
const db_host = process.env.DB_HOST||'35.221.222.246'
const db_schema = process.env.DB_SCHEMA||'nagp'


var ConnPool = mysql.createPool({
	host: db_host,
	user: db_user,
	password: db_password,
	database: db_schema
});


ConnPool.query('USE nagp', function (err) {
	if (err) throw Error('\n\t **** error using database **** ' + err);
		console.log('\n\t ==== database nagp Connected successfully !! ====')

	ConnPool.query('CREATE TABLE IF NOT EXISTS user(id INT NOT NULL AUTO_INCREMENT, PRIMARY KEY(id),name VARCHAR(30),age INT,'
			       + 'email VARCHAR(30))', function (err) {
	if (err) {
		throw Error('\n\t **** error creating table **** ' + err);
	}
	});
});
	

app.get('/user/:id', function (req, res) {
	ConnPool.getConnection(function (errConn, conn) {
		var userId = req.params.id;
		if (errConn) {
			throw Error('error get connection : ' + errConn);
		}
		conn.query('SELECT * FROM user where id = '+ userId , function (errSelect, rows) {
		if (errSelect) {
			throw Error('error selecting user : ' + errSelect);
		}
		res.writeHead(200, {
			'Content-Type': 'application/json'
		});
		var result = {
			success: true,
			rows: rows.length,
		}
		res.write(JSON.stringify(rows));
		res.end();
		});
	});
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))