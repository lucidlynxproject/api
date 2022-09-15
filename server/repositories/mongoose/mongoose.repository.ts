import { Query, Schema } from "mongoose";
import BaseRepository from "../../base/base.repository";
import mongooseConnector, {
  MONGOOSE_MODELS,
} from "./mongoose-connector.service";

export default class MongooseRepo implements BaseRepository {
  collection: string;

  schema: Schema<any>;

  constructor(collection: string, schema?: Schema) {
    this.collection = collection;
    this.schema = schema || this.getSchema(collection);
  }

  private getSchema(entity: string): Schema {
    const schema = MONGOOSE_MODELS.find(
      (model) => model.name === entity
    )?.schema;
    if (!schema) {
      throw new Error("No schema found!");
    }

    return schema;
  }

  private async createModel() {
    const connection = await mongooseConnector.connect();
    return connection.model(this.collection, this.schema);
  }

  async count(filter?: Record<string, unknown>): Promise<number> {
    const model = await this.createModel();
    return model.estimatedDocumentCount(filter).exec();
  }

  async get(
    filter: Record<string, unknown>,
    projection?: Record<string, unknown>,
    options?: Record<string, unknown>,
    populateFields?: string[]
  ): Promise<any[]> {
    const Model = await this.createModel();
    console.log("filter", filter);
    return Model.find(filter, projection, options)
      .populate(populateFields || [])
      .exec();
  }

  async getSubItems(
    itemId: string,
    filter: Record<string, unknown> = {}
  ): Promise<any[]> {
    const Model = await this.createModel();
    return Model.find({ _id: itemId }, filter).exec();
  }

  async getById(_id: string, populateFields?: string[]): Promise<any> {
    const Model = await this.createModel();
    return Model.findById(_id)
      .populate(populateFields || [])
      .exec();
  }

  async create(newDocument: any): Promise<any> {
    const Model = await this.createModel();
    return Model.create(newDocument);
  }

  async createMany(newDocument: any): Promise<any> {
    const Model = await this.createModel();
    return Model.insertMany(newDocument);
  }

  async update(_id: string, newDocument: any): Promise<any | null> {
    const Model = await this.createModel();
    return Model.findByIdAndUpdate(_id, newDocument, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async updateMany(query: any, newDocument: any): Promise<any | null> {
    const Model = await this.createModel();
    return Model.updateMany(query, newDocument, {
      new: true,
      runValidators: true,
    }).exec();
  }

  async addArrayElement(
    id: any,
    propName: string,
    newElement: any
  ): Promise<any | null> {
    const Model = await this.createModel();
    return Model.findByIdAndUpdate(
      id,
      { $addToSet: { [propName]: newElement } },
      {
        new: true,
        runValidators: true,
      }
    ).exec();
  }

  async removeArrayElement(
    id: any,
    propName: string,
    elementToRemove: any
  ): Promise<any | null> {
    const Model = await this.createModel();
    return Model.findByIdAndUpdate(
      id,
      { $pull: { [propName]: elementToRemove } },
      {
        new: true,
        runValidators: true,
      }
    ).exec();
  }

  async updateArrayElement(
    _id: string,
    prop: string,
    arrayKey: string,
    arrayElementId: string,
    newArrayElement: any
  ): Promise<any | null> {
    const Model = await this.createModel();
    const mongooseSetter = Object.entries(newArrayElement).reduce(
      (mongooseUpdateObj, [key, value]) =>
        key !== arrayKey
          ? {
              ...mongooseUpdateObj,
              [`${prop}.$.${key}`]: value,
            }
          : mongooseUpdateObj,
      {}
    );

    return Model.updateOne(
      { _id, [`${prop}.${arrayKey}`]: arrayElementId },
      { $set: mongooseSetter },
      {
        new: true,
        runValidators: true,
      }
    ).exec();
  }

  async set(_id: string, newDocument: any): Promise<any | null> {
    const Model = await this.createModel();
    return Model.findByIdAndUpdate(_id, newDocument, {
      new: true,
      runValidators: true,
      upsert: true,
    }).exec();
  }

  async delete(_id: string): Promise<any | null> {
    const Model = await this.createModel();
    return Model.findByIdAndDelete(_id).exec();
  }

  async validate(newDocument: any): Promise<any | null> {
    const Model = await this.createModel();
    const document = new Model(newDocument);
    return document.validate();
  }

  private populate(
    query: Query<any, any>,
    fieldsToPopulate: string[]
  ): Query<any, any> {
    return query.populate(fieldsToPopulate);
  }

  async getOne(
    filter?: Record<string, unknown>,
    populateFields?: string[]
  ): Promise<any> {
    const Model = await this.createModel();
    return Model.findOne(filter)
      .populate(populateFields || [])
      .exec();
  }

  private async findOneAndUpdate(
    filter: Record<string, unknown>,
    newDocument: any
  ): Promise<any | null> {
    const Model = await this.createModel();
    return Model.findOneAndUpdate(filter, newDocument, {
      new: true,
      runValidators: true,
    }).exec();
  }

  private async findOneAndDelete(
    filter: Record<string, unknown>
  ): Promise<any | null> {
    const Model = await this.createModel();
    return Model.findOneAndDelete(filter).exec();
  }
}
