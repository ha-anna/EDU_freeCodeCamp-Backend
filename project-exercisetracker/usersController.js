const User = require('./userSchema.js')
const uniqid = require('uniqid')

const getUsers = async (req, res) => {
  const users = await User.find({})

  const usersArr = users.map((user) => {
    return { _id: user._id, username: user.username }
  });

  res.send(usersArr);
}

const postUser = async (req, res) => {
  const { username } = req.body
  const _id = uniqid()

  let emptyFields = []

  if (!username) {
    emptyFields.push('username')
  }
  if (emptyFields.length > 0) {
    return res.status(400).json({ error: 'Please fill in the field', emptyFields })
  }

  try {
    const userEntry = User.create({ username: username, _id: _id })
    res.send({ username: username, _id: _id })
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}


module.exports = { getUsers, postUser }