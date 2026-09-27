const express = require("express");
const db = require("./db");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Backend is running inside Docker"
    });
});

app.get("/api/tasks", async (req, res) => {
    try {
        const [rows] = await db.query("SELECT * FROM tasks");

        res.json(rows);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Database error"
        });
    }
});

app.post("/api/tasks", async (req, res) => {
    try {
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({
                error: "Title is required"
            });
        }

        const [result] = await db.query(
            "INSERT INTO tasks (title) VALUES (?)",
            [title]
        );

        res.status(201).json({
            id: result.insertId,
            title
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Database error"
        });
    }
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Backend running on port ${PORT}`);
});