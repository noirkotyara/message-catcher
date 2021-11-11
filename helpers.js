function getErrorMessageForSequelize(errorData) {
  if (_hasArrayErrors(errorData)) {
    return errorData.errors.map((err) => err.message).join("/n");
  }
  if (_hasObjectParent(errorData)) {
    return errorData.parent.sqlMessage;
  }

  return JSON.stringify(errorData);
}

function _hasArrayErrors(errorData) {
  return Object.prototype.toString.call(errorData.errors) === "[object Array]";
}

function _hasObjectParent(errorData) {
  return Object.prototype.toString.call(errorData.parent) === "[object Error]";
}

function isAxiosError(error) {
  return error.isAxiosError;
}

module.exports = {
  getErrorMessageForSequelize: getErrorMessageForSequelize,
  isAxiosError: isAxiosError,
};
