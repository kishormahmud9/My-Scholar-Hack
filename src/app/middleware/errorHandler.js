import DevBuildError from "../lib/DevBuildError.js";

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Handle Axios Errors
    if (err.isAxiosError) {
        statusCode = err.response?.status || 502; // Bad Gateway if no response
        message = err.response?.data?.message || err.message || 'Error from external service';
    }

    // Handle AggregateError (often from Axios connection issues)
    if (err.name === 'AggregateError') {
        statusCode = 502;
        message = 'External service connection failed';
    }

    console.error("🔥 Error caught by middleware:", {
        message,
        name: err.name,
        statusCode,
        stack: err.stack,
    });

    res.status(statusCode).json({
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && {
            stack: err.stack,
            details: err.response?.data
        })
    });
}
export default errorHandler
