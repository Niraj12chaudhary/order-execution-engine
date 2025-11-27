import { Worker, Job } from "bullmq";
import { redisConnection } from "../../config/redis";
import { PrismaClient, OrderStatus } from "@prisma/client";
import Redis from "ioredis";
import { dexService } from "../../config/modules/dex/dex.service";

const prisma = new PrismaClient();
const redisPub = new Redis(redisConnection as any);
const processOrder = async (job: Job) => {
  const { orderId, tokenIn, tokenOut, amount } = job.data;
  console.log(`[Worker]  Processing Order: ${orderId}`);

  // Helper function to Update DB & Notify WebSocket
  const updateAndPublish = async (status: OrderStatus, details: any = {}) => {
    await prisma.order.update({
      where: { id: orderId },
      data: { status, ...details },
    });

    const message = JSON.stringify({ orderId, status, ...details });
    await redisPub.publish("order-updates", message);
  };

  await updateAndPublish(OrderStatus.ROUTING);
  console.log(`[Worker]  Routing...`);

  try {
    const [raydiumQuote, meteoraQuote] = await Promise.all([
      dexService.getRaydiumQuote(tokenIn, tokenOut, amount),
      dexService.getMeteoraQuote(tokenIn, tokenOut, amount),
    ]);

    let bestQuote =
      raydiumQuote.price < meteoraQuote.price ? raydiumQuote : meteoraQuote;
    console.log(
      `[Worker] Best: ${bestQuote.dex} ($${bestQuote.price.toFixed(2)})`
    );

    await new Promise((r) => setTimeout(r, 2000));

    await updateAndPublish(OrderStatus.CONFIRMED, {
      txHash: `sol_tx_${Math.random().toString(36).substring(7)}`,
      executionPrice: bestQuote.price,
      routeUsed: bestQuote.dex,
    });

    console.log(`[Worker]  Completed`);
  } catch (error: any) {
    await updateAndPublish(OrderStatus.FAILED, { errorMsg: error.message });
  }
};

export const initOrderWorker = () => {
  const worker = new Worker("order-execution-queue", processOrder, {
    connection: redisConnection,
  });
  worker.on("failed", (job, err) =>
    console.error(`Job failed: ${err.message}`)
  );
  console.log("[Worker] Order Worker Started ");
};
