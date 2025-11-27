import { OrderSide } from "@prisma/client";

interface Quote {
  dex: "RAYDIUM" | "METEORA";
  price: number;
  fee: number;
}

export class DexService {
  // Base prices for simulation (In real app, fetch from API)
  private readonly PRICES = {
    SOL: 150.0,
    USDC: 1.0,
  };

  async getRaydiumQuote(
    tokenIn: string,
    tokenOut: string,
    amount: number
  ): Promise<Quote> {
    await this.delay(200);
    const variance = 1 + (Math.random() * 0.02 - 0.01);
    const price = this.PRICES.SOL * variance;

    return {
      dex: "RAYDIUM",
      price: price,
      fee: 0.03,
    };
  }

  async getMeteoraQuote(
    tokenIn: string,
    tokenOut: string,
    amount: number
  ): Promise<Quote> {
    await this.delay(200);

    const variance = 1 + (Math.random() * 0.03 - 0.015);
    const price = this.PRICES.SOL * variance;

    return {
      dex: "METEORA",
      price: price,
      fee: 0.02,
    };
  }

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

export const dexService = new DexService();
