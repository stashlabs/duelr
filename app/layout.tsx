import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Duelr - Compare LLMs in One Click",
  description:
    "Open source tool to compare LLM responses across models. See latency, response quality, and cost in one comprehensive view.",
  keywords: [
    "LLM",
    "AI",
    "comparison",
    "OpenAI",
    "Claude",
    "GPT",
    "open source",
  ],
  authors: [{ name: "Duelr Team" }],
  openGraph: {
    title: "Duelr - Compare LLMs in One Click",
    description: "Open source tool to compare LLM responses across models",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
