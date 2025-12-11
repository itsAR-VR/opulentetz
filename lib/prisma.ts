import { PrismaClient } from "@/lib/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

const connectionString = process.env.DATABASE_URL ?? process.env.DIRECT_URL

if (!connectionString) {
  throw new Error("DIRECT_URL or DATABASE_URL must be set")
}

const pool = new Pool({
  connectionString,
})

const adapter = new PrismaPg(pool)

export const prisma = globalThis.prisma ?? new PrismaClient({ adapter })

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma
}
