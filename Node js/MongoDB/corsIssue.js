import express from 'express'
import cors from 'cors'
const app = express()
app.use(cors())

app.get('/', (req, res)=>{
    res.send({
        name: "samir",
        age:29,
        email:"samir@test.com"
    })
})

app.listen(3000);