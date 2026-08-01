import express from 'express'
const app = express();
app.set('view engine', 'ejs');

app.get('/', (req, res)=>{
res.render('Detail', {name:"Samir Jamil Shaikh", email:"samirshaikh050505@gmail.com", age:19})
})

app.listen(3000);