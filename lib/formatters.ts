export function formatCadPrice(price: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: 0,
  }).format(price)
}

export function formatConditionLabel(condition: string) {
  return condition.trim() ? condition.trim().toUpperCase() : condition
}

export function buildStandardProductDescription(options: {
  year: number
  reference: string
  condition: string
  boxAndPapers?: boolean
  status?: string
}) {
  const statusLine = options.status?.trim().toLowerCase() === "sold"
    ? "Sold by Exclusive Time Zone"
    : "Available for purchase from Exclusive Time Zone"

  return [
    `Year: ${options.year}`,
    `Ref: ${options.reference}`,
    `Condition: ${formatConditionLabel(options.condition)}`,
    statusLine,
  ].join("\n")
}

export function buildStandardProductDescriptionInline(options: {
  year: number
  reference: string
  condition: string
  boxAndPapers?: boolean
  status?: string
}) {
  return buildStandardProductDescription(options).replaceAll("\n", " • ")
}
