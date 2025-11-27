import buildApp from "../app";
import { FastifyInstance } from "fastify";

describe("Order API Integration", () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });

  //  Health Check
  it("should return 200 on root route", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/",
    });
    expect(response.statusCode).toBe(200);
  });

  // Create Valid Order
  it("should create a new order successfully", async () => {
    const payload = {
      type: "MARKET",
      side: "BUY",
      tokenIn: "USDC",
      tokenOut: "SOL",
      amount: 100,
    };

    const response = await app.inject({
      method: "POST",
      url: "/api/orders/execute",
      payload,
    });

    expect(response.statusCode).toBe(201);
    const body = JSON.parse(response.payload);
    expect(body.status).toBe("success");
    expect(body.data.orderId).toBeDefined();
    expect(body.data.status).toBe("PENDING");
  });

  //  Validation Error (Missing Field)
  it("should fail if side is missing", async () => {
    const payload = {
      type: "MARKET",
      // side is missing
      tokenIn: "USDC",
      tokenOut: "SOL",
      amount: 100,
    };

    const response = await app.inject({
      method: "POST",
      url: "/api/orders/execute",
      payload,
    });

    expect(response.statusCode).toBe(400);
  });

  //  Validation Error (Negative Amount)
  it("should fail if amount is negative", async () => {
    const payload = {
      type: "MARKET",
      side: "BUY",
      tokenIn: "USDC",
      tokenOut: "SOL",
      amount: -50,
    };

    const response = await app.inject({
      method: "POST",
      url: "/api/orders/execute",
      payload,
    });

    expect(response.statusCode).toBe(400);
  });

  //  Get Orders List
  it("should fetch order history", async () => {
    const response = await app.inject({
      method: "GET",
      url: "/api/orders",
    });
    expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(Array.isArray(body.data)).toBe(true);
  });

  // Invalid Token Input (Empty String)
  it("should fail if tokenIn is empty", async () => {
    const payload = {
      type: "MARKET",
      side: "BUY",
      tokenIn: "",
      tokenOut: "SOL",
      amount: 100,
    };
    const response = await app.inject({
      method: "POST",
      url: "/api/orders/execute",
      payload,
    });
    expect(response.statusCode).toBe(400);
  });

  // : Invalid Order Type
  it("should fail if order type is invalid", async () => {
    const payload = {
      type: "SNIPER_PRO_MAX", // Invalid Enum
      side: "BUY",
      tokenIn: "USDC",
      tokenOut: "SOL",
      amount: 100,
    };
    const response = await app.inject({
      method: "POST",
      url: "/api/orders/execute",
      payload,
    });
    expect(response.statusCode).toBe(400);
  });
});
