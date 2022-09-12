import { Schema } from "mongoose";
const SectionSchema = new Schema({
  name: { type: String },
  link: { type: String },
  category: [
    {
      type: Schema.Types.ObjectId,
      ref: "categories",
    },
  ],
});
export default SectionSchema;
