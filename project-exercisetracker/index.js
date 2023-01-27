const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
require('dotenv').config()
const {getUsers, postUser} = require('./usersController.js')
const {postExercise, getExerciseLogs} = require('./exerciseController.js')

app.use(cors())

mongoose.set('strictQuery', false);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(express.static('public'))

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get('/api/users', getUsers)

app.post('/api/users', postUser)

app.post('/api/users/:_id/exercises', postExercise)

app.get('/api/users/:_id/logs', getExerciseLogs)


const listener = app.listen(process.env.PORT || 3001, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
