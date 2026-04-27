import { getData } from "../utils/getData"
import { sendResponse } from "../utils/sendResponse"


export const handleGet = async (req, res) => {
    try {
        const parsedData = await getData()
        const content = JSON.stringify(parsedData)
        sendResponse(res, 200, 'application/json', content)
    } catch (error) {
        throw new Error(error)
    }
}