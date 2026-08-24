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
    game.territories = await mapDal.findTerritories("player")
    return game
}









export async function updateGame(id, territoryId) {
    const game = await playersDal.findPlaterById(id)
    if (!game) throw createError(404, { error: "The game not found" })
    if (!game.phase === "reinforce") throw createError(400, "bad request")
    let flag = false
    game.territories.forEach((t) => {
        if (t.id === territoryId) {
            flag = true
        }
    })

    if (!flag) throw createError(400, "The territories must to be belongs to player")

    const territory = await mapDal.findTerritory(territoryId)
    territory.soldiers += 3
    game.phase = "attack"
    await mapDal.updateTerritory(territoryId, territory)
    game.territories = await mapDal.findTerritories("player")
    await playersDal.updateGame(id, game)
    return { playerEvent: game.phase, computerEvents: [] }

}








export async function attack(id, body) {
    if (!checkAttack(body)) throw createError(400, "Bad request")
    const game = await playersDal.findPlaterById(id)
    if (!game) throw createError(404, { error: "The game not found" });

    let checkOwner = isOwner(body.toId, game.territories);
    if (checkOwner) throw createError(400, "The territories must to be belongs to the computer");

    checkOwner = isOwner(body.fromId, game.territories)
    if (!checkOwner) throw createError(400, "The territories must to be belongs to player");
    
    
    if (!checkOwner.neighbors.includes(body.toId)) throw createError(404, "You can only attack a neighbor");

    const territory = await mapDal.findTerritory(body.fromId)
    const soldiers = territory.soldiers - body.soldiers
    if (soldiers < 1) throw createError(400, "One soldier must to stay in the base");
    console.log(soldiers);
    
    territory.soldiers = soldiers
    console.log(territory);
    

    const territoryComputer = await mapDal.findTerritory(body.toId)

    const survive = battleCalculation(body.soldiers, territoryComputer.soldiers);
    await mapDal.updateTerritory(body.fromId, territory)
    if (survive.attack) {
        territoryComputer.owner = "player"
        territoryComputer.soldiers = survive.attack
        game.territories.push(territoryComputer)
        await mapDal.updateTerritory(body.toId, territoryComputer);

        if (territoryComputer.headquarters) {
            game.winner = "player"
            game.status = "finished"
            await playersDal.updateGame(id, game)
        }

        game.phase = "move"
        game.territories = await mapDal.findTerritories("player")
        await playersDal.updateGame(id, game)
        
    } else {
        territoryComputer.soldiers = survive.defense
        await mapDal.updateTerritory(body.toId, territoryComputer);
        game.phase = "move"
        game.territories = await mapDal.findTerritories("player")
        await playersDal.updateGame(id, game)
    }
    return {playerEvent: "move", computerEvents: []}



}



export async function move(id, body) {
    if(!body.skip === true) throw createError(400, "Bad request")
    const game = await playersDal.findPlaterById(id);
    if (!game) throw createError(404, { error: "The game not found" });
    game.phase = "move"
    await playersDal.updateGame(id, game)
    return {playerEvent: null, computerEvents: []}
}







export async function moveSoldiers(id, body) {
    if (!checkAttack(body)) throw createError(400, "Bad request")
    const game = await playersDal.findPlaterById(id)
    if (!game) throw createError(404, { error: "The game not found" });
    if (body.fromId === body.toId) throw createError(409, "The 'fromId' and 'toId' can't be the same thing");

    let checkOwner = isOwner(body.toId, game.territories);
    if (!checkOwner) throw createError(400, "The territories must to be belongs to player");
    const toIdNeighbors = checkOwner.neighbors
    checkOwner = isOwner(body.fromId, game.territories);
    if (!checkOwner) throw createError(400, "The territories must to be belongs to player");
    if (!toIdNeighbors.includes(checkOwner.id)) createError(400, "they are not neighbors");


    const territory = await mapDal.findTerritory(body.fromId)
    if (territory.soldiers - body.soldiers < 1) throw createError(400, "One soldier must to stay in the base");

    if (!game.phase === "move") throw createError(400, "The game must to be on 'move'");
    territory.soldiers -= body.soldiers
    const toTerritory = await mapDal.findTerritory(body.toId)
    toTerritory.soldiers += body.soldiers

    await mapDal.updateTerritory(body.fromId, territory)
    await mapDal.updateTerritory(body.toId, toTerritory)


    return {playerEvent: null, computerEvents: []}
}

















function battleCalculation(sentSoldiers, defendingSoldiers) {
    const attackLuck = 0.6 + Math.random() * 0.4;
    const defenseLuck = 0.6 + Math.random() * 0.4;
    const attackPower = sentSoldiers * attackLuck;
    const defensePower = defendingSoldiers * defenseLuck;

    if (attackPower > defensePower) {
        const survivors = Math.max(
            1,
            Math.ceil(sentSoldiers * (attackPower - defensePower) / attackPower)
        );
        return { attack: survivors }
    }
    const survivors = Math.max(
        1,
        Math.ceil(defendingSoldiers * (defensePower - attackPower) / defensePower)
    );
    return { defense: survivors }
}







function checkAttack(body) {
    if (typeof (body.fromId) === "number" && typeof (body.toId) === "number" && typeof (body.soldiers) === "number") {
        if (body.fromId > 0 && body.toId > 0 && body.soldiers > 0) return true
    }
    return false
}


function isOwner(territoryId, territories) {
    let flag = false;
    territories.forEach((t) => {
        if (t.id === territoryId) {
            flag = t
        }
    })
    return flag
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


