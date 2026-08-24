import express from "express"
import { checkId, checkName, checkTerritoryId } from "../middleware/player.js"
import { createPlayer, getGameById, updateGame } from "../service/playerService.js"


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




router.get("/:id", checkId, async (req, res) => {
    try {
        const id = req.params.id
        const game = await getGameById(id)
        res.status(200).json(game)
    } catch (error) {
        if (error.status) {
            res.status(error.status).json(error.message)
        }
        console.log(error);
    }
})







router.post("/:id/reinforce", checkId, checkTerritoryId, async (req, res) => {
    try {
        const id = req.params.id
        const { territoryId } = req.body
        const game = await updateGame(id, territoryId)
        res.status(200).json(game)
    } catch (error) {
        if (error.status) {
            res.status(error.status).json(error.message)
        }
        console.log(error);
    }
})






export default router;
