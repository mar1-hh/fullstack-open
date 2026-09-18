const Blog = require('../models/blog')
const blogsRouter = require('express').Router()
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogsRouter.get('/', async (request, response) => {

  const blogs = await Blog.find().populate('user', {username: 1, id: 1, name: 1})
  return (response.json(blogs))
})

blogsRouter.delete('/:id', async (req, res) => {
  const id = req.params.id
  const user = req.user
  
  const blog = await Blog.findById(id)
 if (blog.user.toString() !== user._id.toString())
    return (res.status(400).json({error: "the creater and delter not the same"}))
  await Blog.findByIdAndDelete(id)
  res.status(200).end()
})

blogsRouter.put('/:id', async (req, res) => {
  const id = req.params.id
  const blog = await Blog.findById(id)
  blog.likes = req.body.likes
  const newBlog = await blog.save()
  res.status(200).json(newBlog)
})

blogsRouter.post('/', async (request, response) => {
  if (request.body.likes === undefined)
    request.body['likes'] = 0
  if (request.body.title === undefined || request.body.url === undefined)
    return (response.status(400).end())
  
  const user = request.user
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    console.log(user)
    user.blogs = user.blogs.concat(result._id)
    user.save().then(() => {
      response.status(201).json(result)
    })
  })
})

module.exports = blogsRouter