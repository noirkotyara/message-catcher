const RESPONSE_CODES = require("./response-codes");

const expressValidation = require("express-validation");

const { getErrorMessageForSequelize, isAxiosError } = require("./helpers");

const responseHandler = (formedResponse, req, res, next) => {
  try {
    let responseToSent = {
      timestamp: Date.now(),
      errorCode: RESPONSE_CODES.UNKNOWN_ERROR,
      status: 503,
      message: "no-massage-provided",
      data: null,
    };

    if (formedResponse instanceof expressValidation.ValidationError) {
      const createdMessage = formedResponse.details.body
        .map((bodyData) => bodyData.message)
        .join("/n");

      responseToSent = {
        ...responseToSent,
        errorCode: RESPONSE_CODES.REQ_VALID_ERROR,
        status: 400,
        message: createdMessage,
      };
    }

    if (isAxiosError(error)) {
      responseToSent = error.response.data;
      return res.status(responseToSent.status).json(responseToSent);
    }

    switch (formedResponse.responseCode) {
      case RESPONSE_CODES.P_ERROR__FORBIDDEN: {
        responseToSent = {
          ...responseToSent,
          errorCode: RESPONSE_CODES.P_ERROR__FORBIDDEN,
          status: 403,
          message: formedResponse.message,
        };
        break;
      }
      case RESPONSE_CODES.P_ERROR__NOT_FOUND: {
        responseToSent = {
          ...responseToSent,
          errorCode: RESPONSE_CODES.P_ERROR__NOT_FOUND,
          status: 404,
          message: formedResponse.message,
        };
        break;
      }
      case RESPONSE_CODES.P_ERROR__UNAUTHORIZED: {
        responseToSent = {
          ...responseToSent,
          errorCode: RESPONSE_CODES.P_ERROR__UNAUTHORIZED,
          status: 401,
          message: formedResponse.message,
        };
        break;
      }
      case RESPONSE_CODES.S_ERROR_INTERNAL: {
        responseToSent = {
          ...responseToSent,
          errorCode: RESPONSE_CODES.S_ERROR_INTERNAL,
          status: 500,
          message: formedResponse.message,
        };
        break;
      }
      case RESPONSE_CODES.DB_ERROR_SEQUELIZE: {
        const createdMessage = getErrorMessageForSequelize(
          formedResponse.message
        );
        responseToSent = {
          ...responseToSent,
          status: 400,
          errorCode: RESPONSE_CODES.DB_ERROR_SEQUELIZE,
          message: createdMessage,
        };
        break;
      }
      case RESPONSE_CODES.DB_ERROR_MYSQL: {
        responseToSent = {
          ...responseToSent,
          message: formedResponse.dbData.sqlMessage,
          errorCode: RESPONSE_CODES.DB_ERROR_MYSQL,
          status: 400,
          data: null,
        };
        break;
      }
      case RESPONSE_CODES.BASIC_SUCCESS: {
        responseToSent = {
          ...responseToSent,
          status: 200,
          message: formedResponse.message,
          errorCode: null,
        };
        break;
      }
      case RESPONSE_CODES.BASIC_SUCCESS__CREATED: {
        responseToSent = {
          ...responseToSent,
          status: 201,
          message: formedResponse.message,
          errorCode: null,
          data: null,
        };
        break;
      }
      case RESPONSE_CODES.SUCCESS: {
        responseToSent = {
          ...responseToSent,
          status: 200,
          message: formedResponse.data.message,
          errorCode: null,
          data: formedResponse.data.data,
        };
        break;
      }
      case RESPONSE_CODES.SUCCESS__CREATED: {
        responseToSent = {
          ...responseToSent,
          status: 201,
          message: formedResponse.data.message,
          errorCode: null,
          data: formedResponse.data.data,
        };
        break;
      }
    }
    return res.status(responseToSent.status).json(responseToSent);
  } catch (e) {
    console.log("RESPONSE_HANDLER_CATCH", e);
    res.status(500).json(JSON.stringify(e));
  }
};

module.exports = {
  sendResponse: responseHandler,
  RESPONSE_CODES: RESPONSE_CODES,
};
