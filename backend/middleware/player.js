export const checkName = (req, res, next) => {
    const { playerName } = req.body
    if (!playerName) res.status(400).send("Bad request")
    next()
}