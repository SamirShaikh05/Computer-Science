import mongoose from "mongoose";
import express from "express"
import {Todo} from "./models/Todo.js"

let conn =  await mongoose.connect("mongodb://[REDACTED]")
const app = express()
const port = 3000

app.get('/', (req, res) => {
  const todo=new Todo({ desc:"This the the description", isDone:false, days: Math.floor(Math.random() * 45 + 5* Math.random()) })
  todo.save()
  res.send('Hello World!')
})

app.get('/abc', async(req, res) => {
  let todo= await Todo.findOne({})
  console.log(todo);
  
  res.json({title:todo.title, description:todo.desc})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})