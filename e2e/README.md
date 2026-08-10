# E2E Tests

Two Playwright projects: `unauthenticated` (`e2e/public/`) and `authenticated`
(`e2e/authenticated/`). CI only runs the first. Config lives in `playwright.config.ts`; reports go to
`.playwright-report/`.

```bash
npm run e2e-test:unauth   # unauthenticated
npm run e2e-test:ci       # same, minus @flaky — what GitHub's CI/CD runs
npm run e2e-test:auth     # authenticated (see below)
npm run e2e-test          # everything
```

Playwright starts a dev server on `:5173` if one isn't already running.

## Authenticated tests

Needs a git-ignored `.env.test` at the repo root with `VITE_API_GATEWAY_BASE_URL`,
`VITE_TEST_AUTH_SECRET`, and `VITE_TEST_USER_ID`. Setup (`authenticated/auth/auth.setup.ts`) posts
these to the backend's `/auth/test-login`, which mints JWTs without Google, then saves the session to
`.playwright/.auth/user.json`. The endpoint only exists on beta (`ENABLE_TEST_AUTH=true`).

The catch: these are `VITE_*` vars, so they're baked into the client bundle and the _dev server_
needs them, not just Playwright. Vite won't load `.env.test` on its own — `npm run dev` runs in
development mode. `npm run e2e-test:auth` exports them and lets Playwright start its own server, but
only if `:5173` is free. Otherwise it reuses whatever is there, and a server started without the vars
gives you "Test Login Not Available" (a client-side check in `TestLoginPage.tsx` — the request never
leaves the browser).

```bash
lsof -ti :5173 | xargs kill
npm run e2e-test:auth
```

Or keep your own server and give it the vars:

```bash
set -a; . ./.env.test; set +a; npm run dev
```

Either way, `http://localhost:5173/test-login` should show a "Login as Test User" button. The port
matters: the beta gateway's CORS allowlist has `localhost:5173` and nothing else, so anywhere else
fails with `Failed to fetch`.

## Without `.env.test`

Setup falls back to manual Google login, waiting 5 minutes for you to sign in. Needs `--headed`, and
plain `npx` so the vars stay unset:

```bash
npx playwright test --project=setup --headed
npx playwright test --project=authenticated
```

## Debugging

```bash
npm run e2e-test:auth -- --ui                    # time-travel UI
npm run e2e-test:auth -- --headed --workers=1    # watch it (>1 worker races windows)
npm run e2e-test:auth -- --debug                 # step through, no timeouts
npm run e2e-test:auth -- --trace on              # npx playwright show-trace <path>
```

Traces are `on-first-retry`, and local runs don't retry, so `--trace on` is the only way to get one.

## CI

Runs `e2e-test:ci` with `--workers=1 --retries=2` inside `mcr.microsoft.com/playwright:vX.Y.Z-jammy`.
Keep that tag in sync with `@playwright/test` in `package-lock.json` — a mismatch fails every test at
launch with "Executable doesn't exist".
