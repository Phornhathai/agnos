import "./globals.css"; // tailwind styles
import type { Metadata } from "next"; // metadata type

export const metadata: Metadata = {
  title: "Patient Real-time Form Demo",
  description: "Next.js + Tailwind + WebSockets demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // main layout
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
