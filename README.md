# go-memo-next

A simple, lightweight note app. This project aims to provide an `unrich` memo experience that runs right in your browser.

![image](https://github.com/imki123/go-memo-next/assets/43270441/828aea82-0843-4a69-8612-0cb88be083c5)

> 🇰🇷 한국어 문서는 `docs/kr/README.md`를 참고해주세요.

---

## Environment

- **Runtime**: Node.js 20 (LTS 권장)
- **Package manager**: pnpm

### Install dependencies

```bash
npm i -g pnpm
pnpm i
```

---

## Running the project

### Start dev server

```bash
pnpm dev
```

Open `http://localhost:4000` in your browser to see the app.

### Browser testing

- Open `http://localhost:4000` in your browser.
- TODO: Sign-in is not fully working in some environments yet.

---

## Build, deploy, and quality checks

### Build & production server

```bash
pnpm build    # Production build
pnpm start    # Run production server with the built output
```

### Code quality scripts

- **`pnpm lint`**: Run ESLint with `--fix`
- **`pnpm type`**: Run one-off TypeScript type-check
- **`pnpm test`**: Placeholder for RTL/Jest test runner (to be configured)
- **`pnpm checkAll`**: Run lint → type-check → test with progress logs

### Deploy to GitHub Pages

This project is deployed to GitHub Pages using the `gh-pages` branch.

1. Create `.env.production.local` and set the following variables:
   - `NEXT_PUBLIC_BE_URL`
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
2. Run:

```bash
pnpm gh-deploy
```

The `gh-deploy` script will:

- validate environment variables via `checkEnv.mjs`
- build the Next.js app to `out/`
- split `out/` as a subtree
- force push it to the `gh-pages` branch.

---

## FE architecture overview

This project follows a **domain-based FE architecture**, grouping business logic by domain and letting pages depend only on domain hooks.

### High-level directory structure

- `app/`: Next.js app entry and global setup
- `pages/`: Route entry points
- `providers/`: Next.js-only wrappers that run **inside** root providers (e.g. QueryClientProvider). Use domain hooks here for initialization; do not call useQuery/useMutation at `_app` root.
- `domain/`: Business logic per domain (entity, service, ports, repository, hook)
- `infra/`: Infrastructure implementations (stores, HTTP client, etc.)
- `shared/`: Shared utilities, UI components, and common logic

The dependency flow looks like this:

```text
pages → hook → service → repository → infra/store
                ↑
              entity (no dependencies)
```

For more details and rules, see `docs/fe-architecture.md`.

---

## Documentation

For the full list of documents, see [`docs/index.md`](./docs/index.md).

When adding new features or changing the structure, please update the relevant docs together so the documentation stays in sync with the codebase.
