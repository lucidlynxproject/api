import mongoose from "mongoose";
import sequence from "mongoose-sequence";

const AutoIncrement = sequence(mongoose);

export interface IProductModel extends mongoose.Document {
  id_product: number;
  name: string;
  category:string;
  price:number;
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
    type:{
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

schema.plugin(AutoIncrement, { inc_field: "id_product", });

export const Product = mongoose.model<IProductModel>("Product", schema);
