import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String },
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "types",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
    },
    product_changes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product_changes",
      },
    ],
    barcode: { type: String, unique: true },
  },
  {
    timestamps: true, // this will automatically add the createdAt and the updatedAt field
  }
);
export default ProductSchema;
