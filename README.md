# CineProd

Mentor en la producción de cine con IA. Guía a creadores, paso a paso, desde la idea hasta los prompts de plano listos para pegar en herramientas de vídeo generativo (Kling, Seedance, Veo, etc.). Además, desde `/generador`, esos prompts se pueden generar de verdad (imagen y vídeo, 38 modelos) sin salir de la app.

## Puesta en marcha

```bash
npm install
```

Crea un archivo `.env.local` (ya está en `.gitignore`, nunca se sube) con:

```
# Mentor de chat (obligatoria)
ANTHROPIC_API_KEY=tu_clave_aqui

# Generador de imagen/vídeo en /generador (obligatorias para generar)
HF_API_BASE_URL=https://platform.higgsfield.ai
OPEN_HIGGSFIELD_READ_WRITE_TOKEN=tu_token_de_vercel_blob
```

- `HF_API_BASE_URL` es la URL base de la API de la plataforma Higgsfield que resuelve las peticiones de generación; cada persona añade su propia clave (`id:secret`) desde el icono de llave en `/generador`, nunca aquí.
- `OPEN_HIGGSFIELD_READ_WRITE_TOKEN` es el token de lectura/escritura de un store de [Vercel Blob](https://vercel.com/docs/storage/vercel-blob), donde se suben las imágenes/vídeos/audios de referencia que el usuario adjunta en el generador.

Y arranca el servidor:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Estructura

- `src/lib/systemPrompt.ts` — el conocimiento y las reglas de comportamiento del mentor.
- `src/app/api/chat/route.ts` — endpoint que llama a la API de Claude en streaming.
- `src/app/components/Chat.tsx` — interfaz de chat; cada respuesta del mentor puede enviarse al generador con "Enviar al generador →".
- `src/app/generador/` — página del estudio de generación (imagen/vídeo), adaptada de [OpenHiggsfield AI](https://github.com/wide-trace/open-higgsfield).
- `src/generation/` y `src/openhiggsfield/` — catálogo de modelos, cliente de la API de la plataforma, estado (Zustand) y componentes del estudio, portados de OpenHiggsfield AI.
- `src/proxy.ts` — asigna un id de dispositivo (cookie) usado para organizar las subidas a Vercel Blob por visitante.

`vendor-repos/` contiene copias locales de otros proyectos de código abierto usadas solo como referencia puntual; no forman parte de la app y están excluidas de git.
