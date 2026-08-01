# Monorepo

This folder contains two different monorepo experiments.

## `Monorepo/`

A pnpm workspace managed by Turborepo. It contains:

- `apps/web`: a Next.js app that displays a currency formatted by the shared package.
- `apps/api`: a TypeScript Express server on port `5000` with `GET /` returning `{ formattedCurrency }`.
- `packages/utils`: the shared `formatCurrency(amount, currency)` package.

Run it from this directory with:

```bash
cd Monorepo
pnpm install
pnpm dev
```

Useful commands are `pnpm build` for all packages and `pnpm --filter web dev` or `pnpm --filter api dev` for one app.

## `primitive-monorepo/`

A simpler client/server/shared layout. The TypeScript Express server on port `3000` returns a formatted mechanical keyboard product at `GET /`; the Next.js client is a separate app that displays a monorepo learning page. Each child project has its own package manager files and README.
