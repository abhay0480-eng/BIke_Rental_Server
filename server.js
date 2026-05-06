import http from 'node:http'
import { handleGet } from './handlers/routeHandlers.js'
import { createUserProfile } from './handlers/userHandlers.js'
import { sendResponse } from './utils/sendResponse.js'
import { initializeFirebaseAdmin } from './config/firebase.js'
import { authMiddleware } from './middleware/authMiddleware.js'

const PORT = 8000

const ALLOWED_ORIGINS = [
    'http://localhost:5173',                              // Local Vite dev server
    'http://localhost:5174',                              // Backup port
    'https://bike-rental-app-nine.vercel.app',            // ✅ FIXED: Removed trailing slash
];

const setCORSHeaders = (res, origin) => {
    // Check if origin is allowed
    if (ALLOWED_ORIGINS.includes(origin) || !origin) {
        res.setHeader('Access-Control-Allow-Origin', origin || '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
    }
};

const handlePreflight = (res, origin) => {
    setCORSHeaders(res, origin);
    res.writeHead(204); // No Content
    res.end();
};

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
    return url.startsWith('/api/host') || url === '/api/users'
}

const server = http.createServer(async (req, res) => {
    const origin = req.headers.origin;

    // Set CORS headers for all requests
    setCORSHeaders(res, origin);

    // Handle OPTIONS preflight requests
    if (req.method === 'OPTIONS') {
        return handlePreflight(res, origin);
    }

    // ✅ REMOVED: await handleRequest(req, res); — this line was wrong!

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
        if (req.method === "POST" && req.url === '/api/users') {
            await createUserProfile(req, res)
        } else if (req.method === "GET") {
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
            console.log(`🔒 Protected routes: /api/host/*, /api/users`)
        })
    } catch (error) {
        console.error('❌ Failed to start server:', error.message)
        process.exit(1)
    }
}

// Start the server
startServer()