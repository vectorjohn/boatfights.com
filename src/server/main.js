const express = require('express')
const path = require('path')
const app = express()

const indexHtml = path.join(__dirname, '..', '..',  'build', 'index.html');

app.use(express.static(path.join(__dirname, '..', '..',  'build')));

app.get('/hi', function (req, res) {
  res.send('Hello World!')
})

app.get('/*', function (req, res) {
  res.sendFile(indexHtml)
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})