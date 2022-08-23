import mongoose from "mongoose";
import sequence from "mongoose-sequence";

const AutoIncrement = sequence(mongoose);

export interface IProductModel extends mongoose.Document {
  id_product: number;
  name: string;
  category:string;
  price:number;
}

const schema = new mongoose.Schema(
  {
    id_product: { type: Number, unique: true },
    name: String,
    category: String,
    price: String,
  },
  {
    collection: "products",
  }
);

schema.plugin(AutoIncrement, { inc_field: "id_product", });

export const Product = mongoose.model<IProductModel>("Product", schema);
