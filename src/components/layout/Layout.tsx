import { Header } from './Header'
import { Footer } from './Footer'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <Header />
      <main className="mx-auto w-full max-w-7xl flex-1 flex flex-col px-6 pt-4 pb-10">
        {children}
      </main>
      <Footer />
    </div>
  )
}
