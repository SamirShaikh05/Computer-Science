import express from 'express'
import nodemailer from 'nodemailer'

const app = express()
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:"samirshaikh050505@gmail.com",
        pass:"qjqh vtug zsfk lata"
    }
})

app.set('view engine', 'ejs')
// app.use(express.urlencoded({extended:true}))
app.use(express.json())

app.get('/mail', (req, res)=>{
    res.render("mail")
})

app.post('/submit-email', (req, res)=>{
console.log(req.body)
const mailOptions = {
    from:"samirshaikh050505@gmail.com",
    to:"samirshaikh050505@gmail.com",
    subject:req.body.subject,
    text:req.body.mail
}

transporter.sendMail(mailOptions, (error, info)=>{
    if(error){
        res.send("email operation failed, try again")
    }else{
        res.send("mail send")
    }
})
})

app.listen(3000)