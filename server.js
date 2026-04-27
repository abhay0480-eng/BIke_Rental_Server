import http from 'node:http'
import { handleGet } from './handlers/routeHandlers'

const PORT = 8000

const server = http.createServer(async (req, res) => {
    if (req.url === '/api') {
        if (req.method === "GET") {
            await handleGet(req, res)
        }
    }
})


server.listen(PORT, () => console.log(`Server is running on PORT ${PORT}`))