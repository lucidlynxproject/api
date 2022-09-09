import mongoose from "mongoose";


export interface IProductModel extends mongoose.Document {
  id_product: number;
  name: string;
  section: string;
  category:string;
  price:number;
  product_changes: [string];
  barcode:string;
}

const schema = new mongoose.Schema(
  {
    id_product: { type: Number, unique: true },
    name: String,
    price: String,
    supermarket:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "supermarkets"
    },
    section:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "types"
    },
    category:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories"
    },
    product_changes:[{
      type: mongoose.Schema.Types.ObjectId,
      ref: "product_changes"
    }],
    barcode: String,
  },
  {
    collection: "products",
  }
);
export const Product = mongoose.model<IProductModel>("Product", schema);
