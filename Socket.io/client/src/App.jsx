import { useState, useEffect } from "react";
import Input from "./Input";
import io from 'socket.io-client'

const socket = io("http://localhost:3000");

function App() {
  const [score, setScore] = useState({});
  const [scores, setAllScores] = useState([]);


  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.id);
    });

    return () => socket.off("connect");
  }, []);

  const sendScore = (e) => {
    e.preventDefault();

    console.log("Sending:", score);

    socket.emit("scores", score);
  };

 useEffect(() => {
  socket.on("playerScores", (playerScores) => {
    console.log("Received from server:", playerScores);
    setAllScores(playerScores);
  });

  return () => socket.off("playerScores");
}, []);

  const handleInput = ({ name, score }) => {
    setScore((prev) => ({
      ...prev,
      [name]: score,
    }));
    console.log({ name, score });

  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center py-8 px-4">
      <h1 className="text-4xl font-bold text-white mb-12">
        REACT MULTIPLAYER GAME
      </h1>

      <form onSubmit={sendScore} className="flex flex-col items-center gap-6 bg-slate-800 p-8 rounded-lg shadow-lg mb-12">
        <Input
          name="name"
          placeholder="Enter Your Name"
          onChange={handleInput}
        />

        <Input
          name="score"
          placeholder="Enter Score"
          onChange={handleInput}
        />

        <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition-colors">
          Submit
        </button>
      </form>

      {scores.length > 0 && (
        <div className="w-full max-w-md bg-slate-800 rounded-lg overflow-hidden shadow-lg">
          <table className="w-full">
            <thead className="bg-blue-600">
              <tr>
                <th className="px-6 py-3 text-white text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-white text-left font-semibold">Score</th>
              </tr>
            </thead>
            <tbody>
              {scores.map((score) => (
                <tr key={score.id} className="border-t border-slate-700 hover:bg-slate-700 transition">
                  <td className="px-6 py-3 text-white">{score.name}</td>
                  <td className="px-6 py-3 text-white">{score.score}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default App;