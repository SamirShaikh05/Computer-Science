import app from "./src/app.js";
import mongoose from 'mongoose';
import authRouter from "./routes/authRotues.js";

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

app.use("/api/auth", authRouter)
app.get('/', (req, res)=>{
    res.send("Hello!!");
})

app.listen(PORT, ()=>{
    console.log(`Server running at: http://localhost:${PORT}`)
})