"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import {
  AlertCircle,
  BookOpen,
  Check,
  ChevronDown,
  Clock,
  Copy,
  Cpu,
  MessageSquarePlus,
  PanelLeftClose,
  PanelLeftOpen,
  Send,
  Share2,
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

type Session = {
  id: string;
  title: string;
  exchanges: Exchange[];
  createdAt: number;
  updatedAt: number;
};

const SESSIONS_KEY = "food-ai-sessions";
const ACTIVE_SESSION_KEY = "food-ai-active-session";

const SUGGESTIONS = [
  "What is a healthy dinner option?",
  "Suggest comfort foods for a cold day",
  "Low-calorie meals under 300 calories",
  "High-protein vegetarian dishes",
  "What Indian dishes are spicy?",
  "Mediterranean diet recommendations",
];

const QUICK_SUGGESTIONS = [
  "Healthy meals",
  "High protein",
  "Vegetarian",
  "Indian cuisine",
  "Low calorie",
  "Comfort food",
];

function createNewSession(): Session {
  return {
    id: crypto.randomUUID(),
    title: "New Chat",
    exchanges: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

function generateSessionTitle(exchanges: Exchange[]): string {
  if (exchanges.length === 0) return "New Chat";
  const firstQuestion = exchanges[0].question;
  return firstQuestion.length > 40
    ? firstQuestion.slice(0, 40) + "..."
    : firstQuestion;
}

export function ChatInterface() {
  const [question, setQuestion] = useState("");
  const [model, setModel] = useState<ModelId>("llama-3.1-8b-instant");
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [isPending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  const activeSession = sessions.find((s) => s.id === activeSessionId);
  const exchanges = activeSession?.exchanges ?? [];

  // Load sessions from localStorage on mount
  useEffect(() => {
    try {
      const savedSessions = localStorage.getItem(SESSIONS_KEY);
      const savedActiveId = localStorage.getItem(ACTIVE_SESSION_KEY);
      
      if (savedSessions) {
        const parsed = JSON.parse(savedSessions) as Session[];
        // Filter out loading states from all sessions
        const cleaned = parsed.map((s) => ({
          ...s,
          exchanges: s.exchanges.filter((ex) => !ex.loading),
        }));
        setSessions(cleaned);
        
        if (savedActiveId && cleaned.some((s) => s.id === savedActiveId)) {
          setActiveSessionId(savedActiveId);
        } else if (cleaned.length > 0) {
          setActiveSessionId(cleaned[0].id);
        }
      }
      
      // If no sessions exist, create one
      if (!savedSessions || JSON.parse(savedSessions).length === 0) {
        const newSession = createNewSession();
        setSessions([newSession]);
        setActiveSessionId(newSession.id);
      }
    } catch {
      const newSession = createNewSession();
      setSessions([newSession]);
      setActiveSessionId(newSession.id);
    }
    setIsHydrated(true);
  }, []);

  // Save sessions to localStorage whenever they change
  useEffect(() => {
    if (!isHydrated) return;
    try {
      const toSave = sessions.map((s) => ({
        ...s,
        exchanges: s.exchanges.filter((ex) => !ex.loading),
      }));
      localStorage.setItem(SESSIONS_KEY, JSON.stringify(toSave));
      if (activeSessionId) {
        localStorage.setItem(ACTIVE_SESSION_KEY, activeSessionId);
      }
    } catch {
      // localStorage unavailable or quota exceeded
    }
  }, [sessions, activeSessionId, isHydrated]);

  function setExchanges(updater: Exchange[] | ((prev: Exchange[]) => Exchange[])) {
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id !== activeSessionId) return s;
        const newExchanges =
          typeof updater === "function" ? updater(s.exchanges) : updater;
        return {
          ...s,
          exchanges: newExchanges,
          title: generateSessionTitle(newExchanges),
          updatedAt: Date.now(),
        };
      })
    );
  }

  function startNewSession() {
    const newSession = createNewSession();
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    setQuestion("");
    inputRef.current?.focus();
  }

  function switchSession(sessionId: string) {
    setActiveSessionId(sessionId);
    setQuestion("");
  }

  function deleteSession(sessionId: string) {
    setSessions((prev) => {
      const remaining = prev.filter((s) => s.id !== sessionId);
      if (remaining.length === 0) {
        const newSession = createNewSession();
        setActiveSessionId(newSession.id);
        return [newSession];
      }
      if (sessionId === activeSessionId) {
        setActiveSessionId(remaining[0].id);
      }
      return remaining;
    });
  }

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

  function clearCurrentChat() {
    if (isPending) return;
    setExchanges([]);
    setQuestion("");
    inputRef.current?.focus();
  }

  const isEmpty = exchanges.length === 0;

  return (
    <div className="flex w-full gap-4">
      {/* Session History Sidebar */}
      <aside
        className={cn(
          "flex flex-col gap-2 rounded-2xl border border-border bg-card/50 p-3 shadow-sm transition-all",
          sidebarOpen ? "w-64 min-w-[16rem]" : "w-12 min-w-[3rem]",
        )}
      >
        <div className="flex items-center justify-between gap-2">
          {sidebarOpen && (
            <h2 className="text-sm font-semibold text-foreground">Sessions</h2>
          )}
          <button
            type="button"
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {sidebarOpen ? (
              <PanelLeftClose className="h-4 w-4" />
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </button>
        </div>

        {sidebarOpen && (
          <>
            <button
              type="button"
              onClick={startNewSession}
              className={cn(
                "flex items-center gap-2 rounded-xl border border-dashed border-border bg-background px-3 py-2 text-sm font-medium text-foreground/80 transition-colors",
                "hover:border-primary/50 hover:bg-primary/5 hover:text-foreground",
              )}
            >
              <MessageSquarePlus className="h-4 w-4" />
              New Chat
            </button>

            <div className="mt-2 flex flex-col gap-1 overflow-y-auto">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className={cn(
                    "group flex items-start gap-2 rounded-xl px-3 py-2 text-sm transition-colors cursor-pointer",
                    session.id === activeSessionId
                      ? "bg-primary/10 text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                  onClick={() => switchSession(session.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium">{session.title}</p>
                    <p className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteSession(session.id);
                    }}
                    className={cn(
                      "rounded p-1 text-muted-foreground opacity-0 transition-opacity",
                      "hover:bg-destructive/10 hover:text-destructive",
                      "group-hover:opacity-100",
                    )}
                    aria-label="Delete session"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </>
        )}
      </aside>

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col gap-6">
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
              onClick={clearCurrentChat}
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
        {/* Quick suggestion chips */}
        <div className="flex flex-wrap items-center gap-1.5 px-2">
          {QUICK_SUGGESTIONS.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => setQuestion(suggestion)}
              disabled={isPending}
              className={cn(
                "rounded-full border border-border bg-card px-2.5 py-1 text-[11px] font-medium text-muted-foreground shadow-sm transition-colors",
                "hover:border-primary/50 hover:bg-primary/5 hover:text-foreground",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              {suggestion}
            </button>
          ))}
        </div>
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
  const [copied, setCopied] = useState(false);

  async function handleShare() {
    const shareText = `${answer}\n\n— Powered by Foodie RAG`;

    // Try Web Share API first (mobile-friendly)
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Foodie RAG Answer",
          text: shareText,
        });
        return;
      } catch {
        // User cancelled or share failed, fall back to clipboard
      }
    }

    // Fallback to clipboard
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.log("[v0] Failed to copy to clipboard");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-start gap-3">
        <div
          className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
          aria-hidden="true"
        >
          <Sparkles className="h-4 w-4" />
        </div>
        <div className="group relative rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3 text-sm leading-relaxed text-foreground shadow-sm">
          <p className="whitespace-pre-wrap text-pretty">{answer}</p>
          
          {/* Share button */}
          <button
            type="button"
            onClick={handleShare}
            className={cn(
              "absolute -bottom-3 right-2 inline-flex items-center gap-1 rounded-full border bg-background px-2 py-0.5 text-[10px] font-medium shadow-sm transition-all",
              copied
                ? "border-primary/50 text-primary"
                : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground",
              "opacity-0 group-hover:opacity-100 focus:opacity-100",
            )}
            aria-label={copied ? "Copied!" : "Share this answer"}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" aria-hidden="true" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="h-3 w-3" aria-hidden="true" />
                Share
              </>
            )}
          </button>
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

