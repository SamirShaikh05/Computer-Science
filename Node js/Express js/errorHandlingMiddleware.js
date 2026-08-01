import express from 'express'
const app = express();
const port = 3000;


app.get('/', (req, res)=>{
    res.send("This is Home Page")
})

app.get('/users', (req, res)=>{
    res.send1("This is users page") // send1 instead of send
})

app.get('/error', (req, res, next)=>{
    const error = new Error("Something went wrong");
    error.status = 404;
    next(error);
})

app.use((error, req, res, next)=>{
    res.status(error.status || 500).send("Try after some time");
})

app.listen(port, ()=>{
    console.log(`App listening on port http://localhost:${port}`);
})