/* -------------------------------------------------------------------------- */
/*                                   COPILOT                                  */
/* -------------------------------------------------------------------------- */
// class CustomError extends Error {
//     constructor(message, statusCode) {
//         super(message);
//         this.statusCode = statusCode;

//         // Capture the stack trace
//         Error.captureStackTrace(this, this.constructor);
//     }
// }

// module.exports = CustomError; 
/* -------------------------------------------------------------------------- */

class CustomError extends Error{
    name = 'CustomError'

    constructor(message, statusCode = 500) {
        super(message)
        this.statusCode = statusCode
    }
};

module.exports = CustomError;