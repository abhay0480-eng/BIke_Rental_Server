

export const getDataByQueryParams = (queryObj, content) => {
    const { type, price } = queryObj

    if (type) {
        content = content.filter(bike =>
            bike.type.toLowerCase() === type.toLowerCase()
        )
    }

    if (price) {
        content = content.filter(destination =>
            destination.price === Number(price)
        )
    }


    return content
}