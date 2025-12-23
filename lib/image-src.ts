const INVENTORY_IMAGE_ROUTE_PREFIX = "/api/inventory-images/"
const IMAGE_PROXY_ROUTE = "/api/image-proxy"

export function resolveImageSrc(src: string | null | undefined) {
  const value = (src ?? "").trim()
  if (!value) return "/placeholder.svg"
  if (value.startsWith(INVENTORY_IMAGE_ROUTE_PREFIX)) return value
  if (/^https?:\/\//i.test(value)) return `${IMAGE_PROXY_ROUTE}?url=${encodeURIComponent(value)}`
  return value
}

