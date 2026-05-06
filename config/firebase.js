import admin from 'firebase-admin'
import { readFile } from 'node:fs/promises'

/**
 * Initialize Firebase Admin SDK
 * Supports both local development (file) and production (env variable)
 */

let firebaseApp = null

export const initializeFirebaseAdmin = async () => {
    if (firebaseApp) {
        return firebaseApp // Already initialized
    }

    try {
        let serviceAccount

        // Check if running in production (Render/Vercel) with env variable
        if (process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
            console.log('📦 Using Firebase service account from environment variable')

            // Decode base64 string to JSON
            const base64String = process.env.FIREBASE_SERVICE_ACCOUNT_BASE64
            const jsonString = Buffer.from(base64String, 'base64').toString('utf-8')
            serviceAccount = JSON.parse(jsonString)
        }
        // Local development - read from file
        else {
            console.log('📁 Using Firebase service account from local file')

            const path = await import('node:path')

            const serviceAccountPath = path.join(process.cwd(), 'serviceAccountKey.json')
            const serviceAccountData = await readFile(serviceAccountPath, 'utf-8')
            serviceAccount = JSON.parse(serviceAccountData)
        }

        // Initialize Firebase Admin
        firebaseApp = admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        })

        console.log('✅ Firebase Admin initialized successfully')

        // ✅ Initialize Firestore AFTER Firebase Admin
        if (!global.firestoreDb) {
            global.firestoreDb = admin.firestore()
            console.log('✅ Firestore initialized successfully')
        }

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

/**
 * Get Firestore instance
 * Must be called AFTER initializeFirebaseAdmin()
 */
export const getDb = () => {
    if (!global.firestoreDb) {
        throw new Error('Firestore not initialized. Call initializeFirebaseAdmin() first.')
    }
    return global.firestoreDb
}