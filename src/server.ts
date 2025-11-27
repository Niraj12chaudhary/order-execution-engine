import buildApp from "./app";
import dotenv from "dotenv";
import { initOrderWorker } from "./shared/queqe/order.worker";
dotenv.config();

const start = async () => {
  const app = await buildApp();
  const PORT = process.env.PORT || 3000;

  try {
    // Start the Background Worker
    initOrderWorker();

    await app.listen({ port: Number(PORT), host: "0.0.0.0" });
    console.log(`Server running at http://localhost:${PORT}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
