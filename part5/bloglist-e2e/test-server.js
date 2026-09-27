const path = require('node:path')
const { createRequire } = require('node:module')
const { MongoMemoryServer } = require('mongodb-memory-server')

// Load the actual Part 4 backend and its own dependencies.
const backendRequire = createRequire(path.resolve(__dirname, '../../part4/bloglist-backend/package.json'))

async function start() {
  const mongo = await MongoMemoryServer.create()
  process.env.NODE_ENV = 'test'
  process.env.TEST_MONGODB_URI = mongo.getUri('bloglist-e2e')
  process.env.SECRET = 'bloglist-e2e-only-secret'
  const app = backendRequire('./app')
  const mongoose = backendRequire('mongoose')
  const Blog = backendRequire('./models/blog')
  const User = backendRequire('./models/user')
  await mongoose.connection.asPromise()

  // These routes exist only in this test process, never in the normal backend.
  app.post('/api/testing/reset', async (_request, response) => {
    await Blog.deleteMany({})
    await User.deleteMany({})
    response.status(204).end()
  })
  app.get('/api/testing/health', (_request, response) => response.sendStatus(200))
  const server = app.listen(3003)

  const shutdown = async () => {
    server.close()
    await mongoose.disconnect()
    await mongo.stop()
    process.exit(0)
  }
  process.once('SIGTERM', shutdown)
  process.once('SIGINT', shutdown)
}

start().catch(error => {
  console.error(error)
  process.exit(1)
})
