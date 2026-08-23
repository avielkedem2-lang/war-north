import { ObjectId } from "mongodb";
import db from "../db/mongodb.js";

const collection = db.collection("players-war")



async function insertPlayer(body){
    const res = await collection.insertOne(body);
    return {_id: res.insertedId, ...body}
}


async function findPlaterById(id) {
    return await collection.findOne({_id: new ObjectId(id)})
}



export default {
    insertPlayer,
    findPlaterById,
}