


export const getDataByPathParams = (req, parsedData, filtername) => {
    const bikeType = req.url.split('/').pop()

    const filteredData = parsedData.filter((bike) => {

        if (typeof (bike[filtername]) === 'number') {
            return bike[filtername] === parseInt(bikeType)
        } else {
            return bike[filtername] === bikeType
        }
    })
    const content = JSON.stringify(filteredData)
    return content
}