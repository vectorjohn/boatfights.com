#!/usr/bin/env nodejs

const auth = require('./auth'),
  userid = process.argv[2],
  dataJson = process.argv[3];

let data = null;

if (!userid) {
  console.error('Usage: ./create-session.js userId dataJson');
  process.exit(-1);
}

if (dataJson) {
  try {
      data = JSON.parse(dataJson);
  }
  catch (err) {
    console.error(err);
    process.exit(-1);
  }
}

process.stdout.write(auth.createAuthToken(userid, data) + '\n');
