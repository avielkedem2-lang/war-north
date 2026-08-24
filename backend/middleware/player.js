import { ObjectId } from "mongodb"

export const checkName = (req, res, next) => {
    const { playerName } = req.body
    if (!playerName) res.status(400).send("Bad request")
    next()
}



export const checkId = (req, res, next) => {
    const id = req.params.id
    if (!id || !ObjectId.isValid(id)) return res.status(400).send("Bad request")
    next()
}




export const checkTerritoryId = (req, res, next) => {
    const territoryId = req.body
    if (!territoryId || isNaN(territoryId.territoryId)) return res.status(400).send("Bad request");
    next()
}