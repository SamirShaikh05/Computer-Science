import express from 'express'
import { MongoClient } from 'mongodb'

const app = express();
const url = process.env.MONGO_URI;
if (!url) throw new Error('MONGO_URI is required');
const database = "ThundrDatabase"
const collection = "signups"
const client = new MongoClient(url);

(async function(){
    client.connect().then(()=>{
        console.log(".........Connected...........");
    })
    const db = client.db(database);
    const collectionResult = db.collection(collection)
    const data = await collectionResult.find().toArray()
    console.log(data);
})()
