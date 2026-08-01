import cookieParser from 'cookie-parser'
import express from 'express'
const app = express()
app.set('view engine', 'ejs')
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.get('/', (req, res)=>{
    let cookieData = req.cookies.name;
    res.render('home', {cookieData})
})

app.get('/login', (req, res)=>{
    res.render('login')
})

app.post('/profile', (req, res)=>{
    res.cookie("login", true)
    res.cookie("name", req.body.name)

    res.render('profile')
})

app.listen(3000);