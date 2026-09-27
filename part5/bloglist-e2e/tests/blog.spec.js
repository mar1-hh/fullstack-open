const { test, expect, beforeEach, describe } = require('@playwright/test')
const { user, api, login, blogByTitle, createBlog, likeBlog } = require('./helpers')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await expect(await request.post(`${api}/testing/reset`)).toBeOK()
    await expect(await request.post(`${api}/users/register`, { data: user })).toBeOK()
    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Login', exact: true })).toBeVisible()
    await expect(page.getByLabel('user name')).toBeVisible()
    await expect(page.getByLabel('password')).toBeVisible()
    await expect(page.getByRole('button', { name: 'login', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'create new blog' })).toBeHidden()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await login(page)
      await expect(page.getByText(`${user.username} logged in`)).toBeVisible()
      await expect(page.getByRole('button', { name: 'login', exact: true })).toBeHidden()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await login(page, { ...user, password: 'incorrect' })
      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page.getByRole('button', { name: 'login', exact: true })).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeHidden()
      await expect(page.getByRole('button', { name: 'create new blog' })).toBeHidden()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await login(page)
      await expect(page.getByText(`${user.username} logged in`)).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'A new blog')
      await page.reload()
      await expect(blogByTitle(page, 'A new blog')).toBeVisible()
    })

    describe('When a blog exists', () => {
      beforeEach(async ({ page }) => {
        await createBlog(page, 'Testing blogs')
      })

      test('a blog can be liked', async ({ page }) => {
        await likeBlog(blogByTitle(page, 'Testing blogs'), 1)
        await page.reload()
        const blog = blogByTitle(page, 'Testing blogs')
        await blog.getByRole('button', { name: 'view' }).click()
        await expect(blog.getByText('likes 1', { exact: true })).toBeVisible()
      })

      test('the creator can delete a blog', async ({ page }) => {
        page.once('dialog', async dialog => {
          expect(dialog.type()).toBe('confirm')
          await dialog.accept()
        })
        await blogByTitle(page, 'Testing blogs').getByRole('button', { name: 'delete' }).click()
        await expect(page.getByTestId('blog')).toHaveCount(0)
        await page.reload()
        await expect(page.getByText(`${user.username} logged in`)).toBeVisible()
        await expect(page.getByTestId('blog')).toHaveCount(0)
      })

      test('only the creator sees the delete button', async ({ page, request }) => {
        // Reload also covers the populated user returned by GET /blogs.
        await page.reload()
        const blog = blogByTitle(page, 'Testing blogs')
        await expect(blog.getByRole('button', { name: 'delete' })).toBeVisible()
        const other = { username: 'otheruser', name: 'Other User', password: 'othersecret' }
        await expect(await request.post(`${api}/users/register`, { data: other })).toBeOK()
        await page.getByRole('button', { name: 'logout' }).click()
        await login(page, other)
        await expect(page.getByText(`${other.username} logged in`)).toBeVisible()
        await page.reload()
        await expect(blog).toBeVisible()
        await expect(blog.getByRole('button', { name: 'delete' })).toHaveCount(0)
        await blog.getByRole('button', { name: 'view' }).click()
        await expect(blog.getByText('likes 0', { exact: true })).toBeVisible()
        await expect(blog.getByRole('button', { name: 'delete' })).toHaveCount(0)
      })
    })

    test('blogs are ordered by likes, most liked first', async ({ page }) => {
      const first = await createBlog(page, 'First blog')
      const second = await createBlog(page, 'Second blog')
      const third = await createBlog(page, 'Third blog')
      await likeBlog(first, 1)
      await likeBlog(second, 3)
      await likeBlog(third, 2)
      const blogs = page.getByTestId('blog')
      await expect(blogs).toHaveCount(3)
      await expect(blogs).toContainText(['Second blog', 'Third blog', 'First blog'])
      await page.reload()
      await expect(blogs).toContainText(['Second blog', 'Third blog', 'First blog'])
    })
  })
})
