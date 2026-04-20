"use client";

import { useRef, useState, useTransition } from "react";
import {
  AlertCircle,
  BookOpen,
  ChevronDown,
  Cpu,
  Send,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";

import { askFoodieRag, type SourceDoc } from "@/app/actions";
import { MODEL_OPTIONS, type ModelId } from "@/lib/models";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SourceCard } from "@/components/source-card";
import { cn } from "@/lib/utils";

type Exchange = {
  id: string;
  question: string;
  answer?: string;
  sources?: SourceDoc[];
  error?: string;
  loading?: boolean;
};

const SUGGESTIONS = [
  "What vegetarian dishes are low-carb?",
  "Suggest a spicy Asian dish with tofu.",
  "Which dishes are high in fiber?",
  "Show me a Mediterranean dish with olive oil.",
];

export function ChatInterface() {
  const [question, setQuestion] = useState("");
  const [model, setModel] = useState<ModelId>(MODEL_OPTIONS[0].id);
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function submit(q: string) {
    const trimmed = q.trim();
    if (!trimmed || isPending) return;

    const id = crypto.randomUUID();
    setExchanges((prev) => [
      ...prev,
      { id, question: trimmed, loading: true },
    ]);
    setQuestion("");

    const selectedModel = model;
    startTransition(async () => {
      const result = await askFoodieRag(trimmed, selectedModel);
      setExchanges((prev) =>
        prev.map((ex) =>
          ex.id === id
            ? result.ok
              ? {
                  ...ex,
                  loading: false,
                  answer: result.answer,
                  sources: result.sources,
                }
              : { ...ex, loading: false, error: result.error }
            : ex,
        ),
      );
      inputRef.current?.focus();
    });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    submit(question);
  }

  function clearChat() {
    if (isPending) return;
    setExchanges([]);
    setQuestion("");
    inputRef.current?.focus();
  }

  const isEmpty = exchanges.length === 0;

  return (
    <div className="flex w-full flex-col gap-6">
      {isEmpty ? (
        <EmptyState onPick={(q) => submit(q)} />
      ) : (
        <>
          <div className="flex items-center justify-between border-b border-border/70 pb-3">
            <div className="flex items-baseline gap-2">
              <h2 className="font-serif text-lg font-semibold text-foreground">
                Conversation
              </h2>
              <span className="text-xs text-muted-foreground">
                {exchanges.length}{" "}
                {exchanges.length === 1 ? "message" : "messages"}
              </span>
            </div>
            <button
              type="button"
              onClick={clearChat}
              disabled={isPending}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground/80 shadow-sm transition-colors",
                "hover:border-destructive/50 hover:bg-destructive/5 hover:text-destructive",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
              aria-label="Clear chat history"
            >
              <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
              Clear chat
            </button>
          </div>
          <ol className="flex flex-col gap-8" aria-live="polite">
            {exchanges.map((ex) => (
              <li key={ex.id} className="flex flex-col gap-4">
                <UserMessage text={ex.question} />

                {ex.loading ? <LoadingAnswer /> : null}

                {ex.error ? <ErrorMessage message={ex.error} /> : null}

                {ex.answer ? (
                  <AnswerBlock answer={ex.answer} sources={ex.sources ?? []} />
                ) : null}
              </li>
            ))}
          </ol>
        </>
      )}

      <form
        onSubmit={handleSubmit}
        className="sticky bottom-4 z-10 mt-2 flex flex-col gap-2"
      >
        <div className="flex items-center justify-between gap-2 px-2">
          <ModelPicker
            value={model}
            onChange={setModel}
            disabled={isPending}
          />
          <span className="text-[11px] text-muted-foreground">
            Powered by Groq
          </span>
        </div>
        <div
          className={cn(
            "flex items-center gap-2 rounded-2xl border border-border bg-card p-2 shadow-lg shadow-foreground/5 transition-colors focus-within:border-primary/60",
          )}
        >
          <Input
            ref={inputRef}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about a dish, ingredient, or diet…"
            aria-label="Ask Foodie RAG a question"
            disabled={isPending}
            className="h-11 border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
          />
          <Button
            type="submit"
            size="icon"
            disabled={isPending || !question.trim()}
            aria-label="Send question"
            className="h-10 w-10 shrink-0 rounded-xl"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
        <p className="px-2 text-[11px] text-muted-foreground">
          Press Enter to send · Answers use retrieved dishes only
        </p>
      </form>
    </div>
  );
}

