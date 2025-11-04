import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Reservation System - Book Tables at Your Favorite Venues",
  description: "Multi-tenant reservation system for bars and restaurants",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
