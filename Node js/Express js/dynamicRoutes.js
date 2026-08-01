import express from 'express'
const app = express();
app.set('view engine', 'ejs')

app.get('/user', (req, res)=>{
    const users = ["samir", "aamir", "mahjabeen", "jabir", "zafer"]
    let data = `<ul>`;
    for (let i = 0; i < users.length; i++) {
    data += `<li><a href="/user/${users[i]}">${users[i]}</a></li>`;
    }
    data += `</ul>`;
    res.send(data);
})

app.get('/user/:name', (req,res)=>{
    const userName = req.params.name;
    res.send(`This is ${userName}'s Profile Page`);
})

app.listen(3000)