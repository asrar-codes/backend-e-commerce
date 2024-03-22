import cors from "cors";
import express from "express";
import "dotenv/config";

import { errorHandlerMiddleware } from "./middlewares/errorHandler.js";
import { connectToDB } from "./utils/connect.js";
import { ApiError } from "./Errors/customErrorClass.js";
import { notFound } from "./middlewares/not-found.js";
import router from "./routes/user.route.js";

const app = express();
const port = process.env.PORT || 8090;
app.use(cors());

app.use("/api/v1", router);

// error handler middleware
app.use(errorHandlerMiddleware);
app.use(notFound);

// connect to db

const start = async () => {
  try {
    await connectToDB(process.env.MONGODB_URI);
    console.log("connected to db successfully");
    app.listen(port, () => {
      console.log(`server is listening on port: ${port}`);
    });
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};
start();

export { app };
