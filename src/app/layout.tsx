import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Salon Pro",
  description: "Modern Salon Management Dashboard for salons",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 min-h-screen" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
