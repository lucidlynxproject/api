import { Request, Response } from "express";
import queryParser from "../services/query-parser.service";
import BaseManager from "./base.manager";

export default class BaseController {
  baseManager: BaseManager;

  constructor(baseManager: BaseManager) {
    this.baseManager = baseManager;
  }

  async getCount(req: Request, res: Response): Promise<Response> {
    try {
      const filters = queryParser.getFilters(req.query);
      const number = await this.baseManager.getCount(filters);
      return res.status(200).send({
        message: "Number of elements returned successfully",
        data: { count: number ?? 0 },
      });
    } catch (e) {
      return this.handleError(res, e);
    }
  }

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const filters = queryParser.getFilters(req.query);
      const projection = queryParser.getProjection(req.query);
      const options = queryParser.getOptions(req.query);
      const populate = queryParser.getPopulationOptions(req.query);
      const result = await this.baseManager.getAll(
        filters,
        projection,
        options,
        populate
      );
      if (!result) {
        throw new Error("No elements found");
      }

      return res.status(200).send({
        message: `Resources retrieved successfully`,
        data: result,
      });
    } catch (e) {
      return this.handleError(res, e);
    }
  }

  async getById(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).send({ message: "Missing fields" });
      }
      const populate = queryParser.getPopulationOptions(req.query);
      const data = populate
        ? await this.baseManager.getById(id, populate)
        : await this.baseManager.getById(id, populate);
      if (!data) {
        throw new Error("API Error: error retrieving resource");
      }
      return res.status(200).send({
        message: `Resource retrieved successfully`,
        data,
      });
    } catch (e) {
      return this.handleError(res, e);
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const { body } = req;

      if (!body) {
        return res.status(400).send({ message: "Missing fields" });
      }

      const created = await this.baseManager.create(body);
      if (!created) {
        throw new Error("API Error: error creating resource");
      }
      return res.status(200).send({
        message: `Resource created successfully`,
        data: created,
      });
    } catch (e) {
      return this.handleError(res, e);
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).send({ message: "Missing fields" });
      }
      const deleted = await this.baseManager.delete(id);

      if (!deleted) {
        throw new Error("API Error: error removing resource");
      }
      return res.status(200).send({
        message: `Resource deleted successfully`,
        data: deleted,
      });
    } catch (e) {
      return this.handleError(res, e);
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { body } = req;
      if (!id && !body) {
        return res.status(400).send({ message: "Missing fields" });
      }
      const updated = await this.baseManager.update(id, body);
      if (!updated) {
        throw new Error("API Error: error updating resource");
      }
      return res.status(200).send({
        message: `Resource updated successfully`,
        data: updated,
      });
    } catch (e) {
      return this.handleError(res, e);
    }
  }

  async set(req: Request, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      const { data } = req.body;
      if (!id && !data) {
        return res.status(400).send({ message: "Missing fields" });
      }
      const updated = await this.baseManager.set(id, data);
      if (!updated) {
        throw new Error("API Error: error setting resource");
      }
      return res.status(200).send({
        message: `Resource updated successfully`,
        data: updated,
      });
    } catch (e) {
      return this.handleError(res, e);
    }
  }

  handleError(res: Response, err: any): Response {
    return res.status(500).send({ message: `${err.code} - ${err.message}` });
  }

  missingFieldsHandler(fields: any): string {
    let msg = "The following fields are required:";

    Object.entries(fields).forEach((field) => {
      if (!field[1]) {
        msg = msg.concat(` ${field[0].toString()},`);
      }
    });

    msg = msg.substr(0, msg.lastIndexOf(",")).concat(".");
    const c = msg.lastIndexOf(",");
    if (c >= 0) {
      msg = msg
        .substr(0, c)
        .concat(" and")
        .concat(msg.substr(c + 1, msg.length));
    }
    return msg;
  }
}
