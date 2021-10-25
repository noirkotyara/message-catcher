const RESPONSE_CODE = require("responseCodes")

const response = (responseCode, data, res, status) => {
    let dataToSent = {
        timestamp: Date.now(),
        status,
    };
    switch (responseCode) {
        case RESPONSE_CODE.DB_ERROR: {
            const message = data.errors.map((err) => err.message).join("/n");
            dataToSent = {
                ...dataToSent,
                message,
                errorCode: RESPONSE_CODE.DB_ERROR,
                data: null,
            };
            return res.status(status).json(dataToSent);
        }
        case RESPONSE_CODE.PROCESS_ERROR: {
            dataToSent = {
                ...dataToSent,
                message: data,
                errorCode: RESPONSE_CODE.PROCESS_ERROR,
                data: null,
            };
            break;
        }
        case RESPONSE_CODE.BASIC_SUCCESS: {
            dataToSent = {
                ...dataToSent,
                message: data,
                errorCode: null,
                data: null,
            };
            break;
        }
        case RESPONSE_CODE.SUCCESS: {
            dataToSent = {
                ...dataToSent,
                message: data.message,
                errorCode: null,
                data: data.data,
            };
            break;
        }
        case RESPONSE_CODE.REQ_VALID_ERROR: {
            const message = data.details.body
                .map((bodyData) => bodyData.message)
                .join("/n");
            dataToSent = {
                ...dataToSent,
                message,
                errorCode: RESPONSE_CODE.REQ_VALID_ERROR,
                data: null,
            };
            break;
        }
        default: {
            dataToSent = {
                timestamp: Date.now(),
                message: "Unknown error",
                status: 520,
                errorCode: RESPONSE_CODE.UNKNOWN_ERROR,
                data: null,
            };
            return res.status(520).json(dataToSent);
        }
    }
    return res.status(status).json(dataToSent);
};

module.exports = { response, RESPONSE_CODE };
