class ApiError extends Error {
  constructor(statusCode, message) {
    this.statusCode = statusCode;
    super(message);
  }
}

export { ApiError };
