import express from "express"
import { checkId, checkName } from "../middleware/player.js"
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




router.get("/", checkId, async (req, res) => {
    try {
        const id = req.params.id
        const game = await getGameById(id)
        res.status(200).json(game)
    } catch (error) {
        console.log(error);
    }
})



export default router;
