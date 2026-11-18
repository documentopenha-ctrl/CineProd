import Link from "next/link";

import Chat from "./components/Chat";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col min-h-0">
      <header className="border-b border-neutral-200 px-4 py-4 sm:px-6 dark:border-neutral-800">
        <div className="mx-auto flex max-w-2xl items-baseline justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <h1 className="text-lg font-semibold tracking-tight">CineProd</h1>
            <p className="text-sm text-neutral-500">
              Tu mentor en la producción de cine con IA
            </p>
          </div>
          <Link
            href="/generador"
            className="shrink-0 text-sm font-medium text-amber-600 hover:underline"
          >
            Generador →
          </Link>
        </div>
      </header>
      <Chat />
    </div>
  );
}
