var expressValidation = require("express-validation");

var RESPONSE_CODE = require("./responseCodes");

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
                statusCode: RESPONSE_CODE.REQ_VALID_ERROR,
                status: 400,
                message: createdMessage,
                data: null,
            });
        }

        switch (error.responseCode) {
            case RESPONSE_CODE.P_ERROR__FORBIDDEN: {
                Object.assign(dataToSent, {
                    errorCode: RESPONSE_CODE.P_ERROR__FORBIDDEN,
                    status: 403,
                    message: error.data,
                    data: null,
                });
                break;
            }
            case RESPONSE_CODE.P_ERROR__NOT_FOUND: {
                Object.assign(dataToSent, {
                    errorCode: RESPONSE_CODE.P_ERROR__NOT_FOUND,
                    status: 404,
                    message: error.data,
                    data: null,
                });
                break;
            }
            case RESPONSE_CODE.P_ERROR__UNAUTHORIZED: {
                Object.assign(dataToSent, {
                    errorCode: RESPONSE_CODE.P_ERROR__UNAUTHORIZED,
                    status: 401,
                    message: error.data,
                    data: null,
                });
                break;
            }
            case RESPONSE_CODE.S_ERROR_INTERNAL: {
                Object.assign(dataToSent, {
                    errorCode: RESPONSE_CODE.S_ERROR_INTERNAL,
                    status: 500,
                    message: error.data,
                    data: null,
                });
                break;
            }
            case RESPONSE_CODE.BASIC_SUCCESS: {
                Object.assign(dataToSent, {
                    status: 200,
                    message: error.data,
                    errorCode: null,
                    data: null,
                });
                break;
            }
            case RESPONSE_CODE.BASIC_SUCCESS__CREATED: {
                Object.assign(dataToSent, {
                    status: 201,
                    message: error.data,
                    errorCode: null,
                    data: null,
                });
                break;
            }
            case RESPONSE_CODE.SUCCESS: {
                Object.assign(dataToSent, {
                    status: 200,
                    message: error.data.message,
                    errorCode: null,
                    data: error.data.data,
                });
                break;
            }
            case RESPONSE_CODE.SUCCESS__CREATED: {
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
};
