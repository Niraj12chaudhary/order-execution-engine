import { z } from "zod";
import { OrderType, OrderSide } from "@prisma/client";
export const createOrderSchema = z.object({
  type: z.nativeEnum(OrderType),
  side: z.nativeEnum(OrderSide),

  tokenIn: z.string().min(1, "Token In is required"),
  tokenOut: z.string().min(1, "Token Out is required"),
  amount: z.number().positive("Amount must be positive"),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
