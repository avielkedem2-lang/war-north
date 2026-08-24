import assert from "node:assert/strict"
import { describe, test, mock } from "node:test"
import playerDal from "../DAL/playersDal.js"
import mapDal from "../DAL/mapDal.js"
import { createPlayer, getGameById, updateGame } from "../service/playerService.js"



describe("function createPlayer", () => {
    test("valid return player", async () => {
        const name = "avi"
        const player = {
            _id: "6a86fdb3fe9a1d4d413318c1",
            "playerName": "avi",
            "round": 1,
            "phase": "move",
            "status": "playing",
            "winner": null,
            "territories": []
        }

        mock.method(
            playerDal,
            "insertPlayer",
            (body) => { return player }
        )

        mock.method(
            mapDal,
            "insertData",
            (data) => { return null }
        )

        const data = await createPlayer(name)
        assert.deepStrictEqual(data, player)
    })
})


describe("function getGameById", () => {
    test("valid return player", async () => {
        const id = "6a86fdb3fe9a1d4d413318c1"
        const player = {
            _id: "6a86fdb3fe9a1d4d413318c1",
            "playerName": "avi",
            "round": 1,
            "phase": "move",
            "status": "playing",
            "winner": null,
            "territories": []
        }
        mock.method(
            playerDal,
            "findPlaterById",
            (id) => { return player }
        )

        mock.method(
            mapDal,
            "findTerritories",
            (name) => { return [] }
        )
        const data = await getGameById(id);
        assert.deepStrictEqual(data, player)
    })
})


describe("function updateGame", () => {
    test("valid return object", async () => {
        const id = "6a86fdb3fe9a1d4d413318c1"
        const territory = {
            "_id": "6a8af75ed08a0de2d7a8d5a8",
            "id": 7,
            "name": "צור",
            "x": 45.9,
            "y": 21,
            "neighbors": [
                4,
                6,
                8,
                10
            ],
            "startOwner": "computer",
            "distanceFromComputerHQ": 2,
            "distanceFromPlayerHQ": 4,
            "owner": "player",
            "soldiers": 4
        }
        const player = {
            _id: "6a86fdb3fe9a1d4d413318c1",
            "playerName": "avi",
            "round": 1,
            "phase": "move",
            "status": "playing",
            "winner": null,
            "territories": [territory]
        }

        mock.method(
            playerDal,
            "findPlaterById",
            (id) => { return player }
        )

        mock.method(
            playerDal,
            "updateGame",
            (id, player) => { return null }
        )

        mock.method(
            mapDal,
            "findTerritory",
            (territoryId) => { return territory }
        )

        mock.method(
            mapDal,
            "updateTerritory",
            (territoryId, territory) => { return null }
        )

        mock.method(
            mapDal,
            "findTerritories",
            (name) => { return [] }
        )
        const d = { playerEvent: "attack", computerEvents: [] }
        const data = await updateGame(id, 7)
        assert.deepStrictEqual(data, d)
    })

    test("invalid return error status-404", async () => {
        const id = "6a86fdb3fe9a1d4d413318c1"
        const territory = {
            "_id": "6a8af75ed08a0de2d7a8d5a8",
            "id": 7,
            "name": "צור",
            "x": 45.9,
            "y": 21,
            "neighbors": [
                4,
                6,
                8,
                10
            ],
            "startOwner": "computer",
            "distanceFromComputerHQ": 2,
            "distanceFromPlayerHQ": 4,
            "owner": "player",
            "soldiers": 4
        }
        const player = {
            _id: "6a86fdb3fe9a1d4d413318c1",
            "playerName": "avi",
            "round": 1,
            "phase": "move",
            "status": "playing",
            "winner": null,
            "territories": [territory]
        }

        mock.method(
            playerDal,
            "findPlaterById",
            (id) => { return null }
        )

        mock.method(
            playerDal,
            "updateGame",
            (id, player) => { return null }
        )

        mock.method(
            mapDal,
            "findTerritory",
            (territoryId) => { return territory }
        )

        mock.method(
            mapDal,
            "updateTerritory",
            (territoryId, territory) => { return null }
        )

        mock.method(
            mapDal,
            "findTerritories",
            (name) => { return [] }
        )
        assert.rejects(async ()=> {
            await updateGame(id, 7)
        })
    })
})