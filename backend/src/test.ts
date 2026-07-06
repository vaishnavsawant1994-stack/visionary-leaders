import { prisma } from "./lib/prisma";

async function main() {
  const test = await prisma.$connect();
  console.log("Database connected successfully");
}

main();