import { Schema } from "mongoose";

const Product_ChangesSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "types" },
    name: { type: String },
    price: { type: Number },
    date: { type: String },
  },
  {
    collection: "product_changes",
    timestamps: true, // this will automatically add the createdAt and the updatedAt field
  }
);
export default Product_ChangesSchema;
