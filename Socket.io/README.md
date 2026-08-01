# Socket.IO Multiplayer Scoreboard

A small real-time client/server demo. A React/Vite client collects a player name and score; a Socket.IO server stores the submitted scores in memory and broadcasts the complete list to every connected browser.

## Run

Start the server:

```bash
cd server
npm install
node server.js
```

In another terminal, start the client:

```bash
cd client
npm install
npm run dev
```

The server listens on `http://localhost:3000` and accepts any CORS origin for learning. The client emits `scores` and listens for `playerScores`. Scores are lost when the server restarts, and disconnected players are not removed from the in-memory array.
