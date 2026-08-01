import express from 'express'
import 'dotenv/config'
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from './generated/prisma/client.js';


const app = express()
const PORT = process.env.PORT || 3000
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get("/new-user", async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        name: "samir shaikh",
        email: "samir@example.com",
        age: 24,
      },
    });

    res.status(201).json({
      success: true,
      message: "New User Created",
      user,
    });
  } catch (error) {
    console.error("Error creating user:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
});

app.get('/add', async (req, res) => {
  try {
    await prisma.blog.update({
      where: {
        id: 1,
      },
      data: {
        categories: {
          connect: [{ id: 1 }],
        },
      },
    });

    res.send("Category connected successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
