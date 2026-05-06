

export const parseJSONbody = async (req) => {
    let body = ""

    for await (const chunk of req) {
        body += chunk
    }

    try {
        const parsedData = JSON.parse(body)
        return parsedData
    } catch (error) {
        throw new Error(error)
    }


}