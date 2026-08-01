import express from 'express'
import userData from './users.json' with {type: 'json'}
const app = express()

app.get('/', (req, res)=>{
    res.send(userData);
})

app.get('/user/:id', (req, res)=>{
    const id = req.params.id;
    const filterData = userData.filter((user)=> user.id == id);
    res.send(filterData)
})
app.get('/userName/:name', (req, res)=>{
    const name = req.params.name;
    const filterData = userData.filter((user)=> user.name == name);
    res.send(filterData)
})

app.listen(3000);