const path = require('path'),
	fs = require('fs'),
	crypto = require('crypto'),
	readdir = require('recursive-readdir');

const fileTypeRE = /\.(jpg|jpeg|png|gif)$/;

function createEmptyDb() {
	return {
		updated: null,
		genTime: null,
		images: []
	};
}

function boatsByPath(db) {
	const lookup = new Map();
	db.images.forEach((boat) => {
		lookup.set(boat.path, boat);
	});
	return lookup;
}

function writeDb(root, db) {
	return new Promise(function(res, rej) {
		fs.writeFile(getDbIndexPath(root), JSON.stringify(db), 'utf8', function(err) {
			if (err) {
				rej(err);
				return;
			}
			res(null);
		})
	});
}

function addBoat(root, filePath, boatRecord) {
	return Promise.all([hashAndLoadFile(filePath), readDb(root)])
		.then(([{hash, data}, db]) => {
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
			fs.writeFile(finalPath, data);
			//fs.rename(filePath, finalPath)

			const newRecord = Object.assign({}, boatRecord, {path: dbPath});
			db.images.push(newRecord);
			rescanDb(root);
			return newRecord;
		})
}

function hashAndLoadFile(path) {
	const hash = crypto.createHash('sha1');
	return new Promise((res, rej) => {
		fs.readFile(path, (err, data) => {
			if (err) {
				rej(err);
				return;
			}
			hash.update(data);
			res({hash: hash.digest('hex'), data});
		})
	});
}

function readDb(root) {
	return readDbAsJson(root)
		.then(JSON.parse);
}

function getDbIndexPath(root) {
	return path.join(root, 'boats.json');
}

function rescanDb(root) {
	const newDb = createEmptyDb();
	const startTime = new Date();

	return readDb(root)
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
			return writeDb(root, newDb)
				.then(() => newDb);
		});
}

function readDbAsJson(root) {
	return new Promise(function(res, rej) {
		fs.readFile(getDbIndexPath(root), 'utf8', function(err, data) {
			if (err) {
				if (err.code === 'ENOENT') {
					res(JSON.stringify(createEmptyDb()));
					return;
				}
				rej(err);
				return;
			}
			res(data);
		});
	});
}

function createBoat(path, name, title, description = null) {
	return {path, name, title, description, timestamp: new Date()};
}

module.exports = {
	readDbAsJson,
	rescanDb,
	addBoat,
	writeDb,
	createBoat
}