import { ApiError } from "../Errors/customErrorClass.js";

const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  console.log("middlewareErrorNotcustom", err);
  return res.status(500).json({ msg: "custom errors handling...!" });
};

export { errorHandlerMiddleware };
