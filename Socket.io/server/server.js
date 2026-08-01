import { createServer } from 'http';
import { Server } from 'socket.io'

const PORT = process.env.PORT || 3000;

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*",
    }
});

let playerScores = [];

io.on('connection', (socket) => {
    socket.on("scores", (score) => {
        console.log("Received:", score);

        playerScores.push({
            ...score,
            id: socket.id,
        });

        console.log(playerScores);

        io.emit("playerScores", playerScores);
    });
});



httpServer.listen(PORT, () => {
    console.log(`App is listening on http://localhost:${PORT}`);
})