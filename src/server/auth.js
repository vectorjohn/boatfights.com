const crypto = require('crypto');
const SUPER_SECRET = 'asdf123';
const CIPHER_ALG = 'aes-192-cbc';
const SESSION_TIME_SEC = 90 * 24 * 60 * 60;

function createAuthToken(key, data) {
    const session = JSON.stringify({
      k: key,
      d: data,
      tl: SESSION_TIME_SEC,
      ts: new Date()
    });

    const cipher = crypto.createCipher(CIPHER_ALG, SUPER_SECRET);
    return cipher.update(session, 'utf8', 'base64')
      + cipher.final('base64');
}

function decryptAuthToken(token) {
  const decipher = crypto.createDecipher(CIPHER_ALG, SUPER_SECRET);
  const json = decipher.update(token, 'base64', 'utf8')
    + decipher.final('utf8');

  return JSON.parse(json);
}

const PASS_HASH_ITERS = 10000;
const PASS_LEN = 32;
function seriouslyHashPass(password, salt) {
	return new Promise((res, rej) => {
		crypto.pbkdf2(password, salt, PASS_HASH_ITERS, PASS_LEN, 'sha512', (err, key) => {
			if (err) {
				rej(err);
				return;
			}
			res(key);
		})
	});
}

const SALT_LEN = 32;
function createSalt() {
	return new Promise((res, rej) => {
		crypto.randomBytes(SALT_LEN, (err, buf) => {
			if (err) {
				rej(err);
				return;
			}
			res(buf);
		})
	})
}

function isValidPassword(pass, expectedHash, salt) {
	return seriouslyHashPass(pass, Buffer.from(salt, 'base64'))
		.then(hash => hash.toString('base64') === expectedHash);
}

function hashPassword(password) {
  return createSalt()
		.then(salt=> Promise.all([salt, seriouslyHashPass(password, salt)]))
		.then(([salt, hash]) => ({
			hash: hash.toString('base64'),
			salt: salt.toString('base64')
		}));
}

module.exports = {
  hashPassword,
  isValidPassword,
  createAuthToken,
  decryptAuthToken
}
