import express from 'express'
import mongoose from 'mongoose';
import Employee from './models/Employee.js'
const app = express()
const port = 3000
app.set('view engine', 'ejs');
const conn = mongoose.connect('mongodb://[REDACTED]');

const getRandom=(arr)=>{
   let rno=Math.floor(Math.random() * (arr.length-1))
   return arr[rno]
}

app.get('/', async (req, res) => {
  res.render('index');
})

app.get('/employee', async (req, res) => {
  await Employee.deleteMany({})
  let randomNames = ['Rohan', "Sohan", "Mohan", "Sobhan"]
  let randomLang = ["Python", "js", "C++", "Java"]
  let randomCities = ["Bilaspur", "Moradabad", "Mysore", "Kolkata"]
  for (let i = 0; i < 10; i++) {
    let e = await Employee.create({
      name: getRandom(randomNames),
      salary: Math.floor(Math.random() * 22000),
      language: getRandom(randomLang),
      city: getRandom(randomCities),
      isManager: (Math.random() > 0.5) ? true : false
    })

  }
  res.render('index');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
