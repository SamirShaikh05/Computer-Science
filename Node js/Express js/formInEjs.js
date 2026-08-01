import express from 'express'
const app = express();
app.use(express.urlencoded({extended:false}))
app.set('view engine', 'ejs');

app.get('/add-user', (req, res)=>{
res.render('addUser');
})

app.post('/submit-user', (req, res)=>{
res.render('submitUser', req.body);
})

app.listen(3000);