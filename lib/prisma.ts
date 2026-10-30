import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function createPrismaClient(): PrismaClient {
  const options = {
    log: (process.env.NODE_ENV === "development"
      ? ["warn", "error"]
      : ["error"]) as ("warn" | "error")[],
  };

  try {
    return new PrismaClient(options);
  } catch (err: any) {
    if (
      typeof err?.message === "string" &&
      err.message.includes("did not initialize yet")
    ) {
      try {
        const nodeRequire = eval("require") as NodeRequire;
        if (nodeRequire?.cache) {
          for (const key of Object.keys(nodeRequire.cache)) {
            if (key.includes(".prisma") || key.includes("@prisma")) {
              delete nodeRequire.cache[key];
            }
          }
        }
        const { PrismaClient: FreshPrismaClient } =
          nodeRequire("@prisma/client");
        return new FreshPrismaClient(options);
      } catch {
        // Fallback to original error if cache eviction fails
      }
    }
    throw err;
  }
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
