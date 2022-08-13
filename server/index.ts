import "./common/env";
import Database from "./common/database";
import Server from "./common/server";
import routes from "./routes";

const port = parseInt(process.env.PORT || "3000");
const connectionString = process.env.MONGODB_URI;

const db = new Database(connectionString);
export default new Server().database(db).router(routes).listen(port);
