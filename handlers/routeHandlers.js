import { getData } from "../utils/getData.js"
import { sendResponse } from "../utils/sendResponse.js"


export const handleGet = async (req, res) => {
    try {
        const parsedData = await getData()
        if (req.url === '/api') {
            const content = JSON.stringify(parsedData)
            sendResponse(res, 200, 'application/json', content)
        } else if (req.url.startsWith('/api/type')) {
            const bikeType = req.url.split('/').pop()
            const filteredData = parsedData.filter((bike) => bike.type === bikeType)
            const content = JSON.stringify(filteredData)
            sendResponse(res, 200, 'application/json', content)
        } else if (req.url.startsWith('/api/price')) {
            const bikePrice = req.url.split('/').pop()
            const filteredData = parsedData.filter((bike) => bike.price === parseInt(bikePrice))
            const content = JSON.stringify(filteredData)
            sendResponse(res, 200, 'application/json', content)
        } else {
            sendResponse(res, 404, 'application/json', JSON.stringify({ error: 'Route Not Found' }))
        }



    } catch (error) {
        throw new Error(error)
    }
}