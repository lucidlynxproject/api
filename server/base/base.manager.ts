import BaseModel from "./base.model";

export default class BaseManager<T = {}> {
  baseModel: BaseModel<any, any>;

  constructor(baseModel: BaseModel<any, any>) {
    this.baseModel = baseModel;
  }

  getCount(filters: Record<string, unknown> = {}): Promise<number> {
    return this.baseModel.count(filters);
  }

  getAll(
    filters: Record<string, unknown>,
    projection?: string,
    options?: Record<string, unknown>,
    populateFields?: string[] | Record<string, string>[]
  ): Promise<T[]> {
    return populateFields && populateFields.length !== 0
      ? this.baseModel.getAllPopulated(
          filters,
          projection,
          options,
          populateFields as string[]
        )
      : this.baseModel.getAll(filters, projection, options);
  }

  getById(
    id: string,
    populateFields?: string[] | Record<string, string>[]
  ): Promise<T> {
    return populateFields && populateFields.length > 0
      ? this.baseModel.getPopulatedById(id, populateFields)
      : this.baseModel.getById(id);
  }

  create(newEntity: T): Promise<T> {
    return this.baseModel.create(newEntity);
  }

  createMany(newEntity: T[]): Promise<void> {
    return this.baseModel.create(newEntity);
  }

  delete(id: string): Promise<T> {
    return this.baseModel.delete(id);
  }

  update(id: string, newEntity: Record<keyof T, unknown>): Promise<T> {
    return this.baseModel.update(id, newEntity);
  }

  set(id: string, newEntity: T): Promise<T> {
    return this.baseModel.set(id, newEntity);
  }
}
