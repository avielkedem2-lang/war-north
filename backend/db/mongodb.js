import { MongoClient } from "mongodb"
import dotenv from "dotenv/config"


const MONGO_URL = process.env.MONGO_URL

const client = new MongoClient(MONGO_URL)

export async function connection(){
    try {
        await client.connect()
        console.log("connection succeeded");
    } catch (error) {
        console.log("connection failed");
    }
}


const db = client.db("war-north")
export default db;