const path = require('path'),
	fs = require('fs'),
	concatStream = require('concat-stream'),
	crypto = require('crypto'),
	readdir = require('recursive-readdir'),
	http = require('http'),
	https = require('https');

const fileTypeRE = /\.(jpg|jpeg|png|gif)$/;

const dbTables = {
	boats: {
		empty: {
			updated: null,
			genTime: null,
			images: []
		}
	},
	auth: {
		empty: {
			updated: null,
			users: []
		}
	},
	pending: {
		empty: {
			updated: null,
			images: []
		}
	}
}

function createEmptyDbTable(table) {
	return dbTables[table].empty;
}

function boatsByPath(db) {
	const lookup = new Map();
	db.images.forEach((boat) => {
		lookup.set(boat.path, boat);
	});
	return lookup;
}

function writeDb(root, db) {
	db.updated = new Date();
	return new Promise(function(res, rej) {
		fs.writeFile(getDbIndexPath(root), JSON.stringify(db), 'utf8', function(err) {
			if (err) {
				rej(err);
				return;
			}
			console.log('creating new boat record: ', newRecord);
			res(null);
		})
	});
}

function addBoat(root, filePath, boatRecord) {
	return Promise.all([hashAndLoadFile(filePath), readDbTable(root, 'boats')])
		.then(([{hash, data}, db]) => {
			if (db.images.length > 1000) {
				//TODO: lazy hack, because this file system based DB and lack of security might provoke too many boats.
				throw new Error('Too many boats');
			}
			const newPath = [hash.substr(0, 2), hash.substr(2, 2), hash.substr(4)];

			newPath.reduce((acc, cur) => {
				if (acc.length === 0) return [path.join(root, cur)];
				return acc.concat([path.join(acc[acc.length-1], cur)]);
			}, []).forEach((path) => {
				try {
					fs.mkdirSync(path);
				} catch (ex) {
					if (ex.code !== 'EEXIST')
						throw ex;
				}
			});

			const dbPath = path.join.apply(path, newPath.concat(path.basename(filePath)));
			const finalPath = path.join.apply(path, [root].concat(dbPath));

			const newRecord = Object.assign({}, boatRecord, {path: dbPath});
			const existing = db.images.find(i => i.path === newRecord.path);
			console.log('creating new boat record: ', newRecord);
			if (existing) {
				Object.assign(existing, newRecord)
			}
			else {
				db.images.push(newRecord);
			}

			fs.writeFile(finalPath, data);
			//fs.rename(filePath, finalPath)

			writeDbTable(root, 'boats', db);
			return newRecord;
		})
}

function deleteBoat(root, imgPath) {
	return readDbTable(root, 'boats')
		.then(db => {
			const origImages = db.images;
			db.images = origImages.filter(i => i.path !== imgPath);
			if (origImages.length === db.images.length) {
				return 0;
			}

			//don't wait for result. If it fails, it's out of the DB at least.
			fs.unlink(path.join(root, imgPath), err => {
				if (err) {
					console.error("Somehow delete failed: ", err);
				}
			});

			return writeDbTable(root, 'boats', db)
				.then(() => origImages.length - db.images.length);
		})
}

function hashAndLoadFile(path) {
	console.log('path', path);
	const hash = crypto.createHash('sha1');
	return new Promise((res, rej) => {
		if (path.substr(0, 'http://'.length) === 'http://') {
			http.get(path, resp => {
				console.log('what type? ', resp.headers['content-type']);
				res(resp);
			}).on('error', rej);
		} else if (path.substr(0, 'https://'.length) === 'https://') {
			https.get(path, resp => {
				console.log('what type (https)? ', resp.headers['content-type']);
				res(resp);
			}).on('error', rej);
		}
		else {
			//TODO: surely this can error. Not sure how it does it, probably throw?
			res(fs.createReadStream(path));
		}
	}).then(fileStream => new Promise((res, rej) => {

		fileStream.on('error', rej);

		fileStream.pipe(concatStream(buf => {
			hash.update(buf);
			res({hash: hash.digest('hex'), data: buf});
		}));
	}));
}

function readDbTable(root, table) {
		return readDbTableAsJson(root, table)
			.then(JSON.parse);
}

function writeDbTable(root, table, db) {
	db.updated = new Date();
	return new Promise((res, rej) => {
		fs.writeFile(getDbTablePath(root, table), JSON.stringify(db), 'utf8', function(err) {
			if (err) {
				rej(err);
				return;
			}
			res();
		});
	})
}

function readDb(root) {
	return readDbTable(root, 'boats');
}

function writeDb(root, db) {
	return writeDbTable(root, 'boats', db);
}

//if root is a path to a json file, use that path
//otherwise, add table + .json
function getDbTablePath(root, table) {
	const base = path.basename(root);
	if (base.substr(-('.json'.length)) === '.json')
		return root;
	return path.join(root, table + '.json');
}
function getDbIndexPath(root) {
	return getDbTablePath(root, 'boats');
}

function getDbAuthPath(root) {
	return getDbTablePath(root, 'auth');
}

function getDbPendingPath(root) {
	return getDbTablePath(root, 'pending');
}


function rescanDb(root) {
	const newDb = createEmptyDbTable('boats');
	const startTime = new Date();

	return readDbTable(root, 'boats')
		.then(function(db) {
			return new Promise(function(res, rej) {
				readdir(root, function(err, files) {
					if (err) {
						rej(err);
						return;
					}
					res([db, files]);
				})
			});
		})
		.then(function([db, files]) {
			const exBBP = boatsByPath(db);
			files
				.filter((f) => fileTypeRE.test(f))
				.map((f) => [f, path.parse(f)])
				.map(([f,p]) => createBoat(path.relative(root, f), p.base, p.name))
				.forEach((boat) => newDb.images.push(Object.assign(boat, exBBP.get(boat.path))));

			newDb.updated = new Date();
			newDb.genTime = (+newDb.updated) - startTime;
			return writeDbTable(root, 'boats', newDb)
				.then(() => newDb);
		});
}

function readDbTableAsJson(root, table) {
	return new Promise(function(res, rej) {
		fs.readFile(getDbTablePath(root, table), 'utf8', function(err, data) {
			if (err) {
				if (err.code === 'ENOENT') {
					res(JSON.stringify(createEmptyDbTable(table)));
					return;
				}
				rej(err);
				return;
			}
			res(data);
		});
	});
}

function createBoat(path, name, title, description = null, source = null) {
	return {path, name, title, description, source, timestamp: new Date()};
}

const PERM_POST = 'PERM_POST';
const PERM_ADMIN = 'PERM_ADMIN';

function createUser(username, hash, salt, perms = [PERM_POST]) {
	return {
		username,
		password: hash,
		salt: salt,
		perms,
		timestamp: new Date()
	}
}


module.exports = {
	createUser,
	readDbTableAsJson,
	rescanDb,
	addBoat,
	deleteBoat,
	readDb,
	readDbTable,
	writeDb,
	writeDbTable,
	createBoat
}
