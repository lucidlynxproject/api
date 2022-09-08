import mongoose from "mongoose";
import sequence from "mongoose-sequence";
export interface ITypeModel extends mongoose.Document {
    id_type: number;
    name: string;
}
const schema = new mongoose.Schema(
    {
        id_type: { type: Number, unique: true },
        name: String,
    },
    {
        collection: "types",
    }
);
export const Type = mongoose.model<ITypeModel>("Type", schema);