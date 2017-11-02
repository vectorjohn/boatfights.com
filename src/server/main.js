const express = require('express')
const path = require('path')
const os = require('os')
const fs = require('fs')
const multer = require('multer');
const bodyParser = require('body-parser');
const boatdb = require('./boatdb');
const auth = require('./auth');

const app = express()
const tmpDir = path.join(os.tmpdir(), 'boat-tmp-' + Date.now());
const indexHtml = path.join(__dirname, '..', '..',  'build', 'index.html');
const boatRoot = process.env.BOATDB || path.join(__dirname, '..', '..', 'boats');

const userdb = boatdb.readDbTable(boatRoot, 'auth');

app.use(express.static(path.join(__dirname, '..', '..',  'build')));
app.use(express.static(boatRoot));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(express.static(path.join(__dirname)))

fs.mkdirSync(tmpDir);

const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, tmpDir)
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})

const upload = multer({
	storage,
	limits: {
		fileSize: 20 * 1024 * 1024
	}
});

/*
boatdb.rescanDb(boatRoot)
	.then((db) => console.log(db));
*/

app.get('/hi', function (req, res) {
  res.send('Hello World!')
})

app.get('/boats.json', function(req, res) {
	boatdb
		.readDbTableAsJson(boatRoot, 'boats')
		.then(function(text) {
			res.end(text);
		}, (err) => {throw err})
});

app.post('/rescan', function(req, res) {
	boatdb.rescanDb(boatRoot)
		.then((db) => res.json({
			_meta: {
				msg: "Boat database updated"
			}
		}));
});

app.post('/boats', upload.single('boat'), function(req, res) {
	const path = req.file ? req.file.path : req.body.url;
	if (!path) {
		return res.status(400)
			.json({
				error: 'must supply a file (boat parameter) or a URL (url parameter)'
			});
	}

	const filename = req.file ? req.file.filename : 'boat';

	boatdb.addBoat(boatRoot, path, boatdb.createBoat(
		null,
		filename,
		req.body.title || filename,
		req.body.description,
		req.file.path ? null : req.body.url
	)).then((boat) => {
		res.json(boat);
	})
});

app.post('/login', function(req, res) {
	userdb.then(db => {
		const {username, password} = req.body;
		if (!username || !password) {
			res.json({error: 'username and password are required'});
			return;
		}
		const user = db.users.find(u => u.username === username) || {salt: '', password: ''};
		auth.isValidPassword(password, user.password, user.salt)
			.then(valid => {
				if (!valid) {
					res.json({error: "Invalid username or password"});
					return;
				}
				const pubUser = Object.assign({}, user);
				delete pubUser.password;
				delete pubUser.salt;
				res.json({msg: 'You win!', pubUser});
			})
	})
})

app.get('/slfjlsjd/*', function (req, res) {
  res.sendFile(indexHtml)
})

app.use(xhrErrorHandler);
//app.use(defaultErrorHandler);

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
});

function xhrErrorHandler(err, req, res, next) {
	if (req.xhr || 'always') {
		res.status(500)
			.json({
				error: err
			})
	} else {
		next(err);
	}
}
function defaultErrorHandler(err, req, res, next) {
	res
		.status(500)
		.render('error', {error: err});
}
