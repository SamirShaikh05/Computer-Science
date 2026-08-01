import express from 'express'
import multer from 'multer'
const app = express()
const storage = multer.diskStorage({
    destination:function (req, file, cb){
     cb(null, 'upload')
    },
    filename:function (req, file, cb){
        cb(null, file.originalname)
    },
})
const upload = multer({storage})

app.get('/', (req,res)=>{
    res.send(`
        <form action='/upload' method='POST' enctype="multipart/form-data">
        <input type="file" name="myfile">
        <button>Upload</button>
        </form>
    `)
})

app.post('/upload', upload.single('myfile'), (req, res)=>{
    res.send({
        message: "file uploaded",
        info: req.file
    })
})

app.listen(3000)