import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import { GlobalStyle, Shell, Navigation, Brand, NavigationLink, LogoutButton, FormCard, Form, Field, Input, Button, Notice, Card, BlogList } from './styles'

import { BrowserRouter as Router, Routes, Route, Link, useNavigate }
  from 'react-router-dom'


const Notif = ({ notif }) => notif && (
  <Notice role='status'><span aria-hidden='true'>✓</span>{notif}</Notice>
)

const NotifError = ({ errorNotif }) => errorNotif && (
  <Notice $error role='alert'><span aria-hidden='true'>!</span>{errorNotif}</Notice>
)

const AddBlog = (props) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const navigate = useNavigate()
  const handleCreate = async (event) => {
    event.preventDefault()
    try
    {
      const blog = await blogService.createBlog(title, author, url, props.user)
      props.setBlogs(props.blogs.concat(blog))
      props.setNotif(`a new blog ${title} by ${author} added`)
      setTimeout(() => {
        props.setNotif('')
      }, 5000)
      setTitle('')
      setAuthor('')
      setUrl('')
      navigate('/')
    } catch (err) {
      console.error('Failed to create blog', err)
    }
  }
  return (
    <FormCard>
      <h2>create new</h2>

      <Form onSubmit={handleCreate}>
        <Field>
          title: <Input value={title} onChange={(event) => {
            setTitle(event.target.value)
          }} />
        </Field>
        <Field>
          author: <Input value={author} onChange={(event) => {
            setAuthor(event.target.value)
          }} />
        </Field>
        <Field>
          url: <Input value={url} onChange={(event) => {
            setUrl(event.target.value)
          }} />
        </Field>
        <Button type='submit'>create</Button>
      </Form>
    </FormCard>

  )
}

const Logout = (props) => {
  const navigate = useNavigate()
  return (
    <div>
      <LogoutButton onClick={() => {
        window.localStorage.removeItem('loggedUser')
        props.setUser('')
        navigate('/login')
      }}>logout</LogoutButton>
    </div>
  )
}

const Login = (props) => {
  const [userName, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()
  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const returned_user = await blogService.login(userName, password)
      props.setUser(returned_user.data)
      blogService.setToken(returned_user.data.token)
      navigate('/')
      window.localStorage.setItem('loggedUser', JSON.stringify(returned_user.data))
      setUsername(' ')
      setPassword(' ')
    }
    catch {
      props.setErrorNotif('wrong username or password')
      setTimeout(() => {
        props.setErrorNotif('')
      }, 5000)
    }
  }
  return (
    <FormCard>
      <h2>Login</h2>
      <Form onSubmit={handleLogin}>
        <Field>
          user name
          <Input autoComplete='username' value={userName} onChange={(event) => {
            setUsername(event.target.value)
          }}/>
        </Field>
        <Field>
          password
          <Input type='password' autoComplete='current-password' value={password} onChange={(event) => {
            setPassword(event.target.value)
          }}/>
        </Field>
        <Button type='submit'>login</Button>
      </Form>
    </FormCard>
  )
}

const Blogs = ({ blogs }) => (
  <BlogList>
    {blogs.map(blog => (
      <li key={blog.id}>
        <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
      </li>
    ))}
  </BlogList>
)

const compareFn = (a, b) => {
  if (a.likes > b.likes)
    return (-1)
  else if (a.likes < b.likes)
    return (1)
  return (0)
}

const Home = (props) => {
  if (!props.blogs)
    return (null)
  return (
    <Card>
      <h2>blogs</h2>
      {props.user && <Blogs blogs={props.blogs} setBlogs={props.setBlogs} user={props.user}/>}
    </Card>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [user, setUser] = useState('')
  const [notif, setNotif] = useState('')
  const [errorNotif, setErrorNotif] = useState('')

  const blogForm = () => {

    return (
      <div>
        <AddBlog setBlogs={setBlogs} blogs={blogs} setNotif={setNotif} user={user}/>
      </div>
    )
  }

  useEffect(() => {
    const loggedUser = window.localStorage.getItem('loggedUser')
    if (loggedUser)
    {
      const user = JSON.parse(loggedUser)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  useEffect(() => {
    const fetchBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs.sort(compareFn))
    }
    if (user)
      fetchBlogs()
  }, [user])

  return (
    <Router>
      <GlobalStyle />
      <Shell>
        <Navigation aria-label='Main navigation'>
          <Brand>Blog App</Brand>
          <NavigationLink to='/' end>home</NavigationLink>
          {!user && <NavigationLink to='/login'>login</NavigationLink>}
          {user && <NavigationLink to='/create'>new blog</NavigationLink>}
          {user && <Logout user={user} setUser={setUser} />}
        </Navigation>
        <main>
          <Notif notif={notif}/>
          <NotifError errorNotif={errorNotif}/>
          <Routes>
            <Route path="/blogs/:id" element={
              <Blog setBlogs={setBlogs} blogs={blogs} user={user}/>
            }
            />
            <Route path="/" element={
              <Home blogs={blogs} setBlogs={setBlogs} user={user} />
            }/>
            <Route path="/login" element={
              <Login setUser={setUser} setErrorNotif={setErrorNotif}/>
            }
            />
            <Route path="/create" element={
              blogForm()
            }
            />
          </Routes>
        </main>
      </Shell>
    </Router>
  )
}

export default App
