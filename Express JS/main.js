// const express = require('express')
// const app = express()
// const port = 3000

// app.use(express.static('public'))

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// app.get('/about', (req, res) => {
//     res.send('About us')
// })

// app.get('/contact', (req, res) => {
//     res.send('Hello contact me!')
// })

// app.get('/blog', (req, res) => {
//     res.send('Hello blog!')
// })

// app.get('/blog/:slug', (req, res) => {
//     console.log(req.params);
//     console.log(req.query);
    
//      res.send(`Hello ${req.params.slug}`)
// })

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`)
// })

const express = require('express')
const blog = require('./routes/blog')
const shop = require('./routes/shop')
const fs= require("fs")
 

const app = express()
const port = 3000

app.use('/blog', blog)
app.use('/shop', shop)
// app.use(express.static("public"))


app.use((req, res, next)=>{
  console.log(req.headers)
  req.samir="samir jamil shaikh"
      fs.appendFileSync("logs.txt", `${Date.now()} is a ${req.method}\n`)
    console.log(`${Date.now()} is a ${req.method}`)
  next()
})

app.use((req, res, next)=>{
  console.log('m2')
    req.samir="samir shaikh"
  next()
})


app.get('/', (req, res) => {
    console.log("Hey its a get request")
    res.send('Hello World21!'+req.samir)
}).post('/', (req, res) => {
    console.log("Hey its a post request")
    res.send('Hello World post!')
})

app.put('/', (req, res) => {
    console.log("Hey its a put request")
    res.send('Hello World put!')
})

app.get("/index", (req, res) => {
    console.log("Hey its index")
    res.sendFile('public/index.html', { root: __dirname })
})

app.get("/api", (req, res) => {
    res.json({ a: 1, b: 2, c: 3, d: 4, name: ["harry", "jerry"] })
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})