import mongoose from "mongoose";
export interface IProductChangeModel extends mongoose.Document {
    id_product_change: number;
    id_product: {
        type: mongoose.Schema.Types.ObjectId;
        ref: "products";
    };

    price: number;
    date: Date;
}
const schema = new mongoose.Schema(

    {
        id_product_change: { type: Number, unique: true },
        id_product: Number,

        name: String,
        price: Number,
        date: Date,
    },
    {
        collection: "product_changes",
        timestamps: true // this will automatically add the createdAt and the updatedAt field
    }
);
export const ProductChange = mongoose.model<IProductChangeModel>("ProductChange", schema);
