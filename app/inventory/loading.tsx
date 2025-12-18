export default function LoadingInventoryPage() {
  return (
    <div className="min-h-screen bg-background">
      <section className="relative py-16 bg-black text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-64 bg-white/10 rounded-md animate-pulse" />
          <div className="mt-4 h-4 w-96 max-w-full bg-white/10 rounded-md animate-pulse" />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-border overflow-hidden animate-pulse">
              <div className="aspect-square bg-muted" />
              <div className="p-4 space-y-3">
                <div className="h-3 w-24 bg-muted rounded" />
                <div className="h-5 w-48 bg-muted rounded" />
                <div className="h-3 w-32 bg-muted rounded" />
                <div className="h-4 w-28 bg-muted rounded mt-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

