export function Sidebar({ children }: { children: React.ReactNode }) {
  return (
    <aside className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-24 space-y-4">
        {children}
      </div>
    </aside>
  )
}
