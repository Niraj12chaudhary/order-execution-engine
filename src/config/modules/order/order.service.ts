import { OrderStatus, PrismaClient } from "@prisma/client";
import { CreateOrderInput } from "./order.schema";
import { addOrderToQueue } from "../../../shared/queqe/order.queue";
const prisma = new PrismaClient();
export const createOrder = async (input: CreateOrderInput) => {
  const order = await prisma.order.create({
    data: {
      type: input.type,
      side: input.side,
      tokenIn: input.tokenIn,
      tokenOut: input.tokenOut,
      amount: input.amount,
      status: OrderStatus.PENDING,
    },
  });

  //  Queue for Background Processing
  await addOrderToQueue(order.id, {
    tokenIn: input.tokenIn,
    tokenOut: input.tokenOut,
    amount: input.amount,
  });

  return order;
};

export const getOrders = async () => {
  return await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });
};
