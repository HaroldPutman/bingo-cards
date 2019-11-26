var express = require('express')
var app = express()

app.use(express.static('www'));
app.use('/src', express.static('src'));
app.listen(3000)
