/* eslint-disable no-console */
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import packageJSON from "../package.json";
import apiRouter from "./api/routes";
import authMiddleware from "./middlewares/auth.middleware";
import mongooseConnector from "./repositories/mongoose/mongoose-connector.service";
import scrapperJob from "./scrapper/scrapperRoutine";
import { BaseScrapper } from "./scrapper/uploadBaseScrapper";
import swaggerUi from "swagger-ui-express";
import openapi from "./common/openapi.json";

dotenv.config();
const app = express();
const http = require("http").Server(app);

app.use(cors());
app.use(express.json());

morgan("tiny");
mongooseConnector.connect();

process.on("SIGINT", async () => {
  try {
    await mongooseConnector.disconnectAllDBs();
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
});

const allowUrl = ["login"];

app.use("/api", authMiddleware.allowWhiteListUrls(allowUrl), apiRouter);
app.use("/status", (_, res) => {
  res.json({ status: "Ok", version: packageJSON.version });
});
app.use(
  "/documentation",
  swaggerUi.serve,
  swaggerUi.setup(openapi, {
    customCss: ".swagger-ui .topbar { display: none }",
  })
);

const port = process.env.PORT || 3000;
const hbs = require("hbs");

app.set("view engine", "hbs");
app.set("views", "./templates");

scrapperJob;

http.listen(port, () => console.log(`Running at http://localhost:${port}`));
