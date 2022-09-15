import { Schema } from "mongoose";

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    link: {
        type: String,
        required: true,
        unique: true,
    },
    section: {
        type: Schema.Types.ObjectId,
        ref: "section",

        }
  },
  {
    timestamps: true,
    collection: "categories",
  
  }
);

export default CategorySchema;
