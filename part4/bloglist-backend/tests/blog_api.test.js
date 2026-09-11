const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const assert = require('node:assert')


const api = supertest(app)

const initialBlogs = [
    {
        title: 'Blog A',
        author: 'Author A',
        url: 'https://example.com/a',
        likes: 5
    },
    {
        title: 'Blog B',
        author: 'Author A',
        url: 'https://example.com/b',
        likes: 1
    },
    {
        title: 'Blog C',
        author: 'Author C',
        url: 'https://example.com/c',
        likes: 8
    }
]

beforeEach(async () => {
    await Blog.deleteMany() 
    await Blog.insertMany(initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const blogs = await api.get('/api/blogs')
    assert.strictEqual(blogs.body.length, initialBlogs.length)
})

test('is named by id', async () => {
    const blogs = await api.get('/api/blogs')
    assert(blogs.body.every(blog => blog.id))
})

test('add new blog', async () => {
    const newBlog = {
        title: 'Blog D',
        author: 'Author D',
        url: 'https://example.com/d',
        likes: 8
    }
    await api.post('/api/blogs').send(newBlog).expect(201)
        .expect('Content-Type', /application\/json/)
    const blogs = await api.get('/api/blogs')
    assert.strictEqual(blogs.body.length, initialBlogs.length + 1)
    assert(blogs.body.some(blog => blog.author === 'Author D'))
})

test('blog without likes', async () => {
    const newBlog = {
        title: 'Blog D',
        author: 'Author D',
        url: 'https://example.com/d',
    }
    const blog = await api.post('/api/blogs').send(newBlog).expect(201)
        .expect('Content-Type', /application\/json/)
    assert.strictEqual(blog.body.likes, 0)
})

test('blog without title or url', async () => {
    const newBlog = {
        title: 'Blog D',
        author: 'Author D',
    }
    const blog = await api.post('/api/blogs').send(newBlog)
    assert.strictEqual(blog.status, 400)
})

after(async () => {
  await mongoose.connection.close()
})