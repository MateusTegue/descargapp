import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Lazy initialization para evitar problemas durante el build
let prismaInstance: PrismaClient | null = null

const getPrisma = () => {
  if (process.env.NEXT_PHASE === "phase-production-build") {
    // Durante el build, retornar un mock que no se ejecutará
    return {} as PrismaClient
  }

  if (!prismaInstance) {
    prismaInstance = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
    })
  }
  return prismaInstance
}

export const prisma = globalForPrisma.prisma ?? getPrisma()

if (process.env.NODE_ENV !== "production" && process.env.NEXT_PHASE !== "phase-production-build") {
  globalForPrisma.prisma = prisma
}

