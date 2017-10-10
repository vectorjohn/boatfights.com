const express = require('express')
const path = require('path')
const boatdb = require('./boatdb');

const app = express()
const indexHtml = path.join(__dirname, '..', '..',  'build', 'index.html');
const boatRoot = process.env.BOATDB || path.join(__dirname, '..', '..', 'boats');

app.use(express.static(path.join(__dirname, '..', '..',  'build')));
app.use(express.static(boatRoot));
//app.use(express.static(path.join(__dirname)))

boatdb.rescanDb(boatRoot)
	.then((db) => console.log(db));

app.get('/hi', function (req, res) {
  res.send('Hello World!')
})

app.get('/boats.json', function(req, res) {
	boatdb
		.readDbAsJson(boatRoot)
		.then(function(text) {
			res.end(text);
		}, errorHandler(res))
});

app.get('/slfjlsjd/*', function (req, res) {
  res.sendFile(indexHtml)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})

function errorHandler(res) {
	return function(reason) {
		console.error(reason);
		res.end("Something bad happened: " + reason);
	}
}