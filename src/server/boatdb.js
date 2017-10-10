const path = require('path'),
	fs = require('fs'),
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

function readDb(root) {

}

function getDbIndexPath(root) {
	return path.join(root, 'boats.json');
}

function rescanDb(root) {
	const newDb = createEmptyDb();
	const startTime = new Date();

	return readDbAsJson(root)
		.then(JSON.parse)
		.then(function(db) {
			return new Promise(function(res, rej) {
				readdir(root, function(err, files) {
					if (err) {
						rej(err);
						return;
					}
					res([db, files]);
				})
			})
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
	rescanDb
}