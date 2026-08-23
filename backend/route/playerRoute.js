import express from "express"
import { checkName } from "../middleware/player.js"
import { createPlayer } from "../service/playerService.js"


const router = express.Router()



router.post("/", checkName, async (req, res) => {
    try {
        let { playerName } = req.body
        playerName = playerName.trim()
        const player = await createPlayer(playerName)
        res.status(201).json(player)
    } catch (error) {
        console.log(error);
    }
})



export default router;
