import mongoose, { Schema } from "mongoose";

const sellerSchema = new Schema(
  {
    storename: {
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

    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export const Seller = mongoose.model("Seller", sellerSchema);
