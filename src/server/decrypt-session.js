#!/usr/bin/env nodejs

const auth = require('./auth'),
  token = process.argv[2];

  if (!token) {
  console.error('Usage: ./decrypt-session.js token');
  process.exit(-1);
}

process.stdout.write(JSON.stringify(auth.decryptAuthToken(token)) + '\n');
