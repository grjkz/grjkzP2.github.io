var express = require('express');
var app = express();
var ejs = require('ejs');
var sqlite3 = require('sqlite3').verbose();
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
	// search and order by most recent posts first
	db.all('SELECT threads.topic,posts.comment FROM threads INNER JOIN posts ON threads.id=posts.thread_id ORDER BY posts.edited DESC',function(err,recents) {
		if (err) throw err;
		else {
			console.log(recents)
			res.render('index.ejs',{recents:recents});
		}
	})
	// res.redirect('/boards');
});

app.get('/boards',function(req,res) {
	db.all('SELECT * FROM genres', function(err, results) {
		// console.log(results);
		res.render('showGenres.ejs',{genres:results});
	})
});


app.get('/boards/:genre',function(req,res) {
	// having threads after genres causes the id of threads to overwrite genres', which i need
	// i also want the alias' to be returned with the associated information
	console.log("path: "+req.params.genre);
	db.all('SELECT users.alias,threads.id,threads.votes,threads.topic,threads.updated,threads.created FROM genres INNER JOIN threads ON threads.genre_id=genres.id INNER JOIN users ON threads.creator_id=users.id WHERE genres.folder_name=?',req.params.genre, function(err, results) {
		if (err) throw err;
		else {
			// console.log(results);
			res.render('showThreads.ejs',{topics:results,path:req.params.genre});
		}
	})
});


// new thread form
app.get('/boards/:genre/new',function(req,res) {
	res.render('newThread.ejs',{path:req.params.genre});
});


// new comment form
app.get('/boards/:genre/:thread_id/:topic_name/new',function(req,res) {
	res.render('newComment.ejs',{topic_name:req.params.topic_name,topic_path:"/boards/"+req.params.genre+"/"+req.params.thread_id+"/"+req.params.topic_name});
});


// show all comments in a specific thread
// need to link this to the alias's somehow
app.get('/boards/:genre/:thread_id/:topic_name',function(req,res) {
	db.all('SELECT * FROM threads INNER JOIN posts ON threads.id=posts.thread_id INNER JOIN users ON users.id=posts.user_id WHERE posts.thread_id=?', req.params.thread_id, function(err, results) {
		if (err) {
			throw err;
		}
		else {
			if (results.length) {
				// console.log(results); 
				// db.all('SELECT * FROM posts WHERE thread_id=?',req.params.thread_id,function(err,results) {
				// res.send(results);
				res.render('showComments.ejs',{comments:results,route:"/boards/"+req.params.genre+"/"+req.params.thread_id+"/"+req.params.topic_name,thread_id:req.params.thread_id});
			}
			else {
				db.all('SELECT * FROM threads WHERE id=?',req.params.thread_id,function(error,results) {
					// console.log('err: '+results);
					res.render('showComments.ejs',{comments:results,route:"/boards/"+req.params.genre+"/"+req.params.thread_id+"/"+req.params.topic_name,thread_id:req.params.thread_id});
				});
			}
		}
	});
});



// posting a comment will 'refresh' the page after saving to db
app.post('/boards/:genre/:thread_id/:topic_name',function(req,res) {
	// console.log(req.get('referer'));
	// console.log(req.body.comment);
	db.run("INSERT INTO posts (thread_id,user_id,comment) VALUES (?,?,?)", req.params.thread_id, 1, req.body.comment, function(err) {
		if (err) throw err;
		else {
			res.redirect(req.url);
		}
	});
});


// POSTing a new thread
app.post('/boards/:genre',function(req,res) {
	// console.log(res);
	db.get('SELECT id FROM genres WHERE folder_name=?', req.params.genre, function(error, result) {
		db.run('INSERT INTO threads (genre_id,creator_id,topic,detail) VALUES (?,?,?,?)',result.id, 1,req.body.topic,req.body.detail,function(err) {
			if (err) throw err;
			else {
				res.redirect(req.url);
			}
		})
	})
});

var recentPosts = function() {
	
}