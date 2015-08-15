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


// landing page
app.get('/',function(req,res) {
	// get list of posts and order by most recent
	db.all('SELECT threads.topic,posts.comment FROM threads INNER JOIN posts ON threads.id=posts.thread_id ORDER BY posts.edited DESC',function(err,recents) {
		if (err) throw err;
		else {
			// console.log(recents);
			// get list of topics ordered by votes
			db.all('SELECT threads.topic,threads.votes,genres.folder_name,threads.id FROM genres INNER JOIN threads ON genres.id=threads.genre_id ORDER BY threads.votes DESC',function(error,popular) {
			// db.all('SELECT * FROM threads ORDER BY votes DESC',function(error,popular) {
				// res.send(popular)
				res.render('index.ejs',{recents:recents,popular:popular});
			})
		}
	})
	// res.redirect('/boards');
});


// render all genre folders
app.get('/boards',function(req,res) {
		// TRYING TO GET A COUNT OF ALL THREADS JOINED WITH WITH THE GENRES.*
		// HAVING NO THREADS WITH .genre_id CAUSES NO RETURN ON SPECIFIC GENRE
		// DOESNT WORK AS INTENDED
		// db.all('SELECT genres.* , COUNT(*) FROM threads INNER JOIN genres ON threads.genre_id=genres.id GROUP BY genres.id',function(error,result){
		// 	if (error) throw error;
		// 	else { res.send(result); }
		// })

	db.all('SELECT * FROM genres', function(err, results) {
		res.render('showGenres.ejs',{genres:results});
	});
});


// sends client to a random topic
app.get('/boards/random',function(req,res) {
	db.all('SELECT threads.*, genres.folder_name FROM threads INNER JOIN genres ON threads.genre_id=genres.id',function(err,results) {
		// shuffle the results
		for (var i=0;i<results.length;i++) {
			var temp = results.shift();
			results.splice(Math.floor(Math.random()*results.length),0,temp);
		}
		res.redirect('/boards/'+results[0].folder_name+'/'+results[0].id+'/'+results[0].topic)
	});
});


// render all threads in specified genre
app.get('/boards/:genre',function(req,res) {
	// having threads after genres causes the id of threads to overwrite genres', which i need
	// i also want the alias' to be returned with the associated information
	console.log("path: "+req.params.genre);
	db.all('SELECT users.alias,threads.id,threads.votes,threads.topic,threads.updated,threads.created FROM genres INNER JOIN threads ON threads.genre_id=genres.id INNER JOIN users ON threads.creator_id=users.id WHERE genres.folder_name=?',req.params.genre, function(err, results) {
		if (err) throw err;
		else {
			// res.send(results);
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
			if (results.length) {  // caution: results=undefined if there are no comments
				// console.log(results); 
				// db.all('SELECT * FROM posts WHERE thread_id=?',req.params.thread_id,function(err,results) {
				// res.send(results);
				res.render('showComments.ejs',{comments:results,route:"/boards/"+req.params.genre+"/"+req.params.thread_id+"/"+req.params.topic_name,back_path:"/boards/"+req.params.genre});
			}
			else {  // if results=undefined for that topic, just grab topic's info
				db.all('SELECT * FROM threads WHERE id=?',req.params.thread_id,function(error,results) {
					// res.send(results);
					res.render('showComments.ejs',{comments:results,route:"/boards/"+req.params.genre+"/"+req.params.thread_id+"/"+req.params.topic_name,back_path:"/boards/"+req.params.genre});
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


// up vote
app.put('/boards/:genre/:thread_id/:topic_name/upvote',function(req,res) {
  db.run('UPDATE threads SET votes=votes+1 WHERE id=?',req.params.thread_id, function(err) {
    if (err) throw err;
    else {
    	console.log('upvote went thru');
    	res.redirect(req.get('referer'));
    }
  });
});

// down vote
app.put('/boards/:genre/:thread_id/:topic_name/downvote',function(req,res) {
  db.run('UPDATE threads SET votes=votes-1 WHERE id=?',req.params.thread_id, function(err) {
    if (err) throw err;
    else {
    	console.log('upvote went thru');
    	res.redirect(req.get('referer'));
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


// form to register a new user
app.get('/signup',function(req,res) {
	res.render('signup.ejs');
});


// post new username
app.post('/signup',function(req,res) {
		db.run('INSERT INTO users (alias,pass,avatar) VALUES (?,?,?)',req.body.alias,req.body.pass,req.body.avatar,function(err) {
			if (err) res.redirect('/signup');
			else res.redirect('/boards');
		})
})