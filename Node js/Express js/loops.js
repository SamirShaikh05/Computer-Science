import express from 'express'
const app = express();

app.set('view engine', 'ejs');

const users = ["samir", "aamir", "mahjabeen", "jabir", "zafer"]
app.get('/users', (req, res)=>{
    res.render('users', {users: users, isLogin:false})
})


app.listen(3000);