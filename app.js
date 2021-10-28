var expressValidation = require("express-validation");

var RESPONSE_CODES = require("./responseCodes");

function responseHandler(error, req, res, next) {
    try {
        var dataToSent = {
            timestamp: Date.now(),
            status: 503,
        };

        if (error instanceof expressValidation.ValidationError) {
            var createdMessage = error.details.body
                .map(function (bodyData) {
                    return bodyData.message;
                })
                .join("/n");

            Object.assign(dataToSent, {
                statusCode: RESPONSE_CODES.REQ_VALID_ERROR,
                status: 400,
                message: createdMessage,
                data: null,
            });
        }

        switch (error.responseCode) {
            case RESPONSE_CODES.P_ERROR__FORBIDDEN: {
                Object.assign(dataToSent, {
                    errorCode: RESPONSE_CODES.P_ERROR__FORBIDDEN,
                    status: 403,
                    message: error.data,
                    data: null,
                });
                break;
            }
            case RESPONSE_CODES.P_ERROR__NOT_FOUND: {
                Object.assign(dataToSent, {
                    errorCode: RESPONSE_CODES.P_ERROR__NOT_FOUND,
                    status: 404,
                    message: error.data,
                    data: null,
                });
                break;
            }
            case RESPONSE_CODES.P_ERROR__UNAUTHORIZED: {
                Object.assign(dataToSent, {
                    errorCode: RESPONSE_CODES.P_ERROR__UNAUTHORIZED,
                    status: 401,
                    message: error.data,
                    data: null,
                });
                break;
            }
            case RESPONSE_CODES.S_ERROR_INTERNAL: {
                Object.assign(dataToSent, {
                    errorCode: RESPONSE_CODES.S_ERROR_INTERNAL,
                    status: 500,
                    message: error.data,
                    data: null,
                });
                break;
            }
            case RESPONSE_CODES.DB_ERROR: {
                const message = error.data.errors.map((err) => err.message).join("/n");
                Object.assign(dataToSent, {
                    message: message,
                    errorCode: RESPONSE_CODES.DB_ERROR,
                    status: 400,
                    data: null,
                });
                break;
            }
            case RESPONSE_CODES.BASIC_SUCCESS: {
                Object.assign(dataToSent, {
                    status: 200,
                    message: error.data,
                    errorCode: null,
                    data: null,
                });
                break;
            }
            case RESPONSE_CODES.BASIC_SUCCESS__CREATED: {
                Object.assign(dataToSent, {
                    status: 201,
                    message: error.data,
                    errorCode: null,
                    data: null,
                });
                break;
            }
            case RESPONSE_CODES.SUCCESS: {
                Object.assign(dataToSent, {
                    status: 200,
                    message: error.data.message,
                    errorCode: null,
                    data: error.data.data,
                });
                break;
            }
            case RESPONSE_CODES.SUCCESS__CREATED: {
                Object.assign(dataToSent, {
                    status: 201,
                    message: error.data.message,
                    errorCode: null,
                    data: error.data.data,
                });
                break;
            }
        }
        return res.status(dataToSent.status).json(dataToSent);
    } catch (e) {
        console.log("RESPONSE_HANDLER_CATCH", e);
        res.status(500).json(e.message);
    }
}

module.exports = {
    sendResponse: responseHandler,
    RESPONSE_CODES: RESPONSE_CODES
};
