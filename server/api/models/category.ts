import mongoose from "mongoose";
import sequence from "mongoose-sequence";
export interface ICategoryModel extends mongoose.Document {
    id_category: number;
    name: string;
}
const schema = new mongoose.Schema(
    {
        id_category: { type: Number, unique: true },
        name: String,
    },
    {
        collection: "categories",
    }
);
export const Category = mongoose.model<ICategoryModel>("Category", schema);