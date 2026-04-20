export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-border/60 bg-background">
      <div className="container flex flex-col items-center justify-between gap-2 py-6 text-xs text-muted-foreground sm:flex-row">
        <p>
          {"Built with Next.js, Upstash Vector, and Groq · "}
          <span className="text-foreground/80">Foodie RAG</span>
        </p>
        <p className="text-[11px]">
          Answers are generated from a curated food knowledge base.
        </p>
      </div>
    </footer>
  );
}
