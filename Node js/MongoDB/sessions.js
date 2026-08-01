import express from 'express'
import session from 'express-session'
const app = express()
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret:'myKey',
    resave: false,
    saveUninitialized: false,
    rolling: true,
    cookie: {
        maxAge: 600000
    }
}))

app.get('/', (req, res)=>{
    let data = req.session.data;
    console.log("data",data);
    res.render('home', {data})
})

app.get('/login', (req, res)=>{
    res.render('login')
})

app.post('/profile', (req, res)=>{
    req.session.data = req.body;
    console.log(req.session.data);

    res.render('profile')
})

app.listen(3000);