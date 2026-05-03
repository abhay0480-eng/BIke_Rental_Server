import http from 'node:http'
import { handleGet } from './handlers/routeHandlers.js'
import { sendResponse } from './utils/sendResponse.js'
import { initializeFirebaseAdmin } from './config/firebase.js'
import { authMiddleware } from './middleware/authMiddleware.js'

const PORT = 8000

const applyMiddleware = (middleware, req, res) => {
    return new Promise((resolve, reject) => {
        middleware(req, res, (error) => {
            if (error) {
                reject(error)
            } else {
                resolve()
            }
        })
    })
}

const isProtectedRoute = (url) => {
    return url.startsWith('/api/host')
}

const server = http.createServer(async (req, res) => {
    try {
        // Check if route requires authentication
        if (isProtectedRoute(req.url)) {
            // Apply auth middleware for protected routes
            try {
                await applyMiddleware(authMiddleware, req, res)
                // If middleware succeeds, req.user is now available
            } catch (error) {
                // Middleware already sent error response
                return
            }
        }

    // Handle the request
        if (req.method === "GET") {
            await handleGet(req, res)
        } else {
            sendResponse(res, 405, 'application/json', JSON.stringify({ error: 'Method Not Allowed' }))
        }
    } catch (error) {
        console.error('Server error:', error)
        sendResponse(res, 500, 'application/json', JSON.stringify({ error: 'Internal Server Error' }))
    }
})


const startServer = async () => {
    try {
        // Initialize Firebase Admin SDK
        await initializeFirebaseAdmin()

        // Start the HTTP server
        server.listen(PORT, () => {
            console.log(`🚀 Server is running on PORT ${PORT}`)
            console.log(`🔒 Protected routes: /api/host/*`)
        })
    } catch (error) {
        console.error('❌ Failed to start server:', error.message)
        process.exit(1)
    }
}

// Start the server
startServer()