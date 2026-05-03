import { getData } from "../utils/getData.js"
import { sendResponse } from "../utils/sendResponse.js"
import { getDataByPathParams } from '../utils/getDataByPathParams.js'
import { getDataByQueryParams } from '../utils/getDataByQueryParams.js'


export const handleGet = async (req, res) => {
    const urlObj = new URL(req.url, `http://${req.headers.host}`)
    const queryObj = Object.fromEntries(urlObj.searchParams)

    try {
        const parsedData = await getData()

        // PUBLIC ROUTES (no auth required)
        if (urlObj.pathname === '/api') {
            // Get all bikes with optional type filter
            const filterData = getDataByQueryParams(queryObj, parsedData)
            sendResponse(res, 200, 'application/json', JSON.stringify(filterData))
        }
        else if (req.url.startsWith('/api/type')) {
            // Get bikes by type (path param)
            const filteredData = getDataByPathParams(req, parsedData, 'type')
            sendResponse(res, 200, 'application/json', filteredData)
        }
        else if (req.url.startsWith('/api/price')) {
            // Get bikes by price (path param)
            const filteredData = getDataByPathParams(req, parsedData, 'price')
            sendResponse(res, 200, 'application/json', filteredData)
        }

        // PROTECTED ROUTES (auth required - req.user is available)
        else if (req.url.startsWith('/api/host/bikes')) {
            // Get bikes owned by the authenticated user
            // req.user.uid is set by authMiddleware
            const userBikes = parsedData.filter(bike => bike.hostId === req.user.uid)
            sendResponse(res, 200, 'application/json', JSON.stringify(userBikes))
        }
        else if (req.url.startsWith('/api/host')) {
            // Get host info for authenticated user
            const userBikes = parsedData.filter(bike => bike.hostId === req.user.uid)
            const hostData = {
                hostId: req.user.uid,
                email: req.user.email,
                bikesCount: userBikes.length,
                bikes: userBikes
            }
            sendResponse(res, 200, 'application/json', JSON.stringify(hostData))
        }

        // PUBLIC ROUTE - Get single bike by ID
        else if (req.url.startsWith('/api')) {
            // Get bike by ID (path param)
            const filteredData = getDataByPathParams(req, parsedData, 'id')
            sendResponse(res, 200, 'application/json', filteredData)
        }

        else {
            sendResponse(res, 404, 'application/json', JSON.stringify({ error: 'Route Not Found' }))
        }

    } catch (error) {
        console.error('Handler error:', error)
        sendResponse(res, 500, 'application/json', JSON.stringify({ error: 'Internal Server Error' }))
    }
}