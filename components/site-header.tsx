import Link from "next/link";
import { BarChart3, ChefHat, Sparkles } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/60 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm"
          >
            <ChefHat className="h-5 w-5" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-serif text-lg font-semibold tracking-tight text-foreground">
              Foodie RAG
            </span>
            <span className="text-xs text-muted-foreground">
              Upstash Vector · Groq · Next.js
            </span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs text-muted-foreground sm:flex">
            <Sparkles className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
            <span>Powered by retrieval-augmented generation</span>
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
          >
            <BarChart3 className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Analytics</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
