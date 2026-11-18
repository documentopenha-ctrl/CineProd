import type { Metadata } from "next";
import { Inter } from "next/font/google";

import GeneradorApp from "./GeneradorApp";

import "@/openhiggsfield/openhiggsfield.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-ohf-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Generador — CineProd",
  description: "Genera las imágenes y vídeos de tus prompts sin salir de CineProd.",
};

export default function GeneradorPage() {
  return <GeneradorApp fontClassName={inter.variable} />;
}
