import mapDal from "../DAL/mapDal.js";
import playersDal from "../DAL/playersDal.js";
import { createError } from "../error/error.js";


export async function computerMove() {
    const territories = await mapDal.findTerritories("computer")
    const territory = selectReinforcement(territories)
    territory.soldiers += 3
    
}






















function selectReinforcement(territories) {
    let listDistance = listDistanceFromComputer(territories).lessThen2;
    if (listDistance.length > 0) {
        let minDistance = listDistance[0]
        for (let i of listDistance) {
            if (i.distanceFromComputerHQ < minDistance.distanceFromComputerHQ) {
                minDistance = i
            }
        }

        if (minDistance.distanceFromComputerHQ === 2) {

            let minSoldiers = listDistance[0]
            for (let i of listDistance) {
                if (i.soldiers < minSoldiers.soldiers) {
                    minSoldiers = i
                }
            }


            for (let i of listDistance) {
                if (i.soldiers === minSoldiers.soldiers) {
                    minSoldiers = false
                }
            }
            if (!minSoldiers) {
                let minId = listDistance[0]
                for (let i of listDistance) {
                    if (i.id < minSoldiers.id) {
                        minId = i
                    }
                }
                return minId
            }
            return minSoldiers
        }
        return minDistance
    }

    listDistance = listDistanceFromComputer(territories).more
    let minDistance = listDistance[0]
    let list = []
    for (let i of listDistance) {
        if (i.distanceFromComputerHQ < minDistance.distanceFromComputerHQ) {
            minDistance = i
        }
    }

    for (let i of listDistance) {
        if (minDistance.distanceFromComputerHQ === i.distanceFromComputerHQ) {
            list.push(i)
        }
    }

    for (let i of list) {
        if (i.soldiers > minDistance.soldiers) {
            minDistance = i
        }
    }
    list = []
    for (let i of list) {
        if (minDistance.soldiers === i.soldiers) {
            list.push(i)
        }
    }

    for (let i of list) {
        if (i.id < minSoldiers.id) {
            minDistance = i
        }
    }
    return minDistance
}



function listDistanceFromComputer(territories) {
    const listDistance = { lessThen2: [], more: [] }
    territories.forEach((t) => {
        if (t.distanceFromComputerHQ <= 2) {
            listDistance.lessThen2.push(t)
        } else {
            listDistance.more.push(t)
        }
    })
    return listDistance
}