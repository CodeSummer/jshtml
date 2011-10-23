var assert = require('assert');
var sqlite = require('sqlite');
var express = require('express');
var jshtml = require('jshtml');

var port = parseInt(process.argv.pop());
var app = express.createServer();
app.configure(function() {
	app.use(express.bodyParser());
	app.use(app.router);
});


app.set('view engine', 'jshtml');
app.set('view options', {
	with:	'locals'
});
app.get('/', function(req, res) {
	res.render('message', {
		title:	'Welcome'
		, message:	'Hey man'
	});
});
app.get('/contact', function(req, res) {
	res.render('contact', {
		title:	'Contact'
	});
});
app.get('/hello', function(req, res) {
	res.render('message', {
		title:	'Hello'
		, message:	'Hello, world!'
	});
});
app.get('/words', function(req, res) {
	var db = new sqlite.Database();
	var words;

	function a()	{
		db.open(__dirname + '/helloworld.db', b);
	}

	function b(error) {
		assert.ifError(error);

		db.execute('select id, word from words order by word;', c);
	}

	function c(error, rows) {
		assert.ifError(error);

		words = rows;
		db.close(d);
	}

	function d(error)	{
		assert.ifError(error);
	
		res.render('words', {
			title:	'Hello'
			, words:	words
		});
	}

	a();
});

app.get('/word/:id', function(req, res) {
	var db = new sqlite.Database();
	var word;

	function a()	{
		db.open(__dirname + '/helloworld.db', b);
	}

	function b(error) {
		assert.ifError(error);

		db.execute('select id, word from words where id = ?;', [req.params.id], c);
	}

	function c(error, rows) {
		assert.ifError(error);

		word = rows[0];
		db.close(d);
	}

	function d(error)	{
		assert.ifError(error);
	
		res.render('message', {
			title:	word.word
			, message:	word.id
		});
	}

	a();
});


app.listen(port);
console.log('helloworld running at port ' + port);



