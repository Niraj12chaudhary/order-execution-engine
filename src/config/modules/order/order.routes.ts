import { FastifyInstance } from "fastify";
import { createOrderHandler, getOrdersHandler } from "./order.controller";

export default async function orderRoutes(app: FastifyInstance) {
  app.post("/execute", createOrderHandler);
  app.get("/", getOrdersHandler);
}
