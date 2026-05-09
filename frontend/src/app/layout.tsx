import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/features/auth";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/lib/QueryProvider";
import { VerificationGate } from "@/components/guards/VerificationGate";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Photophile | India's Leading Photography Marketplace",
  description: "The all-in-one studio management platform for professional photographers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${cormorant.variable} antialiased`}
      >
        <QueryProvider>
          <AuthProvider>
            <Toaster position="top-right" richColors />
            <VerificationGate>{children}</VerificationGate>
          </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
