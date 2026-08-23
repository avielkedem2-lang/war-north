import express from "express"
import cors from "cors"
import { connection } from "./db/mongodb.js"
import router from "./route/playerRoute.js"


const app = express()

const PORT = process.env.PORT

app.use(express.json())
app.use(cors())


app.use("/games", router)






async function run() {
    try {
        await connection()
        app.listen(PORT, (e) => {
            if (e) return console.log(e);
            
            console.log("The server running ...");
        })
    } catch (error) {
        console.log(error);
    }
} 
run()
