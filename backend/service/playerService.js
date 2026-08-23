import mapDal from "../DAL/mapDal.js";
import playersDal from "../DAL/playersDal.js";
import { readFromFile } from "../file/read.js"




export async function createPlayer(playerName) {
    const dataMap = await addToMap()
    const territories = []
    dataMap.forEach((t) => {
        if (t.owner === "player"){
            territories.push(t)
        }
    })
    const player = createThePlayer(playerName, territories)
    const allPlayer = await playersDal.insertPlayer(player)
    await mapDal.insertData(dataMap)
    return {...allPlayer}
}




async function addToMap() {
    try {
        const res = await readFromFile()
        const data = await res.forEach((v) => {
            if (v.headquarters === true) {
                if (startOwner === "computer") {
                    v.owner = "computer"
                    v.soldiers = 8
                } else {
                    v.owner = "player"
                    v.soldiers = 8
                }
            } else {
                v.owner = v.startOwner
                v.soldiers = 4
            }
        })
        return data
    } catch (error) {
        console.log(error);

    }
}


function createThePlayer(playerName, territories){
    return {
        playerName,
        round: 1,
        phase: "reinforce",
        status: "playing",
        winner: null,
        territories: territories
    }
}


