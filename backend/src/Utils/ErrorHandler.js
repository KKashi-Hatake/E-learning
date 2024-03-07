class ErrorHandler extends Error {
  constructor(statusCode = 500, message = "Internal servre error") {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default ErrorHandler;
