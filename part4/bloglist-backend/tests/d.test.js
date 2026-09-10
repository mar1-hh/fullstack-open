const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})

describe('total likes', () => {
    const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 4,
      __v: 0
    }
  ]
  test('when list has only one blog, equals the likes of that', () => {
      const result = listHelper.totalLikes(listWithOneBlog)
      assert.strictEqual(result, 4)
  })
})

describe('favorite blog', () => {
    const listWithManyBlogs = [
    {
        _id: '1',
        title: 'Blog A',
        author: 'Author A',
        url: 'https://example.com/a',
        likes: 5
    },
    {
        _id: '2',
        title: 'Blog B',
        author: 'Author B',
        url: 'https://example.com/b',
        likes: 12
    },
    {
        _id: '3',
        title: 'Blog C',
        author: 'Author C',
        url: 'https://example.com/c',
        likes: 8
    }
    ]
    test('returns the blog with the most likes', () => {
        const res = listHelper.favoriteBloga(listWithManyBlogs)
        assert.strictEqual(listWithManyBlogs[1], res)
    })
})

describe('most blogs', () => {
    const listWithManyBlogs = [
    {
        _id: '1',
        title: 'Blog A',
        author: 'Author A',
        url: 'https://example.com/a',
        likes: 5
    },
    {
        _id: '2',
        title: 'Blog B',
        author: 'Author A',
        url: 'https://example.com/b',
        likes: 12
    },
    {
        _id: '3',
        title: 'Blog C',
        author: 'Author C',
        url: 'https://example.com/c',
        likes: 8
    }
    ]
    test('returns the author with the most blog', () => {
        const res = listHelper.mostBlogs(listWithManyBlogs)
        assert.deepStrictEqual({author: "Author A", blogs: 2}, res)
    })
})

describe('most likes', () => {
    const listWithManyBlogs = [
    {
        _id: '1',
        title: 'Blog A',
        author: 'Author A',
        url: 'https://example.com/a',
        likes: 5
    },
    {
        _id: '2',
        title: 'Blog B',
        author: 'Author A',
        url: 'https://example.com/b',
        likes: 1
    },
    {
        _id: '3',
        title: 'Blog C',
        author: 'Author C',
        url: 'https://example.com/c',
        likes: 8
    }
    ]
    test('returns the author with the most blog', () => {
        const res = listHelper.mostLikes(listWithManyBlogs)
        assert.deepStrictEqual({author: "Author C", likes: 8}, res)
    })
})