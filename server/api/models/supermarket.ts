import mongoose from "mongoose";
import sequence from "mongoose-sequence";
export interface ISupermarketModel extends mongoose.Document {
    id_supermarket: number;
    name: string;
}
const schema = new mongoose.Schema(
    {
        id_supermarket: { type: Number, unique: true },
        name: String,
    },
    {
        collection: "supermarkets",
    }
);
export const Supermarket = mongoose.model<ISupermarketModel>("Supermarket", schema); 