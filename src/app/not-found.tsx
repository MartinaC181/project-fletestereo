import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-8">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-primary">404</h1>
        <p className="text-xl text-muted-foreground">La página que buscas no existe.</p>
        <Link href="/" className="text-accent-orange underline hover:opacity-80">Volver al inicio</Link>
      </div>
    </div>
  );
}