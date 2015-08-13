var express = require('express');
var app = express();
var ejs = require('ejs');
var sqlite3 = require('sqlite3');
var db = new sqlite3.Database('milkT.db');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var urlencodedBodyParser = bodyParser.urlencoded({extended: false});
var fs = require('fs');
app.use(express.static('views'));
app.use(urlencodedBodyParser);
app.use(methodOverride('_method'));
app.set('view_engine', 'ejs');

app.listen(3000, function() {
	console.log('listening on 3k...');
});

app.get('/',function(req,res) {
	res.redirect('/boards');
});

app.get('/boards',function(req,res) {
	db.all('SELECT * FROM genres', function(err, results) {
		// console.log(results);
		res.render('showGenres.ejs',{genres:results});
	})
});

app.get('/boards/:genre',function(req,res) {
	// having threads after genres causes the id of threads to overwrite genres', which i need
	db.all('SELECT * FROM genres INNER JOIN threads ON threads.genre_id=genres.id WHERE genres.folder_name=?',req.params.genre, function(err, results) {
		if (err) throw err;
		else {
			// console.log(results);
			res.render('showThreads.ejs',{topics:results,route:req.url});
		}
	})
});

app.get('/boards/:genre/new',function(req,res) {
	res.render('newThread.ejs',{path:req.params.genre});
});

app.get('boards/:genre/:thread_id/:topic',function(req,res) {
	//render the posts with the same :thread_id. dont think the other params are needed
});

app.post('/boards/:genre',function(req,res) {
	// console.log(res);
	db.get('SELECT id FROM genres WHERE folder_name=?', req.params.genre, function(error, result) {
		db.run('INSERT INTO threads (genre_id,topic,detail) VALUES (?,?,?)',result.id,req.body.topic,req.body.detail,function(err) {
			if (err) throw err;
			else {
				res.redirect(req.url);
			}
		})
	})
});

