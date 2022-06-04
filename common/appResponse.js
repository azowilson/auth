class AppResponse {

    builder(responseCode, message, data) {
        return {
            status: {
                message,
                code: responseCode,
            },
            data
        }
    }

}

module.exports = new AppResponse;