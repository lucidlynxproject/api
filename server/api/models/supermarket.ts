import mongoose from "mongoose";
export interface ISupermarketModel extends mongoose.Document {
    id_supermarket: number;
    name: string;
    link: string;
}
const schema = new mongoose.Schema(
    {
        id_supermarket: { type: Number, unique: true },
        name: String,
        link: String,
    },
    {
        collection: "supermarkets",
    }
);
export const Supermarket = mongoose.model<ISupermarketModel>("Supermarket", schema); 