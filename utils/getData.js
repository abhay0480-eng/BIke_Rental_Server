import path from 'node:path'
import fs from 'node:fs/promises'

export const getData = async () => {
    try {
        const filePath = path.join('data', "bikeData.json")
        const content = fs.readFile(filePath)
        const parsedData = JSON.parse(content)
        return parsedData
    } catch (error) {
        return []
    }

}