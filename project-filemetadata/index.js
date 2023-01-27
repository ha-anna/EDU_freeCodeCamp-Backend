const express = require('express');
const cors = require('cors');
require('dotenv').config()
const multer = require('multer')
const bodyParser = require('body-parser')
const upload = multer({ dest: 'uploads/' })

const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


app.post('/api/fileanalyse', upload.single('upfile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please choose a file to upload first.' })
  }
  const {originalname, mimetype, size} = req.file
  
  return res.status(200).json({name: originalname, type: mimetype, size: size})
})

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
