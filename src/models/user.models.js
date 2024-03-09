import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    totalPrice: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);
const Order = mongoose.model("Order", orderSchema);

const userSchema = new Schema(
  {
    username: {
      type: String,
      lowercase: true,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      required: [true, "please provide a valid email !"],
    },
    password: {
      type: String,
      required: [true, "please provide a valid password !"],
    },
    fullname: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    avatar: {
      type: String,
    },
    cartItems: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    orderedItems: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
