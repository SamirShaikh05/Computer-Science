import mongoose from "mongoose";
import express from 'express'
import students from './models/studentSchema.js'
const app = express();

app.use(express.json())

await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/students").then(()=>{
    console.log("_______connected______");
})

app.get('/', async(req, res)=>{
    const studentData = await students.find();
    res.send(studentData)
})
app.post('/save', async (req, res)=>{
    try{
        const studentData = await students.create(req.body);
        // res.sendStatus(201).json(studentData);
        res.send({
            message:"data stored",
            success:true,
            storedInfo:studentData
        })
    }
    catch(err){
        // res.sendStatus(400).json({error: err.message})
        res.send({
            message:"data not stored",
            success:false,
            storedInfo:null
        })
    }
    
})
app.put('/update/:id', async(req, res)=>{
    try{
        const id = req.params.id;
        const studentData = await students.findByIdAndUpdate(id, {...req.body});
        res.send({
            message:"data updated",
            success:true,
            storedInfo:studentData
        })
    }
    catch(err){
         res.send({
            message:"data not updated",
            success:false,
            storedInfo:null
        })
    }
})

app.delete('/delete/:id', async(req, res)=>{
    try{
        const id = req.params.id;
        const studentData = await students.findByIdAndDelete(id);
        res.send({
            message:"data deleted",
            success:true,
            storedInfo:studentData
        })
    }
    catch(err){
         res.send({
            message:"data not deleted",
            success:false,
            storedInfo:null
        })
    }
})

app.listen(3000)

// (async function dbConnection(){
//     await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/students");
//     const schema = mongoose.Schema({
//         name: String,
//         email: String,
//         age: Number,
//     })
//     const studentModel = mongoose.model('students', schema);
//     const result = await studentModel.find();
//     console.log(result);
    
// })();
