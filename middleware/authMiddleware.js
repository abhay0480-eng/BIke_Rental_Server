import { verifyToken } from '../config/firebase.js'
/**
 * Auth Middleware
 * Verifies Firebase ID token and attaches user info to request
 * 
 * How it works:
 * 1. Extracts token from Authorization header
 * 2. Verifies token with Firebase
 * 3. Attaches decoded user info to req.user
 * 4. Calls next() to continue to route handler
 * 5. If token invalid, returns 401 Unauthorized
 */
export const authMiddleware = async (req, res, next) => {
    try {
        // Step 1: Get Authorization header
        const authHeader = req.headers.authorization

        if (!authHeader) {
            return res.writeHead(401, { 'Content-Type': 'application/json' })
                .end(JSON.stringify({ error: 'No authorization token provided' }))
        }

        // Step 2: Extract token from "Bearer <token>" format
        if (!authHeader.startsWith('Bearer ')) {
            return res.writeHead(401, { 'Content-Type': 'application/json' })
                .end(JSON.stringify({ error: 'Invalid authorization format. Use: Bearer <token>' }))
        }

        const token = authHeader.split('Bearer ')[1]

        if (!token) {
            return res.writeHead(401, { 'Content-Type': 'application/json' })
                .end(JSON.stringify({ error: 'Token not found' }))
        }

        // Step 3: Verify token with Firebase
        const decodedToken = await verifyToken(token)

        // Step 4: Attach user info to request object
        // Now route handlers can access req.user.uid, req.user.email, etc.
        req.user = {
            uid: decodedToken.uid,
            email: decodedToken.email,
            emailVerified: decodedToken.email_verified
        }

        // Step 5: Continue to route handler
        next()

    } catch (error) {
        // Token verification failed
        console.error('Auth middleware error:', error.message)

        return res.writeHead(401, { 'Content-Type': 'application/json' })
            .end(JSON.stringify({ error: 'Invalid or expired token' }))
    }
}