const FALLBACK_MODEL = {
  id: "llama-3.1-8b-instant" as ModelId,
  label: "Llama 3.1 8B Instant",
  description: "Fastest · great for quick answers",
};

function ModelPicker({
  value,
  onChange,
  disabled,
}: {
  value: ModelId;
  onChange: (id: ModelId) => void;
  disabled?: boolean;
}) {
  const models = MODEL_OPTIONS?.length ? MODEL_OPTIONS : [FALLBACK_MODEL];
  const selected = models.find((m) => m.id === value) ?? models[0];

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
        {models.map((m) => (
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
          Ask Foodie anything about food
        </h2>
        <p className="text-pretty text-sm text-muted-foreground">
          Retrieval-augmented answers grounded in a curated dish knowledge base.
          Try an example below or type your own question.
        </p>
      </div>

      {/* Example Queries Section */}
      <div className="w-full max-w-lg rounded-2xl border border-border bg-card p-4 shadow-sm">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Example Queries
        </h3>
        <div className="grid gap-2 sm:grid-cols-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => onPick(s)}
              className={cn(
                "rounded-xl border border-border bg-background px-3 py-2.5 text-left text-sm text-foreground/80 shadow-sm transition-colors",
                "hover:border-primary/60 hover:bg-primary/5 hover:text-foreground",
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
