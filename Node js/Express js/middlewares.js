import express from 'express'
const app = express();
const port = 3000;

app.use((req,res,next)=>{
    console.log("User is Accessing "+req.url+" Page");
    next();
})

app.get('/',(req,res)=>{
    res.send("This is Home Page");
})

app.get('/users',(req,res)=>{
    res.send("This is User Page Page");
})

app.get('/products',(req,res)=>{
    res.send("This is Product page");
})

app.listen(port, ()=>{
    console.log(`App listening on port http://localhost:${port}`);
})