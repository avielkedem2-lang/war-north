import mapDal from "../DAL/mapDal.js";
import playersDal from "../DAL/playersDal.js";
import { createError } from "../error/error.js";
import { readFromFile } from "../file/read.js"




export async function createPlayer(playerName) {
    const dataMap = await addToMap()
    const territories = []
    dataMap.forEach((t) => {
        if (t.owner === "player") {
            territories.push(t)
        }
    })
    const player = createThePlayer(playerName, territories)
    const allPlayer = await playersDal.insertPlayer(player)
    await mapDal.insertData(dataMap)
    return { ...allPlayer }
}







export async function getGameById(id) {
    const game = await playersDal.findPlaterById(id)
    if (!game) throw createError(404, { error: "The game not found" })
    return game
}









export async function updateGame(id, territoryId) {
    const game = await playersDal.findPlaterById(id)
    if (!game) throw createError(404, { error: "The game not found" })
    if (!game.phase === "reinforce") throw createError(400, "bad request")
    let flag = false
    game.territories.forEach((t) => {
        if (t.id === territoryId){
            flag = true
        }
    })

    if (!flag) throw createError(400, "The territories must to be belongs to player")
    
    const territory =  await mapDal.findTerritory(territoryId)
    territory.soldiers += 3
    game.phase = "attack"
    await mapDal.updateTerritory(territoryId, territory)
    await playersDal.updateGame(id, game)
    return {playerEvent: game.phase, computerEvents: []}

}








export async function attack(id, body) {
    
}



export async function move(id, body) {
    
}







async function addToMap() {
    try {
        const res = await readFromFile()
        const data = await res.forEach((v) => {
            if (v.headquarters === true) {
                if (v.startOwner === "computer") {

                    v.owner = "computer"
                    v.soldiers = 8
                } else {
                    v.owner = "player"
                    v.soldiers = 8
                }
            } else {
                // console.log(v);
                v.owner = v.startOwner
                v.soldiers = 4
            }
        })
        // console.log(data);

        return res
    } catch (error) {
        console.log(error);

    }
}


function createThePlayer(playerName, territories) {
    return {
        playerName,
        round: 1,
        phase: "reinforce",
        status: "playing",
        winner: null,
        territories: territories
    }
}


