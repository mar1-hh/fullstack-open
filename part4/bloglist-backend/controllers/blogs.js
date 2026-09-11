const Blog = require('../models/blog')
const blogsRouter = require('express').Router()

blogsRouter.get('/', async (request, response) => {

  const blogs = await Blog.find()
  return (response.json(blogs))
})

blogsRouter.delete('/:id', async (req, res) => {
  const id = req.params.id

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

blogsRouter.post('/', (request, response) => {
  if (request.body.likes === undefined)
    request.body['likes'] = 0
  if (request.body.title === undefined || request.body.url === undefined)
    return (response.status(400).end())
  const blog = new Blog(request.body)

  blog.save().then((result) => {
    response.status(201).json(result)
  })
})

module.exports = blogsRouter