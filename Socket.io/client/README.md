# Socket.IO React client

The frontend for the parent Socket.IO scoreboard demo. It is a Vite React app styled with Tailwind CSS and connects to `http://localhost:3000` using `socket.io-client`.

## Features

- Collects a player name and score with the reusable `Input` component.
- Emits a `scores` event when the form is submitted.
- Listens for `playerScores` broadcasts and renders a live scoreboard.
- Uses the socket connection lifecycle to log and clean up listeners.

## Run

Start the parent server first, then:

```bash
npm install
npm run dev
```

Use `npm run build`, `npm run lint`, and `npm run preview` for the other Vite workflows.
