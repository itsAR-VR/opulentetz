export const runtime = "nodejs"

const MAX_BYTES = 10 * 1024 * 1024
const TIMEOUT_MS = 15_000

const detectImageContentType = (buffer: Uint8Array) => {
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
    const header = Buffer.from(buffer.subarray(0, 6)).toString("ascii")
    if (header === "GIF87a" || header === "GIF89a") return "image/gif"
  }
  if (buffer.length >= 12) {
    const riff = Buffer.from(buffer.subarray(0, 4)).toString("ascii")
    const webp = Buffer.from(buffer.subarray(8, 12)).toString("ascii")
    if (riff === "RIFF" && webp === "WEBP") return "image/webp"
  }
  return null
}

const isAllowedImageHost = (hostname: string) => hostname.toLowerCase().endsWith("fbcdn.net")

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const rawUrl = (searchParams.get("url") ?? "").trim()

  if (!rawUrl) return new Response("Missing url", { status: 400 })

  let target: URL
  try {
    target = new URL(rawUrl)
  } catch {
    return new Response("Invalid url", { status: 400 })
  }

  if (target.protocol !== "https:") return new Response("Only https URLs are allowed", { status: 400 })
  if (!isAllowedImageHost(target.hostname)) return new Response("Host not allowed", { status: 403 })

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)

  try {
    const upstream = await fetch(target.toString(), {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        // Some CDNs behave differently with no UA; keep it generic.
        "User-Agent": "Mozilla/5.0 (compatible; ExclusiveTimeZoneBot/1.0; +https://example.com)",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
      },
    })

    if (!upstream.ok) {
      return new Response("Upstream fetch failed", { status: 502 })
    }

    const arrayBuffer = await upstream.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)
    if (buffer.byteLength > MAX_BYTES) {
      return new Response("Image too large", { status: 413 })
    }

    const headerContentType = upstream.headers.get("content-type")?.split(";")[0]?.trim() ?? null
    const sniffed = detectImageContentType(buffer)
    const contentType =
      headerContentType && headerContentType.startsWith("image/") ? headerContentType : sniffed ?? "image/jpeg"

    return new Response(buffer, {
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(buffer.byteLength),
        "Cache-Control": "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800",
      },
    })
  } catch {
    return new Response("Upstream fetch failed", { status: 502 })
  } finally {
    clearTimeout(timeout)
  }
}
