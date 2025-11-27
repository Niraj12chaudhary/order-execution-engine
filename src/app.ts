import fastify from "fastify";
import websocket from "@fastify/websocket";
import orderRoutes from "./config/modules/order/order.routes";
import orderWebsocket from "./config/modules/order/order.websocket";
const buildApp = async () => {
  const app = fastify({ logger: true });

  await app.register(websocket);

  // API Routes
  app.register(orderRoutes, { prefix: "/api/orders" });

  // WebSocket Routes
  app.register(orderWebsocket); // Register here

  app.get("/", async () => {
    return { status: "ok", message: "Order Execution Engine is Running 🚀" };
  });

  return app;
};

export default buildApp;
