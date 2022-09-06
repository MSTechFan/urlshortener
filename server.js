require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const urlShort = require('node-url-shortener')

// Basic Configuration
const port = process.env.PORT || 3000;
const urlRegex = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
const urlDb = [
  {
    "original_url": "https://www.freecodecamp.org/learn",
    "shorturl": 0
  },
  {
    "original_url": "https://www.freecodecamp.org/learn",
    "shorturl": 1
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
  res.redirect('https://www.freecodecamp.org/learn')
})
app.post('/api/shorturl', (req, res) => {
  if(urlRegex.test(req.body.url)){
    urlShort.short(req.body.url, (err, url) => {
      res.json({"original_url": req.body.url, "shorturl": url})
      urlDb.push({"original_url": req.body.url, "shorturl": url})
    })
    
  } else {
    res.json({error: 'invalid url'})
  }
  
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
