import { getData } from "../utils/getData.js"
import { sendResponse } from "../utils/sendResponse.js"
import { getDataByPathParams } from '../utils/getDataByPathParams.js'


export const handleGet = async (req, res) => {
    try {
        const parsedData = await getData()
        if (req.url === '/api') {
            const content = JSON.stringify(parsedData)
            sendResponse(res, 200, 'application/json', content)
        } else if (req.url.startsWith('/api/type')) {
            const filteredData = getDataByPathParams(req, parsedData, 'type')
            sendResponse(res, 200, 'application/json', filteredData)
        } else if (req.url.startsWith('/api/price')) {
            const filteredData = getDataByPathParams(req, parsedData, 'price')
            sendResponse(res, 200, 'application/json', filteredData)
        } else {
            sendResponse(res, 404, 'application/json', JSON.stringify({ error: 'Route Not Found' }))
        }



    } catch (error) {
        sendResponse(res, 500, 'application/json', JSON.stringify({ error: 'Internal Server Error' }))
    }
}