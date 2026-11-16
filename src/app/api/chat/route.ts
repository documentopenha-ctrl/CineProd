import Anthropic from "@anthropic-ai/sdk";
import { CINEPROD_SYSTEM_PROMPT } from "@/lib/systemPrompt";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const MAX_MESSAGES = 60;
const MAX_MESSAGE_LENGTH = 8000;

function isValidHistory(value: unknown): value is ChatMessage[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > MAX_MESSAGES) {
    return false;
  }
  return value.every(
    (m) =>
      typeof m === "object" &&
      m !== null &&
      (m as ChatMessage).role !== undefined &&
      ["user", "assistant"].includes((m as ChatMessage).role) &&
      typeof (m as ChatMessage).content === "string" &&
      (m as ChatMessage).content.length > 0 &&
      (m as ChatMessage).content.length <= MAX_MESSAGE_LENGTH
  );
}

export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("Falta configurar ANTHROPIC_API_KEY en el servidor.", {
      status: 500,
    });
  }

  const body = await req.json().catch(() => null);
  const history = body?.messages;

  if (!isValidHistory(history)) {
    return new Response("Mensajes inválidos.", { status: 400 });
  }

  const anthropic = new Anthropic();

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        const response = anthropic.messages.stream({
          model: "claude-sonnet-5-5",
          max_tokens: 4096,
          system: CINEPROD_SYSTEM_PROMPT,
          messages: history,
        });

        response.on("text", (textDelta) => {
          controller.enqueue(encoder.encode(textDelta));
        });

        await response.finalMessage();
        controller.close();
      } catch (err) {
        console.error("Error en /api/chat:", err);
        controller.enqueue(
          encoder.encode(
            "\n\n[Hubo un error contactando con el modelo. Inténtalo de nuevo.]"
          )
        );
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}
