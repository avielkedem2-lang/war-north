import db from "../db/mongodb.js";


const collection = await db.collection("map");


async function insertData(area) {
    return await collection.insertMany(area)
}




export default {
    insertData,
}