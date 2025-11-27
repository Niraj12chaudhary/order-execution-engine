import { FastifyRequest, FastifyReply } from "fastify";
import { createOrder, getOrders } from "./order.service";
import { createOrderSchema } from "./order.schema";

export const createOrderHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    // Validate Input
    const body = createOrderSchema.parse(request.body);

    // Call Service
    const order = await createOrder(body);

    return reply.code(201).send({
      status: "success",
      message: "Order received and queued",
      data: {
        orderId: order.id,
        status: order.status,
      },
    });
  } catch (error: any) {
    return reply.code(400).send({
      status: "error",
      message: error.message || "Invalid Request",
    });
  }
};

export const getOrdersHandler = async (
  request: FastifyRequest,
  reply: FastifyReply
) => {
  const orders = await getOrders();
  return reply.send({ status: "success", data: orders });
};
