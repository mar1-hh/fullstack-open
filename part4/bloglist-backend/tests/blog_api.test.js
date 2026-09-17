const { test, after, beforeEach } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')

const User = require('../models/user')
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

const initialUsers = [
    {
        username: "7mida",
        name: "sii",
        password: "1234"
    }
]

beforeEach(async () => {
    await Blog.deleteMany() 
    await Blog.insertMany(initialBlogs)
    await User.deleteMany()
    await User.insertMany(initialUsers)
})

// test('useranme must be unique', async () => {
//     await 
// })

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
    console.log(blogs.body)
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

test('delete a blog', async () => {
    const blogs = await api.get('/api/blogs')
    const res = await api.delete(`/api/blogs/${blogs.body[0].id}`)
    const afterDel = await api.get('/api/blogs')

    assert.strictEqual(res.status, 200)
    assert.strictEqual(afterDel.body.length, initialBlogs.length - 1)
})

test('update a blog', async () => {
    const blogs = await api.get('/api/blogs')
    const res = await api.put(`/api/blogs/${blogs.body[0].id}`).send({likes: 1337})
    const afterUpdate = await api.get('/api/blogs')

    assert.strictEqual(res.status, 200)
    assert.strictEqual(afterUpdate.body[0].likes, 1337)
})

after(async () => {
  await mongoose.connection.close()
})