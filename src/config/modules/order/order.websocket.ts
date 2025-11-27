import { FastifyInstance, FastifyRequest } from "fastify";
import Redis from "ioredis";

export default async function orderWebsocket(app: FastifyInstance) {
  app.get(
    "/ws/orders",
    { websocket: true },
    (connection, req: FastifyRequest) => {
      console.log("Client connected to WebSocket 🔌");

      const redisSub = new Redis({ host: "localhost", port: 6379 });

      redisSub.subscribe("order-updates", (err) => {
        if (err) console.error("Failed to subscribe to Redis", err);
      });

      redisSub.on("message", (channel, message) => {
        const data = JSON.parse(message);

        connection.send(JSON.stringify(data));
      });

      connection.on("close", () => {
        console.log("Client disconnected ");
        redisSub.quit();
      });
    }
  );
}
