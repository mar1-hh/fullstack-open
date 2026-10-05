import { useState } from 'react'
import blog_service from '../services/blogs'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { BlogCard, Author, Actions, OutlineButton } from '../styles'

const compareFn = (a, b) => {
  if (a.likes > b.likes)
    return (-1)
  else if (a.likes < b.likes)
    return (1)
  return (0)
}

const Blog = ({ blog, setBlogs, blogs, user }) => {
  const [likeCounts, setLike] = useState(blog.likes)
  const [dataVisible, setDataVisible] = useState(false)
  const canDelete = Boolean(user && (blog.user?.id ?? blog.user) === user.id)


  const handleLikes = async () => {
    const res = await blog_service.addLIke(blog.id, likeCounts + 1)

    setLike(likeCounts + 1)
    setBlogs(blogs.map(b => b.id === blog.id ? res : b).sort(compareFn))
  }
  const navigate = useNavigate()

  const handleDelete = async () => {
    if (window.confirm('are you sure'))
    {
      await blog_service.removeBlog(blog.id)
      navigate('/')
      setBlogs(blogs.filter(b => b.id !== blog.id))
    }
  }


  const butoonVisible = {
    display: dataVisible ? 'none' : ''
  }
  const showData = {
    display: dataVisible ? '' : 'none'
  }
  return (

    <BlogCard data-testid="blog">
      <div style={butoonVisible}>
        <h2>{blog.title}</h2>
        <Author>by {blog.author}</Author>
        <OutlineButton onClick={() => {setDataVisible(true)}}>view</OutlineButton>
      </div>
      <div style={showData}>
        <h2>{blog.title}</h2>
        <Author>by {blog.author}</Author>
        <p><a href={blog.url} target="_blank" rel="noreferrer">{blog.url}</a></p>
        <Actions>
          <p>likes {likeCounts}</p>
          <OutlineButton onClick={handleLikes}>like</OutlineButton>
        </Actions>
        <OutlineButton onClick={() => {setDataVisible(false)}}>hide</OutlineButton>
      </div>
      {canDelete && <OutlineButton $danger onClick={handleDelete}>delete</OutlineButton>}
    </BlogCard>
  )
}

const BlogPage = ({ blogs, setBlogs, user }) => {
  const { id } = useParams()

  const blog = blogs.find(blog => blog.id === id)

  if (!blog)
    return null

  return (
    <Blog
      key={blog.id}
      blog={blog}
      blogs={blogs}
      setBlogs={setBlogs}
      user={user}
    />
  )
}

export default BlogPage
