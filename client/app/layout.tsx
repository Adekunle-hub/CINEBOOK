import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { AuthProvider } from "@/lib/auth-context";
import { Header } from "@/components/header";
import "./globals.css";
import { UIProvider } from "@/lib/ui-context";
import { ConditionalHeader } from "@/components/conditional-header";
import { TanstackProviders } from "./providers";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CineBook - Movie Ticket Booking",
  description: "Book your favorite movies at the best cinemas",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <AuthProvider>
          <UIProvider>
            <TanstackProviders>
              <ConditionalHeader />
              <main className="min-h-screen bg-background">{children}</main>
            </TanstackProviders>
          </UIProvider>
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
