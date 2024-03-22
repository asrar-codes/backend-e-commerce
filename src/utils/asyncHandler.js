import { ApiError } from "../Errors/customErrorClass.js";

const asyncHandler = (fn) => {
  return async (req, res, next) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      throw new ApiError(500, error.message);
    }
  };
};

export { asyncHandler };
