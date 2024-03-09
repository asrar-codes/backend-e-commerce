import cors from "cors";
import express from "express";
import { errorHandlerMiddleware } from "./middlewares/errorHandler";

const app = express();

app.use(cors());

// error handler middleware

app.use(errorHandlerMiddleware);
