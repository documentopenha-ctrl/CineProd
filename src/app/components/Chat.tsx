"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { HANDOFF_PROMPT_KEY } from "@/lib/handoff";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const WELCOME =
  "Soy CineProd, tu mentor en la producción de cine con IA. Cuéntame qué quieres hacer — una idea suelta, un guion ya escrito, o solo necesitas prompts de plano — y te voy guiando paso a paso.";

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const sendToGenerator = (text: string) => {
    try {
      window.localStorage.setItem(HANDOFF_PROMPT_KEY, text);
    } catch {
      // Almacenamiento no disponible (modo privado, cuotas, etc.): seguimos sin bloquear la navegación.
    }
    router.push("/generador");
  };

  const scrollToBottom = () => {
    requestAnimationFrame(() => {
      scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
    });
  };

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || isStreaming) return;

    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages([...nextMessages, { role: "assistant", content: "" }]);
    setInput("");
    setIsStreaming(true);
    scrollToBottom();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });

      if (!res.body) throw new Error("Sin respuesta del servidor");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantText += decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const copy = [...prev];
          copy[copy.length - 1] = { role: "assistant", content: assistantText };
          return copy;
        });
        scrollToBottom();
      }
    } catch {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "No he podido conectar con el servidor. Inténtalo de nuevo.",
        };
        return copy;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-6 sm:px-6"
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-4">
          <div className="max-w-[85%] self-start rounded-2xl rounded-bl-sm bg-neutral-100 px-4 py-3 text-sm leading-relaxed text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100">
            {WELCOME}
          </div>
          {messages.map((m, i) => {
            const isLastStreaming = isStreaming && i === messages.length - 1;
            return (
              <div key={i} className={m.role === "user" ? "self-end" : "self-start"}>
                <div
                  className={
                    m.role === "user"
                      ? "max-w-[85%] rounded-2xl rounded-br-sm bg-amber-600 px-4 py-3 text-sm leading-relaxed text-white"
                      : "max-w-[85%] rounded-2xl rounded-bl-sm bg-neutral-100 px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100"
                  }
                >
                  {m.content || (isLastStreaming ? "…" : "")}
                </div>
                {m.role === "assistant" && m.content && !isLastStreaming && (
                  <button
                    type="button"
                    onClick={() => sendToGenerator(m.content)}
                    className="mt-1 text-xs font-medium text-amber-600 hover:underline"
                  >
                    Enviar al generador →
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="border-t border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-800">
        <div className="mx-auto flex max-w-2xl items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe aquí tu idea, tu guion o tu pregunta..."
            rows={1}
            className="flex-1 resize-none rounded-xl border border-neutral-300 bg-transparent px-3 py-2 text-sm outline-none focus:border-amber-600 dark:border-neutral-700"
          />
          <button
            onClick={sendMessage}
            disabled={isStreaming || !input.trim()}
            className="rounded-xl bg-amber-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
          >
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
