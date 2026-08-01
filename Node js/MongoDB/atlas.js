import express from 'express'
import { MongoClient } from 'mongodb'

const app = express();
const url = "mongodb://[REDACTED]"
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