import axios from 'axios'
const baseUrl = 'http://localhost:3003/api'

let token = ''

const setToken = (newToken) => {
  token = `Bearer ${newToken}`
}

const login = async (username, password) => {
  const user = await axios.post(`${baseUrl}/users/login`, { username, password })
  return (user)
}

const getAll = async () => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  const request = await axios.get(`${baseUrl}/blogs`, config)
  return (request.data)
}

const createBlog = async (title, author, url, user) => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  const res = await axios.post(`${baseUrl}/blogs`, { title, author, url, user: user.id }, config)
  return (res.data)
}

const addLIke = async (id, likes) => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  const res = await axios.put(`${baseUrl}/blogs/${id}`, { likes }, config)
  return res.data
}

const removeBlog = async (id) => {
  const config = {
    headers: {
      Authorization: token
    }
  }
  await axios.delete(`${baseUrl}/blogs/${id}`, config)
}

export default { getAll , login, setToken, createBlog, addLIke, removeBlog }