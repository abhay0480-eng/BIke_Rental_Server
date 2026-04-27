import http from 'node:http'
import { handleGet } from './handlers/routeHandlers.js'
import { sendResponse } from './utils/sendResponse.js'

const PORT = 8000

const server = http.createServer(async (req, res) => {
        if (req.method === "GET") {
            await handleGet(req, res)
        } else {
            sendResponse(res, 405, 'application/json', JSON.stringify({ error: 'Method Not Allowed' }))
        }
})


server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))