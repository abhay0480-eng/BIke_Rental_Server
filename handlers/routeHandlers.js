import { getData } from "../utils/getData.js"
import { sendResponse } from "../utils/sendResponse.js"
import { getDataByPathParams } from '../utils/getDataByPathParams.js'
import { getDataByQueryParams } from '../utils/getDataByQueryParams.js'


export const handleGet = async (req, res) => {
    const urlObj = new URL(req.url, `http://${req.headers.host}`)
    const queryObj = Object.fromEntries(urlObj.searchParams)


    try {
        const parsedData = await getData()
        if (urlObj.pathname === '/api') {
            const filterData = getDataByQueryParams(queryObj, parsedData)
            sendResponse(res, 200, 'application/json', JSON.stringify(filterData))
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