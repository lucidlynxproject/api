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
  
} , {
  timestamps: true,
  collection: "section",

});
export default SectionSchema;
