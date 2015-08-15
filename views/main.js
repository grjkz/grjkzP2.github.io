var sqlite = require('sqlite3').verbose();
var db = new sqlite.Database('milkT.db');

$('.upvote').click(function() {
	console.log('upvote clicked');
	// db.run('UPDATE threads SET votes+votes+1 WHERE id=?',id, function(err) {
	// 	if (err) throw err;
	// 	else console.log('upvote went thru');
	// })
})

var upvote = function(id) {
	db.run('UPDATE threads SET votes+votes+1 WHERE id=?',id, function(err) {
		if (err) throw err;
		else console.log('upvote went thru');
	});
}