import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">404</h1>
          <p className="text-muted-foreground">Página no encontrada</p>
          <Link href="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

