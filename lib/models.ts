export const MODEL_OPTIONS = [
  {
    id: "llama-3.1-8b-instant",
    label: "Llama 3.1 8B Instant",
    description: "Fastest · great for quick answers",
  },
  {
    id: "llama-3.3-70b-versatile",
    label: "Llama 3.3 70B Versatile",
    description: "Highest quality · slower, more detailed",
  },
] as const;

export type ModelId = (typeof MODEL_OPTIONS)[number]["id"];

export const DEFAULT_MODEL: ModelId = "llama-3.1-8b-instant";

export const VALID_MODEL_IDS: ReadonlySet<string> = new Set(
  MODEL_OPTIONS.map((m) => m.id),
);
