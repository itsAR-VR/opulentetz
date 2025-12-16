import { prisma } from "./prisma"

const INVENTORY_IMAGE_ROUTE_PREFIX = "/api/inventory-images/"

export const buildInventoryImageUrl = (id: string) => `${INVENTORY_IMAGE_ROUTE_PREFIX}${id}`

export const isStoredInventoryImageUrl = (value: string) => value.startsWith(INVENTORY_IMAGE_ROUTE_PREFIX)

export const parseStoredInventoryImageId = (value: string) => {
  if (!isStoredInventoryImageUrl(value)) return null
  const rest = value.slice(INVENTORY_IMAGE_ROUTE_PREFIX.length)
  const [id] = rest.split("?")
  return id || null
}

const detectImageContentType = (buffer: Buffer) => {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg"
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  )
    return "image/png"
  if (buffer.length >= 6) {
    const header = buffer.subarray(0, 6).toString("ascii")
    if (header === "GIF87a" || header === "GIF89a") return "image/gif"
  }
  if (buffer.length >= 12) {
    const riff = buffer.subarray(0, 4).toString("ascii")
    const webp = buffer.subarray(8, 12).toString("ascii")
    if (riff === "RIFF" && webp === "WEBP") return "image/webp"
  }
  return null
}

const filenameFromUrl = (url: string) => {
  try {
    const parsed = new URL(url)
    const last = parsed.pathname.split("/").filter(Boolean).pop()
    return last ?? null
  } catch {
    return null
  }
}

type IngestOptions = {
  timeoutMs?: number
  maxBytes?: number
  maxImages?: number
}

export async function ingestInventoryImagesFromUrls(inventoryId: string, urls: string[], options: IngestOptions = {}) {
  const timeoutMs = options.timeoutMs ?? 15_000
  const maxBytes = options.maxBytes ?? 10 * 1024 * 1024
  const maxImages = options.maxImages ?? 12

  const unique = Array.from(new Set(urls.map((u) => u.trim()).filter(Boolean))).slice(0, maxImages)
  const results: string[] = []

  let sortOrder = 0
  for (const url of unique) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const response = await fetch(url, { signal: controller.signal, redirect: "follow" })
      if (!response.ok) {
        results.push(url)
        continue
      }

      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      if (buffer.byteLength > maxBytes) {
        results.push(url)
        continue
      }

      const headerContentType = response.headers.get("content-type")?.split(";")[0]?.trim() ?? null
      const sniffed = detectImageContentType(buffer)
      const contentType = headerContentType && headerContentType.startsWith("image/")
        ? headerContentType
        : sniffed ?? "application/octet-stream"

      const fileName = filenameFromUrl(url)

      const created = await prisma.inventoryImage.create({
        data: {
          inventoryId,
          sortOrder,
          fileName,
          contentType,
          size: buffer.byteLength,
          data: buffer,
          sourceUrl: url,
        },
        select: { id: true },
      })

      results.push(buildInventoryImageUrl(created.id))
      sortOrder += 1
    } catch {
      results.push(url)
    } finally {
      clearTimeout(timeout)
    }
  }

  return results
}

