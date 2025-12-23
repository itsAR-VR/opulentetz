import "./load-env"
import fs from "fs"
import path from "path"
import { importListings, parseListingsFromJson } from "../lib/importers/facebook"
import { prisma } from "../lib/prisma"

async function main() {
  const filePath = process.argv[2]
  if (!filePath) {
    console.error("Usage: pnpm tsx scripts/import_facebook.ts <path-to-json>")
    process.exit(1)
  }

  const absolutePath = path.resolve(filePath)
  if (!fs.existsSync(absolutePath)) {
    console.error(`File not found: ${absolutePath}`)
    process.exit(1)
  }

  const raw = fs.readFileSync(absolutePath, "utf8")
  const parsed = JSON.parse(raw)
  const entries = parseListingsFromJson(parsed)

  if (!Array.isArray(entries) || entries.length === 0) {
    console.error("Input JSON must be an array or contain an 'items'/'data' array.")
    process.exit(1)
  }

  const summary = await importListings(entries, { refreshImages: true })

  console.log(`Import complete: ${summary.created} created, ${summary.updated} updated, ${summary.skipped} skipped.`)
}

main()
  .catch((error) => {
    console.error("Import failed", error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
