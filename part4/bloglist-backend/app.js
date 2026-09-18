const config = require('./utils/config')
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const blogMiddleware = require('./middleware/blog.middleware')
const express = require('express')
const mongoose = require('mongoose')

const app = express()

const mongoUrl = config.MONGODB_URI
mongoose.connect(mongoUrl, { family: 4 })

app.use(express.json())

app.use('/api/blogs', blogMiddleware.tokenExtractor, blogMiddleware.userExtractor, blogsRouter)
app.use('/api/users', usersRouter)

const errorHandler = (error, request, response, next) => {
    if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
    return response.status(400).json({ error: 'expected `username` to be unique' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({
      error: error.message
    })
  }

  next(error)
}

app.use(errorHandler)
module.exports = app