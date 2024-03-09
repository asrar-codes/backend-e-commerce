import mongoose, { Schema } from "mongoose";

const reviewSchema = new Schema({
  productId: {
    type: Schema.Types.ObjectId,
    ref: "Product",
  },
  noOfStars: {
    type: Number,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});
const Review = mongoose.model("Review", reviewSchema);

const productSchema = new Schema(
  {
    videoFile: {
      type: String, // cloudinary url
    },
    images: [
      {
        type: String, // cloudinary url
        required: true,
      },
    ],
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    itemCount: {
      type: Number,
      required: true,
    },
    noOfOrders: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
    },
    review: [
      {
        type: Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