function UserMessage({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground"
        aria-hidden="true"
      >
        <User className="h-4 w-4" />
      </div>
      <div className="rounded-2xl rounded-tl-sm bg-secondary px-4 py-2.5 text-sm text-secondary-foreground">
        {text}
      </div>
    </div>
  );
}

function LoadingAnswer() {
  return (
    <div className="flex items-start gap-3">
      <div
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
        aria-hidden="true"
      >
        <Sparkles className="h-4 w-4" />
      </div>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3">
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary" />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary" />
        <span className="typing-dot h-1.5 w-1.5 rounded-full bg-primary" />
        <span className="sr-only">Searching the food knowledge base…</span>
      </div>
    </div>
  );
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive"
        aria-hidden="true"
      >
        <AlertCircle className="h-4 w-4" />
      </div>
      <div className="rounded-2xl rounded-tl-sm border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
        <p className="font-medium">Something went wrong</p>
        <p className="mt-0.5 text-destructive/80">{message}</p>
      </div>
    </div>
  );
}

function AnswerBlock({
  answer,
  sources,
}: {
  answer: string;
  sources: SourceDoc[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
          aria-hidden="true"
        >
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3 text-sm leading-relaxed text-foreground shadow-sm">
          <p className="whitespace-pre-wrap text-pretty">{answer}</p>
        </div>
      </div>

      {sources.length > 0 ? (
        <section
          aria-label="Retrieved sources"
          className="ml-11 flex flex-col gap-3"
        >
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <BookOpen className="h-3.5 w-3.5" aria-hidden="true" />
            Sources from knowledge base
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {sources.map((doc, i) => (
              <SourceCard key={doc.id} doc={doc} index={i} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function ModelPicker({
  value,
  onChange,
  disabled,
}: {
  value: ModelId;
  onChange: (id: ModelId) => void;
  disabled?: boolean;
}) {
  const selected = MODEL_OPTIONS.find((m) => m.id === value) ?? MODEL_OPTIONS[0];

  return (
    <label
      className={cn(
        "group relative inline-flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-3 pr-2 text-xs font-medium text-foreground shadow-sm transition-colors",
        "hover:border-primary/60",
        disabled && "opacity-60",
      )}
    >
      <Cpu className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
      <span className="sr-only">Model</span>
      <span aria-hidden="true">{selected.label}</span>
      <ChevronDown
        className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:text-foreground"
        aria-hidden="true"
      />
      <select
        aria-label="Select model"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value as ModelId)}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        {MODEL_OPTIONS.map((m) => (
          <option key={m.id} value={m.id}>
            {m.label} — {m.description}
          </option>
        ))}
      </select>
    </label>
  );
}

function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-6 rounded-3xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
      <div
        className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"
        aria-hidden="true"
      >
        <Sparkles className="h-6 w-6" />
      </div>
      <div className="max-w-md space-y-2">
        <h2 className="font-serif text-2xl font-semibold text-balance text-foreground">
          {"Ask Foodie anything about food"}
        </h2>
        <p className="text-pretty text-sm text-muted-foreground">
          {
            "Retrieval-augmented answers grounded in a curated dish knowledge base. Try a suggestion below or type your own question."
          }
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onPick(s)}
            className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-foreground/80 shadow-sm transition-colors hover:border-primary/60 hover:bg-primary/5 hover:text-foreground"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
