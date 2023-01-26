require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const shortId = require('shortid')
const validator = require('validator');

// Basic Configuration
const port = process.env.PORT || 3000;
mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const Schema = mongoose.Schema;

const urlSchema = new Schema({
  original_url: { type: String, required: true },
  short_url: String
})

const Url = mongoose.model('Url', urlSchema)

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.post('/api/shorturl', (req, res) => {
  const { url } = req.body

  if (!validator.isURL(url)) {
    res.send({ error: 'invalid url' })
  } else {
    const shortUrl = shortId.generate()

    let emptyFields = []

    if (!url) {
      emptyFields.push('url')
    }
    if (emptyFields.length > 0) {
      return res.status(400).json({ error: 'Please fill in the field', emptyFields })
    }

    try {
      const urlEntry = Url.create({ original_url: url, short_url: shortUrl })
      res.send({ original_url: url, short_url: shortUrl })
    } catch (error) {
      res.status(400).json({ error: error.message })
    }
    emptyFields = []

  }
});

app.get('/api/shorturl/:shorturl', function(req, res) {
  Url.find({ short_url: req.params.shorturl }, function(err, data) {
    if (err) return console.log(err);
    let url = data[0]["original_url"]
    res.redirect(url)
  })
});


app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
