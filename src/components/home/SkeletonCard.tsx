export function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-xl border border-border overflow-hidden h-full" style={{ borderTop: '3px solid hsl(var(--border))' }}>
      <div className="flex flex-col gap-3 p-5 flex-1 animate-pulse-soft">
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            <div className="skeleton h-5 w-16 rounded-md" />
            <div className="skeleton h-5 w-12 rounded" />
          </div>
          <div className="skeleton h-4 w-14 rounded-full" />
        </div>
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-8 w-full rounded" />
        <div className="flex gap-1 mt-auto pt-1">
          <div className="skeleton h-4 w-14 rounded-md" />
          <div className="skeleton h-4 w-16 rounded-md" />
        </div>
      </div>
    </div>
  )
}
