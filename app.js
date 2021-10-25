const RESPONSE_CODES = require("./responseCodes")

const response = (responseCode, data, res, status) => {
    let dataToSent = {
        timestamp: Date.now(),
        status,
    };
    switch (responseCode) {
        case RESPONSE_CODES.DB_ERROR: {
            const message = data.errors.map((err) => err.message).join("/n");
            dataToSent = {
                ...dataToSent,
                message,
                errorCode: RESPONSE_CODES.DB_ERROR,
                data: null,
            };
            return res.status(status).json(dataToSent);
        }
        case RESPONSE_CODES.PROCESS_ERROR: {
            dataToSent = {
                ...dataToSent,
                message: data,
                errorCode: RESPONSE_CODES.PROCESS_ERROR,
                data: null,
            };
            break;
        }
        case RESPONSE_CODES.BASIC_SUCCESS: {
            dataToSent = {
                ...dataToSent,
                message: data,
                errorCode: null,
                data: null,
            };
            break;
        }
        case RESPONSE_CODES.SUCCESS: {
            dataToSent = {
                ...dataToSent,
                message: data.message,
                errorCode: null,
                data: data.data,
            };
            break;
        }
        case RESPONSE_CODES.REQ_VALID_ERROR: {
            const message = data.details.body
                .map((bodyData) => bodyData.message)
                .join("/n");
            dataToSent = {
                ...dataToSent,
                message,
                errorCode: RESPONSE_CODES.REQ_VALID_ERROR,
                data: null,
            };
            break;
        }
        default: {
            dataToSent = {
                timestamp: Date.now(),
                message: "Unknown error",
                status: 520,
                errorCode: RESPONSE_CODES.UNKNOWN_ERROR,
                data: null,
            };
            return res.status(520).json(dataToSent);
        }
    }
    return res.status(status).json(dataToSent);
};

module.exports = { sendResponse: response, RESPONSE_CODES };
