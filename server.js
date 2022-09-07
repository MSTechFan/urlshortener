require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const uniqid = require('uniqid')

// Basic Configuration
const port = process.env.PORT || 3000;
const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
const urlDb = [
  {
    "original_url": "https://www.freecodecamp.org/learn",
    "shorturl": 0
  }
]

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.use(express.urlencoded({
  extended: true
}))

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.get('/api/shorturl/:id', (req, res) => {
  const urlFound = urlDb.findIndex(element => element.shorturl == req.params.id)
  if(urlFound === -1){
    res.json({"error": "This ID is not created yet", "id": urlFound})
  } else {
    res.redirect(urlDb[urlFound]["original_url"])
  }
})

app.post('/api/shorturl', (req, res) => {
  if(urlRegex.test(req.body.url)){
    const uniqueId = uniqid()
    urlDb.push({"original_url": req.body.url, "shorturl": uniqueId})
    console.log(urlDb)
    res.json({"original_url": req.body.url, "shorturl": uniqueId})
  } else {
    res.json({error: 'invalid url'})
  }
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
