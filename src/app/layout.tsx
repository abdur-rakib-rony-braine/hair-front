import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { MarketProvider } from "@/providers/MarketProvider";
import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Salon Pro",
  description: "Modern Salon Management Dashboard",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <MarketProvider>
            {children}
          </MarketProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}