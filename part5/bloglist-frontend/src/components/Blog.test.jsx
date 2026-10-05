import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, test, vi } from 'vitest'
import Blog from './Blog'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import App from '../App'
import blogService from '../services/blogs'

vi.mock('../services/blogs', () => ({
  default: {
    addLIke: vi.fn(),
    createBlog: vi.fn(),
    getAll: vi.fn(),
    setToken: vi.fn()
  }
}))

afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

const blog = {
  title: 'Testing React',
  author: 'Marouane',
  url: 'https://example.com',
  likes: 10,
  id: '1'
}

const renderBlog = () =>
  render(
    <MemoryRouter initialEntries={['/blogs/1']}>
      <Routes>
        <Route path='/blogs/:id' element={<Blog blogs={[blog]} setBlogs={vi.fn()} />} />
      </Routes>
    </MemoryRouter>
  )

describe('Blog', () => {
  test('renders title and author but not url and likes by default', () => {
    renderBlog()

    expect(screen.getByRole('heading', { name: blog.title })).toBeVisible()
    expect(screen.getAllByText(`by ${blog.author}`)[0]).toBeVisible()
    expect(screen.queryByText(blog.url)).not.toBeVisible()
    expect(screen.queryByText(`likes ${blog.likes}`)).not.toBeVisible()
  })

  test('shows url and likes after clicking the view button', () => {
    renderBlog()

    fireEvent.click(screen.getByRole('button', { name: 'view' }))

    expect(screen.getByText(blog.url)).toBeVisible()
    expect(screen.getByText(`likes ${blog.likes}`)).toBeVisible()
  })

  test('calls the like handler twice when the like button is clicked twice', async () => {
    blogService.addLIke.mockResolvedValue({ ...blog, likes: 11 })
    renderBlog()
    fireEvent.click(screen.getByRole('button', { name: 'view' }))

    fireEvent.click(screen.getByRole('button', { name: 'like' }))
    fireEvent.click(screen.getByRole('button', { name: 'like' }))

    await waitFor(() => expect(blogService.addLIke).toHaveBeenCalledTimes(2))
  })
})

test('calls the create blog handler with the form values', async () => {
  const createdBlog = { ...blog, title: 'New blog', author: 'New author', url: 'https://new.example.com' }
  const user = { id: 'user-1', username: 'tester', token: 'token' }
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      getItem: vi.fn().mockReturnValue(JSON.stringify(user)),
      removeItem: vi.fn(),
      setItem: vi.fn()
    }
  })
  blogService.getAll.mockResolvedValue([])
  blogService.createBlog.mockResolvedValue(createdBlog)

  render(<App />)
  fireEvent.click(await screen.findByRole('link', { name: 'new blog' }))
  fireEvent.change(screen.getByLabelText('title:'), { target: { value: createdBlog.title } })
  fireEvent.change(screen.getByLabelText('author:'), { target: { value: createdBlog.author } })
  fireEvent.change(screen.getByLabelText('url:'), { target: { value: createdBlog.url } })
  fireEvent.click(screen.getByRole('button', { name: 'create' }))

  await waitFor(() => {
    expect(blogService.createBlog).toHaveBeenCalledWith(
      createdBlog.title,
      createdBlog.author,
      createdBlog.url,
      user
    )
  })
})