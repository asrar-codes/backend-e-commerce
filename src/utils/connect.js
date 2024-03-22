import mongoose from "mongoose";
import { ApiError } from "../Errors/customErrorClass.js";

export const connectToDB = async (url) => {
  try {
    await mongoose.connect(url);
  } catch (error) {
    throw new ApiError(500, error.message);
  }
};
