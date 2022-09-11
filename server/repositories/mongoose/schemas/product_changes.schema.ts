import { Schema } from "mongoose";

 const Product_ChangesSchema = new Schema(

    {
        id_product: { type: Number },
        name: { type: String },
        price: { type: Number },
        date: { type: Date },

    },
    {
        collection: "product_changes",
        timestamps: true // this will automatically add the createdAt and the updatedAt field
    }
);
export default Product_ChangesSchema;