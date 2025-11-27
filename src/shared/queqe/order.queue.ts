import { Queue } from "bullmq";
import { redisConnection } from "../../config/redis";

export const ORDER_QUEUE_NAME = "order-execution-queue";

export const orderQueue = new Queue(ORDER_QUEUE_NAME, {
  connection: redisConnection,
});

export const addOrderToQueue = async (orderId: string, orderData: any) => {
  await orderQueue.add(
    "execute-order",
    {
      orderId,
      ...orderData,
    },
    {
      attempts: 3, // Retry failed orders 3 times
      backoff: {
        type: "exponential",
        delay: 1000, // Wait 1s, then 2s, then 4s...
      },
      removeOnComplete: true, // Auto-delete successful jobs to save Redis memory
    }
  );
  console.log(`[Queue] Order ${orderId} added to queue`);
};
