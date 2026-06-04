import { config } from "dotenv";
config({ path: ".env.local" });

const NAMES = [
  "Steve", "Alex", "Notch", "Herobrine", "Creeperz", "EnderKing",
  "DiamondDan", "PixelPete", "BlockyBen", "RedstoneRo", "NetherNed",
  "GhastGal", "PiglinPat", "WardenWes", "AxolotlAmy", "DrownedDom",
  "SkeleSam", "ZombieZoe", "SpiderSid", "PhantomPhil", "LlamaLuz",
  "FoxFiona", "BeeBella", "WolfWill", "CatCleo", "TurtleTed",
  "FrogFreya", "GoatGus", "AllayAva", "SnifferSue",
];

async function main() {
  const { db } = await import("../db");
  const { bets } = await import("../db/schema");

  const rand = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const rows = NAMES.map((username) => ({
    username,
    guessDeaths: rand(0, 12),
    guessHearts: rand(0, 10),
    guessTime: rand(600, 3600), // 10–60 min in seconds
  }));

  await db.insert(bets).values(rows);
  console.log(`Inserted ${rows.length} bets.`);
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
