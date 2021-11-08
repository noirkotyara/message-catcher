function getErrorMessageForSequelize(errorData) {
    var errorMessage = 'no message provided'

    if(_hasArrayErrors(errorData)){
        errorMessage = errorData.errors.map((err) => err.message).join("/n")
    }
    if(_hasObjectParent(errorData)){
        errorMessage += "/n" + errorData.parent.sqlMessage
    }
    return errorMessage
}

function _hasArrayErrors(errorData) {
    return Object.prototype.toString.call(errorData.errors) === "[object Array]";
}

function _hasObjectParent(errorData) {
    return Object.prototype.toString.call(errorData.parent) === "[object Object]";
}

module.exports = {
    getErrorMessageForSequelize: getErrorMessageForSequelize
}