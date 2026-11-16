# CineProd

Mentor en la producción de cine con IA. Guía a creadores, paso a paso, desde la idea hasta los prompts de plano listos para pegar en herramientas de vídeo generativo (Kling, Seedance, Veo, etc.). No genera imagen, vídeo ni audio: escribe el texto (guion, fichas de personaje, listas de planos, prompts) que el usuario usa fuera de la app.

## Puesta en marcha

```bash
npm install
```

Necesitas una clave de la API de Claude. Crea un archivo `.env.local` (ya está en `.gitignore`, nunca se sube) con:

```
ANTHROPIC_API_KEY=tu_clave_aqui
```

Y arranca el servidor:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura

- `src/lib/systemPrompt.ts` — el conocimiento y las reglas de comportamiento del mentor.
- `src/app/api/chat/route.ts` — endpoint que llama a la API de Claude en streaming.
- `src/app/components/Chat.tsx` — interfaz de chat.

`vendor-repos/` contiene copias locales de otros proyectos de código abierto usadas solo como referencia puntual; no forman parte de la app y están excluidas de git.
