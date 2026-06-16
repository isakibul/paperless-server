import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Paperless Console",
  description: "Paperless organization access console",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
