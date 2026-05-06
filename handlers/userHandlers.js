import { parseJSONbody } from "../utils/parseJSONbody.js"
import { sendResponse } from "../utils/sendResponse.js"
import { getDb } from '../config/firebase.js'
import admin from 'firebase-admin'


export const createUserProfile = async (req, res) => {

    try {
        const userData = await parseJSONbody(req)

        const { fullName, role, city, phone } = userData

        if (!fullName || !role || !phone) {
            return sendResponse(res, 400, 'application/json', JSON.stringify({
                error: 'Missing required fields: role, fullName, phone number'
            }))
        }

        if (!['host', 'renter'].includes(role)) {
            return sendResponse(res, 400, 'application/json', JSON.stringify({
                error: 'Invalid Role. Must be host or renter'
            }))
        }

        if (role === "host" && !city) {
            return sendResponse(res, 400, 'application/json', JSON.stringify({
                error: "City is required for host"
            }))
        }

        const uid = req.user.uid
        const db = getDb()
        await db.collection('users').doc(uid).set({
            email: req.user.email,
            role,
            fullName,
            phone,
            city: city || null,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        })

        sendResponse(res, 201, 'application/json',
            JSON.stringify({
                success: true,
                user: {
                    uid,
                    email: req.user.email,
                    role,
                    fullName
                }
            }))

    } catch (error) {
        console.error('Create user profile error:', error)

        if (error.message === 'Invalid JSON in request body') {
            return sendResponse(res, 400, 'application/json',
                JSON.stringify({ error: 'Invalid JSON in request body' }))
        }

        sendResponse(res, 500, 'application/json',
            JSON.stringify({ error: 'Failed to create user profile' }))
    }
}

