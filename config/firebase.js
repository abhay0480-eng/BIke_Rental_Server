import admin from 'firebase-admin'
import { readFile } from 'node:fs/promises'
import path from 'node:path'

/**
 * Initialize Firebase Admin SDK
 * This allows the backend to verify Firebase auth tokens
 */

let firebaseApp = null

export const initializeFirebaseAdmin = async () => {
    if (firebaseApp) {
        return firebaseApp // Already initialized
    }

    try {
        // Read service account key file
        const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json')
        const serviceAccountData = await readFile(serviceAccountPath, 'utf-8')
        const serviceAccount = JSON.parse(serviceAccountData)

        // Initialize Firebase Admin
        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        })

        console.log('✅ Firebase Admin initialized successfully')
        return firebaseApp
    } catch (error) {
        console.error('❌ Failed to initialize Firebase Admin:', error.message)
        throw error
    }
}

/**
 * Verify a Firebase ID token
 * @param {string} idToken - The Firebase ID token from the frontend
 * @returns {Promise<Object>} - Decoded token with user info (uid, email, etc.)
 */
export const verifyToken = async (idToken) => {
    try {
        const decodedToken = await admin.auth().verifyIdToken(idToken)
        return decodedToken
    } catch (error) {
        console.error('❌ Token verification failed:', error.message)
        throw new Error('Invalid or expired token')
    }
}