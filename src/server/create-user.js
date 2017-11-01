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

new Promise((res, rej) => {
  rl.question('Password:', res);
}).then(pass1 => {

  mutableStdout.muted = false;
  mutableStdout.write('\n');

  rl.question('Re-type Password: ', function(pass2) {
    mutableStdout.muted = false;
    mutableStdout.write('\n');
    rl.close();

    if (pass1 !== pass2) {
      mutableStdout.write('Passwords did not match. Try again.\n\n');
      return;
    }

    Promise.all([db.readDbTable(userdb, 'auth'), db.createUser(username, pass1)])
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
});

mutableStdout.muted = true;
