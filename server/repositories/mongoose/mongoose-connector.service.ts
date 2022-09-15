import dotenv from "dotenv";
import mongoose, { Connection } from "mongoose";
import UserSchema from "./schemas/user.schema";
import SectionSchema from "./schemas/section.schema";
import ProductSchema from "./schemas/product.schema";
import Product_ChangesSchema from "./schemas/product_changes.schema";
import CategorySchema from "./schemas/category.schema";

dotenv.config();

const {
  MONGO_BASE_URL,
  MONGO_URL,
  MONGO_DB_PASSWORD,
  MONGO_DB_USER,
  MONGO_DB_NAME,
} = process.env;

const POOL_SIZE = 20;
export const MONGOOSE_MODELS = [
  { name: "users", schema: UserSchema },
  { name: "products", schema: ProductSchema },
  { name: "product_changes", schema: Product_ChangesSchema },
  { name: "sections", schema: SectionSchema },
  { name: "categories", schema: CategorySchema },
];

class MongooseConnector {
  connectionPool: { db: string; connection: Connection }[];

  superConnection?: Connection;

  constructor() {
    this.connectionPool = [];
  }

  async init() {
    this.superConnection = mongoose.createConnection(
      `${MONGO_BASE_URL}${MONGO_DB_USER}:${MONGO_DB_PASSWORD}${MONGO_URL}/super`
    );
  }

  async connect(db: string = MONGO_DB_NAME as string): Promise<Connection> {
    if (db === "super") {
      if (!this.superConnection) {
        this.superConnection = mongoose.createConnection(
          `${MONGO_BASE_URL}${MONGO_DB_USER}:${MONGO_DB_PASSWORD}${MONGO_URL}/super`
        );
      }
      return this.superConnection as Connection;
    }
    const connectionOpenedIndex = this.connectionPool.findIndex(
      (connection) => connection.db === db
    );
    if (connectionOpenedIndex >= 0) {
      const { connection } = this.connectionPool[connectionOpenedIndex];
      this.connectionPool.push(
        this.connectionPool.splice(connectionOpenedIndex, 1)[0]
      );
      return connection;
    }
    const connection = await this.createConnection(db);
    connection.on("connected", () => `Mongoose correctly connected to ${db}`);
    connection.on(
      "disconnected",
      () => `Mongoose correctly disconnected to ${db}`
    );
    if (this.connectionPool.length < POOL_SIZE) {
      this.connectionPool.push({ db, connection });
    } else {
      const deletedConnection = this.connectionPool.shift();
      await deletedConnection?.connection.close();
    }
    return connection;
  }

  async createConnection(
    db: string = MONGO_DB_NAME as string
  ): Promise<Connection> {
    const connection = mongoose.createConnection(
      `${MONGO_BASE_URL}${MONGO_DB_USER}:${MONGO_DB_PASSWORD}${MONGO_URL}/${db}`
    );
    MONGOOSE_MODELS.forEach(({ name, schema }) => {
      connection.model(name, schema);
    });
    return connection;
  }

  disconnectAllDBs(): Promise<void[]> {
    return Promise.all([
      ...this.connectionPool.map(({ connection }) => connection.close()),
      this.superConnection?.close(),
    ]);
  }
}

const mongooseConnector = new MongooseConnector();
export default mongooseConnector;
