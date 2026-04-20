import type { SourceDoc } from "@/app/actions";
import { Badge } from "@/components/ui/badge";
import { Utensils } from "lucide-react";

export function SourceCard({ doc, index }: { doc: SourceDoc; index: number }) {
  const m = doc.metadata ?? {};
  const scorePct = Math.round((doc.score ?? 0) * 100);

  return (
    <article className="rounded-lg border border-border bg-card p-4 shadow-sm transition-colors hover:border-primary/40">
      <header className="mb-2 flex items-start justify-between gap-3">
        <div className="flex items-start gap-2">
          <div
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary"
            aria-hidden="true"
          >
            <Utensils className="h-3.5 w-3.5" />
          </div>
          <div>
            <h4 className="font-serif text-base font-semibold leading-tight text-foreground">
              {m.name ?? `Source ${index + 1}`}
            </h4>
            {m.category ? (
              <p className="text-xs text-muted-foreground">{m.category}</p>
            ) : null}
          </div>
        </div>
        <Badge variant="secondary" className="shrink-0 font-mono text-[10px]">
          {scorePct}% match
        </Badge>
      </header>

      {doc.data ? (
        <p className="mb-3 text-sm leading-relaxed text-foreground/80">
          {doc.data}
        </p>
      ) : null}

      <dl className="grid grid-cols-1 gap-x-4 gap-y-1.5 text-xs sm:grid-cols-2">
        {m.ingredients && m.ingredients.length > 0 ? (
          <div className="sm:col-span-2">
            <dt className="font-medium text-muted-foreground">Ingredients</dt>
            <dd className="text-foreground/80">{m.ingredients.join(", ")}</dd>
          </div>
        ) : null}
        {m.nutrition ? (
          <div className="sm:col-span-2">
            <dt className="font-medium text-muted-foreground">Nutrition</dt>
            <dd className="text-foreground/80">{m.nutrition}</dd>
          </div>
        ) : null}
      </dl>

      {(m.dietary_tags?.length ?? 0) > 0 ||
      (m.allergens?.length ?? 0) > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {m.dietary_tags?.map((t) => (
            <Badge key={`diet-${t}`} variant="accent" className="text-[10px]">
              {t}
            </Badge>
          ))}
          {m.allergens?.map((a) => (
            <Badge
              key={`al-${a}`}
              variant="outline"
              className="border-destructive/40 text-[10px] text-destructive"
            >
              allergen: {a}
            </Badge>
          ))}
        </div>
      ) : null}
    </article>
  );
}
