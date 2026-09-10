const dummy = (blogs) => {
  return (1)
}

const totalLikes = (blogs) => {
    let total = 0;
    blogs.forEach(blog => {
        total += blog.likes
    });
    return (total)
}

const favoriteBloga = (blogs) => {
    return (blogs.reduce((fav, cur) => {
        if (cur.likes > fav.likes)
            return (cur)
        return (fav)
    }, blogs[0]))
}

const mostBlogs = (blogs) => {
  const counts = {}

  for (const blog of blogs) {
    counts[blog.author] = (counts[blog.author] || 0) + 1
  }

  const result = Object.entries(counts).reduce((favorite, current) => {
    if (current[1] > favorite[1]) {
      return current
    }

    return favorite
  })

  return {
    author: result[0],
    blogs: result[1]
  }
}

const mostLikes = (blogs) => {
  const counts = {}

  for (const blog of blogs) {
    counts[blog.author] = (counts[blog.author] || 0) + blog.likes
  }

  const result = Object.entries(counts).reduce((favorite, current) => {
    if (current[1] > favorite[1]) {
      return current
    }

    return favorite
  })

  return {
    author: result[0],
    likes: result[1]
  }
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBloga,
  mostBlogs,
  mostLikes
}