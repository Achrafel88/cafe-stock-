import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/context/DataContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CafeStock Pro - Beni Mellal",
  description: "Système de gestion de stock et facturation moderne",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} transition-colors duration-300`} suppressHydrationWarning>
        <DataProvider>
          {children}
        </DataProvider>
      </body>
    </html>
  );
}
