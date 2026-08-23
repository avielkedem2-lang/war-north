import express from "express"
import cors from "cors"
import { connection } from "./db/mongodb.js"

const app = express()

const PORT = process.env.PORT

app.use(express.json())
app.use(cors())




async function run() {
    try {
        await connection()
        app.listen(PORT, () => {
            console.log("The server running ...");
        })
    } catch (error) {
        console.log(error);
    }
} 
run()
