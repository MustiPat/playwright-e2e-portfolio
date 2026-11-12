# Playwright end-to-end tests

[![E2E](https://github.com/MustiPat/playwright-e2e-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/MustiPat/playwright-e2e-portfolio/actions/workflows/ci.yml)

A TypeScript test suite that checks a live website the way a user (and a client's QA team) would: structure, navigation, content, accessibility basics, layout on a phone-sized screen, and link health. It runs against my own portfolio by default and against any site you point it at.

## What is covered

- Page title and a single, meaningful h1
- Every navigation link targets a section that exists, and clicking scrolls to it (desktop)
- The six service lines appear in order, and all seven case studies are listed
- FAQ items expand and collapse
- The open-source demo link is reachable
- Contact links are valid `mailto:` addresses
- Images have alternative text
- No horizontal scrolling and no uncaught script errors
- All of the above run twice: a desktop viewport and a 390 px wide phone viewport

## Run it

```bash
npm install
npx playwright install chromium
npm test
```

Test another deployment:

```bash
BASE_URL=https://staging.example.com npm test
```

## CI

GitHub Actions runs the suite on every push and on a daily schedule, so a broken deployment shows up as a failing badge. The HTML report and failure traces are uploaded as build artifacts.

## Why this exists

It is a working sample of the test automation I do for clients: stable selectors, no fixed sleeps, one assertion focus per test, configurable base URL, and CI from day one. See the same approach applied to unit tests in [docqa-dotnet](https://github.com/MustiPat/docqa-dotnet) and to security testing in [secreview-dotnet](https://github.com/MustiPat/secreview-dotnet).
