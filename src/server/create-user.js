#!/usr/bin/env nodejs

const db = require('./boatdb'),
    readline = require('readline'),
    Writable = require('stream').Writable;
    userdb = process.argv[2],
    username = process.argv[3];

if (!userdb || !username) {
  console.error("Usage: ./create-user.js /path/to/auth.json username");
  process.exit(-1);
}

const mutableStdout = new Writable({
  write: function(chunk, encoding, callback) {
    if (!this.muted)
      process.stdout.write(chunk, encoding);
    callback();
  }
});

mutableStdout.muted = false;

const rl = readline.createInterface({
  input: process.stdin,
  output: mutableStdout,
  terminal: true
});

rl.question('Password: ', function(password) {
  console.log('\nPassword is ' + password);
  rl.close();

  Promise.all([db.readDbTable(userdb, 'auth'), db.createUser(username, password)])
    .then(([udb, u]) => {
      const existing = udb.users.find(eu => eu.username === username);
      if (existing) {
        Object.assign(existing, u);
      } else {
        udb.users.push(u);
      }
      console.log(udb);
      console.log('User:', u);
      return db.writeDb(userdb, udb);
    });

});

mutableStdout.muted = true;

console.log(userdb);
