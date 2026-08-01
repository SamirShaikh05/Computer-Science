import express from 'express'
import { MongoClient, ObjectId } from 'mongodb'
const app = express()
app.set('view engine', 'ejs')

const url = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/college";
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const client = new MongoClient(url);
client.connect().then((connection) => {
    const db = connection.db("college");
    app.get('/api', async (req, res) => {
        const collection = db.collection('students')
        const students = await collection.find().toArray();
        res.send(students);
    })

    app.get('/ui', async (req, res) => {
        const collection = db.collection('students')
        const students = await collection.find().toArray();
        res.render('students', { result: students });
    })

    app.get('/add', (req, res) => {
        res.render('add-student')
    })

    app.post('/add-student', async (req, res) => {
        const collection = db.collection('students');
        await collection.insertOne(req.body)
        res.send("data saved")
    })

    app.post('/add-student-api', async (req, res) => {
        console.log(req.body);
        const { name, age, email } = req.body;
        if (!name || !age || !email) {
            res.send({ message: "operation failed", success: false })
            return false
        }

        const collection = db.collection('students');
        await collection.insertOne(req.body)
        res.send({ message: "data stored", success: true})
    })

    app.delete('/delete/:id', async(req, res)=>{
        console.log(req.params.id);
        const collection = db.collection('students')
        const result = await collection.deleteOne({_id:new ObjectId(req.params.id)})
        if(result){
            res.send({
                message:"student data deleted",
                success:true
            })
        }else{
            res.send({
                message:"student data not deleted, try after sometime",
                success:false
            })
        }
    })
    app.get('/ui/delete/:id', async(req, res)=>{
       console.log(req.params.id);
        const collection = db.collection('students')
        const result = await collection.deleteOne({_id:new ObjectId(req.params.id)})
        if(result){
            res.send("<h1>Student record deleted<h1>")
        }else{
            res.send("<h1>Student record  not deleted<h1>")
        }
    })
    app.get('/ui/student/:id', async(req, res)=>{
        console.log(req.params.id);
        const collection = db.collection('students')
        const result = await collection.findOne({_id:new ObjectId(req.params.id)})
        res.render('update-student',{result})
    })

    app.get('/student/:id', async(req, res)=>{
        console.log(req.params.id);
        const collection = db.collection('students')
        const result = await collection.findOne({_id:new ObjectId(req.params.id)})
        res.send({message:"data fetched", success:true, result:result})
    })

    app.post("/ui/update/:id", async(req, res) => {
        console.log(req.params.id);
        const collection = db.collection('students')
        const filter = {_id: new ObjectId(req.params.id)};
        const update = {$set: req.body}
        const result = await collection.updateOne(filter, update)

        if (result) {
            res.send("data updated")
        } else {
            res.send("data not updated")
        }
    })

    app.put("/update/:id", async(req, res) => {
        console.log(req.params.id);
        const collection = db.collection('students')
        const filter = {_id: new ObjectId(req.params.id)};
        const update = {$set: req.body}
        const result = await collection.updateOne(filter, update)

        if (result) {
        res.send({
            message: 'data updated',
            success: true,
            result: req.body
        })
        } else {
        res.send({
            message: 'data not updated',
            success: false,
            result: null
        })
        }
    })
})

// app.get('/', async(req, res)=>{
//     const db = client.db('college');
//     const collection = db.collection('students')
//     const result = await collection.find().toArray()
//     console.log(result);
//     res.render('homies',{result: result}); 

// })

app.listen(3000);
