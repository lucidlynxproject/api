import BaseModel from "../../base/base.model";
import MongooseRepository from "../../repositories/mongoose/mongoose.repository";
import SectionSchema from "../../repositories/mongoose/schemas/section.schema";
import { Section } from "../../types/interfaces/section.interface";

class SectionModel extends BaseModel<Section, Section> {}

export default new SectionModel(new MongooseRepository("section", SectionSchema));
