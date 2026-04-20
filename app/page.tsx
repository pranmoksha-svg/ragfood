import { ChatInterface } from "@/components/chat-interface";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <div className="food-bg flex min-h-dvh flex-col">
      <SiteHeader />

      <main className="container flex-1 py-8 md:py-12">
        <section className="mx-auto mb-8 max-w-2xl text-center md:mb-12">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
            Retrieval-Augmented Generation for food knowledge
          </p>
          <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight text-balance text-foreground md:text-5xl">
            {"Your AI sous-chef for "}
            <span className="text-primary">dishes, diets & cuisines</span>
          </h1>
          <p className="mt-4 text-pretty text-base text-muted-foreground md:text-lg">
            {
              "Ask in plain English. We retrieve the most relevant dishes from an Upstash Vector index and let Groq's llama-3.1-8b-instant craft a grounded answer."
            }
          </p>
        </section>

        <section className="mx-auto w-full max-w-3xl">
          <ChatInterface />
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
