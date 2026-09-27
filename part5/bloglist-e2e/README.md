# Blog list end-to-end tests (5.17–5.23)

This separate npm project tests the React frontend against the actual Part 4
Express backend and a disposable MongoDB database. No existing database or `.env`
credentials are used. The test server adds `/api/testing/reset` only to its own
process, and every test resets the database and registers a fresh user.

## Setup

From this directory:

```sh
npm ci
npm --prefix ../bloglist-frontend ci
npm --prefix ../../part4/bloglist-backend ci
npx playwright install chromium
npm test
```

The backend must be at `../../part4/bloglist-backend`. Playwright starts both
servers; ports 3003 and 5173 must be free. The first run downloads a MongoDB binary
through `mongodb-memory-server`, so internet access is needed during setup.

Tests run with one worker because they share the disposable database. The suite
covers the initial login form, successful and failed login, creation, liking,
confirmed deletion, delete-button ownership, and descending like order both after
updates and after reloading. Blog actions use the UI; setup uses the request
fixture. Assertions wait for rendered results rather than fixed delays.

Use `npm run test:headed` to watch Chromium, `npm run test:ui` for interactive
execution, or `npm run report` for the HTML report. Failure screenshots and traces
are retained under the ignored test output directories.

References: [API testing](https://playwright.dev/docs/api-testing),
[assertions](https://playwright.dev/docs/test-assertions), and
[dialogs](https://playwright.dev/docs/dialogs).
