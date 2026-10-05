const { test, expect, beforeEach, describe } = require('@playwright/test')
const { user, api, login, blogByTitle, createBlog, likeBlog } = require('./helpers')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await expect(await request.post(`${api}/testing/reset`)).toBeOK()
    await expect(await request.post(`${api}/users/register`, { data: user })).toBeOK()
    await page.goto('/')
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await login(page)
      await expect(page).toHaveURL('/')
      await expect(page.getByRole('button', { name: 'logout', exact: true })).toBeVisible()
      await expect(page.getByRole('button', { name: 'login', exact: true })).toBeHidden()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await login(page, { ...user, password: 'incorrect' })
      await expect(page.getByText('wrong username or password')).toBeVisible()
      await expect(page).toHaveURL('/login')
      await expect(page.getByRole('button', { name: 'login', exact: true })).toBeVisible()
      await expect(page.getByRole('button', { name: 'logout' })).toBeHidden()
      await expect(page.getByRole('link', { name: 'new blog', exact: true })).toBeHidden()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await login(page)
      await expect(page.getByRole('button', { name: 'logout', exact: true })).toBeVisible()
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
        await likeBlog(page, 'Testing blogs', 1)
        await page.reload()
        const blog = page.getByTestId('blog')
        await blog.getByRole('button', { name: 'view' }).click()
        await expect(blog.getByText('likes 1', { exact: true })).toBeVisible()
      })

      test('the creator can delete a blog', async ({ page }) => {
        page.once('dialog', async dialog => {
          expect(dialog.type()).toBe('confirm')
          await dialog.accept()
        })
        await blogByTitle(page, 'Testing blogs').click()
        await expect(page).toHaveURL(/\/blogs\/[^/]+$/)
        await page.getByTestId('blog').getByRole('button', { name: 'delete' }).click()
        await expect(page).toHaveURL('/')
        await expect(blogByTitle(page, 'Testing blogs')).toHaveCount(0)
        await page.reload()
        await expect(page.getByRole('button', { name: 'logout', exact: true })).toBeVisible()
        await expect(blogByTitle(page, 'Testing blogs')).toHaveCount(0)
      })

    })
  })
})
