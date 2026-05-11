import { getData } from "./getData.js"
import { writeFile } from 'node:fs/promises'
import path from 'node:path'



export const addBike = async (bikeData) => {
    try {
        const filePath = path.join('data', 'bikeData.json')
        const parsedData = await getData()
        const newId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        const newBike = {
            id: newId,
            name: bikeData.name,
            price: Number(bikeData.price),
            description: bikeData.description,
            imageUrl: bikeData.imageUrl,
            type: bikeData.type,
            hostId: bikeData.hostId,
            hostedBy: bikeData.hostedBy,
            role: bikeData.role
        }

        parsedData.push(newBike)
        await writeFile(filePath, JSON.stringify(parsedData, null, 4), 'utf-8')
        return newBike
    } catch (error) {
        console.error('❌ Error adding bike:', error)
        throw error
    }
}