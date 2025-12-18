export default function LoadingWatchDetailPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
          <div className="h-4 w-40 bg-muted rounded animate-pulse" />
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4 animate-pulse">
            <div className="relative aspect-square bg-muted rounded-lg overflow-hidden" />
            <div className="grid grid-cols-4 gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="relative aspect-square bg-muted rounded-md" />
              ))}
            </div>
          </div>

          <div className="space-y-6 animate-pulse">
            <div className="space-y-3">
              <div className="h-3 w-24 bg-muted rounded" />
              <div className="h-10 w-72 max-w-full bg-muted rounded" />
              <div className="h-4 w-48 bg-muted rounded" />
            </div>

            <div className="border-y border-border py-6 space-y-3">
              <div className="h-3 w-16 bg-muted rounded" />
              <div className="h-12 w-44 bg-muted rounded" />
              <div className="h-3 w-64 max-w-full bg-muted rounded" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="h-3 w-16 bg-muted rounded" />
                  <div className="h-5 w-28 bg-muted rounded" />
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-4">
              <div className="h-12 w-full bg-muted rounded-md" />
              <div className="h-12 w-full bg-muted rounded-md" />
            </div>

            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center text-center space-y-2">
                  <div className="h-6 w-6 bg-muted rounded-full" />
                  <div className="h-3 w-24 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

