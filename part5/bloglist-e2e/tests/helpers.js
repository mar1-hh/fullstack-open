const { expect } = require('@playwright/test')

const user = { username: 'mluukkai', name: 'Matti Luukkainen', password: 'secret123' }
const api = 'http://localhost:3003/api'

async function login(page, credentials = user) {
  await page.getByRole('link', { name: 'login', exact: true }).click()
  await expect(page).toHaveURL('/login')
  await page.getByLabel('user name').fill(credentials.username)
  await page.getByLabel('password').fill(credentials.password)
  await page.getByRole('button', { name: 'login', exact: true }).click()
}

function blogByTitle(page, title) {
  return page.getByRole('link', { name: title, exact: true })
}

async function createBlog(page, title) {
  await page.getByRole('link', { name: 'new blog', exact: true }).click()
  await expect(page).toHaveURL('/create')
  await page.getByLabel('title:').fill(title)
  await page.getByLabel('author:').fill('Test Author')
  await page.getByLabel('url:').fill('https://example.com/blog')
  await page.getByRole('button', { name: 'create', exact: true }).click()
  await expect(page).toHaveURL('/')
  const blog = blogByTitle(page, title)
  await expect(blog).toBeVisible()
  return blog
}

async function likeBlog(page, title, count) {
  await blogByTitle(page, title).click()
  await expect(page).toHaveURL(/\/blogs\/[^/]+$/)
  const blog = page.getByTestId('blog')
  await blog.getByRole('button', { name: 'view', exact: true }).click()
  for (let likes = 1; likes <= count; likes++) {
    await blog.getByRole('button', { name: 'like', exact: true }).click()
    await expect(blog.getByText(`likes ${likes}`, { exact: true })).toBeVisible()
  }
}

module.exports = { user, api, login, blogByTitle, createBlog, likeBlog }
