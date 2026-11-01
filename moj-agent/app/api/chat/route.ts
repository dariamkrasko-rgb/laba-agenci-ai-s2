import { createOpenRouter } from "@openrouter/ai-sdk-provider";
import { convertToModelMessages, createUIMessageStreamResponse, streamText, toUIMessageStream } from "ai";
import { z } from "zod";

export const runtime = "nodejs";

const requestSchema = z.object({
  messages: z.array(z.object({
    id: z.string().min(1),
    role: z.enum(["user", "assistant"]),
    parts: z.array(z.union([
      z.object({ type: z.literal("text"), text: z.string().max(20000) }),
      z.object({ type: z.literal("step-start") }),
      z.object({ type: z.literal("reasoning"), text: z.string() }),
    ])).min(1).transform((parts) => parts.filter((part) => part.type === "text")),
  })).min(1),
});

function fail(message: string, status: number) {
  // DefaultChatTransport displays a non-2xx response's text as the chat error.
  return new Response(message, { status, headers: { "Content-Type": "text/plain; charset=utf-8" } });
}

export async function POST(req: Request) {
  const apiKey = process.env.OPENROUTER_API_KEY?.trim();
  const model = process.env.OPENROUTER_MODEL?.trim();
  if (!apiKey || !model) {
    return fail("Brakuje konfiguracji czatu. Uzupełnij OPENROUTER_API_KEY i OPENROUTER_MODEL w pliku .env.local, a następnie uruchom ponownie serwer.", 503);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return fail("Nieprawidłowe dane wiadomości. Odśwież stronę i spróbuj ponownie.", 400);
  }

  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) return fail("Nieprawidłowa historia rozmowy. Odśwież stronę i spróbuj ponownie.", 400);
  const messages = parsed.data.messages;
  const last = messages.at(-1)!;
  if (last.role !== "user" || !last.parts.some((part) => part.text.trim())) {
    return fail("Wpisz treść wiadomości przed wysłaniem.", 400);
  }

  const generationError = "Nie udało się uzyskać odpowiedzi. Sprawdź klucz OpenRouter, identyfikator modelu, dostępne środki i połączenie, a potem spróbuj ponownie.";
  try {
    const openrouter = createOpenRouter({ apiKey });
    const result = streamText({
      model: openrouter(model),
      messages: await convertToModelMessages(messages),
      abortSignal: req.signal,
      maxRetries: 0,
      onError: () => {},
    });
    return createUIMessageStreamResponse({
      stream: toUIMessageStream({ stream: result.stream, onError: () => generationError }),
    });
  } catch {
    // Never expose provider responses or credential details to the browser.
    return fail(generationError, 502);
  }
}
