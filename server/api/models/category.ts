import mongoose from "mongoose";
export interface ICategoryModel extends mongoose.Document {
    id_category: number;
    name: string;
    section: string;
    link: string;
}
const schema = new mongoose.Schema(
    {
        id_category: { type: Number, unique: true },
        name: { type: String, unique: true },
        section: { type: mongoose.Schema.Types.ObjectId, ref: "sections" },
        link: String,
    },
    {
        collection: "categories",
    }
);
export const Category = mongoose.model<ICategoryModel>("Category", schema);