import express from 'express'
import path from 'path'
const app = express();
const port = 3000;

app.use(express.urlencoded({extended:false}))
app.use(express.static('public'))

app.get('/', (req, res)=>{
    res.sendFile(path.resolve('View/home.html'))
})

app.get('/login', (req, res)=>{
    res.sendFile(path.resolve('View/form.html'))
})

app.post('/submit', (req, res)=>{
    console.log(req.body);
    
    res.send("Form is Submitted")
})

app.listen(port, ()=>{
    console.log(`App listening on port http://localhost:${port}`);
})