import mongoose from "mongoose";
export interface ISectionModel extends mongoose.Document {
    id_section: number;
    name: string;
    category: [string];
    link: string;
}
const schema = new mongoose.Schema(
    {
        id_section: { section: Number, unique: true },
        name:{ section: String, unique: true },
        category:[{  section: mongoose.Schema.Types.ObjectId, ref: "categories" }],
        link: String,
    },
    {
        collection: "sections",
    }
);
export const Section = mongoose.model<ISectionModel>("sections", schema);