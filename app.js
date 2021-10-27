const expressValidation = require("express-validation");

const RESPONSE_CODES = require("./responseCodes")

function responseMiddleware(error, req, res, next) {
    try {
        let dataToSent = {
            timestamp: Date.now(),
            status: error.status,
        };

        if (error instanceof expressValidation.ValidationError) {
            var createdMessage = error.details.body
                .map(function (bodyData) {
                    return bodyData.message;
                })
                .join("/n");

            Object.assign(dataToSent, {
                status: 400,
                statusCode: RESPONSE_CODES.REQ_VALID_ERROR,
                message: createdMessage,
                data: null,
            });
        }

        switch (error.responseCode) {
            case RESPONSE_CODES.PROCESS_ERROR: {
                Object.assign(dataToSent, {
                    message: error.data,
                    errorCode: RESPONSE_CODES.PROCESS_ERROR,
                    data: null,
                });
                break;
            }
            case RESPONSE_CODES.BASIC_SUCCESS: {
                Object.assign(dataToSent, {
                    message: error.data,
                    errorCode: null,
                    data: null,
                });
                break;
            }
            case RESPONSE_CODES.SUCCESS: {
                Object.assign(dataToSent, {
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
    }
}
module.exports = { sendResponse: responseMiddleware, RESPONSE_CODES };
