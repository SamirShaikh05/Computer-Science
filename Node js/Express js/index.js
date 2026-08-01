import express from 'express'
import path from 'path'
const app = express();
const port = 3000;

// app.get('/', (req, res)=>{
//     res.send(home())
// })

// app.get('/login', (req, res)=>{
//     res.send(login())
// })

// app.post('/submit', (req, res)=>{
//     res.send(submit())
// })

const folder = path.resolve('View');
const publicPath = path.resolve('public');

app.use(express.static(publicPath))

app.get('/', (req, res)=>{
    res.sendFile(folder+'/home.html')
})
app.get('/login', (req, res)=>{
    res.sendFile(folder+'/login.html')
})
app.get('/about', (req, res)=>{
    res.sendFile(folder+'/about.html')
})

app.use((req, res)=>{
    res.status(404).sendFile(folder+'/404.html');
})

app.listen(port, ()=>{
    console.log(`App listening on port http://localhost:${port}`);
})