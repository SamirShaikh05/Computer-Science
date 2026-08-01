# Monorepo web app

The Next.js frontend in the `Monorepo` Turborepo workspace. Its home page imports `formatCurrency` from the workspace package `@Monorepo/utils` and renders the formatted value for `25.99`.

Run from `monorepo/Monorepo`:

```bash
pnpm install
pnpm --filter web dev
```

The app runs on `http://localhost:3000`. Workspace-level commands are `pnpm dev` and `pnpm build`; the web package also supports `pnpm --filter web lint`.
