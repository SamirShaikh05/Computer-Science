import express from 'express'
import morgan from 'morgan';
const app = express();
const port = 3000;

app.use(morgan('dev'));
app.get('/',(req,res)=>{
    res.send("Home page")
})

app.get('/users', (req, res)=>{
    res.send("Users page")
})

app.get('/wait', (req, res)=>{
    setTimeout(() => {
        res.send("print after 1 sec")
    }, 1000);
})

app.listen(port, ()=>{
    console.log(`App listening on port http://localhost:${port}`);
})