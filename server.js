const cheerio = require('cheerio');
const express = require('express');
const fs = require('fs');
const app = express();

app.get('/', (req, res) => {
  res.contentType = 'text/html';
  fs.readFile('www/index.html', (err, data) => {
    if (err) {
      throw err;
    }
    const $ = cheerio.load(data);
    $('script.gtag').remove();
    res.send($.html());
  });
});
app.use(express.static('www'));
app.use('/src', express.static('src'));
app.listen(3000)
