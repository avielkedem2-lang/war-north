import db from "../db/mongodb.js";


const collection = await db.collection("map");


async function insertData(data) {
    return await collection.insertMany(data)
}



async function findTerritory(id) {
    return await collection.findOne({id})
}


async function updateTerritory(id, territory) {
    return await collection.updateOne({id}, {$set : {...territory}})
}



export default {
    insertData,
    findTerritory,
    updateTerritory,
}