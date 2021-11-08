const expressValidation = require("express-validation");

const RESPONSE_CODES = require("./responseCodes");

function responseHandler(error, req, res, next) {
  try {
    let dataToSent = {
      timestamp: Date.now(),
      status: 503,
    };

    if (error instanceof expressValidation.ValidationError) {
      const createdMessage = error.details.body
        .map((bodyData) => bodyData.message)
        .join("/n");

      dataToSent = {
        ...dataToSent,
        statusCode: RESPONSE_CODES.REQ_VALID_ERROR,
        status: 400,
        message: createdMessage,
        data: null,
      };
    }

    switch (error.responseCode) {
      case RESPONSE_CODES.P_ERROR__FORBIDDEN: {
        dataToSent = {
          ...dataToSent,
          errorCode: RESPONSE_CODES.P_ERROR__FORBIDDEN,
          status: 403,
          message: error.data,
          data: null,
        };
        break;
      }
      case RESPONSE_CODES.P_ERROR__NOT_FOUND: {
        dataToSent = {
          ...dataToSent,
          errorCode: RESPONSE_CODES.P_ERROR__NOT_FOUND,
          status: 404,
          message: error.data,
          data: null,
        };
        break;
      }
      case RESPONSE_CODES.P_ERROR__UNAUTHORIZED: {
        dataToSent = {
          ...dataToSent,
          errorCode: RESPONSE_CODES.P_ERROR__UNAUTHORIZED,
          status: 401,
          message: error.data,
          data: null,
        };
        break;
      }
      case RESPONSE_CODES.S_ERROR_INTERNAL: {
        dataToSent = {
          ...dataToSent,
          errorCode: RESPONSE_CODES.S_ERROR_INTERNAL,
          status: 500,
          message: error.data,
          data: null,
        };
        break;
      }
      case RESPONSE_CODES.DB_ERROR_SEQUELIZE: {
        const errorMessage = error.data;
        dataToSent = {
          ...dataToSent,
          message: errorMessage,
          errorCode: RESPONSE_CODES.DB_ERROR_SEQUELIZE,
          status: 400,
          data: null,
        };
        break;
      }
      case RESPONSE_CODES.DB_ERROR_MYSQL: {
        dataToSent = {
          ...dataToSent,
          message: error.data.sqlMessage,
          errorCode: RESPONSE_CODES.DB_ERROR_MYSQL,
          status: 400,
          data: null,
        };
        break;
      }
      case RESPONSE_CODES.BASIC_SUCCESS: {
        dataToSent = {
          ...dataToSent,
          status: 200,
          message: error.data,
          errorCode: null,
          data: null,
        };
        break;
      }
      case RESPONSE_CODES.BASIC_SUCCESS__CREATED: {
        dataToSent = {
          ...dataToSent,
          status: 201,
          message: error.data,
          errorCode: null,
          data: null,
        };
        break;
      }
      case RESPONSE_CODES.SUCCESS: {
        dataToSent = {
          ...dataToSent,
          status: 200,
          message: error.data.message,
          errorCode: null,
          data: error.data.data,
        };
        break;
      }
      case RESPONSE_CODES.SUCCESS__CREATED: {
        dataToSent = {
          ...dataToSent,
          status: 201,
          message: error.data.message,
          errorCode: null,
          data: error.data.data,
        };
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
  RESPONSE_CODES: RESPONSE_CODES,
};
