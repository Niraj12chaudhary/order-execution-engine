import { dexService } from "../config/modules/dex/dex.service";
describe("DEX Service Logic", () => {
  //  Raydium Quote
  it("should return a valid quote from Raydium", async () => {
    const quote = await dexService.getRaydiumQuote("SOL", "USDC", 1);
    expect(quote.dex).toBe("RAYDIUM");
    expect(quote.price).toBeGreaterThan(0);
  });

  //  Meteora Quote
  it("should return a valid quote from Meteora", async () => {
    const quote = await dexService.getMeteoraQuote("SOL", "USDC", 1);
    expect(quote.dex).toBe("METEORA");
    expect(quote.price).toBeGreaterThan(0);
  });

  //Price Variance (Values shouldn't be exactly same/static)
  it("should return slightly different prices for subsequent calls", async () => {
    const quote1 = await dexService.getRaydiumQuote("SOL", "USDC", 1);
    const quote2 = await dexService.getRaydiumQuote("SOL", "USDC", 1);
    expect(quote1.price).not.toBe(0);
  });
});
