# React + TypeScript practice

A Vite application for learning typed React components. The demo renders product-like cards, a counter, a typed chai menu, an order form, and a generic card layout.

## Source map

- `src/types.ts` defines the shared `Chai` type.
- `src/components/ChaiCard.tsx` demonstrates typed props.
- `src/components/ChaiList.tsx` renders a typed collection.
- `src/components/Counter.tsx` demonstrates state.
- `src/components/OrderForms.tsx` demonstrates typed form submission.
- `hooks/useFetch.tsx` contains a reusable fetch hook experiment.

## Run

```bash
npm install
npm run dev
```

Production and quality commands are `npm run build`, `npm run lint`, and `npm run preview`.
