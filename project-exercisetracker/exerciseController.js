const User = require('./userSchema.js')
const validator = require('validator');

const postExercise = async (req, res) => {
  const { _id } = req.params
  const { description, duration, date } = req.body
  let dateFormat
  if (!date) {
    dateFormat = new Date(Date.now()).toDateString()
  } else {
    dateFormat = new Date(date).toDateString()
  }
  const user = await User.find({ _id: _id })
  const username = user[0]["username"]

  let emptyFields = []

  if (!_id) {
    emptyFields.push('_id')
  }
  if (!description) {
    emptyFields.push('description')
  }
  if (!duration) {
    emptyFields.push('duration')
  }
  if (!username) {
    return res.status(400).json({ error: 'User with such ID does not exist.' })
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in the field', emptyFields })
  }

  try {
    User.findOne({ _id: _id }, (err, data) => {
      if (err) {
        return next(new Error(`Something went wrong`))
      }
      if (data === null) {
        return next(new Error(`User ${_id} not found`))
      }
      data.exercises.push({ date: dateFormat, duration: parseInt(duration), description: description })
      data.save((err, data) => {
        if (err) {
          return next(new Error(`Could not save data`))
        }
        return res.json({ _id: _id, username: username, date: dateFormat, duration: parseInt(duration), description: description })
      })
    })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

const getExerciseLogs = async (req, res) => {
  const { _id } = req.params
  const {from, to, limit} = req.query

  const errorLog = []
  
  if(from && !validator.isDate(from)) {
    errorLog.push("Incorrect date format. Try YYYY-MM-DD instead.")
  } 
  if (to && !validator.isDate(from)) {
    errorLog.push("Incorrect date format. Try YYYY-MM-DD instead.")
  } 
  if (limit && !validator.isNumeric(limit)) {
    errorLog.push("Incorrect limit format. Try a number instead.")
  }
  
  if (errorLog.length > 0) {
    res.status(400).json({error: errorLog})
  }

  let dateFormatFrom = new Date(from).toDateString()
  let dateFormatTo = new Date(to).toDateString()
  const query = await User.find({ _id: _id })

  let filtered = null;
    if(from){
      if(to){
        filtered = query[0]["exercises"].filter(ex => new Date(ex.date).getTime() >= new Date(dateFormatFrom).getTime() && new Date(ex.date).getTime() <= new Date(dateFormatTo).getTime());
      }else{
        filtered = query[0]["exercises"].filter(ex => new Date(ex.date).getTime() >= new Date(dateFormatFrom).getTime());
      }
    }
    if(limit){
      filtered = query[0]["exercises"].slice(0, limit);
  }
  
  const exerciseData = await User.find({ _id: _id })
  const exercises = exerciseData[0]["exercises"]
  const username = exerciseData[0]["username"]
  const count = exercises.length

  if(Object.keys(req.query).length === 0) {
    res.send({ _id: _id, username: username, count: count, log: exercises })
  } else {
    res.send({ _id: _id, username: username, count: count, log: filtered})
  }
}

module.exports = { postExercise, getExerciseLogs }