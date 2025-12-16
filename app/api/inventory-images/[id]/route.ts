import { prisma } from "@/lib/prisma"

export const runtime = "nodejs"

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const record = await prisma.inventoryImage.findUnique({
    where: { id },
    select: { data: true, contentType: true },
  })

  if (!record) {
    return new Response("Not found", { status: 404 })
  }

  return new Response(record.data, {
    headers: {
      "Content-Type": record.contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  })
}
