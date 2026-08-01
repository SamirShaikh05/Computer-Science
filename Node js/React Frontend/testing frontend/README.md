# React API-fetching test client

A minimal React/Vite frontend used to test the Node/Express service at `http://localhost:3000/`. On mount, `App.jsx` fetches the root JSON response and logs it to the browser console, then renders a small working-status message.

## Run

Start the backend that exposes port `3000`, then run:

```bash
npm install
npm run dev
```

The app also supports `npm run build`, `npm run lint`, and `npm run preview`. Change the URL in `src/App.jsx` if the backend uses another port.
