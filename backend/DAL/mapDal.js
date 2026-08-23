import db from "../db/mongodb.js";


const collection = await db.collection("map");


async function insertData(data) {
    return await collection.insertMany(data)
}




export default {
    insertData,
}