import { ObjectId } from "mongodb"

export const checkName = (req, res, next) => {
    const { playerName } = req.body
    if (!playerName) res.status(400).send("Bad request")
    next()
}



export const checkId = (req, res, next) => {
    const id = req.prams.id
    if (!id || ObjectId.isValid(id)) return res.status(400).send("Bad request")
    next()
}