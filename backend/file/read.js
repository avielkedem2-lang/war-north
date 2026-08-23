import { readFile } from "fs/promises"


export async function readFromFile() {
    try {
        const res = await readFile("map.json")
        return JSON.parse(res) 
    } catch (error) {
        console.log(error);

    }
}