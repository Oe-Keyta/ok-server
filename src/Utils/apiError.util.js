class ApiError extends Error {
    constructor(
        statusCode,
        message = "-->E: Somthing went wrong !! , @apiError",
        errors = [],
        stack = ""
    ) {
        // overriding our own error way.
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.message = message;
        this.success = false;
        this.errors = errors;

        // to stack of error resulting files.
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}


export default ApiError;
